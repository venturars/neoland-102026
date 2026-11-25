"""Resumen de gastos personales.

Lee un CSV de gastos (columnas: fecha, concepto, categoria, importe),
calcula el total gastado, el total por categoría y el gasto más grande,
y guarda el resumen en un fichero JSON.

Uso:
    uv run python resumen_gastos.py [gastos.csv] [resumen.json]
"""

import csv
import json
import sys
from pathlib import Path

# Carpeta donde está este script: así los ficheros por defecto se encuentran
# aunque el programa se ejecute desde otra carpeta.
CARPETA = Path(__file__).parent


def leer_gastos(ruta_csv):
    """Lee el CSV y devuelve una lista de gastos válidos (diccionarios).

    Las filas con un importe que no es un número se saltan con un aviso.
    """
    gastos = []

    # newline="" es lo que pide la documentación de csv para ficheros
    # (library/csv.md, nota [1]).
    # Codificación explícita: en Python 3.14 el defecto depende del
    # sistema (en Windows no es UTF-8); solo 3.15 usa UTF-8 por defecto
    # (library/io.md, «Text encoding»).
    # "utf-8-sig" lee UTF-8 normal y además se salta el BOM que añaden
    # Excel o el Bloc de notas (library/codecs.md, encodings.utf_8_sig).
    with open(ruta_csv, newline="", encoding="utf-8-sig") as fichero:
        # DictReader usa la primera fila como nombres de columna
        # (library/csv.md, csv.DictReader).
        lector = csv.DictReader(fichero)

        for fila in lector:
            try:
                importe = float(fila["importe"])
            except (ValueError, TypeError):
                # ValueError: texto que no es un número ("veinte", "76,80", "").
                # TypeError: la fila tiene menos columnas y DictReader rellena
                # el importe con None (restval por defecto).
                print(
                    f"Aviso: línea {lector.line_num} saltada, "
                    f"importe no válido: {fila['importe']!r}"
                )
                continue

            gastos.append(
                {
                    "fecha": fila["fecha"],
                    "concepto": fila["concepto"],
                    "categoria": fila["categoria"],
                    "importe": importe,
                }
            )

    return gastos


def calcular_resumen(gastos):
    """Calcula el total, el total por categoría y el gasto más grande."""
    total = 0.0
    por_categoria = {}

    for gasto in gastos:
        total += gasto["importe"]
        # dict.get devuelve 0.0 si la categoría aún no está en el diccionario
        # (tutorial/datastructures.md, 5.5 Dictionaries).
        categoria = gasto["categoria"]
        por_categoria[categoria] = por_categoria.get(categoria, 0.0) + gasto["importe"]

    # max con key compara por importe; default=None evita el ValueError
    # si no hay ningún gasto válido (builtins/functions.md, max).
    gasto_mayor = max(gastos, key=lambda g: g["importe"], default=None)

    # Redondeamos a céntimos para que el JSON no muestre cosas como 0.30000000000000004.
    for categoria in por_categoria:
        por_categoria[categoria] = round(por_categoria[categoria], 2)

    return {
        "numero_gastos": len(gastos),
        "total": round(total, 2),
        "por_categoria": por_categoria,
        "gasto_mayor": gasto_mayor,
    }


def guardar_resumen(resumen, ruta_json):
    """Guarda el resumen en un fichero JSON legible."""
    with open(ruta_json, "w", encoding="utf-8") as fichero:
        # indent=2: JSON con sangría; ensure_ascii=False: deja las tildes
        # tal cual en vez de escaparlas (library/json.md, json.dump).
        json.dump(resumen, fichero, indent=2, ensure_ascii=False)


def main():
    # Rutas por defecto, que se pueden cambiar desde la línea de comandos.
    ruta_csv = sys.argv[1] if len(sys.argv) > 1 else CARPETA / "gastos.csv"
    ruta_json = sys.argv[2] if len(sys.argv) > 2 else CARPETA / "resumen.json"

    gastos = leer_gastos(ruta_csv)
    resumen = calcular_resumen(gastos)
    guardar_resumen(resumen, ruta_json)

    # Mostramos también el resumen por pantalla.
    print()
    print(f"Gastos válidos: {resumen['numero_gastos']}")
    print(f"Total gastado: {resumen['total']:.2f} €")
    print("Total por categoría:")
    for categoria, importe in resumen["por_categoria"].items():
        print(f"  - {categoria}: {importe:.2f} €")
    mayor = resumen["gasto_mayor"]
    if mayor is not None:
        print(
            f"Gasto más grande: {mayor['concepto']} ({mayor['categoria']}) "
            f"el {mayor['fecha']}: {mayor['importe']:.2f} €"
        )
    print(f"Resumen guardado en {ruta_json}")


if __name__ == "__main__":
    main()
