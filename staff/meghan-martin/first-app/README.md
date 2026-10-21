# first-app

## Skills

En esta app está `SKILL.md`. Ahí están las skills de este trabajo. Cada persona instala su copia en su máquina. Esa copia no se sube.

Cada skill tiene un `name`. Para usarla, crea una carpeta con ese nombre y deja dentro un `SKILL.md` que empiece por el frontmatter de esa skill.

En Cursor:

```bash
mkdir -p .cursor/skills/<nombre>
```

Copia la skill en `.cursor/skills/<nombre>/SKILL.md`. Abre una conversación nueva de Agent. En Customize → Skills comprueba que aparece. Para tenerla en todos tus proyectos, usa `~/.cursor/skills/<nombre>/SKILL.md`.

En Claude Code el sitio es `.claude/skills/<nombre>/SKILL.md`, o `~/.claude/skills/<nombre>/SKILL.md` para todos los proyectos.

## MCPs

En esta app está `MCP.md`. Ahí están los servidores: el navegador, GitHub y Socket. Cada persona los configura en su máquina. El token no se sube. `.gitignore` ignora `.mcp.json`.

En Cursor, crea `~/.cursor/mcp.json` para todos tus proyectos, o `.cursor/mcp.json` solo para este. Dentro de `mcpServers`, copia la entrada de cada apartado de `MCP.md`. Si el fichero ya existe, añade esas entradas y deja las que ya tuvieras. Abre Cursor Settings → MCP y comprueba que aparecen conectados. Abre una conversación nueva de Agent.

En Claude Code, ejecuta el comando de cada apartado de `MCP.md`. Esos comandos llevan `--scope user` y valen para todos tus proyectos. Para limitarlos a este repositorio, quita esa opción. Abre una sesión nueva y comprueba con `claude mcp list`.
