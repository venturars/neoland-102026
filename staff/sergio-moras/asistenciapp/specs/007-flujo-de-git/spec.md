# Spec 007 · Flujo de git del curso en cinco momentos

> Estado: **Implementada** (2026-11-02) · Creada: 2026-11-02 · Aprobada: 2026-11-02 · Issue: #730

---

## 1. Problema

Cada tarea del curso pasa por los mismos pasos de git: dejarla escrita en una issue, abrir una rama desde `staging`, hacer el commit vacío de apertura, subirla, abrir la pull request en borrador, enlazarla con la issue y, al final, pedir revisión. Hoy nada de eso está escrito dentro de AsistenciApp: el agente lo hace de memoria y cada vez puede hacerlo de una forma distinta.

Además, las reglas obligan a parar tres veces antes de tocar nada: tras la spec, tras el plan y tras las tasks. Quien trabaja en esta carpeta quiere decidir en menos puntos, pero con cada uno bien definido:

1. **Crear la issue:** qué hay que hacer y cómo se comprueba.
2. **Crear el draft:** rama, commit de apertura, subida y pull request en borrador enlazada.
3. **Crear las specs:** spec, plan y tasks del cambio, juntas.
4. **Implementar:** hacer lo que dicen las tasks.
5. **La pull request:** subir el trabajo, pedir revisión o lo que se pida sobre ella.

El curso ya tiene una plantilla con este flujo (agentes, skills, scripts, plantillas de issue y de PR por tipo, y la conexión con GitHub), pero vive fuera de esta carpeta.

---

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| **Quien trabaja en esta carpeta** | Pedir un momento concreto y que el agente haga ese y solo ese. |
| **Agente de IA** | Saber qué momento toca, con qué ficheros hacerlo y cuándo parar. |
| **Quien revisa la PR** | Encontrar issues y PRs con la misma forma en todas las tareas. |

---

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en esta carpeta, quiero tener el flujo de git del curso dentro de AsistenciApp, para que el agente lo siga siempre igual.
- **HU-02**: Como quien trabaja en esta carpeta, quiero intervenir solo en cinco momentos, para no aprobar spec, plan y tasks por separado.
- **HU-03**: Como quien trabaja en esta carpeta, quiero que el agente haga un único momento cada vez y pare, para decidir yo cuándo pasar al siguiente.
- **HU-04**: Como quien trabaja en esta carpeta, quiero que el código siga esperando a que la spec, el plan y las tasks estén escritos, para no perder el SDD.
- **HU-05**: Como quien revisa, quiero que issues y PRs usen las plantillas por tipo del curso, para leerlas todas igual.

---

## 4. Criterios de aceptación

### El flujo dentro de la carpeta (HU-01, HU-05)

- **CA-01**: **Dado** AsistenciApp, **cuando** se busca el flujo de git, **entonces** están los agentes, las skills, los scripts, las plantillas por tipo y la conexión con GitHub de la versión actual de la plantilla del curso.
- **CA-02**: **Dado** esos ficheros, **cuando** se comparan con la plantilla, **entonces** solo cambian las rutas necesarias para que los scripts se lancen desde la raíz del repositorio y apunten a esta carpeta.
- **CA-03**: **Dado** un script del flujo, **cuando** se lanza desde la raíz del repositorio, **entonces** se puede ejecutar y funciona.
- **CA-04**: **Dado** la plantilla del curso y el resto del repositorio, **cuando** se aplica el cambio, **entonces** no se modifican.

### Los cinco momentos (HU-02, HU-03, HU-04)

- **CA-05**: **Dado** el manual del agente, **cuando** describe cómo se trabaja, **entonces** nombra los cinco momentos en orden y dice qué hace el agente en cada uno.
- **CA-06**: **Dado** un momento pedido, **cuando** el agente lo termina, **entonces** para; no empieza el siguiente ni pide otro ok en medio.
- **CA-07**: **Dado** el momento de crear las specs, **cuando** se hace, **entonces** se escriben spec, plan y tasks en la misma pasada, y si falta un dato se pregunta en ese momento en vez de inventarlo.
- **CA-08**: **Dado** que todavía no están escritas la spec, el plan y las tasks, **cuando** se pide cambiar la app, **entonces** no se toca: ni una issue, ni una rama, ni una PR autorizan a hacerlo.
- **CA-09**: **Dado** el momento de implementar, **cuando** se hace, **entonces** no hay commit ni push; eso queda para el momento de la PR, si se pide.
- **CA-10**: **Dado** la pull request, **cuando** se trabaja en ella, **entonces** el agente no la fusiona con `staging`.

### Los documentos

- **CA-11**: **Dado** la constitución, **cuando** describe el SDD, **entonces** ya no pide un ok entre spec, plan y tasks, mantiene el orden spec → plan → tasks → implementación y queda anotada en su historial con su versión.
- **CA-12**: **Dado** el documento de arquitectura, **cuando** se lee, **entonces** muestra las carpetas nuevas del flujo y qué papel tienen.

### Lo que no cambia

- **CA-13**: **Dado** la app, **cuando** se aplica el cambio, **entonces** su código, sus pantallas y sus tests no cambian y siguen pasando.

---

## 5. Fuera de alcance

- Cambiar la plantilla del curso.
- Configurar el MCP de GitHub en el editor de cada persona.
- Cambiar la app.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 0.1 | 2026-11-02 | Borrador |
| 1.0 | 2026-11-02 | Aprobada |
| 1.1 | 2026-11-02 | Implementada: T01–T07, 170 tests en verde; `check-status.sh` funciona desde la raíz y `exercises/` sin cambios |
