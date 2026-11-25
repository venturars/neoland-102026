"""Analizador concurrente de logs de acceso.

Lee la configuración de un TOML, analiza varios ficheros de log a la vez y saca, por fichero y en total,
las peticiones por código de estado, las rutas más pedidas y la latencia (mediana y p95).

Cada decisión de API cita la consulta al RAG que la respalda (ver consultas.json).
Uso: python analizador_logs.py config.toml
"""
import asyncio
import re
import statistics
import sys
import time
import tomllib
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

# [re_named] `(?P<name>...)` + `Match.groupdict()` devuelve los grupos con nombre como dict.
LINEA = re.compile(
    r'(?P<ip>\S+) "(?P<metodo>[A-Z]+) (?P<ruta>\S+)" (?P<estado>\d{3}) (?P<ms>\d+(?:\.\d+)?)ms'
)


@dataclass
class Resultado:
    fichero: str
    estados: Counter = field(default_factory=Counter)
    rutas: Counter = field(default_factory=Counter)
    latencias: list[float] = field(default_factory=list)
    lineas_invalidas: int = 0
    error: str | None = None


def leer_lineas(ruta: Path, retardo: float) -> list[str]:
    """Lectura bloqueante. `retardo` simula un disco lento para probar el timeout."""
    time.sleep(retardo)
    return ruta.read_text(encoding="utf-8").splitlines()


def analizar(nombre: str, lineas: list[str]) -> Resultado:
    r = Resultado(nombre)
    for linea in lineas:
        m = LINEA.fullmatch(linea.strip())
        if m is None:
            r.lineas_invalidas += 1
            continue
        datos = m.groupdict()  # [re_named]
        r.estados[datos["estado"]] += 1  # [counter] Counter devuelve 0 para claves ausentes.
        r.rutas[datos["ruta"]] += 1
        r.latencias.append(float(datos["ms"]))
    return r


async def procesar(ruta: Path, timeout_s: float, retardo: float) -> Resultado:
    if not ruta.exists():
        # Error de configuración: se deja salir para que el TaskGroup cancele el resto (fallo rápido).
        raise FileNotFoundError(f"No existe el log: {ruta}")
    try:
        # [timeout] `async with asyncio.timeout(delay)` limita el bloque y lanza TimeoutError.
        async with asyncio.timeout(timeout_s):
            # [to_thread] la lectura bloqueante va a otro hilo para no bloquear el bucle de eventos.
            lineas = await asyncio.to_thread(leer_lineas, ruta, retardo)
    except TimeoutError:
        # Un fichero lento no debe tumbar a los demás: se captura dentro de la tarea.
        return Resultado(ruta.name, error=f"timeout tras {timeout_s} s")
    return analizar(ruta.name, lineas)


def resumen_latencia(latencias: list[float]) -> str:
    if len(latencias) < 2:
        return "sin datos suficientes"
    # [quantiles] n=100 da los percentiles; method="inclusive" porque el log es la población completa,
    # no una muestra (la doc: "inclusive" se usa "for describing population data").
    p = statistics.quantiles(latencias, n=100, method="inclusive")
    return f"mediana {statistics.median(latencias):.1f} ms, p95 {p[94]:.1f} ms"


async def main(config_path: Path) -> int:
    # [tomllib] `tomllib.load` necesita el fichero abierto en binario ("rb").
    with open(config_path, "rb") as f:
        config = tomllib.load(f)
    base = config_path.parent
    timeout_s = config["timeout_s"]
    top = config.get("top_rutas", 3)

    try:
        # [taskgroup] TaskGroup espera a todas las tareas; si una falla con algo que no es
        # CancelledError, cancela las demás y lanza un ExceptionGroup.
        async with asyncio.TaskGroup() as tg:
            tareas = [
                tg.create_task(procesar(base / log["ruta"], timeout_s, log.get("retardo_s", 0.0)))
                for log in config["logs"]
            ]
    # [except_star] except* extrae del grupo solo las excepciones de ese tipo.
    # `return` no puede ir dentro de un except* (reference/compound_stmts.md): se marca y se sale después.
    except* FileNotFoundError as grupo:
        for e in grupo.exceptions:
            print(f"ERROR de configuración: {e}")
        tareas = None
    if tareas is None:
        return 1

    total = Resultado("TOTAL")
    for tarea in tareas:
        r = tarea.result()
        print(f"\n== {r.fichero}")
        if r.error:
            print(f"   omitido: {r.error}")
            continue
        print(f"   estados: {dict(sorted(r.estados.items()))}  líneas inválidas: {r.lineas_invalidas}")
        print(f"   latencia: {resumen_latencia(r.latencias)}")
        total.estados.update(r.estados)
        total.rutas.update(r.rutas)
        total.latencias += r.latencias

    print(f"\n== TOTAL ({sum(total.estados.values())} peticiones)")
    print(f"   estados: {dict(sorted(total.estados.items()))}")
    print(f"   rutas más pedidas: {total.rutas.most_common(top)}")  # [counter] most_common(n)
    print(f"   latencia: {resumen_latencia(total.latencias)}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main(Path(sys.argv[1]))))
