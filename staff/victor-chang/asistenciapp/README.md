# AsistenciApp

Pasa lista en una clase online (Discord, Google Meet o cualquier otra plataforma) en menos de un minuto.

Cada clase usa uno de dos modos:

- **Código** (cualquier plataforma): el profesor comparte en la llamada un **código de 4 cifras** que cambia cada 30 segundos. Los alumnos abren un enlace, escriben su nombre y el código, y aparecen al momento en la lista del profesor.
- **Automático (Google Meet)**: la app pide a Google la lista de participantes de la reunión y los registra, sin que el alumno haga nada (sección 4).

Al final de la clase, la lista se descarga para Excel o Google Sheets.

> Proyecto hecho con *Spec-Driven Development*. Las reglas están en [CONSTITUTION.md](CONSTITUTION.md), la arquitectura del código en [ARCHITECTURE.md](ARCHITECTURE.md), el manual para agentes de IA en [AGENT.md](AGENT.md) y las especificaciones en [specs/](specs/) (la del modo código, [001-checkin-codigo](specs/001-checkin-codigo/spec.md); la del modo automático, [004-asistencia-meet](specs/004-asistencia-meet/spec.md)).

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
| **Una clase de Meet** (modo automático, sección 4) | `python app.py --meet <enlace>` |

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
| `ASISTENCIA_TZ` | Zona horaria del título por defecto, de la hora de la reunión y del CSV (p. ej. `Europe/Madrid`) | la del ordenador |
| `ASISTENCIA_GOOGLE_CLIENT` | La llave de la app en Google Cloud (sección 4.1) | `data/google-client.json` |
| `ASISTENCIA_GOOGLE_TOKEN` | Dónde se guarda tu permiso de Google | `data/google-token.json` |

---

## 3. Pasar lista con código, paso a paso

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

## 4. Modo automático (Google Meet)

En una clase **automática**, nadie escribe nada: la app pregunta a Google quién está en la reunión de Meet y registra a cada participante con su **nombre en Meet** y la hora. Tú (la cuenta con la que das permiso) no te registras.

### 4.1 Preparar Google Cloud (solo la primera vez, unos 15 minutos)

La app necesita una "llave" propia en Google Cloud. Es gratis y sirve con una cuenta de Google normal.

