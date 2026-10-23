# AsistenciApp

Pasa lista en una clase online (Discord, Google Meet o cualquier otra plataforma) en menos de un minuto.

El profesor abre una sesión y comparte en la llamada un **código de 4 cifras** que cambia cada 30 segundos. Los alumnos abren un enlace, escriben su nombre y el código, y aparecen al momento en la lista del profesor. Al final de la clase, la lista se descarga para Excel o Google Sheets.

> Proyecto hecho con *Spec-Driven Development*. Las reglas están en [CONSTITUTION.md](CONSTITUTION.md), la arquitectura del código en [ARCHITECTURE.md](ARCHITECTURE.md), el manual para agentes de IA en [AGENT.md](AGENT.md) y las especificaciones en [specs/](specs/) (la de la app, [001-checkin-codigo](specs/001-checkin-codigo/spec.md)).

---

## 1. Preparar el entorno (solo la primera vez)

Necesitas **Python 3.13+** y, para clases online, **Homebrew** (macOS).

```bash
cd staff/victor-chang/asistenciapp
python3 -m venv .venv                # crea el entorno virtual del proyecto
source .venv/bin/activate            # lo activa (verás "(.venv)" en el prompt)
python --version                     # debe decir "Python 3.13…"
pip install -r requirements.txt      # instala Flask y las herramientas de desarrollo
brew install cloudflared             # el túnel para que los alumnos entren desde casa
```

---

## 2. Arrancar la app

En cada terminal nueva, primero activa el entorno:

```bash
cd staff/victor-chang/asistenciapp
source .venv/bin/activate
```

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

### Opciones (variables de entorno)

Todas son opcionales; se ponen delante del comando, p. ej. `PORT=8001 python app.py`.

| Variable | Para qué | Por defecto |
| --- | --- | --- |
| `PORT` | Puerto local de la app | `8000` |
| `ASISTENCIA_DB` | Archivo de la base de datos (p. ej. una copia para probar) | `data/asistencia.db` |
| `ASISTENCIA_TZ` | Zona horaria del título por defecto y del CSV (p. ej. `Europe/Madrid`) | la del ordenador |

---

## 3. Pasar lista, paso a paso

1. Abre el **enlace del panel** que aparece en la terminal.
2. Escribe un título de hasta **20 caracteres** (opcional; si no, se usa la fecha y hora) y pulsa **Abrir asistencia**.
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

## 4. Cerrar la app

Pulsa **Ctrl+C** en la terminal donde está arrancada. Se paran la app y el túnel. Los datos quedan guardados en `data/asistencia.db`.

> **"Cerrar asistencia"** (el botón del panel) solo cierra los registros de *esa clase*; la app sigue funcionando. **Ctrl+C** apaga la app entera.

Si ya no encuentras la terminal donde la arrancaste:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN     # muestra el proceso "Python" y su número (PID)
kill <PID>                           # lo para
pkill cloudflared                    # para el túnel, si lo usabas
```

---

## 5. Problemas frecuentes

| Mensaje o síntoma | Qué hacer |
| --- | --- |
| `El puerto 8000 ya está en uso` | Ya tienes la app abierta en otra terminal: ciérrala (sección 4). O usa otro puerto: `PORT=8001 python app.py --tunel`. |
| `No se encontró cloudflared` | Instálalo: `brew install cloudflared`. |
| El enlace del túnel no carga | Espera unos 20 segundos y recarga: los túneles nuevos tardan en estar accesibles. |
| Aviso amarillo en el panel: *"tus alumnos no podrán abrir el enlace"* | Abriste el panel en `localhost`. Para la app y arráncala con `python app.py --tunel`. |
| *"Enlace del panel no válido"* | Usa el enlace exacto de la terminal, incluido todo lo que va detrás de `#t=`. |
| `command not found: pytest` o `python` no encuentra Flask | No has activado el entorno: `source .venv/bin/activate`. |
| `SyntaxError: Non-ASCII character '\xc3' in file app.py` | Estás usando el Python 2 del sistema. Activa el entorno (`source .venv/bin/activate`) y comprueba que `python --version` dice 3.13. |
| `PORT debe ser un número…` o `ASISTENCIA_TZ no es una zona horaria válida…` | Corrige esa variable o quítala para usar el valor por defecto (tabla de la sección 2). |

---

## 6. Tests y revisión del código

```bash
source .venv/bin/activate
pytest            # o "pytest -v" para ver cada test
ruff format       # da formato al código
ruff check        # estilo y errores habituales
mypy              # tipos
```

Cada criterio de aceptación de la spec 001 (`CA-01` a `CA-26`) tiene un test o una verificación manual; la tabla está en [plan.md §6](specs/001-checkin-codigo/plan.md). Los de la spec 005, en su [plan.md §6](specs/005-adaptar-arquitectura/plan.md).

El código está organizado por capas según [ARCHITECTURE.md](ARCHITECTURE.md): `attendance/domain/` (reglas), `usecases/` (acciones), `entrypoints/web/` (Flask) e `infra/` (base de datos, CSV, túnel). `app.py` solo arranca la app.

---

## 7. Privacidad

- Del alumno solo se guarda **el nombre que escribe** y **la hora**. Nada de emails ni IPs.
- El límite "un registro por navegador" se guarda **solo en el navegador del alumno**, no en el servidor.
- Quitar un registro lo **borra de verdad** (no queda en ninguna papelera).
- Los datos se guardan **solo en tu ordenador** (`data/`, que no se sube a git).
- Con `--tunel`, el tráfico pasa **cifrado** por Cloudflare, que no lo almacena (constitución P4).
- La consola de la app no muestra IPs ni nombres de alumnos.
