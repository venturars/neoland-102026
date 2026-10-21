# bootcamp-102026

## Skills

En la raíz está `SKILL.md`. Ahí están las skills compartidas del repositorio. El fichero irá sumando skills; la de git es una de ellas.

`SKILL.md` es la fuente común. Cada persona lo configura en su entorno. Esa configuración se queda en tu máquina: `.gitignore` ignora `.claude/skills/`, `.cursor/skills/` y `.agents/skills/`.

En `SKILL.md`, cada skill trae su frontmatter (`name`, `description` y el resto de campos) y el apartado «Adaptación a tu entorno» dice qué puedes cambiar. Al configurarla, crea una carpeta con el `name` de esa skill y deja dentro un `SKILL.md` que empiece por su frontmatter.

## Claude Code

```bash
mkdir -p .claude/skills/<nombre>
```

Copia esa skill en `.claude/skills/<nombre>/SKILL.md`. `<nombre>` es el campo `name` del frontmatter. Abre una sesión nueva en este repositorio.

Para tenerlas en todos tus proyectos, usa `~/.claude/skills/<nombre>/SKILL.md`.

## Cursor

```bash
mkdir -p .cursor/skills/<nombre>
```

Copia esa skill en `.cursor/skills/<nombre>/SKILL.md`. Si ya está en `.claude/skills/`, Cursor la lee ahí. Abre una conversación nueva de Agent. En Customize → Skills puedes comprobar que aparecen.

Para tenerlas en todos tus proyectos, usa `~/.cursor/skills/<nombre>/SKILL.md`.
