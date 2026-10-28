# AsistenciApp

Pasa lista en una clase online (Discord, Google Meet o cualquier otra plataforma) en menos de un minuto.

El profesor abre una sesión y comparte en la llamada un **código de 4 cifras** que cambia cada 30 segundos. Los alumnos abren un enlace, escriben su nombre y el código, y aparecen al momento en la lista del profesor. Al final de la clase, la lista se descarga para Excel o Google Sheets.

La app usa el aspecto de [neoland.es](https://neoland.es): sus colores, sus tipografías (Montserrat y Roboto) y sus botones redondeados, también en modo oscuro.

> Proyecto hecho con *Spec-Driven Development*. Las reglas están en [docs/CONSTITUTION.md](docs/CONSTITUTION.md), la organización del código en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), el manual para agentes de IA en [AGENTS.md](AGENTS.md) y la especificación en [specs/001-checkin-codigo/](specs/001-checkin-codigo/spec.md).

---

## 1. Preparar el entorno (solo la primera vez)

Necesitas **Python 3.13+** y, para clases online, **Homebrew** (macOS).

```bash
cd staff/ella-deyavorsky/asistenciapp
python3 -m venv .venv                # crea el entorno virtual del proyecto
source .venv/bin/activate            # lo activa (verás "(.venv)" en el prompt)
pip install -r requirements.txt      # instala Flask y pytest
brew install cloudflared             # el túnel para que los alumnos entren desde casa
```

---

## 2. Activar el entorno

En cada terminal nueva, primero activa el entorno:

