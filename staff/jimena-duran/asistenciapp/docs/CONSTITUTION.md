# Constitución de AsistenciApp

> Versión 3.1 · Ratificada: 2026-10-19 · Última enmienda: 2026-11-02

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
- Del alumno solo se guarda el **nombre que él mismo escribe** y la **hora del registro**.
- **Prohibido** guardar emails, identificadores de dispositivo o cualquier dato no imprescindible. Como única excepción para este control de seguridad, se permite guardar la IP solo para contar intentos de registro y conservar la lista de bloqueo, separada del nombre y de la hora de asistencia.
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

La organización es: docs/ para reglas y arquitectura, asistencia/domain/ para
reglas del producto, asistencia/usecases/ para acciones, asistencia/storage/
para SQLite y app.py para HTTP y arranque. static/ y data/ mantienen su función.
El detalle está en [ARCHITECTURE.md](ARCHITECTURE.md).

Cambiar el stack requiere enmendar esta constitución.

---

## 4. Desarrollo guiado por especificaciones (SDD)

Cada momento requiere su autorización y termina en una pausa humana. Una autorización limitada no permite encadenar el siguiente ni realizar operaciones prohibidas.

1. Issue: crear o reutilizar la issue y detenerse, sin abrir rama.

2. Rama y PR draft: solo con autorización expresa, adelantar staging por avance rápido, crear o recuperar rama, commit de apertura si corresponde, push y PR draft contra staging, con autor y enlace de issue. Sin specs todavía. Detenerse.

3. Documentos: con autorización, escribir spec, plan y tasks juntos, en ese orden, con el siguiente número disponible y sin sobrescribir specs anteriores. Detenerse para revisión conjunta.

4. Implementación: con documentos revisados y autorización expresa, ejecutar solo las tareas aprobadas. Detenerse con resultados, sin commit ni push.

5. Publicación o revisión: realizar solo las operaciones, archivos y revisores expresamente autorizados. Sin merge implícito. Detenerse.

Todo cambio de código, tests, README u otra documentación de uso requiere una spec aprobada que lo cubra.

Si la spec activa no cubre el pedido, se abre una spec nueva.

Una issue, una rama o una pull request no sustituyen la spec aprobada.

No se encadena un momento con el siguiente sin autorización expresa.

Si cambian los documentos o falta una decisión, detenerse y pedir revisión; no inventar requisitos.

La spec describe qué y por qué, sin tecnologías; el plan explica cómo y comprueba esta constitución. Registrar la aprobación en la propia spec forma parte de su ciclo SDD. Los documentos siguen el orden spec, plan y tasks, preparados juntos en el tercer momento; el código espera su revisión y la autorización del cuarto.

El segundo momento solo permite las operaciones de apertura expresamente autorizadas. En el quinto, pedir revisión no autoriza publicar archivos no indicados ni hacer merge. Los ensayos con commits y push en repositorios desechables requieren permiso explícito limitado a esos ensayos, que no autoriza publicaciones del repositorio de trabajo.

La sustitución del proceso requiere enmienda aprobada según §8. La entrega 008 aplica esta enmienda con aprobación explícita de spec, plan, tareas e implementación; no obliga a recrear su rama ni a publicar una PR.

---

## 5. Calidad

- Cada **criterio de aceptación** de una spec tiene al menos **un test** automatizado (o, si es puramente visual, un paso de verificación manual escrito en el plan).
- `pytest` debe pasar antes de dar una tarea por terminada.
- Los errores que ve el usuario son claros, en español y dicen qué hacer ("El código ha caducado, pide el nuevo al profesor").

---

## 6. Seguridad

- Los códigos de asistencia **caducan** y no se pueden adivinar **a mano** antes de caducar. La protección contra ataques automatizados (scripts) no es un requisito.
- Un mismo alumno no puede registrarse dos veces en la misma sesión.
- Una sesión cerrada no acepta más registros.
- Toda entrada del usuario se valida en el servidor y se escapa al mostrarla (sin HTML inyectado).

---

## 7. Alcance y límites del repositorio

- El proyecto vive entero en `staff/jimena-duran/asistenciapp/`. No se tocan archivos fuera de esta carpeta.

---

## 8. Enmiendas

- Cualquiera (persona o agente) puede **proponer** un cambio, pero solo Jimena Durán lo **aprueba**.
- Cada enmienda sube la versión (1.0 → 1.1 para añadidos, 2.0 si se elimina o contradice un principio) y se anota abajo con fecha y motivo.

### Historial de enmiendas

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-19 | Versión inicial | Arranque del proyecto |
| 1.1 | 2026-10-19 | §6: los códigos no deben poder adivinarse *a mano*; la protección contra scripts deja de ser obligatoria | En una clase el riesgo real es un alumno ausente, no un ataque automatizado. Evita añadir límites de intentos que no aportan al MVP (P2) |
| 2.0 | 2026-10-20 | §3: stack Node.js → Python (Flask + pytest). P3 pasa de "cero dependencias" a "dependencias mínimas" y permite Flask y pytest | Requisito nuevo: el proyecto debe hacerse en Python. Se elige Flask por ser simple y muy extendido, y pytest por su sintaxis sencilla |
| 2.1 | 2026-10-20 | P4: distingue *almacenar* (solo en local) de *transitar* (puede pasar cifrado por un proveedor de túnel) | Los alumnos asisten desde casa y necesitan llegar a la app del profesor; un túnel es la forma más simple (spec 001, HU-08) |

| 2.2 | 2026-10-22 | §4: spec aprobada para todo cambio y puertas explícitas; §7: carpeta personal; §8: aprueba Jimena Durán | Aprobación de spec, plan y tareas de la 002 por Jimena Durán; no confundir Git con aprobación SDD |

| 2.3 | 2026-10-22 | §3: documentos y separación domain/usecases/storage; guía AGENTS.md | Reorganización 005 autorizada por Jimena Durán, sin cambios de producto |

| 3.0 | 2026-10-23 | P4: excepción limitada para IPs de recuento y bloqueo, separadas de la asistencia | Enmienda de privacidad de la spec 006 aprobada por Jimena Durán |

| 3.1 | 2026-11-02 | §4: cinco momentos humanos para issue, draft, documentos conjuntos, implementación y publicación o revisión autorizada | Separar decisiones y operaciones del proceso sin cambiar los principios ni el producto |
