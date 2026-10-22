# SKILL

En la raíz está `SKILL.md`. Ahí están las skills compartidas del repositorio. El fichero irá sumando skills. grill-me y grilling son dos de ellas.

`SKILL.md` es la fuente común. Cada persona lo configura en su entorno. Esa configuración se queda en tu máquina: `.gitignore` ignora `.claude/skills/`, `.cursor/skills/` y `.agents/skills/`.

Cada skill trae su frontmatter (`name`, `description` y el resto de campos) y el apartado «Adaptación a tu entorno» dice qué puedes cambiar. Al configurarla, crea una carpeta con el `name` de esa skill y deja dentro un `SKILL.md` que empiece por su frontmatter.

## Estándar Agent Skills

Este fichero es el catálogo. No es un skill. El estándar pide una carpeta con el mismo nombre que `name` y, dentro, un `SKILL.md`. Eso pasa al copiar cada skill, no en la raíz.

Fuente: [especificación Agent Skills](https://agentskills.io/specification).

- La carpeta del skill lleva `SKILL.md`. Puede llevar también `scripts/`, `references/` y `assets/`. grill-me y grilling no traen esas carpetas.
- El frontmatter obligatorio es `name` y `description`. `name` tiene de 1 a 64 caracteres, solo minúsculas, números y guiones, y coincide con el nombre de la carpeta. `description` dice qué hace el skill y cuándo usarlo, hasta 1024 caracteres.
- El frontmatter opcional es `license`, `compatibility` (hasta 500 caracteres, solo si hay un requisito de entorno), `metadata` (mapa de texto a texto) y `allowed-tools` (experimental).
- El cuerpo es Markdown y no tiene un formato fijo. El agente carga el fichero entero cuando activa el skill.
- `disable-model-invocation` no está en esa especificación. Es de Cursor. grill-me lo trae y se deja. Un agente que no lo conozca lo ignora.

## grill-me

~~~~markdown
---
name: grill-me
description: A relentless interview to sharpen a plan or design. Use when the user wants to stress-test a plan or design, or says "grill me".
license: MIT
compatibility: Requires the grilling skill in the same agent.
metadata:
  author: "Matt Pocock"
  source: "https://github.com/mattpocock/skills"
disable-model-invocation: true
---

Call the Skill tool with "grilling".
~~~~

### Adaptación a tu entorno

Crea la carpeta `grill-me` dentro de `.claude/skills/`, `.cursor/skills/` o `.agents/skills/`, según tu IDE. Dentro, un `SKILL.md` que empiece por ese frontmatter seguido del cuerpo. El `name` y el cuerpo no se cambian. La carpeta de destino sí, según el IDE. `allowed-tools` no se rellena: el skill no nombra herramientas concretas.

## grilling

~~~~markdown
---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
license: MIT
compatibility: No extra packages. Works in an agent that loads Agent Skills.
metadata:
  author: "Matt Pocock"
  source: "https://github.com/mattpocock/skills"
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.
~~~~

### Adaptación a tu entorno

Crea la carpeta `grilling` dentro de `.claude/skills/`, `.cursor/skills/` o `.agents/skills/`, según tu IDE. Dentro, un `SKILL.md` que empiece por ese frontmatter seguido del cuerpo. El `name` y el cuerpo no se cambian. La carpeta de destino sí, según el IDE. `allowed-tools` no se rellena: el skill no nombra herramientas concretas.
