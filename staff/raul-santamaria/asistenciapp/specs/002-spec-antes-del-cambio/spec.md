# Spec 002 · Spec antes del cambio

> Estado: **Implementada** (2026-10-23) · Creada: 2026-10-23 · Aprobada: 2026-10-23

---

## 1. Problema

En esta carpeta un pedido de cambio puede acabar escrito al momento. Si las reglas solo frenan con claridad una funcionalidad nueva, un ajuste del README, de los tests o de otra documentación de uso se cuela sin que el qué esté cerrado.

El camino de git del bootcamp (issue, rama, pull request) deja la tarea apuntada. No define qué hay que cumplir ni reemplaza al spec de la app. Hace falta una puerta: primero el spec aprobado; después el resto.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Fijar el qué del cambio y dar el ok antes de que se escriba nada en la app. |
| **Agente** | Saber que al empezar solo puede crear el spec, y cuándo debe parar a esperar. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que no se modifique la app sin un spec aprobado que cubra ese cambio, para que el qué quede decidido antes de tocar ficheros.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero que al arrancar un cambio el agente solo escriba el spec y espere mi ok, para poder corregirlo antes del plan y de la implementación.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero que un pedido que no encaje en la spec activa abra una spec nueva, para no mezclarlo con una ya cerrada.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que una issue, una rama o una pull request no valgan como spec, para que el flujo de git no salte esta puerta.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero que las reglas nombren esta carpeta y que yo apruebe cada fase, para que el ok sea mío y no de otro proyecto.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Antes de escribir (HU-01, HU-02)

- **CA-01**: **Dado** un pedido de cambiar el código, los tests, el README u otra documentación de uso, **cuando** aún no hay un spec aprobado que lo cubra, **entonces** ese fichero no se modifica y lo primero que se escribe es el spec.
- **CA-02**: **Dado** un spec recién escrito para ese pedido, **cuando** el agente termina de redactarlo, **entonces** lo enseña y espera el ok. No escribe el plan, las tasks ni el cambio.

### El orden (HU-02, HU-03)

- **CA-03**: **Dado** el ok al spec, **cuando** se continúa con el cambio, **entonces** el orden es plan, luego tasks, luego el cambio. No se omite ninguno.
- **CA-04**: **Dado** un pedido que la spec activa no describe, **cuando** se empieza, **entonces** se abre otra spec y no se reutiliza `001-checkin-codigo`.

### Qué no cuenta como spec (HU-04, HU-05)

- **CA-05**: **Dado** una issue, una rama o una pull request que describen el cambio, **cuando** todavía no hay un spec aprobado, **entonces** esos tres no autorizan a modificar la app.
- **CA-06**: **Dado** la constitución y el manual del agente, **entonces** nombran `staff/<usuario>/asistenciapp/` y dicen que quien aprueba cada fase es la persona que trabaja en esa carpeta.
- **CA-07**: **Dado** el historial de la spec `001-checkin-codigo`, **entonces** los nombres y las fechas de quien la aprobó y la probó se dejan como están.

---

## 5. Fuera de alcance (en esta spec)

- El bot de Discord. Queda como idea futura, sin número de spec.
- Reescribir el historial de la spec `001-checkin-codigo`.
- Escribir el `plan.md`, el `tasks.md` o aplicar el cambio de esta 002: eso va después del ok a este spec.

---

## 6. Preguntas abiertas

Ninguna. El propósito (nada de la app sin spec aprobado) y el nombre de carpeta `002-spec-antes-del-cambio` quedaron decididos el 2026-10-23.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-23 | Borrador inicial | Formalizar la puerta del spec en esta carpeta |
| 1.0 | 2026-10-23 | Implementada (constitución 2.3 + AGENT) | T01–T05 cerradas |
