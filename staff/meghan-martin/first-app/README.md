# first-app

## Skills

`SKILL.md` está en esta app. Ahí están las skills de este trabajo. El fichero puede ir sumando skills. La de git es una de ellas.

Ese fichero es la fuente. Cada persona instala su copia en su máquina. La copia no se sube al repositorio.

Cada skill trae su frontmatter (`name`, `description` y el resto) y un apartado de adaptación que dice qué se puede cambiar. Para instalarla, crea una carpeta con el `name` de esa skill y deja dentro un `SKILL.md` que empiece por su frontmatter.

### Claude Code

```bash
mkdir -p .claude/skills/<nombre>
```

Copia la skill en `.claude/skills/<nombre>/SKILL.md`. `<nombre>` es el campo `name` del frontmatter. Abre una sesión nueva.

Para tenerla en todos tus proyectos, usa `~/.claude/skills/<nombre>/SKILL.md`.

### Cursor

```bash
mkdir -p .cursor/skills/<nombre>
```

Copia la skill en `.cursor/skills/<nombre>/SKILL.md`. Si ya está en `.claude/skills/`, Cursor también la lee ahí. Abre una conversación nueva de Agent. En Customize → Skills comprueba que aparece.

Para tenerla en todos tus proyectos, usa `~/.cursor/skills/<nombre>/SKILL.md`.

## MCPs

`MCP.md` está en esta app. Ahí están los servidores de este trabajo. El fichero puede ir sumando servidores.

Ese fichero es la fuente. Cada persona lo configura en su máquina. El token y el inicio de sesión no se suben. `.gitignore` ignora `.mcp.json`.

Cada servidor tiene su apartado. El apartado de adaptación dice qué se puede cambiar.

### Claude Code

En cada apartado de `MCP.md` está el comando de ese servidor. Ejecútalos. Abre una sesión nueva. Con `claude mcp list` compruebas que aparecen.

Los comandos llevan `--scope user` y valen para todos tus proyectos. Para tenerlos solo en este repositorio, quita esa opción. En los dos casos quedan en `~/.claude.json`.

### Cursor

Crea `~/.cursor/mcp.json` para tenerlos en todos tus proyectos, o `.cursor/mcp.json` para tenerlos solo aquí. Dentro de `mcpServers`, copia la entrada de cada apartado de `MCP.md`. Si el fichero ya existe, añade esas entradas y deja las que ya tuvieras.

Abre Cursor Settings → MCP y comprueba que aparecen conectados. Abre una conversación nueva de Agent.
