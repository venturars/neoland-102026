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
pip install -r requirements.txt      # instala las dependencias del proyecto
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
- En las clases normales, el recordatorio "un registro por navegador" se guarda **solo en el navegador del alumno**. En carrera se guardan plazas y permisos temporales separados, con caducidad máxima de dos horas; la cookie propia no identifica dispositivos entre clases.
- Quitar un registro lo **borra de verdad** (no queda en ninguna papelera).
- Los datos se guardan **solo en tu ordenador** (`data/`, que no se sube a git).
- Con `--tunel`, el tráfico pasa **cifrado** por Cloudflare, que no lo almacena (constitución P4, v2.1).


## Protección de los registros

Una dirección puede intentar registrarse como máximo cinco veces en un segundo y veinte en un minuto, contando también los intentos incorrectos y repetidos. Superar cualquiera de los máximos bloquea permanentemente esa dirección para registrar asistencia, incluso tras reiniciar la aplicación. Esperar no elimina el bloqueo; no hay función de desbloqueo en esta versión.

El formulario muestra el motivo del rechazo. Las páginas, consultas y operaciones del profesor siguen disponibles. Personas que comparten una dirección pública comparten los límites: se distingue la conexión, no la identidad de cada alumno.

Con `python app.py` se cuenta la dirección de la conexión directa y se ignoran las cabeceras que intenten sustituirla. Con `python app.py --tunel`, el registro exige la dirección de visitante comunicada por el conector Cloudflare local; si falta o no es válida se rechaza con un aviso, sin inventar una dirección. En ese modo el registro directo por localhost sin el origen del túnel se rechaza, aunque las consultas locales siguen funcionando. La aplicación continúa escuchando únicamente en 127.0.0.1.


## Carrera de Halloween

1. En el panel, marca **Carrera de Halloween** antes de abrir la clase. La presentación muestra los quince nombres y sus personajes del ejercicio de Halloween sobre karts distintos.
2. Comparte esa pantalla. Los alumnos escanean el QR o abren **Abrir entrada sin cámara**, eligen un nombre libre y pulsan **Entrar a la parrilla**. Aparecer como «Listo» todavía no registra asistencia ni da un puesto.
3. Cuando estén los participantes previstos, pulsa **Empezar carrera**. No hace falta esperar a los quince. Se cierra la entrada, se fija el grupo y comienza una única cuenta atrás de tres segundos.
4. Al terminar la cuenta atrás aparece el código de cuatro cifras en la presentación. Cada alumno lo escribe en su teléfono: gana quien confirma primero, no quien escaneó primero. Cada plaza tiene **tres envíos totales, incluido el correcto**. Los códigos rotan cada treinta segundos.
5. El alumno recibe su confirmación y puesto enseguida. Cuando todos los participantes fijados registran asistencia, se cierra la carrera. Si alguien falta, se desconecta o agota sus intentos, pulsa **Terminar carrera** y confirma el cierre.
6. Los pilotos que registraron asistencia recorren la pista en una llegada de unos ocho segundos, en el orden guardado. Después aparecen el podio y la clasificación. Con movimiento reducido o al recargar una carrera cerrada, el resultado se muestra directamente. Con uno o dos finalistas se conceden solo esas medallas; sin registros no hay ganadores.

**Descargar asistencia** conserva el CSV de asistencia. **Quitar** retira una asistencia y recalcula los puestos, pero no devuelve intentos ni vuelve a abrir la plaza. El nombre **neoland / kart** de la cabecera vuelve al panel para consultar otras clases; **Pantalla completa** amplía la presentación.

### Acceso e intentos

La entrada compartida no comprueba identidad: alguien puede ocupar nombres ajenos, incluso todos antes de empezar. El profesor puede retirar una ocupación equivocada mientras el lobby está abierto. Después de la salida no se admiten nuevas plazas ni accesos de reemplazo: hay que conservar el mismo navegador y sus cookies. Perder ese acceso impide continuar en esa carrera.

En carrera, compartir Wi-Fi no mezcla los presupuestos: cada plaza tiene tres comprobaciones y las quince suman como máximo cuarenta y cinco. Las clases normales mantienen los límites por dirección descritos arriba. Cambiar de dispositivo, dirección o código no repone oportunidades de la carrera.

Ante una respuesta perdida, la pantalla consulta el resultado. Si ofrece **Reintentar el mismo envío**, conserva su identificador y código; repetirlo no obtiene otra comprobación. Si un envío quedó sin resultado confirmado, su oportunidad permanece gastada y nunca se muestra como éxito. Otro envío requiere una nueva acción del alumno. El acceso privado al propio resultado caduca como máximo dos horas después de preparar la carrera.

### QR y dibujos

El QR se genera en el servidor con **qrcode==8.2**, sin extras de imágenes ni servicio externo. En Windows el paquete declara **colorama** como dependencia de plataforma; no se necesita Pillow. Los quince SVG son adaptaciones originales de los ejercicios: [personajes y referencias](docs/RACE-ASSETS.md).

En la verificación local se decodificó el QR con Apple Vision y se probó su enlace en navegadores independientes. Miguel comprobó después el escaneo con la cámara de su móvil y el recorrido de registro mediante un túnel HTTPS temporal el 2026-10-25.

### Comprobar la carrera

Desde la carpeta del proyecto, con el entorno activado:

```bash
python -m pytest -q
python -m pytest -q tests/test_race_qr.py tests/test_race_live_http.py
```

Los ensayos de navegador, capturas y sus resultados están en [la evidencia de 007](specs/007-carrera-de-asistencia/evidence.md). El backend y sus límites están documentados en [008](specs/008-proteger-el-registro-de-carrera/evidence.md).
