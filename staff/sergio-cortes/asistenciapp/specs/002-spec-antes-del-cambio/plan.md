# Plan técnico 002 · Spec antes de tocar la app

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-22

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación de cada criterio es manual: el cambio es de reglas escritas, no de pantallas.

---

## 1. Visión general

Se enmiendan dos ficheros que ya existen. No se crea código ni se toca el README.

- [CONSTITUTION.md](../../CONSTITUTION.md) pasa a la versión 2.2. Ahí está la obligación.
- [AGENT.md](../../AGENT.md) dice el día a día: qué fichero se puede crear al empezar, cuándo parar y quién da el ok.

La spec, este plan y las tasks se escriben antes de la enmienda.

---

## 2. Decisiones

### 2.1 La puerta cubre cualquier fichero de la app (CA-01, CA-02, CA-03, CA-05)

En la constitución §4 se sustituye «no hay código sin especificación» por esta obligación:

- Ningún fichero de la app se modifica sin un spec aprobado que cubra ese cambio. Entran el código, los tests, el README y el resto de la documentación de uso.
- El orden sigue siendo spec, plan, tasks e implementación. Al terminar el spec, el agente lo enseña y espera el ok de quien trabaja en `staff/ventura-rodriguez/asistenciapp/`.
- Una issue, una rama o una pull request no sustituyen al spec.
- Si el cambio no cabe en la spec activa, se abre otra.

### 2.2 Alcance y quien aprueba (CA-06)

- Constitución §7: el proyecto vive en `staff/sergio-cortes/asistenciapp/`.
- Constitución §8: aprueba la persona que trabaja en `staff/ventura-rodriguez/asistenciapp/` (enmiendas y fases SDD).
- En el manual, la ruta de los comandos y la regla «solo se edita dentro de…» usan la carpeta de Sergio Cortes.
- Las menciones a una persona concreta en las reglas vivas (aprobación de cada fase, commits, enmiendas y definición de terminado) pasan a ser quien trabaja en `staff/ventura-rodriguez/asistenciapp/`, sin nombrar a Victor.

La versión sube de 2.1 a 2.2: se añade una obligación y se corrige a qué carpeta se aplica y quién aprueba. No se quita un principio. El historial de enmiendas gana una fila con fecha 2026-10-22 y el motivo.

### 2.3 El manual al escribir el spec (CA-02, CA-04)

En `AGENT.md` §2, «cada funcionalidad» pasa a «cada cambio en esta app». Al empezar, el único fichero nuevo permitido es el `spec.md`. La fase de implementar incluye el README cuando una task lo diga.

§2.4 dice que ningún fichero de la app se adelanta al spec. Si la spec activa no cubre el pedido, el agente para y escribe el spec.

§7 lista `002-spec-antes-del-cambio`. La idea del bot de Discord se queda en la tabla como idea futura, sin el número 002.

### 2.4 Lo que no se edita (CA-07)

No se modifica `specs/001-checkin-codigo/`. Su historial, y las menciones de quien aprobó y probó, se quedan como están. Tampoco se modifica el README de la app en esta spec.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01, CA-02, CA-03, CA-05 | Constitución §4 y `AGENT.md` §2 y §2.4 |
| CA-04 | `AGENT.md` §2.1 y la tabla del §7: `001-checkin-codigo` sigue terminada y esta spec tiene su propia fila |
| CA-06 | Constitución §7 y §8; `AGENT.md` §4, §5 y §6. Alcance Sergio; aprobador Ventura |
| CA-07 | `git diff` de `specs/001-checkin-codigo/` vacío, y el README sin cambios en esta rama para esta spec |

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
| §7 Alcance | Sí | Todo queda en `staff/sergio-cortes/asistenciapp/` |
| §8 Enmiendas | Sí | Aprueba quien trabaja en `staff/ventura-rodriguez/asistenciapp/`, y queda anotada en el historial |

---

## 5. Decisiones tomadas

1. **Versión 2.2** (2026-10-22): la puerta pasa de «código de una funcionalidad» a «cualquier fichero de la app».
2. **Alcance y aprobador** (2026-10-22): el proyecto vive en la carpeta de Sergio Cortes; quien aprueba cada fase SDD trabaja en la carpeta de Ventura Rodríguez.
3. **Número 002** (2026-10-22): lo usa esta spec. El bot de Discord se queda sin número.
