# Plan 002 · Cómo dejo escrita la parada

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) · Creado: 2026-10-22

La spec dice el qué. Aquí digo en qué ficheros lo dejo. No hay código nuevo y no hay test nuevo. Se comprueba leyendo.

---

## 1. Ficheros

Se enmiendan dos ficheros que ya existen:

- `CONSTITUTION.md`, secciones 4, 7 y 8, más una fila en el historial. La versión pasa a 2.2.
- `AGENT.md`, el flujo, la carpeta de trabajo, quién pide el sí, y la tabla del final.

`README.md` no entra. `specs/001-checkin-codigo/` no entra.

---

## 2. Qué queda escrito

En la constitución, la sección 4 pasa a decir esto: antes de cambiar un fichero hace falta un spec con mi sí. Da igual que sea código, un test, el README u otro documento. Hasta ese sí, el agente solo escribe el spec. Después el orden es plan, tasks y el cambio. Una issue, una rama o una pull request avisan de la tarea y no dan permiso para editar.

La sección 7 deja de nombrar una carpeta personal y nombra `staff/meghan-martin/asistenciapp/`. La sección 8 deja de decir que otra persona aprueba las enmiendas. El sí lo da quien trabaja aquí.

En el manual, el flujo deja de hablar de «cada funcionalidad» y pasa a hablar de cualquier cambio. Si el pedido no cabe en el spec abierto, se abre otro y el 001 no se reutiliza. El bot de Discord se queda como idea, sin número. El número 002 es este cambio.

---

## 3. Cómo lo compruebo

| Criterio | Dónde miro |
| --- | --- |
| CA-01, CA-02, CA-03, CA-05 | Constitución §4 |
| CA-04 | `AGENT.md`: otro spec si el abierto no cubre el pedido, y el bot sin número |
| CA-06 | Los dos ficheros dicen mi carpeta y quién da el sí |
| CA-07 | El diff no incluye el README ni la spec 001 |

---

## 4. Comprobación de la constitución

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 | Sí | No cambio cómo se pasa lista |
| P2 | Sí | Amplío una frase que ya estaba. No añado una herramienta |
| P3 | Sí | No añado dependencias |
| P4 | Sí | No guardo datos |
| P5 | Sí | No toco pantallas |
| P6 | Sí | Lo nuevo está en español |
| §5 | Sí | La comprobación es leer, porque no cambia el comportamiento de la app |
| §6 | Sí | No toco códigos ni sesiones |