1. Entra en [console.cloud.google.com](https://console.cloud.google.com/) y **crea un proyecto** (p. ej. "AsistenciApp").
2. En **APIs y servicios → Biblioteca**, busca **Google Meet REST API** y pulsa **Habilitar**.
3. En **APIs y servicios → Pantalla de consentimiento de OAuth** (o **Google Auth Platform**):
   - tipo de usuario **Externo**;
   - nombre de la app y tu email de contacto;
   - en **Permisos** (*scopes*), añade `openid` y `https://www.googleapis.com/auth/meetings.space.readonly` (solo lectura);
   - en **Usuarios de prueba**, añade la cuenta de Google con la que vas a tomar la asistencia.
4. En **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**, elige el tipo **Aplicación de escritorio** (no "Aplicación web").
5. Descarga el JSON y guárdalo como **`data/google-client.json`** dentro de la carpeta del proyecto. Luego, en la terminal:

   ```bash
   chmod 600 data/google-client.json   # solo tú puedes leerlo
   git status                          # no debe aparecer: data/ no se sube a git
   ```

Es un secreto: no lo pegues en ningún chat ni lo subas a ningún sitio.

> **Permiso semanal.** Mientras la app de Google esté en modo *Prueba* (*Testing*), Google pide aceptar el permiso de nuevo **cada 7 días**. La app lo detecta y vuelve a abrir la ventana de Google; solo tienes que aceptar.

### 4.2 Tomar la asistencia

**Desde la terminal** (lo más rápido):

```bash
python app.py --meet https://meet.google.com/abc-defg-hij           # quién está ahora
python app.py --meet abc-defg-hij --meet-todos                      # todos los que han estado
python app.py --meet https://meet.google.com/abc-defg-hij --tunel   # también con túnel
```

La app abre una clase automática con la fecha como título, toma la asistencia una vez y escribe el resultado, p. ej. *"Reunión del 23/10 a las 08:56 · Añadidas 12 personas nuevas · 12 en la llamada ahora"*. El enlace del panel que aparece después abre directamente esa clase.

**Desde el panel**: al abrir la clase, elige **Automático (Meet)** y pega el enlace de la reunión. La clase muestra dos botones:

| Botón | Qué registra |
| --- | --- |
| **Quién está ahora** | Quien está en la llamada en este momento. Si la reunión ya terminó, te avisa. |
| **Todos los que han estado** | Todos los que han entrado en algún momento, también quien ya salió. Sirve con la reunión terminada. |

- Puedes pulsarlos **las veces que quieras**: cada vez añade solo a los nuevos (nadie se repite) y nunca quita a quien salió.
- La **primera vez**, la app abre el navegador **de tu ordenador** con la pantalla de Google: elige tu cuenta, marca la casilla **"Ver información sobre tus reuniones de Google Meet"** y acepta. Las siguientes veces ya no lo pide.
- Funciona si **organizas** la reunión **o** si **estás en ella** con esa cuenta. Google guarda cada reunión **30 días** después de terminar.
- Si una sala de Meet se usa cada día, se toma la reunión **en curso** o, si no hay ninguna, **la última que terminó**; el resultado dice de qué día y hora es.
- Quien entra sin nombre aparece como **"Invitado sin nombre"**; puedes quitarlo con **Quitar**.
- En una clase automática los alumnos no tienen nada que hacer: si abren el enlace de alumnos, se les explica que la asistencia se toma desde Meet.

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
| `SyntaxError: Non-ASCII character '\xc3' in file app.py` | Estás usando el Python 2 del sistema. Activa el entorno (`source .venv/bin/activate`) y comprueba que `python --version` dice 3.13. |
| `PORT debe ser un número…` o `ASISTENCIA_TZ no es una zona horaria válida…` | Corrige esa variable o quítala para usar el valor por defecto (tabla de la sección 2). |
| *"Falta preparar la app en Google Cloud…"* | Falta `data/google-client.json` o la Google Meet REST API no está habilitada: sigue la sección 4.1. |
| *"Falta el permiso de Google Meet…"* | En la ventana de Google no marcaste la casilla de Meet. Vuelve a tomar la asistencia y márcala. |
| *"No se completó el permiso de Google…"* | Pasaron 2 minutos o pulsaste *Cancelar*. Vuelve a tomar la asistencia y acepta. Si Google dice que la app no está verificada o que no tienes acceso, añade tu cuenta en **Usuarios de prueba** (sección 4.1, paso 3). |
| *"No hay ninguna reunión con ese enlace que esta cuenta pueda ver…"* | Revisa el enlace; la reunión debe haber empezado, tener menos de 30 días, y tu cuenta debe organizarla o haber entrado. |
| *"Esta reunión ya terminó…"* | Usa **Todos los que han estado**. |
| *"Google Meet no responde ahora mismo…"* | Espera unos segundos y vuelve a pulsar el botón. |

---

## 7. Tests y revisión del código

```bash
source .venv/bin/activate
pytest            # o "pytest -v" para ver cada test
ruff format       # da formato al código
ruff check        # estilo y errores habituales
mypy              # tipos
```

Cada criterio de aceptación de la spec 001 (`CA-01` a `CA-26`) tiene un test o una verificación manual; la tabla está en [plan.md §6](specs/001-checkin-codigo/plan.md). Los de la spec 004, en su [plan.md §6](specs/004-asistencia-meet/plan.md), y los de la spec 005, en su [plan.md §6](specs/005-adaptar-arquitectura/plan.md). Los tests nunca llaman a Google: usan respuestas de ejemplo con nombres inventados (`tests/fixtures/meet/`).

El código está organizado por capas según [ARCHITECTURE.md](ARCHITECTURE.md): `attendance/domain/` (reglas), `usecases/` (acciones), `entrypoints/web/` (Flask) y `entrypoints/cli.py` (el atajo `--meet`) e `infra/` (base de datos, CSV, túnel, Google Meet). `app.py` solo arranca la app.

---

## 8. Privacidad

- Del alumno solo se guarda **el nombre** y **la hora**: el que escribe él (modo código) o su nombre en Meet (modo automático). Nada de emails ni IPs, aunque Google los tenga.
- Con Meet, la app pide a Google **solo lectura** de tus reuniones y no pide tu email. El permiso se guarda en `data/google-token.json`, que solo puede leer tu usuario.
- El límite "un registro por navegador" se guarda **solo en el navegador del alumno**, no en el servidor.
- Quitar un registro lo **borra de verdad** (no queda en ninguna papelera).
- Los datos se guardan **solo en tu ordenador** (`data/`, que no se sube a git).
- Con `--tunel`, el tráfico pasa **cifrado** por Cloudflare, que no lo almacena (constitución P4).
- La consola de la app no muestra IPs, nombres de alumnos ni respuestas de Google.
