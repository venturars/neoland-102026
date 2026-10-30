# Spec 009 · Adaptar el flujo de git y los momentos humanos

> Estado: **Implementada** · Creada: 2026-10-30 · Issue: #618

---

## 1. Problema

Quien construye AsistenciApp con IA sigue un SDD con muchas paradas humanas (ok tras spec, tras plan y tras tasks) y no tiene en esta carpeta el flujo de git del curso (pensar, dejar la tarea escrita, empezar con borrador, guardar un trozo, pedir revisión).

Hace falta un solo camino: la persona solo interviene en cinco momentos fijados; el agente no encadena un momento con el siguiente ni pide ok de más; y el trabajo de git del curso vive dentro de esta carpeta.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Marcar el ritmo solo en issue, draft, specs, implementar y pull request; sin oks intermedios. |
| **Agente** | Saber qué momento es, qué puede hacer y qué no debe adelantar. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero **crear la issue** (con entrevista si hace falta) **sin abrir la rama**, para dejar la tarea escrita antes de empezar.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero **crear el draft de una vez** (rama desde staging, commit de apertura, pull request en borrador enlazada a la issue) **sin escribir specs todavía**, para abrir el trabajo en git.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero que al pedir **crear las specs** salgan de una vez spec, plan y tasks, con el número de issue en la spec y **sin tocar código**, para cerrar el qué y el cómo antes de implementar.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que al pedir **implementar** se ejecuten las tasks con sus comprobaciones **sin commit ni push**, para revisar el cambio antes de subirlo.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero que en el momento de la **pull request** solo se haga lo que pido (subir, pedir revisión u otra acción) y **no se fusione en staging**, para controlar el cierre del trabajo.
- **HU-06**: Como persona que trabaja en esta carpeta, quiero que una issue, una rama o una pull request **no autoricen** el cambio de código por sí solas, para que el código espere al momento de implementar y a que existan los tres ficheros de specs.
- **HU-07**: Como persona que trabaja en esta carpeta, quiero el **flujo de git del curso** dentro de esta carpeta (orquestador, agentes, skills, herramientas y plantillas), para no depender de otra app.

---

## 4. Criterios de aceptación

Formato: **Dado** · **Cuando** · **Entonces**.

### Momentos (HU-01 a HU-05)

- **CA-01**: **Dado** un pedido de crear la issue, **cuando** la tarea aún no se puede escribir, **entonces** hay entrevista (una pregunta cada vez) y luego se crea la issue **sin** abrir la rama.
- **CA-02**: **Dado** un pedido de crear el draft, **cuando** ya existe la issue, **entonces** de una vez: se adelanta staging, se crea la rama desde staging, hay commit de apertura con el número de issue, se publica la rama y queda una pull request en borrador contra staging con autor y enlace que cierra la issue al fusionar en la rama por defecto según la convención del curso (`Closes #N`). **No** se escriben specs en ese momento.
- **CA-03**: **Dado** un pedido de crear las specs, **cuando** el agente actúa, **entonces** escribe de una vez y en orden `spec.md`, `plan.md` y `tasks.md`; la spec abre con el número de issue; si falta un dato, pregunta y no inventa; **no** modifica código de la app.
- **CA-04**: **Dado** un pedido de implementar y los tres ficheros del momento 3, **cuando** el agente actúa, **entonces** ejecuta las tasks una detrás de otra con sus comprobaciones y **no** hace commit ni push.
- **CA-05**: **Dado** un pedido sobre la pull request, **cuando** el agente actúa, **entonces** solo hace lo pedido (subir cambios con commit de ficheros nombrados y push, pedir revisión sacando de borrador, u otra petición sobre esa PR) y **no** fusiona en staging.

### Puerta del código (HU-06)

- **CA-06**: **Dado** solo una issue, una rama o una pull request, **cuando** aún no se ha pedido implementar o faltan los tres ficheros de specs, **entonces** no se modifica el código de la app.
- **CA-07**: **Dado** el manual del agente, **cuando** se lee el flujo de trabajo, **entonces** describe los cinco momentos (sin parar tras spec, plan o tasks por separado) y dice que commit y push solo ocurren en el momento del draft (commit de apertura) y en el momento de la pull request cuando lo piden.

### Flujo de git en la carpeta (HU-07)

- **CA-08**: **Dado** esta carpeta, **cuando** termina la implementación de esta spec, **entonces** existen en ella el orquestador de git, los agentes, las skills, las herramientas, las plantillas de issue/PR y la referencia al servidor de GitHub del curso.
- **CA-09**: **Dado** las skills que lanzan comandos de terminal, **cuando** se invocan desde la raíz del repositorio git, **entonces** apuntan a las herramientas de `staff/raul-santamaria/asistenciapp/`.
- **CA-10**: **Dado** la constitución y la arquitectura, **cuando** termina la implementación, **entonces** el §4 refleja issue y draft antes de las specs, spec/plan/tasks en el mismo momento, e implementación y pull request como momentos distintos; el árbol nombra las carpetas nuevas antes de `docs/` y un párrafo describe al orquestador.

### Comprobación

- **CA-11**: **Dado** la implementación hecha, **cuando** se lanza desde la raíz del monorepo la herramienta de estado de esta app, **entonces** termina bien y escribe repositorio, rama y remoto.

---

## 5. Fuera de alcance

- Cambiar reglas de negocio, base de datos, pantallas, bot de Discord o dependencias de la app.
- Reescribir el historial de las specs `001`–`008`.
- Fusionar en `staging` desde este flujo.
- Configurar el MCP de GitHub en la máquina de otra persona.

---

## 6. Preguntas abiertas

Ninguna. El alcance quedó cerrado en la issue #618. La enmienda de constitución usa la **siguiente versión libre** del historial (ver plan): el número «3.1» de la issue choca con la 3.1 ya anotada (Discord).
