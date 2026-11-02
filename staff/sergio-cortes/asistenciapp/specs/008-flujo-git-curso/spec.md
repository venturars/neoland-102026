# Spec 008 · Flujo de git del curso

> Estado: **Implementada** (2026-10-30) · Creada: 2026-10-30 · Aprobada: 2026-10-30 · Issue: [#688](https://github.com/venturars/neoland-102026/issues/688)

---

## 1. Problema

Quien trabaja en esta carpeta sigue el orden spec, plan y tasks, con un ok entre cada uno. El flujo de git del curso no vive aquí: pensar la tarea, dejarla escrita, empezarla, guardar un trozo y pedir que la revisen se hacen fuera de esta carpeta, o se copiarían de una adaptación vieja de otro proyecto.

Esa adaptación vieja no es el flujo de hoy. Cambia la fórmula con la que la pull request enlaza la issue y se queda con una sola plantilla mínima. Quien trabaja aquí quiere el flujo actual, el de la plantilla del ejercicio, dentro de esta carpeta. La plantilla del ejercicio no se reescribe. El pasar lista no cambia.

La issue sigue sin autorizar el código. Lo nuevo es que el número de issue existe antes de abrir la carpeta de una spec, y que las tres paradas (spec, plan, tasks) se quedan.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Pedir un momento del flujo de git y que el agente use el texto actual del curso, sin perder el ok entre spec, plan y tasks. |
| **Agente** | Saber qué momento toca, qué ficheros de ese flujo usar y cuándo parar. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que no se abra la carpeta de una spec nueva hasta que la issue tenga número, para que el qué y el cómo probarlo queden escritos antes.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero que al empezar el trabajo la pull request en borrador lleve la fórmula de cierre del flujo actual (`Closes #N`), para no heredar la fórmula vieja (`Related to #N`) ni cerrar la issue a mano.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero el flujo de git del curso dentro de esta carpeta, con todas las plantillas por tipo, para que el agente lo encuentre aquí y la plantilla del ejercicio siga igual.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que el manual del agente señale ese flujo, pida la issue antes de la spec y siga parando tras el spec, tras el plan y tras las tasks.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero que la constitución deje escrita esa puerta nueva sin quitar las paradas ni los principios, para que una issue, una rama o una pull request sigan sin autorizar el código.
- **HU-06**: Como persona que trabaja en esta carpeta, quiero ver en la arquitectura las carpetas del flujo, para saber que no forman parte de la app en marcha.
- **HU-07**: Como profesor o alumno, quiero que pasar lista siga igual, para que este cambio no toque la clase.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### La issue antes de la spec (HU-01, HU-05)

- **CA-01**: **Dado** un pedido de cambio que todavía no tiene número de issue, **cuando** se empieza, **entonces** no se abre `specs/NNN-nombre/`.
- **CA-02**: **Dado** la constitución y el manual del agente, **cuando** se leen, **entonces** dicen que la issue existe antes de esa carpeta, que el orden de ficheros sigue siendo spec, plan, tasks e implementación, y que hay un ok entre ellos. Una issue, una rama o una pull request no autorizan el código. Los principios no cambian. La cabecera de la constitución coincide con la fila nueva del historial.

### El flujo actual, dentro de esta carpeta (HU-02, HU-03)

- **CA-03**: **Dado** esta carpeta, **cuando** se mira el flujo de git, **entonces** están `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`, copiados de la plantilla del ejercicio. La plantilla del ejercicio no se ha editado. En las skills de terminal, la ruta apunta a `staff/sergio-cortes/asistenciapp/tools/`.
- **CA-04**: **Dado** las plantillas de issue y de pull request de esta carpeta, **cuando** se listan, **entonces** están las de cada tipo (feat, fix, chore, docs, refactor, test). No las sustituye una sola plantilla mínima.
- **CA-05**: **Dado** la skill que enlaza la pull request con la issue y las plantillas de pull request, **cuando** se leen, **entonces** piden `Closes #N` en el cuerpo y no llaman a cerrar la issue. `Related to #N` no es la fórmula de esta app.

### Manual, arquitectura y pasar lista (HU-04, HU-06, HU-07)

- **CA-06**: **Dado** el manual del agente, **cuando** se lee el orden de trabajo, **entonces** remite a `agents/git-workflow-agent.md`, pide el número de issue antes de `specs/NNN-nombre/`, dice que el spec abre con `Issue: #N`, y mantiene la parada tras el spec, tras el plan y tras las tasks. La tabla de estado incluye esta spec.
- **CA-07**: **Dado** la arquitectura, **cuando** se lee el árbol, **entonces** lista `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` antes de `docs/`, sin los ficheros de dentro, y dice que el orquestador reconoce el momento. Esas carpetas no son parte de la app en marcha.
- **CA-08**: **Dado** el pasar lista, **cuando** termina este cambio, **entonces** `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt` y el README de uso siguen igual, y los tests siguen pasando.

---

## 5. Fuera de alcance (en esta spec)

- Editar la plantilla del ejercicio.
- Sustituir `Closes #N` por `Related to #N` o por otra fórmula.
- Juntar spec, plan y tasks en un solo pase, sin ok entre ellos.
- Fusionar la pull request a `staging`.
- Tocar el fichero de servidores del editor, fuera de esta carpeta.
- Escribir el dueño y el nombre del repositorio dentro de las skills.
- Cambiar el pasar lista, sus tests, sus dependencias o el README de uso.
- Incluir `test.py` ni `contextlibtest.py`, que siguen fuera de este cambio.
- El bot de Discord.

---

## 6. Preguntas abiertas

Ninguna. El flujo actual, la fórmula `Closes #N`, las plantillas por tipo y las tres paradas quedaron en la issue #688 (2026-10-30).

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-30 | Borrador inicial | Issue #688: el flujo de git actual entra en esta carpeta y las paradas spec, plan y tasks se quedan |
| 1.0 | 2026-10-30 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-30 | Implementada | T01–T07; plantilla del ejercicio sin diff; 96 tests en verde |
