# bootcamp-102026

## Skills

En la raíz está `SKILL.md`. Ahí están las skills compartidas del repositorio. El fichero irá sumando skills; la de git es una de ellas.

`SKILL.md` es la fuente común. Cada persona lo configura en su entorno. Esa configuración se queda en tu máquina: `.gitignore` ignora `.claude/skills/`, `.cursor/skills/` y `.agents/skills/`.

En `SKILL.md`, cada skill trae su frontmatter (`name`, `description` y el resto de campos) y el apartado «Adaptación a tu entorno» dice qué puedes cambiar. Al configurarla, crea una carpeta con el `name` de esa skill y deja dentro un `SKILL.md` que empiece por su frontmatter.

### Claude Code

```bash
mkdir -p .claude/skills/<nombre>
```

Copia esa skill en `.claude/skills/<nombre>/SKILL.md`. `<nombre>` es el campo `name` del frontmatter. Abre una sesión nueva en este repositorio.

Para tenerlas en todos tus proyectos, usa `~/.claude/skills/<nombre>/SKILL.md`.

### Cursor

```bash
mkdir -p .cursor/skills/<nombre>
```

Copia esa skill en `.cursor/skills/<nombre>/SKILL.md`. Si ya está en `.claude/skills/`, Cursor la lee ahí. Abre una conversación nueva de Agent. En Customize → Skills puedes comprobar que aparecen.

Para tenerlas en todos tus proyectos, usa `~/.cursor/skills/<nombre>/SKILL.md`.

## MCPs

En la raíz está `MCP.md`. Ahí están los servidores MCP compartidos del repositorio. El fichero irá sumando servidores.

`MCP.md` es la fuente común. Cada persona lo configura en su entorno. Esa configuración se queda en tu máquina.

En `MCP.md`, cada servidor tiene su apartado. El apartado «Adaptación a tu entorno» dice qué puedes cambiar.

### Claude Code

En cada apartado de `MCP.md` está el comando de ese servidor. Ejecútalos desde la raíz del repositorio. Abre una sesión nueva. Con `claude mcp list` compruebas que aparecen.

Los comandos llevan `--scope user` y valen para todos tus proyectos. Para tenerlos solo en este repositorio, quita esa opción. En los dos casos quedan en `~/.claude.json`.

### Cursor

Crea `~/.cursor/mcp.json` para tenerlos en todos tus proyectos, o `.cursor/mcp.json` para tenerlos solo aquí. En `mcpServers`, copia la entrada de cada apartado de `MCP.md`. Si el fichero ya existe, añade esas entradas y deja las que ya tuvieras.

Abre Cursor Settings → MCP y comprueba que aparecen conectados. Abre una conversación nueva de Agent.
