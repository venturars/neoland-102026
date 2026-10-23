# Plan técnico 002 · Spec antes de tocar la app

> Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación de cada criterio es manual: el cambio es de reglas escritas, no de pantallas.

---

## 1. Visión general

Se enmienda la constitución y se renombra el manual del agente. No se crea código. No se cambia cómo se pasa lista.

- [CONSTITUTION.md](../../CONSTITUTION.md) pasa a la versión 2.2. Ahí está la obligación.
- `AGENT.md` se renombra a `AGENTS.md` y dice el día a día: dónde buscar specs, qué fichero se puede crear al empezar, cuándo parar y quién da el ok.
- El README solo cambia el enlace al manual.

La spec, este plan y las tasks se escriben antes de la enmienda y del renombre.

---

## 2. Decisiones

### 2.1 La puerta cubre cualquier fichero de la app (CA-01, CA-02, CA-03, CA-05)

En la constitución §4 se sustituye «no hay código sin especificación» por esta obligación:

- Ningún fichero de la app se modifica sin un spec aprobado **de esta aplicación** que cubra ese cambio. Entran el código, los tests, el README y el resto de la documentación.
- El orden sigue siendo spec, plan, tasks e implementación. Hay aprobación explícita entre fases. Al terminar el spec, el agente lo enseña y espera el ok de quien trabaja en esta carpeta.
- Una issue, una rama o una pull request no sustituyen al spec.
- Si el cambio no cabe en ninguna spec local aprobada, se abre otra.

### 2.2 Esta carpeta, las specs locales y quien aprueba (CA-04, CA-06, CA-07)

- Constitución §7: el proyecto vive en `staff/maria-osipuk/asistenciapp/`. No se tocan archivos fuera de esta carpeta.
- Constitución §8: aprueba la persona que trabaja en esa carpeta.
- En el manual, la ruta de los comandos y la regla «solo se edita dentro de…» usan esa misma carpeta.
- Las menciones personales en las reglas vivas (aprobación de cada fase, commits, enmiendas y definición de terminado) pasan a ser quien trabaja en esta carpeta.
- El agente busca specs **únicamente** en `staff/maria-osipuk/asistenciapp/specs/`. Un spec o una aprobación de un compañero no autorizan un cambio aquí.
- Una spec nueva usa el siguiente número disponible en esa carpeta. No se reutiliza `001-checkin-codigo`.

La versión sube de 2.1 a 2.2: se añade una obligación y se corrige a qué carpeta se aplica y quién aprueba. No se quita un principio. El historial de enmiendas gana una fila con fecha 2026-10-23 y el motivo.

### 2.3 El manual al escribir el spec (CA-02, CA-04, CA-06, CA-09)

`AGENT.md` se mueve a `AGENTS.md` (mismo contenido, nombre nuevo). El título interno y el árbol de carpetas del §3 usan `AGENTS.md`.

En `AGENTS.md` §2, «cada funcionalidad» pasa a «cada cambio en esta app». Al empezar, el único fichero nuevo permitido es el `spec.md`. La fase de implementar incluye el README cuando una task lo diga.

§2.4 dice que ningún fichero de la app se adelanta al spec. Si ninguna spec local aprobada cubre el pedido, el agente para y escribe el spec en `staff/maria-osipuk/asistenciapp/specs/`.

§7 lista `002-spec-antes-del-cambio`. La idea del bot de Discord se queda en la tabla como idea futura, sin el número 002. El ejemplo de numeración en §3 deja de usar `002-discord-bot`.

El README cambia solo el enlace `[AGENT.md](AGENT.md)` por `[AGENTS.md](AGENTS.md)`.

### 2.4 Lo que no se edita (CA-08)

No se modifica `specs/001-checkin-codigo/`. Su historial, y las menciones de quien aprobó y probó, se quedan como están (incluido si alguna tarea antigua nombra `AGENT.md`). No se toca el código, los tests ni las pantallas de pasar lista. El README no se corrige más allá del enlace del CA-09.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01, CA-02, CA-03, CA-05 | Constitución §4 y `AGENTS.md` §2 y §2.4 |
| CA-04 | `AGENTS.md` §2.1 y la tabla del §7: `001-checkin-codigo` sigue terminada y esta spec tiene su propia fila |
| CA-06 | Constitución §4 y `AGENTS.md` §2: las specs se buscan solo en `staff/maria-osipuk/asistenciapp/specs/` |
| CA-07 | Constitución §7 y §8; `AGENTS.md` §4, §5 y §6. Todo apunta a `staff/maria-osipuk/asistenciapp/` y quien aprueba es quien trabaja ahí |
| CA-08 | `git diff` de `specs/001-checkin-codigo/` vacío |
| CA-09 | Existe `AGENTS.md`, no existe `AGENT.md`, y el README enlaza a `AGENTS.md` |

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade una plataforma ni se cambia el registro de asistencia |
| P2 Simplicidad | Sí | Se precisan dos ficheros que ya existían. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos nuevos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | La spec, el plan, las tasks y la enmienda están en español |
| §3 Stack | Sí | El stack no cambia |
| §4 SDD | Sí | Esta enmienda es el §4 nuevo: spec, plan y tasks van antes del cambio |
| §5 Calidad | Sí | Cada criterio tiene un paso manual en §3. No hay comportamiento de la app que probar con tests nuevos |
| §6 Seguridad | Sí | No se toca el registro ni los códigos |
| §7 Alcance | Sí | Todo queda en `staff/maria-osipuk/asistenciapp/` |
| §8 Enmiendas | Sí | La aprueba quien trabaja en esta carpeta, y queda anotada en el historial |

---

## 5. Decisiones tomadas

1. **Versión 2.2** (2026-10-23): la puerta pasa de «código de una funcionalidad» a «cualquier fichero de esta app».
2. **Quién aprueba** (2026-10-23): la persona que trabaja en `staff/maria-osipuk/asistenciapp/`, no otra persona ni otra carpeta del repositorio.
3. **Specs locales** (2026-10-23): solo cuentan las de `staff/maria-osipuk/asistenciapp/specs/`.
4. **Número 002** (2026-10-23): lo usa esta spec. El bot de Discord se queda sin número.
5. **Nombre del manual** (2026-10-23): `AGENT.md` pasa a `AGENTS.md`. El README solo actualiza ese enlace.
