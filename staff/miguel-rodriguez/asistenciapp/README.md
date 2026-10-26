# AsistenciApp

Pasa lista en una clase online (Discord, Google Meet o cualquier otra plataforma) en menos de un minuto.

El profesor abre una sesión y comparte en la llamada un **código de 4 cifras** que cambia cada 30 segundos. Los alumnos abren un enlace, escriben su nombre y el código, y aparecen al momento en la lista del profesor. Al final de la clase, la lista se descarga para Excel o Google Sheets.

> Proyecto hecho con *Spec-Driven Development*. Las reglas están en [CONSTITUTION.md](docs/CONSTITUTION.md), el manual para agentes de IA en [AGENTS.md](AGENTS.md), la arquitectura en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) y la especificación en [specs/001-checkin-codigo/](specs/001-checkin-codigo/spec.md).

---

## 1. Preparar el entorno (solo la primera vez)

Necesitas **Python 3.13+** y, para clases online, **Homebrew** (macOS).

```bash
cd staff/<usuario>/asistenciapp
python3 -m venv .venv                # crea el entorno virtual del proyecto
source .venv/bin/activate            # lo activa (verás "(.venv)" en el prompt)
pip install -r requirements.txt      # instala Flask y pytest
brew install cloudflared             # el túnel para que los alumnos entren desde casa
```

---

## 2. Activar el entorno

En cada terminal nueva, primero activa el entorno:

```bash
cd staff/<usuario>/asistenciapp
source .venv/bin/activate
```

---

## 3. Arrancar la app

| Para… | Comando |
| --- | --- |
| **Una clase online** (alumnos en sus casas) | `python app.py --tunel` |
| Probar solo en tu ordenador | `python app.py` |

Al arrancar verás algo así:

```
  Abriendo el túnel público (puede tardar unos segundos)...

  Panel del profesor: https://palabras-al-azar.trycloudflare.com/profesor.html#t=…
```

Ese enlace es **tu panel privado**: no lo compartas, porque quien lo tenga puede ver y cerrar tus listas.

- Con `--tunel`, la dirección **cambia cada vez** que arrancas, y puede tardar **unos 20 segundos** en funcionar.
- La app solo funciona **mientras tu ordenador esté encendido** y la app arrancada.

---

## 4. Pasar lista, paso a paso

1. Abre el **enlace del panel** que aparece en la terminal.
2. Escribe un título (opcional; si no, se usa la fecha y hora) y pulsa **Abrir asistencia**.
3. **Comparte pantalla** en la llamada: el código se ve en grande, con una cuenta atrás.
4. Pulsa **Copiar enlace de alumnos** y pégalo en el chat de Discord o Meet.
5. Cada alumno abre el enlace, escribe su **nombre** y el **código** de tu pantalla, y pulsa **Estoy en clase**. Su nombre aparece en tu lista en un par de segundos.
6. Cuando ya estén todos, pulsa **Cerrar asistencia** y confírmalo. Desde ese momento nadie más puede registrarse.
7. Pulsa **Descargar lista** para obtener el CSV (columnas *Nombre* y *Hora*).

**¿Ves un nombre falso o equivocado?** Pulsa **Quitar** en su fila y confirma con **Sí, quitar**. Desaparece de la lista, del total y de la descarga. Funciona también con la asistencia ya cerrada.

### Un registro por navegador

Cuando un alumno se registra, su navegador lo recuerda **para esa clase**: si vuelve a abrir el enlace, ve *"Ya te registraste en esta clase como Ana García a las 11:07"* y no puede apuntar a otra persona. En la clase siguiente puede registrarse con normalidad.

Es un límite **disuasorio**, no una prueba de identidad: se salta con otro navegador, una ventana privada u otro dispositivo. Para lo que se cuele, está el botón **Quitar**. Si quitas a alguien, su navegador sigue mostrando "ya te registraste": tendría que usar otro navegador para registrarse de nuevo.

Las **sesiones anteriores** aparecen en el panel con su número de asistentes, y puedes volver a verlas o descargarlas cuando quieras.

---

## 5. Cerrar la app

Pulsa **Ctrl+C** en la terminal donde está arrancada. Se paran la app y el túnel. Los datos quedan guardados en `data/asistencia.db`.

> **"Cerrar asistencia"** (el botón del panel) solo cierra los registros de *esa clase*; la app sigue funcionando. **Ctrl+C** apaga la app entera.

Si ya no encuentras la terminal donde la arrancaste:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN     # muestra el proceso "Python" y su número (PID)
kill <PID>                           # lo para
pkill cloudflared                    # para el túnel, si lo usabas
```

---

## 6. Problemas frecuentes

| Mensaje o síntoma | Qué hacer |
| --- | --- |
| `El puerto 8000 ya está en uso` | Ya tienes la app abierta en otra terminal: ciérrala (sección 5). O usa otro puerto: `PORT=8001 python app.py --tunel`. |
| `No se encontró cloudflared` | Instálalo: `brew install cloudflared`. |
| El enlace del túnel no carga | Espera unos 20 segundos y recarga: los túneles nuevos tardan en estar accesibles. |
| Aviso amarillo en el panel: *"tus alumnos no podrán abrir el enlace"* | Abriste el panel en `localhost`. Para la app y arráncala con `python app.py --tunel`. |
| *"Enlace del panel no válido"* | Usa el enlace exacto de la terminal, incluido todo lo que va detrás de `#t=`. |
| `command not found: pytest` o `python` no encuentra Flask | No has activado el entorno: `source .venv/bin/activate`. |

