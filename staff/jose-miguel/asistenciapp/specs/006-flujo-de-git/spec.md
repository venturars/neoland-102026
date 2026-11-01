# Spec 006 · Flujo de git y cinco momentos

> Estado: **Aprobada** (2026-11-01) · Creada: 2026-11-01

Issue: #712.

---

## 1. Problema

Quien trabaja en esta carpeta tiene que dar el ok después del spec, después del plan y después de las tasks. El flujo de git del curso no vive aquí: pensar la tarea, dejarla escrita, empezar, guardar un trozo y pedir revisión se hacen fuera de esta carpeta, o no se hacen.

Quiere intervenir solo en cinco momentos, en este orden. El agente no encadena un momento con el siguiente y no pide otro ok entre medias. Antes de tocar ficheros, la issue deja escrito qué hay que hacer y cómo se comprueba.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Pedir un momento y que el agente haga solo ese. |
| **Agente** | Saber qué momento toca, qué ficheros de git usar y cuándo parar. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que el primer momento sea la issue, con el qué y el cómo probarlo ya escritos, para que no se abra rama ni se toquen ficheros antes.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero que el segundo momento deje la pull request en draft contra `staging`, enlazada a la issue, para empezar el trabajo sin escribir todavía las specs.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero que el tercer momento escriba spec, plan y tasks de un tirón, para no parar entre esos tres ficheros.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que el cuarto momento implemente la spec sin commit ni push, para decidir después qué hacer con la pull request.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero que el quinto momento haga solo lo que pida sobre la pull request, para subir cambios o pedir revisión sin fusionar a `staging`.
- **HU-06**: Como persona que trabaja en esta carpeta, quiero el flujo de git del curso dentro de esta carpeta, para que el agente lo encuentre aquí y la plantilla del ejercicio siga igual.
- **HU-07**: Como persona que trabaja en esta carpeta, quiero que una issue, una rama o una pull request no autoricen el código, para que el código espere a las tres specs y al momento de implementar.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Los cinco momentos (HU-01 a HU-05)

- **CA-01**: **Dado** un pedido de dejar la tarea escrita, **cuando** el agente termina ese momento, **entonces** existe la issue, asignada, con qué hay que hacer y cómo probarlo. No hay rama ni ficheros nuevos de la app.
- **CA-02**: **Dado** el pedido de crear el draft, **cuando** el agente termina ese momento, **entonces** `staging` está adelantada, la rama sale de `staging` con el commit vacío `chore: open #N`, la pull request está en draft contra `staging`, tiene autor y el cuerpo lleva `Closes #N`. No existen todavía las specs de ese cambio.
- **CA-03**: **Dado** el pedido de crear las specs, **cuando** el agente termina ese momento, **entonces** existen `spec.md`, `plan.md` y `tasks.md`. La spec abre con el número de la issue. No se ha tocado el código de la app. No hay una parada entre los tres ficheros.
- **CA-04**: **Dado** el pedido de implementar, **cuando** el agente termina ese momento, **entonces** las tasks están hechas. No hay commit ni push de ese trabajo.
- **CA-05**: **Dado** un pedido sobre la pull request, **cuando** el agente actúa, **entonces** hace solo eso: subir los ficheros nombrados, pedir revisión, u otra cosa pedida. No fusiona a `staging`. Si no se pide, no hay commit de trabajo ni push.

### El flujo dentro de la carpeta (HU-06, HU-07)

- **CA-06**: **Dado** esta carpeta, **cuando** se mira el flujo de git, **entonces** están `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, copiados de la plantilla del ejercicio. La plantilla no se ha editado. Las skills de terminal apuntan a `staff/jose-miguel/asistenciapp/tools/`.
- **CA-07**: **Dado** el manual del agente, **cuando** se lee el orden de trabajo, **entonces** describe estos cinco momentos y dice que el agente no los encadena. Commit y push solo en el draft (commit vacío) y cuando se piden en el quinto momento.
- **CA-08**: **Dado** la constitución, **cuando** se lee el desarrollo guiado por especificaciones, **entonces** la versión es 3.2, el orden de los ficheros sigue siendo spec, plan, tasks e implementación, y ya no pide un ok entre spec y plan. Una issue, una rama o una pull request no autorizan el código. Los principios P1–P6 no cambian.
- **CA-09**: **Dado** la arquitectura, **cuando** se lee el árbol, **entonces** lista `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` antes de `docs/`, sin los ficheros de dentro, y dice que el orquestador reconoce el momento.
- **CA-10**: **Dado** el código de pasar lista, **cuando** termina este cambio, **entonces** `app.py`, `asistencia/`, `static/`, `tests/` y el README de uso siguen igual salvo un ajuste mínimo en tests si la constitución pasa a 3.2, y `pytest` pasa.

---

## 5. Fuera de alcance (en esta spec)

- Fusionar la pull request a `staging`.
- Llamar a los subagentes con otra herramienta distinta de la que ya dice la plantilla.
- Sustituir `Closes #N` por otra fórmula.
- Escribir el dueño y el nombre del repositorio dentro de las skills.
- Tocar el `mcp.json` de Cursor o cualquier fichero fuera de `staff/jose-miguel/asistenciapp/`.
- Editar la plantilla `exercises/git-workflow-agent-template`.
- Cambiar el pasar lista, su lógica en `asistencia/` o el README de uso.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Versión inicial aprobada | La issue #712 deja el flujo definido antes de los ficheros |
