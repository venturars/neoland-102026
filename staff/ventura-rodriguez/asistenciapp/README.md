# AsistenciApp

Pasa lista en una clase online (Discord, Google Meet o cualquier otra plataforma) en menos de un minuto.

El profesor abre una sesión y comparte en la llamada un **código de 4 cifras** que cambia cada 30 segundos. Los alumnos abren un enlace, escriben su nombre y el código, y aparecen al momento en la lista del profesor. Al final de la clase, la lista se descarga para Excel o Google Sheets.

> Proyecto hecho con _Spec-Driven Development_. Las reglas están en [CONSTITUTION.md](docs/CONSTITUTION.md), el manual para agentes de IA en [AGENTS.md](AGENTS.md) y la especificación en [specs/001-checkin-codigo/](specs/001-checkin-codigo/spec.md).

---

## 1. Preparar el entorno (solo la primera vez)

Necesitas **Python 3.13+** y, para clases online, **cloudflared** (el túnel para que los alumnos entren desde casa). Funciona en macOS, Linux y Windows.

Primero entra en la carpeta (en cualquier sistema):

```bash
cd staff/<usuario>/asistenciapp
```

**macOS y Linux:**

```bash
python3 -m venv .venv                # crea el entorno virtual del proyecto
source .venv/bin/activate            # lo activa (verás "(.venv)" en el prompt)
pip install -r requirements.txt      # instala Flask y pytest
brew install cloudflared             # solo macOS
```

En Linux, instala cloudflared con el paquete de tu distribución o desde [sus descargas](https://github.com/cloudflare/cloudflared/releases).

**Windows (PowerShell):**

```powershell
py -m venv .venv                     # crea el entorno virtual del proyecto
.venv\Scripts\Activate.ps1           # lo activa (verás "(.venv)" en el prompt)
pip install -r requirements.txt      # instala Flask y pytest
winget install --id Cloudflare.cloudflared
```

Si PowerShell no deja ejecutar `Activate.ps1`, lánzalo una vez: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

---

## 2. Activar el entorno

En cada terminal nueva, primero entra en la carpeta y activa el entorno:

```bash
cd staff/<usuario>/asistenciapp
```

| Sistema              | Comando                      |
| -------------------- | ---------------------------- |
| macOS y Linux        | `source .venv/bin/activate`  |
| Windows (PowerShell) | `.venv\Scripts\Activate.ps1` |

---

## 3. Arrancar la app

| Para…                                       | Comando                 |
| ------------------------------------------- | ----------------------- |
| **Una clase online** (alumnos en sus casas) | `python app.py --tunel` |
| Probar solo en tu ordenador                 | `python app.py`         |

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
7. Pulsa **Descargar lista** para obtener el CSV (columnas _Nombre_ y _Hora_).

**¿Ves un nombre falso o equivocado?** Pulsa **Quitar** en su fila y confirma con **Sí, quitar**. Desaparece de la lista, del total y de la descarga. Funciona también con la asistencia ya cerrada.

### Un registro por navegador

Cuando un alumno se registra, su navegador lo recuerda **para esa clase**: si vuelve a abrir el enlace, ve _"Ya te registraste en esta clase como Ana García a las 11:07"_ y no puede apuntar a otra persona. En la clase siguiente puede registrarse con normalidad.

Es un límite **disuasorio**, no una prueba de identidad: se salta con otro navegador, una ventana privada u otro dispositivo. Para lo que se cuele, está el botón **Quitar**. Si quitas a alguien, su navegador sigue mostrando "ya te registraste": tendría que usar otro navegador para registrarse de nuevo.

### Intentos de registrarse

Solo cuentan los **códigos fallados**: registrarse con el código correcto nunca cuenta, aunque se apunte la clase entera a la vez. Una misma dirección puede fallar el código **5 veces por segundo** y **20 por minuto**. Si se pasa, queda bloqueada **10 minutos** y luego puede volver a intentarlo. El código de 4 cifras no cambia.

Con `--tunel`, cada alumno cuenta con su propia dirección (la que da Cloudflare): si uno se bloquea, los demás siguen pudiendo registrarse.

Las **sesiones anteriores** aparecen en el panel con su número de asistentes, y puedes volver a verlas o descargarlas cuando quieras.

---

## 5. Cerrar la app

Pulsa **Ctrl+C** en la terminal donde está arrancada. Se paran la app y el túnel. Los datos quedan guardados en `data/asistencia.db`.

> **"Cerrar asistencia"** (el botón del panel) solo cierra los registros de _esa clase_; la app sigue funcionando. **Ctrl+C** apaga la app entera.

Si ya no encuentras la terminal donde la arrancaste:

**macOS y Linux:**

```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN     # muestra el proceso ("Python" en macOS) y su número (PID)
kill <PID>                           # lo para
pkill cloudflared                    # para el túnel, si lo usabas
```

**Windows (PowerShell):**

```powershell
Get-NetTCPConnection -LocalPort 8000 -State Listen   # la columna OwningProcess es el PID
Stop-Process -Id <PID>                               # lo para
Stop-Process -Name cloudflared                       # para el túnel, si lo usabas
```

---

## 6. Problemas frecuentes

| Mensaje o síntoma                                                     | Qué hacer                                                                                                              |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `El puerto 8000 ya está en uso`                                       | Ya tienes la app abierta en otra terminal: ciérrala (sección 5). O usa otro puerto: `PORT=8001 python app.py --tunel` (Windows: `$env:PORT=8001; python app.py --tunel`). |
| `No se encontró cloudflared`                                          | Instálalo (sección 1). El aviso dice el comando de tu sistema.                                                         |
| _"Esta dirección queda bloqueada 10 minutos…"_                        | Se falló el código demasiadas veces. Espera 10 minutos y escribe el código que se ve ahora en pantalla.                |
| El enlace del túnel no carga                                          | Espera unos 20 segundos y recarga: los túneles nuevos tardan en estar accesibles.                                      |
| Aviso amarillo en el panel: _"tus alumnos no podrán abrir el enlace"_ | Abriste el panel en `localhost`. Para la app y arráncala con `python app.py --tunel`.                                  |
| _"Enlace del panel no válido"_                                        | Usa el enlace exacto de la terminal, incluido todo lo que va detrás de `#t=`.                                          |
| `command not found: pytest` o `python` no encuentra Flask             | No has activado el entorno (sección 2).                                                                                |

---

## 7. Tests

Con el entorno activado (sección 2):

```bash
pytest            # o "pytest -v" para ver cada test
```

Cada criterio de aceptación de la spec (`CA-01` a `CA-26`) tiene un test o una verificación manual; la tabla está en [plan.md §6](specs/001-checkin-codigo/plan.md).

---

## 8. Privacidad

- Del alumno solo se guarda **el nombre que escribe** y **la hora**. Nada de emails.
- La dirección desde la que intenta registrarse se recuerda **solo** para contar los códigos fallados (un minuto) y para la lista de bloqueo (10 minutos), en el mismo archivo local. Pasado ese tiempo se borra. No se guarda junto al nombre ni a la hora.
- El límite "un registro por navegador" se guarda **solo en el navegador del alumno**, no en el servidor.
- Quitar un registro lo **borra de verdad** (no queda en ninguna papelera).
- Los datos se guardan **solo en tu ordenador** (`data/`, que no se sube a git).
- Con `--tunel`, el tráfico pasa **cifrado** por Cloudflare, que no lo almacena (constitución P4).
