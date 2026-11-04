# Constitución de AsistenciApp

> Versión 4.1 · Ratificada: 2026-10-19 · Última enmienda: 2026-10-30

Este documento recoge los principios **no negociables** del proyecto. Toda especificación, plan técnico, tarea y línea de código debe cumplirlos. Si algo entra en conflicto con esta constitución, gana la constitución (o se enmienda primero, ver §8).

---

## 1. Propósito

AsistenciApp permite a un profesor **pasar lista en una clase online** (Discord, Google Meet o cualquier otra plataforma) de forma rápida, fiable y respetuosa con la privacidad del alumnado.

El producto existe para **ahorrar tiempo al profesor** y **dejar constancia de quién asistió**. Cualquier funcionalidad que no sirva a uno de esos dos objetivos queda fuera.

---

## 2. Principios

### P1 · Independiente de la plataforma

El registro de asistencia no depende de una plataforma concreta. Las integraciones (Discord, Meet…) son **fuentes adicionales** que se conectan al mismo modelo de datos, nunca el núcleo.

### P2 · Simplicidad primero

- Se elige siempre la solución más simple que cumpla la especificación.
- Nada de abstracciones "por si acaso". Se generaliza cuando haya un segundo caso real.
- Un alumno debe poder registrarse en **menos de 30 segundos** desde que ve el código.

### P3 · Dependencias mínimas

- Se usa la biblioteca estándar de Python (`sqlite3`, `hmac`, `secrets`, `csv`, `unicodedata`…) y el navegador (HTML, CSS y JavaScript sin frameworks).
- Las únicas dependencias externas permitidas de serie son **Flask** (servidor web) y **pytest** (tests), listadas en `requirements.txt`.
- Añadir cualquier otra requiere **justificarla por escrito** en el `plan.md` de la feature (qué problema resuelve y por qué no basta lo que ya hay).
- Herramientas externas que no son de Python, ya justificadas: `cloudflared` para el túnel (spec 001), y `git`, `gh` y el MCP de GitHub para el flujo de git (spec 007). Cualquier otra sigue la regla anterior.

### P4 · Privacidad mínima

- Del alumno solo se guarda el **nombre que él mismo escribe** y la **hora del registro**.
- **Prohibido** guardar emails, identificadores de dispositivo o cualquier dato no imprescindible. La IP de quien intenta registrarse es la excepción (con el túnel, la que da el proveedor del túnel; sin él, la de la conexión). Se recuerda solo para contar los códigos fallados durante un minuto y para la lista de bloqueo, que caduca y se borra. No forma parte del registro del alumno.
- Los datos se **almacenan** solo en local (SQLite). Ningún servicio de terceros los guarda.
- Para que los alumnos lleguen a la app desde sus casas, el tráfico puede **pasar cifrado (HTTPS)** por un proveedor de túnel (p. ej. Cloudflare). Ese proveedor no los almacena, pero técnicamente podría verlos en tránsito; por eso solo se envía lo imprescindible (nombre y código).

### P5 · Accesible y usable en móvil

- Todas las pantallas funcionan en un móvil (~400 px de ancho).
- HTML semántico, contraste suficiente, formularios con `<label>` y navegables con teclado.

### P6 · Todo en español

Interfaz, mensajes de error, documentación y especificaciones se escriben en español. El código (nombres de variables y funciones) puede ir en inglés.

---

## 3. Stack técnico fijo

| Capa          | Tecnología                                                                        |
| ------------- | --------------------------------------------------------------------------------- |
| Runtime       | Python 3.13+, en un entorno virtual `.venv/` (no se sube a git)                   |
| Servidor      | Flask, entrada en `app.py`                                                        |
| Reglas        | `asistencia/domain/`                                                              |
| Acciones      | `asistencia/usecases/`                                                            |
| Guardado      | `asistencia/storage/` con `sqlite3`, archivo en `data/` (no se sube a git)        |
| Documentos    | `docs/` (esta constitución y `docs/ARCHITECTURE.md`)                              |
| Frontend      | HTML + CSS + JavaScript sin frameworks, servidos desde `static/`                  |
| Tests         | `pytest`                                                                          |
| Túnel         | `cloudflared` (solo con `--tunel`), lanzado desde `asistencia/tunnel.py`          |
| Flujo de git  | `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`; usa `git`, `gh` y el MCP de GitHub |
| Sistemas      | macOS, Linux y Windows. Los scripts de `tools/` piden bash (en Windows, Git Bash) |

El detalle de cómo se relacionan esas carpetas está en `docs/ARCHITECTURE.md`. Cambiar el stack requiere enmendar esta constitución.

---

## 4. Forma de trabajo: desarrollo guiado por especificaciones (SDD)

El proyecto se trabaja con **SDD**: primero se escribe **qué** se quiere y **por qué**, después **cómo**, después los **pasos**, y solo entonces se cambia nada.

- **Ningún fichero de esta carpeta cambia sin una spec que lo cubra.**
- Toda spec sirve al propósito (§1). Si no, no sigue adelante.
- La spec dice el qué y el porqué; el plan, el cómo, y comprueba esta constitución; las tareas, los pasos.
- Las dudas se resuelven antes de implementar. No se inventan requisitos.

Cómo se aplica día a día está en `AGENTS.md`.

---

## 5. Calidad

- Todo lo que pide una spec se comprueba: con un test o, si no se puede automatizar, a mano.
- Los tests pasan antes de dar algo por terminado.
- Los errores que ve el usuario son claros y dicen qué hacer.

---

## 6. Seguridad

- Los códigos de asistencia **caducan** y no se pueden adivinar **a mano** antes de caducar.
- Hay un **freno** contra quien prueba códigos sin parar: cuenta los fallos y bloquea **un tiempo**. **Nunca** puede impedir que la clase pase lista.
- Un mismo alumno no puede registrarse dos veces en la misma sesión.
- Una sesión cerrada no acepta más registros.
- Toda entrada del usuario se valida en el servidor y se escapa al mostrarla.

---

## 7. Alcance y límites del repositorio

- El proyecto vive entero en `staff/ventura-rodriguez/asistenciapp/`. No se tocan archivos fuera de esta carpeta.

---

## 8. Enmiendas

- Cualquiera (persona o agente) puede **proponer** un cambio, pero solo lo **aprueba** la persona que trabaja en esta carpeta.
- Cada enmienda sube la versión (1.0 → 1.1 para añadidos, 2.0 si se elimina o contradice un principio) y se anota con fecha y motivo en [`specs/000-historial/enmienda.md`](../specs/000-historial/enmienda.md).
