# Plan técnico 002 · Parar tras el spec

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) v1.1 · Creado: 2026-10-22

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación es manual: el cambio es de reglas escritas, no de pantallas.

---

## 1. Visión general

Se enmiendan dos ficheros que ya existen. No se crea código ni se toca el README.

- [CONSTITUTION.md](../../CONSTITUTION.md) pasa a la versión 2.2. Ahí queda la obligación.
- [AGENT.md](../../AGENT.md) dice el día a día: el único fichero nuevo al empezar, cuándo parar y que el ok lo da el autor de la carpeta.

La spec ya está aprobada. Este plan y las tasks se escriben ahora. La enmienda de esos dos ficheros espera el ok a este plan y a las tasks.

---

## 2. Decisiones

### 2.1 El único fichero al empezar (CA-01, CA-02)

En la constitución §4, el primer punto pasa a decir:

- Si el pedido no está cubierto por una spec aprobada, el único fichero nuevo es `specs/NNN-nombre/spec.md`.
- En ese paso no se crean el plan, las tasks ni el cambio, y no se modifican ficheros que ya existían.

En `AGENT.md` §2 se dice lo mismo, en el arranque del flujo. §2.4 añade que, si la spec activa no cubre el pedido, el agente para y escribe solo ese `spec.md`.

### 2.2 Cuándo parar, y quién da el ok (CA-03, CA-04, CA-05)

- Al terminar el spec, el agente lo enseña y para. No escribe el plan, las tasks ni el cambio.
- Sigue parado hasta el ok explícito del autor de la carpeta, aunque le pidan el cómo o el cambio.
- Con ese ok, el siguiente fichero permitido es el plan. El orden sigue siendo spec, plan, tasks e implementación.

Eso sustituye, en esta puerta, el nombre propio que hay ahora en la constitución §4 y en el manual (la tabla del §2, el §5 y el §6). La constitución §8 pasa a decir que las enmiendas las aprueba el autor de la carpeta, sin escribir un nombre. Si no, el §8 seguiría dejando el ok en una persona concreta.

La versión sube de 2.1 a 2.2. Se añade una obligación y se corrige quién da el ok. No se quita un principio. El historial de enmiendas gana una fila con fecha 2026-10-22 y el motivo.

### 2.3 El número 002

En `AGENT.md` §3 el ejemplo deja de asignar el 002 al bot de Discord. En el §7, `002-parar-tras-el-spec` tiene su fila y el bot sigue como idea futura, sin número.

### 2.4 Lo que no se edita

- No se modifica `specs/001-checkin-codigo/`.
- No se modifica el README.
- No se cambian las rutas que nombran `staff/victor-chang/asistenciapp/`. Siguen en la constitución §7 y en `AGENT.md` §4 y §5.
- No se decide si una issue, una rama o una pull request cuentan como spec.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01, CA-02 | Constitución §4 y `AGENT.md` §2 y §2.4: el único fichero nuevo es el `spec.md`, y en ese paso no se tocan ficheros ya existentes |
| CA-03, CA-04, CA-05 | Esos mismos apartados: se enseña el spec, se para hasta el ok explícito del autor de la carpeta, y solo entonces se escribe el plan |
| Número 002 | `AGENT.md` §3 y §7: esta spec tiene el 002 y el bot de Discord no |
| Fuera de alcance | `specs/001-checkin-codigo/` y el README sin cambios. Las rutas `staff/victor-chang/asistenciapp/` siguen donde estaban |

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
| §4 SDD | Sí | Esta enmienda es el §4 nuevo: un solo fichero al empezar, y parar hasta el ok |
| §5 Calidad | Sí | Cada criterio tiene un paso manual en §3. No hay comportamiento de la app que probar con tests |
| §6 Seguridad | Sí | No se toca el registro ni los códigos |
| §7 Alcance | Sí | No se cambian las rutas. La enmienda se escribe dentro de esta carpeta de trabajo |
| §8 Enmiendas | Sí | Las aprueba el autor de la carpeta, y quedan anotadas en el historial |

---

## 5. Decisiones tomadas

1. **Versión 2.2** (2026-10-22): se añade la puerta del fichero único y de la parada. No se elimina un principio.
2. **Quién da el ok** (2026-10-22): el autor de la carpeta, sin nombre propio, como quedó en la spec v1.1.
3. **Rutas** (2026-10-22): se quedan como están. Esta spec las deja fuera de alcance.
