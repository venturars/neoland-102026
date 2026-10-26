# Constitución de AsistenciApp

> Versión 2.3 · Ratificada: 2026-10-19 · Última enmienda: 2026-10-22

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

### P4 · Privacidad mínima
- Del alumno solo se guarda el **nombre que él mismo escribe** y la **hora del registro** (tablas de asistencia por sesión).
- **Prohibido** guardar emails, identificadores de dispositivo o cualquier dato no imprescindible en el registro del alumno.
- **Excepción (anti-abuso, spec 006):** se pueden guardar **direcciones de conexión** solo en tablas dedicadas (`blocked_ips`, `invalid_code_attempts`), **sin** vincularlas al nombre ni a la hora del check-in. Los intentos inválidos se purgan tras ~60 s; los bloqueos duran hasta que el profesor los quite.
- Los datos se **almacenan** solo en local (SQLite). Ningún servicio de terceros los guarda.
- Para que los alumnos lleguen a la app desde sus casas, el tráfico puede **pasar cifrado (HTTPS)** por un proveedor de túnel (p. ej. Cloudflare). Ese proveedor no los almacena, pero técnicamente podría verlos en tránsito; por eso solo se envía lo imprescindible (nombre y código).

### P5 · Accesible y usable en móvil
- Todas las pantallas funcionan en un móvil (~400 px de ancho).
- HTML semántico, contraste suficiente, formularios con `<label>` y navegables con teclado.

### P6 · Todo en español
Interfaz, mensajes de error, documentación y especificaciones se escriben en español. El código (nombres de variables y funciones) puede ir en inglés.

---

## 3. Stack técnico fijo

| Capa | Tecnología |
| --- | --- |
| Runtime | Python 3.13+, en un entorno virtual `.venv/` (no se sube a git) |
| Servidor | Flask |
| Base de datos | SQLite vía `sqlite3` (biblioteca estándar), archivo en `data/` (no se sube a git) |
| Frontend | HTML + CSS + JavaScript sin frameworks, servidos desde `static/` |
| Tests | `pytest` |

Cambiar el stack requiere enmendar esta constitución.

### 3.1 Organización del código del servidor

- El código Python del servidor sigue `docs/ARCHITECTURE.md` (v1.3): reglas en `domain/`, acciones en `usecases/`, almacén en `storage/sqlite.py`, HTTP en `web/flask_app.py`.
- El DDL compartido está en `infra/sqlite/schema.py`; `connection.py` define `connect` e `init_schema(conn)`.

---

## 4. Desarrollo guiado por especificaciones (SDD)

1. **Ningún fichero de la app se modifica sin un spec aprobado que cubra ese cambio.** Entran el código, los tests, el README y el resto de la documentación de uso. Cada cambio nace como `specs/NNN-nombre/spec.md`. Si no cabe en la spec activa, se abre otra. Una issue, una rama o una pull request **no sustituyen** al spec. Quien aprueba cada fase es la persona que trabaja en `staff/sergio-cortes/asistenciapp/`.
2. El orden siempre es: **spec → plan → tasks → implementación**. No se salta ningún paso. Al terminar el spec, el agente lo enseña y espera el ok. No escribe el plan, las tasks ni el cambio hasta entonces.
3. La `spec.md` describe el **qué y el porqué**, nunca el cómo (no menciona tecnologías).
4. El `plan.md` describe el **cómo** e incluye una sección que comprueba que cumple esta constitución.
5. Las dudas se marcan como `[NECESITA ACLARACIÓN]` y se resuelven **antes** de implementar. No se inventan requisitos.

---

## 5. Calidad

- Cada **criterio de aceptación** de una spec tiene al menos **un test** automatizado (o, si es puramente visual, un paso de verificación manual escrito en el plan).
- `pytest` debe pasar antes de dar una tarea por terminada.
- Los errores que ve el usuario son claros, en español y dicen qué hacer ("El código ha caducado, pide el nuevo al profesor").

---

## 6. Seguridad

- Los códigos de asistencia **caducan** y no se pueden adivinar **a mano** antes de caducar.
- La app **limita** intentos automatizados de códigos inválidos por dirección de conexión (spec 006): umbrales, lista de bloqueo y gestión desde el panel del profesor.
- Un mismo alumno no puede registrarse dos veces en la misma sesión.
- Una sesión cerrada no acepta más registros.
- Toda entrada del usuario se valida en el servidor y se escapa al mostrarla (sin HTML inyectado).

---

## 7. Alcance y límites del repositorio

- El proyecto vive entero en `staff/sergio-cortes/asistenciapp/`. No se tocan archivos fuera de esta carpeta.

---

## 8. Enmiendas

- Cualquiera (persona o agente) puede **proponer** un cambio, pero solo lo **aprueba** la persona que trabaja en `staff/sergio-cortes/asistenciapp/`.
- Cada enmienda sube la versión (1.0 → 1.1 para añadidos, 2.0 si se elimina o contradice un principio) y se anota abajo con fecha y motivo.

### Historial de enmiendas

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-19 | Versión inicial | Arranque del proyecto |
| 1.1 | 2026-10-19 | §6: los códigos no deben poder adivinarse *a mano*; la protección contra scripts deja de ser obligatoria | En una clase el riesgo real es un alumno ausente, no un ataque automatizado. Evita añadir límites de intentos que no aportan al MVP (P2) |
| 2.0 | 2026-10-20 | §3: stack Node.js → Python (Flask + pytest). P3 pasa de "cero dependencias" a "dependencias mínimas" y permite Flask y pytest | Requisito nuevo: el proyecto debe hacerse en Python. Se elige Flask por ser simple y muy extendido, y pytest por su sintaxis sencilla |
| 2.1 | 2026-10-20 | P4: distingue *almacenar* (solo en local) de *transitar* (puede pasar cifrado por un proveedor de túnel) | Los alumnos asisten desde casa y necesitan llegar a la app del profesor; un túnel es la forma más simple (spec 001, HU-08) |
| 2.2 | 2026-10-22 | §4: ningún fichero de la app sin spec aprobado; issue, rama y pull request no sustituyen al spec. §7: carpeta `staff/sergio-cortes/asistenciapp/`. §8: aprueba quien trabaja en esa carpeta | El texto solo frenaba el código; README y tests podían cambiarse sin spec. Las reglas nombraban otra carpeta (spec 002, issue #228) |
| 2.3 | 2026-10-22 | §3.1: organización en capas documentada en `docs/ARCHITECTURE.md` | Issue #239; alinear gobernanza y código sin cambiar el stack (spec 005) |
| 2.4 | 2026-10-23 | P4: excepción acotada para IPs en anti-abuso; §6: límite de intentos inválidos por conexión | Issue #318 / spec 006; fuerza bruta de códigos sin mezclar IP con asistencia |
