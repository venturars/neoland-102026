# Plan — integrar skill del MCP de Socket

Issue: #656.

No es funcionalidad de `src/logic/`. Sin firma, SQL ni paquete Node nuevo.
La issue #631 dejó `MCPS/socket-mcp/mcp.txt` y el contrato MCP en la
constitución. Falta la skill (como las de GitHub), enlazarla en
`AGENTS.md` y «Orden», y corregir rutas pre-`src/` en guías.

La constitución, `#631` y esta spec no se contradicen.

## Ficheros

Se crea:

- `skills/validate-node-package/SKILL.md`

Se tocan:

- `AGENTS.md`
- `docs/CONSTITUTIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/STYLE.md`

No se tocan `package.json`, código en `src/`, `docs/TREE.md` (el árbol no
lista cada skill), ni el staff root.

## Skill

Misma forma que `skills/create-issue/SKILL.md`: descripción, MCP en
`MCPS/socket-mcp/mcp.txt`, cuándo usarla, procedimiento (`depscore`,
`alerts`, `threat_feed`, org `ai-engineering`), remisión al contrato en
`docs/CONSTITUTIONS.md` § Paquetes y a «Paquetes» de `AGENTS.md`.

## AGENTS.md

- Intro: constitución = qué; arquitectura = organización; agents = cómo
  (modelo asistenciapp).
- «Orden»: al escribir `plan.md`, si hay paquete npm nuevo o cambio de
  versión, aplicar la skill antes de parar.
- «Paquetes»: enlazar `skills/validate-node-package/SKILL.md`; procedimiento
  de capas y resumen; contrato de herramientas solo en constitución.
- Rutas: `src/db/users.sqlite`, `src/logic/`, `src/clients/terminal/`.

## Constitución

- Apertura: principios no negociables; remitir el cómo del agente a
  `AGENTS.md`.
- «Paquetes»: mantener contrato MCP; añadir que el procedimiento no está
  en esa sección.
- Rutas `src/logic/`, `src/clients/terminal/` en contrato y ejemplo de
  tarea.

## Arquitectura y estilo

- Bullet de `skills/validate-node-package/SKILL.md` junto al stack de
  skills.
- Bullet de `docs/CONSTITUTIONS.md` actualizado (reglas SDD, contrato MCP,
  `src/logic/`).
- `docs/STYLE.md`: contrato en `src/logic/`.

## Paquetes y Socket

Este plan no añade dependencias npm.

## Contrato

No hay función de `src/logic/`, firma pública ni SQL.
