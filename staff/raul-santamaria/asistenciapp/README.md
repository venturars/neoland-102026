# AsistenciApp

Pasa lista en una clase online (Discord, Google Meet o cualquier otra plataforma) en menos de un minuto.

El profesor abre una sesión y comparte en la llamada un **código de 4 cifras** que cambia cada 30 segundos. Los alumnos abren un enlace, escriben su nombre y el código, y aparecen al momento en la lista del profesor. Al final de la clase, la lista se descarga para Excel o Google Sheets.

> Proyecto hecho con *Spec-Driven Development*. Las reglas están en [docs/CONSTITUTION.md](docs/CONSTITUTION.md), el manual para agentes de IA en [AGENTS.md](AGENTS.md) y la especificación en [specs/001-checkin-codigo/](specs/001-checkin-codigo/spec.md).

---

## 1. Preparar el entorno (solo la primera vez)

Necesitas **Python 3.13+** y, para clases online, **Homebrew** (macOS).

```bash
cd staff/<usuario>/asistenciapp
python3 -m venv .venv                # crea el entorno virtual del proyecto
source .venv/bin/activate            # lo activa (verás "(.venv)" en el prompt)
pip install -r requirements.txt      # instala Flask, pytest y discord.py
brew install cloudflared             # el túnel para que los alumnos entren desde casa
```

---

## 2. Activar el entorno

En cada terminal nueva, primero activa el entorno:

```bash
cd staff/<usuario>/asistenciapp
source .venv/bin/activate
```

En Windows: `.\.venv\Scripts\Activate.ps1`.

---

## 3. Arrancar la app

| Para… | Comando |
| --- | --- |
| **Una clase online** (alumnos en sus casas) | `python app.py --tunel` |
| Probar solo en tu ordenador | `python app.py` |
| Bot de Discord (opcional, otra terminal) | `python bot_discord.py` |

Al arrancar verás algo así:

```
  Abriendo el túnel público (puede tardar unos segundos)...

  Panel del profesor: https://palabras-al-azar.trycloudflare.com/profesor.html#t=…
```

Ese enlace es **tu panel privado**: no lo compartas, porque quien lo tenga puede ver y cerrar tus listas.

- Con `--tunel`, la dirección **cambia cada vez** que arrancas, y puede tardar **unos 20 segundos** en funcionar.
- La app solo funciona **mientras tu ordenador esté encendido** y la app arrancada.
- El bot de Discord es un **proceso aparte**: no sustituye a `app.py`.

---

## 4. Bot de Discord (opcional)

Sirve para que el alumno se registre con el **nombre visible** de su cuenta de Discord y el **código de 4 cifras**. El check-in por enlace web sigue igual.

### Primera vez

