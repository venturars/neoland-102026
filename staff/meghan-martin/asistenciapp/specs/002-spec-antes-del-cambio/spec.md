# Spec 002 · Primero decido el qué

> Estado: **Aprobada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

Si digo «cambia el README», el agente puede hacerlo ya. La regla que copiamos solo para cuando el cambio es código de una función nueva. El README, un test o un documento de uso se cuelan por ese hueco.

La issue y la pull request solo avisan de que hay una tarea. No dicen qué tiene que quedar hecho, así que no me valen de permiso para tocar un fichero.

La constitución y el manual, al copiarlos, nombraban otra carpeta y decían que otra persona daba el sí. Esta carpeta es `staff/meghan-martin/asistenciapp/` y el sí lo doy yo.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Yo, en esta carpeta** | Leer el qué y decir sí, o corregirlo, antes de que se toque un fichero. |
| **Agente** | Una instrucción clara: después del spec, parar. |

---

## 3. Historias de usuario

- **HU-01**: Si pido cambiar cualquier fichero de la app, primero quiero un spec aprobado. Sin ese sí, el fichero se queda como está.
- **HU-02**: Quiero ver el spec y poder corregirlo. El plan y el cambio esperan.
- **HU-03**: Si lo que pido no está en el spec que ya está abierto, quiero un spec nuevo. El 001 se queda cerrado.
- **HU-04**: Quiero que la issue, la rama y la pull request no cuenten como el spec.
- **HU-05**: Quiero que la constitución y el manual digan esta carpeta, y que el sí de cada fase sea mío.

---

## 4. Criterios de aceptación

Formato: **Dado** · **Cuando** · **Entonces**.

- **CA-01**: **Dado** que pido tocar código, un test, el README u otro documento de uso, **cuando** ese pedido no tiene un spec con mi sí, **entonces** el fichero no cambia y lo primero que aparece es el spec.
- **CA-02**: **Dado** que el spec ya está escrito, **cuando** el agente me lo enseña, **entonces** se para. No escribe el plan, las tasks ni el cambio.
- **CA-03**: **Dado** que yo he dicho sí al spec, **cuando** seguimos, **entonces** el plan va primero, las tasks después, y el cambio al final.
- **CA-04**: **Dado** que lo que pido no cabe en el spec abierto, **cuando** empezamos, **entonces** se abre otro spec. `001-checkin-codigo` no se reabre para meterlo.
- **CA-05**: **Dado** que ya hay una issue, una rama o una pull request, **cuando** el spec todavía no tiene mi sí, **entonces** esos tres no bastan para editar la app.
- **CA-06**: **Dado** la constitución y `AGENT.md`, **entonces** los dos nombran `staff/meghan-martin/asistenciapp/` y dicen que el sí lo da quien trabaja en esta carpeta.
- **CA-07**: **Dado** la spec `001-checkin-codigo`, **entonces** en este paso no se toca. Se quedan sus fechas, lo que se decidió y los nombres que ya estaban.

---

## 5. Fuera de alcance

- En el README, el paso que solo activa el entorno sigue con el título de arrancar la app. Eso es el paso 3.
- Las dos líneas que entran en una carpeta personal se quedan. El paso 4 las cambia.
- El bot de Discord no entra en este paso y no se lleva el número 002.
- No reescribo la spec 001.

---

## 6. Preguntas abiertas

Ninguna. El 2026-10-22 decidí tres cosas: la regla vale para cualquier fichero, la carpeta es la mía, y el sí lo doy yo.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-22 | Primera versión, con mi sí | Vi que un cambio del README se podía escribir sin spec |
