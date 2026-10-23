# Spec 002 · Spec antes de tocar la app

> Estado: **Implementada (2026-10-23)** · Creada: 2026-10-23 · Aprobada: 2026-10-23

---

## 1. Problema

Quien trabaja en esta carpeta pide un cambio y el agente lo escribe enseguida. Las reglas solo frenan el código de una funcionalidad nueva. Un cambio del README, de los tests o de otra documentación de uso cabe fuera de esa frase, así que se hace sin un spec aprobado.

La issue, la rama y la pull request del bootcamp dejan la tarea apuntada. No dicen qué hay que cumplir ni sustituyen al spec de la app. Las reglas, además, siguen nombrando otra carpeta y a otra persona, así que la parada para pedir el ok no es para quien trabaja aquí.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Decidir el qué de un cambio y dar el ok antes de que se escriba. |
| **Agente** | Saber cuál es el único fichero que puede crear al empezar, y cuándo tiene que parar. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que un cambio de la app no se escriba hasta que haya un spec aprobado que lo cubra, para que el qué quede decidido antes del cambio.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero que al empezar un cambio el agente solo escriba el spec y espere mi ok, para poder corregirlo antes del plan y de la implementación.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero que un pedido que no cabe en la spec activa abra una spec nueva, para no mezclarlo con una spec ya terminada.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que una issue, una rama o una pull request no cuenten como spec, para que el camino de git no se salte esta puerta.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero que las reglas nombren esta carpeta y que yo apruebe cada fase, para que no sigan apuntando a otro proyecto.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Antes de escribir (HU-01, HU-02)

- **CA-01**: **Dado** un pedido de cambiar el código, los tests, el README u otra documentación de uso, **cuando** todavía no hay un spec aprobado que lo cubra, **entonces** ese fichero no se modifica y lo primero que se escribe es el spec.
- **CA-02**: **Dado** un spec recién escrito para ese pedido, **cuando** el agente termina de escribirlo, **entonces** lo enseña y espera el ok. No escribe el plan, las tasks ni el cambio.

### El orden (HU-02, HU-03)

- **CA-03**: **Dado** el ok al spec, **cuando** se sigue con el cambio, **entonces** el orden es plan, luego tasks, luego el cambio. No se salta ninguno.
- **CA-04**: **Dado** un pedido que la spec activa no describe, **cuando** se empieza, **entonces** se abre otra spec y no se reutiliza `001-checkin-codigo`.

### Qué no cuenta como spec (HU-04, HU-05)

- **CA-05**: **Dado** una issue, una rama o una pull request que describen el cambio, **cuando** aún no hay un spec aprobado, **entonces** esos tres no autorizan a modificar la app.
- **CA-06**: **Dado** la constitución y el manual del agente, **entonces** nombran `staff/ella-deyavorsky/asistenciapp/` y dicen que quien aprueba cada fase es la persona que trabaja en esa carpeta.
- **CA-07**: **Dado** el historial de la spec `001-checkin-codigo`, **entonces** los nombres y las fechas de quien la aprobó y la probó siguen como estaban.

---

## 5. Fuera de alcance (en esta spec)

- El cambio del README de la issue #301 (separar «Activar el entorno» de «Arrancar la app»).
- Las rutas del README que todavía nombran una carpeta personal.
- El bot de Discord. Se queda como idea futura, sin número de spec.
- Reescribir el historial de la spec `001-checkin-codigo`.

---

## 6. Preguntas abiertas

Ninguna. El alcance, la carpeta y quién aprueba quedaron decididos el 2026-10-23.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Versión inicial (borrador) | El agente escribió un cambio de README (issue #301) sin spec |
| 1.0 | 2026-10-23 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-23 | Implementada | Enmienda aplicada a `CONSTITUTION.md` (v2.2) y `AGENT.md`; `grep` de «victor» vacío y 77 tests en verde |
