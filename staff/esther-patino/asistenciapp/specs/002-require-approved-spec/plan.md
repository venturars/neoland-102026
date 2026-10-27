# Plan técnico 002 · Ningún fichero sin spec aprobada

> Estado: **Aprobado** · Spec: [spec.md](spec.md) aprobada · Creado: 2026-10-23 · Paso a las tareas: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

No hay arquitectura nueva, ni modelo de datos, ni rutas. No se añade ninguna dependencia. El cambio es texto en dos documentos que ya existen.

---

## 1. Archivos

| Archivo | Qué se hace | Cubre |
| --- | --- | --- |
| `CONSTITUTION.md` | Se enmienda el apartado 4, punto 1, y se anota la versión 2.2 | CA-01, CA-02, CA-03, CA-04 |
| `AGENT.md` | Se escribe la misma puerta en el flujo y en las reglas de comportamiento. La tabla de estado nombra esta spec | CA-04 |

No se crean código ni tests. No se toca `README.md` ni `specs/001-checkin-codigo`. `tasks.md` se escribe en la fase siguiente, no aquí.

Quien aprueba las fases y las enmiendas sigue siendo Victor. No se cambia su nombre en ninguno de los dos documentos. La carpeta citada hoy (`staff/victor-chang/asistenciapp/`) tampoco se cambia: la spec no lo pide.

---

## 2. Decisiones

### 2.1 Constitución, apartado 4, punto 1 (CA-01, CA-02, CA-03, CA-04)

El punto 1 pasa de «no hay código sin especificación aprobada» a esta frase:

> **Ningún fichero de la app se modifica sin un spec aprobado que cubra ese cambio.** Esos ficheros son el código, los tests, el documento de uso de la app y cualquier otra documentación de uso. Cada cambio nace como `specs/NNN-nombre/spec.md`. Victor lo aprueba antes de pasar al plan y antes de modificar esos ficheros. Una issue, una rama o una pull request no sustituyen a ese spec. Un spec aprobado de otro cambio no cubre este.

Los puntos 2 a 5 del apartado 4 se quedan igual. El orden sigue siendo spec, plan, tareas e implementación.

La versión sube de 2.1 a **2.2** (añadido, sin tocar P1–P6). En el historial, fecha 2026-10-23: el apartado 4 cierra cualquier fichero de la app y deja claro que una issue, una rama o una pull request no sustituyen al spec. El apartado 8 no se reescribe: Victor sigue aprobando las enmiendas.

### 2.2 Manual del agente (CA-04)

La misma puerta se escribe dos veces, con las mismas tres reglas, para que no baste con saltarse un apartado:

1. Al inicio del flujo (apartado 2), antes de la tabla de fases.
2. En las reglas de comportamiento (apartado 5), como primera regla.

Las tres reglas son:

- No se modifican código, tests, el documento de uso de la app ni otra documentación de uso sin un spec aprobado que cubra ese cambio.
- Un spec aprobado de otro cambio no cubre este.
- Una issue, una rama o una pull request no sustituyen a ese spec ni al «ok» de Victor.

Victor sigue siendo quien aprueba cada fase, los commits, las enmiendas y el visto bueno final. El apartado 2.4 mantiene que el trabajo no se adelanta a los documentos y nombra los mismos ficheros, no solo «el código».

### 2.3 Tabla de estado (AGENT.md, apartado 7)

La fila `002-discord-bot` es una idea, sin carpeta. El número 002 ya lo usa esta spec. Al implementar:

- `002-require-approved-spec` entra en la tabla, en la fase que tenga en ese momento.
- La idea del bot pasa a `003-discord-bot`, sin carpeta.
- El ejemplo de nombres del apartado 3 deja de usar `002-discord-bot`.

---

## 3. Verificación manual

No hay test nuevo. La app no cambia de comportamiento. La comprobación es leer los dos documentos.

| Criterio | Qué se lee | Resultado |
| --- | --- | --- |
| CA-01 | Constitución, apartado 4, punto 1, y las dos copias en `AGENT.md` | Dicen que código, tests, documento de uso y otra documentación de uso no se modifican sin un spec aprobado que cubra ese cambio |
| CA-02 | Los mismos sitios | Dicen que un spec de otro cambio no cubre este |
| CA-03 | Los mismos sitios | Dicen que una issue, una rama o una pull request no sustituyen al spec |
| CA-04 | Primero solo la constitución. Después solo `AGENT.md` | Cada documento, por su cuenta, dice CA-01, CA-02 y CA-03 |

---

## 4. Comprobación de la constitución (v2.1)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade ninguna plataforma ni se toca el registro de asistencia |
| P2 Simplicidad | Sí | Es un párrafo en la constitución y la misma frase en dos sitios del manual. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guarda ningún dato nuevo |
| P5 Accesible y móvil | Sí | No hay pantallas nuevas |
| P6 Español | Sí | La spec, este plan y los textos que se van a enmendar están en español |
| Apartado 5, calidad | Sí | CA-01 a CA-04 se comprueban leyendo, en la tabla de arriba. No hay test automático porque la app no cambia |
| Apartado 6, seguridad | Sí | Los códigos, el registro único y la sesión cerrada no se tocan |