---

## 7. Tests

```bash
source .venv/bin/activate
pytest            # o "pytest -v" para ver cada test
```

Cada criterio de aceptación de la spec (`CA-01` a `CA-26`) tiene un test o una verificación manual; la tabla está en [plan.md §6](specs/001-checkin-codigo/plan.md).

---

## 8. Privacidad

- En la lista de asistencia solo se guarda **el nombre que escribe** y **la hora**. No se añaden emails ni IPs a esa lista.
- Para proteger el registro se guardan por separado la dirección de conexión y los intentos del último minuto. Al siguiente intento se eliminan los temporales de 60 segundos o más de todas las direcciones. Las direcciones bloqueadas se guardan permanentemente en local, sin asociarlas a nombres ni clases.
- El límite "un registro por navegador" se guarda **solo en el navegador del alumno**, no en el servidor.
- Quitar un registro lo **borra de verdad** (no queda en ninguna papelera).
- Los datos se guardan **solo en tu ordenador** (`data/`, que no se sube a git).
- Con `--tunel`, el tráfico pasa **cifrado** por Cloudflare, que no lo almacena (constitución P4, v2.1).


## Protección de los registros

Una dirección puede intentar registrarse como máximo cinco veces en un segundo y veinte en un minuto, contando también los intentos incorrectos y repetidos. Superar cualquiera de los máximos bloquea permanentemente esa dirección para registrar asistencia, incluso tras reiniciar la aplicación. Esperar no elimina el bloqueo; no hay función de desbloqueo en esta versión.

El formulario muestra el motivo del rechazo. Las páginas, consultas y operaciones del profesor siguen disponibles. Personas que comparten una dirección pública comparten los límites: se distingue la conexión, no la identidad de cada alumno.

Con `python app.py` se cuenta la dirección de la conexión directa y se ignoran las cabeceras que intenten sustituirla. Con `python app.py --tunel`, el registro exige la dirección de visitante comunicada por el conector Cloudflare local; si falta o no es válida se rechaza con un aviso, sin inventar una dirección. En ese modo el registro directo por localhost sin el origen del túnel se rechaza, aunque las consultas locales siguen funcionando. La aplicación continúa escuchando únicamente en 127.0.0.1.


## Backend de carrera (008)

El contrato de seguridad de [008](specs/008-proteger-el-registro-de-carrera/spec.md) permite preparar una carrera, ocupar plazas, dar la salida y registrar asistencia desde la API. La pantalla de karts y el QR de 007 todavía no están implementados. Contrato completo: [arquitectura](docs/ARCHITECTURE.md#registro-de-carrera-008).

La lista local incluye los quince nombres y personajes. El profesor prepara la carrera y comparte su entrada durante el lobby. Cada alumno elige un nombre libre; Go fija el grupo y abre el registro tres segundos después. Gana quien confirma primero el código, no quien entró primero al lobby. El profesor puede cerrar aunque falten participantes.

Cada plaza tiene tres oportunidades totales, incluida la correcta; las quince plazas suman como máximo cuarenta y cinco evaluaciones. Cambiar dirección o navegador, girar el código o reiniciar no repone oportunidades. Si se pierde el acceso después de Go, no se entrega otro. Esta entrada sencilla permite elegir nombres ajenos: no verifica identidad.

Los participantes de una carrera pueden compartir Wi-Fi sin gastar el presupuesto de otros ni activar un bloqueo colectivo. Las clases normales conservan sus límites de cinco intentos por segundo y veinte por minuto con bloqueo permanente por dirección.

Si la base está ocupada antes de reservar, la API devuelve 503 con Retry-After: 1: se puede repetir el mismo envío, sin generar otro identificador. Una reserva confirmada queda gastada aunque el resultado falle. Ante 202/unconfirmed o un error técnico, se consulta /me o se repite el mismo operation_id con el mismo contenido; eso no vuelve a evaluar el código. Si sigue abierto y queda presupuesto, el alumno puede decidir hacer otro envío con un UUID nuevo. Después de un éxito, el resultado se recupera hasta dos horas desde la preparación; ni cerrar ni reiniciar prolonga ese plazo.

Para comprobar el backend, con el entorno activado y desde la carpeta del proyecto:

```bash
python -m pytest -q tests/test_race_domain.py tests/test_race_storage.py tests/test_race_usecases.py tests/test_race_concurrency.py tests/test_race_api.py
python -m pytest -q tests/test_race_live_http.py
python -m pytest -q
```

La segunda comprobación levanta un servidor solo en loopback sobre un puerto libre, usa quince clientes y cincuenta envíos adversarios con datos ficticios, lo detiene y comprueba que el puerto queda libre. No necesita un túnel. Las pruebas usan bases temporales; no añaden asistencias a data/asistencia.db.

La API requiere un origen real configurado para carreras. El arranque lo obtiene de su URL local o túnel; una factoría de desarrollo puede recibir race_origin y race_local_http=True únicamente para loopback. La entrada del profesor sigue protegida con X-Teacher-Token. No publiques una instancia HTTP de desarrollo en la red de clase.