```bash
cd staff/ella-deyavorsky/asistenciapp
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

Es un límite **disuasorio**, no una prueba de identidad: se salta con otro navegador, una ventana privada u otro dispositivo. Para lo que se cuele, está el botón **Quitar**. Si quitas a alguien, **su navegador puede volver a registrarse**: al abrir otra vez el enlace ve el formulario (spec 007). Los registros hechos antes de este cambio siguen mostrando "ya te registraste".

Las **sesiones anteriores** aparecen en el panel con su número de asistentes, y puedes volver a verlas o descargarlas cuando quieras.

### Grupos: los alumnos eligen su nombre de una lista

En vez de que cada alumno escriba su nombre, puedes preparar **una vez** la lista de un grupo (por ejemplo «SDD 2º A»). Así no hay erratas ni nombres inventados, y la app te dice **quién faltó**.

> **Antes del primer arranque con esta versión**, copia `data/asistencia.db` a una carpeta fuera del repositorio. Al arrancar, la app añade columnas nuevas a la base (sin borrar nada). Si algo saliera mal, vuelve a poner la copia.

**Crear un grupo**

1. En el panel, en **Grupos**, pulsa **Nuevo grupo** y escribe su nombre.
2. Escribe un alumno en cada casilla. Con **Intro** pasas a la siguiente (o aparece una nueva), y con **×** quitas una casilla. Si pegas varios nombres a la vez (uno por línea, por ejemplo una columna copiada de Excel), cada uno va a su casilla.
3. ¿Tienes la lista en un **CSV** de Excel o Google Sheets? Elígelo en «O sube un CSV» y pulsa **Revisar**: sus nombres pasan a las casillas, detrás de los que ya había. Vale separado por `;` o por `,`; se usa la primera columna, y la primera fila puede ser una cabecera como «Nombre».
4. Pulsa **Subir lista**. Antes de guardar, la app revisa la lista: los nombres repetidos o demasiado largos salen marcados en su casilla y no se guarda nada hasta que los corrijas (diferéncialos, por ejemplo con la inicial del apellido). Si un nombre solo **se parece** a otro, te lo enseña («¿Quisiste decir…?») y el botón pasa a **Subir igualmente**.
5. Al guardar, cada palabra empieza por **mayúscula**: «maría de la fuente» queda «María de la Fuente» («de», «del», «la», «las», «los», «y» y «e» se quedan en minúscula). El resto de la palabra se queda como lo escribiste. Los nombres que escriben los alumnos no cambian.

Un grupo puede tener hasta 200 alumnos y puede guardarse vacío para rellenarlo luego: escribe solo su nombre y pulsa **Subir lista**.

Con **Editar** añades alumnos (con las mismas casillas, el CSV y **Subir lista**), los renombras (también con mayúscula) o los quitas. **Archivar** lo esconde del panel sin perder nada (puedes restaurarlo). **Borrar** solo funciona si el grupo no tiene una asistencia abierta; sus listas pasadas se conservan.

**Pasar lista con un grupo**

1. Al abrir la asistencia, elige el grupo en **Lista** (o «Sesión rápida» para hacerlo como siempre). Un grupo sin alumnos no puede abrir asistencia.
2. El alumno abre el enlace, escribe el **código** de tu pantalla y ve la lista. Busca su nombre y lo toca. Tiene **2 minutos** para elegir; si se le pasa, vuelve a escribir el código y no pierde lo que había elegido. Cada código escrito sirve para **un solo registro**: para apuntar a otra persona hay que escribir el código otra vez.
3. Los nombres ya registrados salen tachados y no se pueden elegir. Si alguien eligió mal, pulsa **Liberar** en su fila: el nombre vuelve a estar libre y ese navegador puede registrarse otra vez.
4. Quien no está en la lista pulsa **No estoy en la lista** y escribe su nombre. Si se parece a uno de la lista, la app le pregunta «¿Quisiste decir…?». Queda como **nuevo**.
5. Ves «X de N presentes», los nuevos y los que faltan. Al cerrar (o después, desde la sesión cerrada) decides qué hacer con cada nuevo: **Añadir al grupo** (estará en la lista la próxima vez), **Dejar solo aquí** o **Descartar**.
6. **Descargar lista** da un CSV con las columnas *Grupo*, *Fecha*, *Nombre*, *Estado* (presente, ausente o nuevo) y *Hora*.

Cada sesión guarda una **copia fija** de la lista: si luego cambias el grupo, las sesiones pasadas no cambian.

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
| Los alumnos ven *"Tu IP ha sido bloqueada…"* | Se superó el límite de intentos y la IP quedó bloqueada para siempre. Mira *Si una IP queda bloqueada*, justo debajo. |

### Límite de intentos y IP bloqueada

Para que nadie ausente pruebe códigos hasta acertar, el registro admite como máximo **5 intentos por segundo y 20 por minuto** desde cada IP. Quien se pasa recibe el aviso *"Tu IP ha sido bloqueada…"* y queda en una lista negra **para siempre**, también si reinicias la app. Solo cuentan los registros de los alumnos; tu panel no tiene límite.

> **Ojo con el enlace público:** con `--tunel` todos los alumnos llegan a la app con la misma IP (`127.0.0.1`), así que comparten el límite. Si se registran más de 5 a la vez, o más de 20 en un minuto, se bloquea a toda la clase. Es una decisión aceptada (spec 006).

**Si una IP queda bloqueada** (por ejemplo, toda la clase), desbloquéala a mano. Para la app (sección 5) y, desde esta carpeta, ejecuta:

```bash
sqlite3 data/asistencia.db "DELETE FROM blocked_ips WHERE ip = '127.0.0.1'; DELETE FROM ip_attempts WHERE ip = '127.0.0.1';"
```

Cambia `127.0.0.1` por la IP que quieras desbloquear. Después vuelve a arrancar la app.

---

## 7. Tests

```bash
source .venv/bin/activate
pytest            # o "pytest -v" para ver cada test
```

Cada criterio de aceptación de la spec (`CA-01` a `CA-26`) tiene un test o una verificación manual; la tabla está en [plan.md §6](specs/001-checkin-codigo/plan.md).

---

## 8. Privacidad

- De cada alumno solo se guarda **su nombre** (el que escribe él o el que pones tú en la lista de un grupo) y, en cada clase, **la hora** y **el estado** de su registro. Nada de emails (constitución P4, v4.0).
- La lista de un grupo **no la ve nadie sin el código** de la clase; tú la ves en tu panel. De un CSV solo se guarda la primera columna.
- La **IP** se guarda solo para limitar los intentos (lista negra y contadores), **separada de los nombres** y sin salir en el CSV (constitución P4, v3.0).
- El límite "un registro por navegador" se guarda **solo en el navegador del alumno**, no en el servidor.
- Quitar un registro o descartar a un nuevo lo **borra de verdad** (no queda en ninguna papelera). Borrar un grupo borra su lista; las listas de asistencia pasadas se conservan.
- Los datos se guardan **solo en tu ordenador** (`data/`, que no se sube a git).
- Con `--tunel`, el tráfico pasa **cifrado** por Cloudflare, que no lo almacena (constitución P4, v2.1).
- Las tipografías van **dentro de la app** (`static/fonts/`, con su licencia OFL): ni tu navegador ni el de los alumnos piden nada a Google ni a otro servicio.