1. En el [Portal de desarrolladores de Discord](https://discord.com/developers/applications), crea una aplicación y un bot. Copia el **token**.
2. Activa en el bot las opciones que pida Discord para comandos slash (applications.commands).
3. Invita el bot a tu servidor de clase (permisos para usar comandos slash / enviar mensajes).
4. En `asistenciapp/`, crea `data/discord_token.txt` con **solo el token** (una línea). Ese fichero **no se sube a git**.

```bash
mkdir -p data
# pon el token en data/discord_token.txt (una sola línea)
```

### En cada clase

1. Arranca la app (`python app.py` o con `--tunel`) y, en **otra terminal** con el venv activo, `python bot_discord.py`.
2. En el panel, abre la asistencia y pulsa **Activar Discord**.
3. Los alumnos escriben en Discord: `/asistencia codigo:1234` (el código de tu pantalla).
4. Aparecen en tu lista con su nombre visible de Discord. Puedes **Quitar** un registro igual que los del web.

Si falta el token, el bot se para con un error claro pidiendo `data/discord_token.txt`.

---

## 5. Pasar lista, paso a paso

1. Abre el **enlace del panel** que aparece en la terminal.
2. Escribe un título (opcional; si no, se usa la fecha y hora) y pulsa **Abrir asistencia**.
3. **Comparte pantalla** en la llamada: el código se ve en grande, con una cuenta atrás.
4. Pulsa **Copiar enlace de alumnos** y pégalo en el chat de Discord o Meet (o usa el bot de la sección 4).
5. Cada alumno abre el enlace, escribe su **nombre** y el **código** de tu pantalla, y pulsa **Estoy en clase**. Su nombre aparece en tu lista en un par de segundos.
6. Cuando ya estén todos, pulsa **Cerrar asistencia** y confírmalo. Desde ese momento nadie más puede registrarse.
7. Pulsa **Descargar lista** para obtener el CSV (columnas *Nombre* y *Hora*).

**¿Ves un nombre falso o equivocado?** Pulsa **Quitar** en su fila y confirma con **Sí, quitar**. Desaparece de la lista, del total y de la descarga. Funciona también con la asistencia ya cerrada.

**¿Falta alguien que sí estuvo?** En la vista de la sesión, escribe el nombre en **Añadir alumno a mano** y pulsa **Añadir**. Cuenta igual que un registro normal (lista, total y descarga). También funciona si la asistencia ya está cerrada.

### Un registro por navegador

Cuando un alumno se registra, su navegador lo recuerda **para esa clase**: si vuelve a abrir el enlace, ve *"Ya te registraste en esta clase como Ana García a las 11:07"* y no puede apuntar a otra persona. En la clase siguiente puede registrarse con normalidad.

Es un límite **disuasorio**, no una prueba de identidad: se salta con otro navegador, una ventana privada u otro dispositivo. Para lo que se cuele, está el botón **Quitar**. Si quitas a alguien, su navegador sigue mostrando "ya te registraste": tendría que usar otro navegador para registrarse de nuevo.

### Intentos de registrarse

Una misma dirección puede intentar registrarse **5 veces por segundo** y **20 por minuto**. Si se pasa, queda bloqueada para siempre. No hay forma de quitar esa dirección. El código de 4 cifras no cambia.

Las **sesiones anteriores** aparecen en el panel con su número de asistentes, y puedes volver a verlas o descargarlas cuando quieras.

---

## 6. Cerrar la app

Pulsa **Ctrl+C** en la terminal donde está arrancada. Se paran la app y el túnel. Si tenías el bot, **Ctrl+C** también en esa terminal. Los datos quedan guardados en `data/asistencia.db`.

> **"Cerrar asistencia"** (el botón del panel) solo cierra los registros de *esa clase*; la app sigue funcionando. **Ctrl+C** apaga la app entera.

Si ya no encuentras la terminal donde la arrancaste:

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN     # muestra el proceso "Python" y su número (PID)
kill <PID>                           # lo para
pkill cloudflared                    # para el túnel, si lo usabas
```

---

## 7. Problemas frecuentes

| Mensaje o síntoma | Qué hacer |
| --- | --- |
| `El puerto 8000 ya está en uso` | Ya tienes la app abierta en otra terminal: ciérrala (sección 6). O usa otro puerto: `PORT=8001 python app.py --tunel`. |
| `No se encontró cloudflared` | Instálalo: `brew install cloudflared`. |
| El enlace del túnel no carga | Espera unos 20 segundos y recarga: los túneles nuevos tardan en estar accesibles. |
| Aviso amarillo en el panel: *"tus alumnos no podrán abrir el enlace"* | Abriste el panel en `localhost`. Para la app y arráncala con `python app.py --tunel`. |
| *"Enlace del panel no válido"* | Usa el enlace exacto de la terminal, incluido todo lo que va detrás de `#t=`. |
| `command not found: pytest` o `python` no encuentra Flask | No has activado el entorno: `source .venv/bin/activate`. |
| `No se encontró el token del bot` | Crea `data/discord_token.txt` con el token (sección 4). |
| `/asistencia` no aparece en Discord | Espera un minuto tras arrancar el bot; comprueba que el bot está en el servidor e invitado con comandos slash. |
| El bot dice que Discord no está activado | En el panel, con la sesión abierta, pulsa **Activar Discord**. |

---

## 8. Tests

```bash
source .venv/bin/activate
pytest            # o "pytest -v" para ver cada test
```

Cada criterio de aceptación de la spec (`CA-01` a `CA-26`) tiene un test o una verificación manual; la tabla está en [plan.md §6](specs/001-checkin-codigo/plan.md). El check-in con Discord está en [specs/007-checkin-discord/](specs/007-checkin-discord/spec.md). Añadir alumno a mano: [specs/008-add-student-manually/](specs/008-add-student-manually/spec.md).

---

## 9. Privacidad

- Del alumno solo se guarda el **nombre** y la **hora**. En el web es el nombre que escribe; por Discord, el **nombre visible** de su cuenta. Nada de emails ni identificadores de Discord.
- La dirección desde la que intenta registrarse (web) se recuerda **solo** para contar esos intentos y para la lista de bloqueo, en el mismo archivo local. No se guarda junto al nombre ni a la hora.
- El límite "un registro por navegador" se guarda **solo en el navegador del alumno**, no en el servidor.
- Quitar un registro lo **borra de verdad** (no queda en ninguna papelera).
- Los datos se guardan **solo en tu ordenador** (`data/`, que no se sube a git). Ahí también va `discord_token.txt` si usas el bot.
- Con `--tunel`, el tráfico pasa **cifrado** por Cloudflare, que no lo almacena (constitución P4).
- El bot de Discord habla con los servidores de Discord; en tu archivo local solo queda el nombre visible y la hora del registro.
