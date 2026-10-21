# Servidores MCP

Cada apartado es un servidor. El nombre del título es el nombre que tiene que quedar en el IDE. El token y el inicio de sesión se quedan en tu máquina. No se suben al repositorio.

En Cursor, cada bloque JSON se añade dentro de `mcpServers` en `~/.cursor/mcp.json` (para todos tus proyectos) o en `.cursor/mcp.json` (solo en este). Si el fichero ya existe, añade la entrada y deja las que ya tuvieras. Luego abre Cursor Settings → MCP y comprueba que aparece conectado. Abre una conversación nueva de Agent.

## playwright

Navegador para probar una página. La primera vez, `npx` descarga `@playwright/mcp@latest` y el navegador. Hace falta Node.js 18 o superior.

```json
"playwright": {
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `playwright`, tipo command, comando `npx @playwright/mcp@latest`.

En Claude Code, desde la raíz:

```bash
claude mcp add --scope user playwright -- npx @playwright/mcp@latest
```

## github

Issues, pull requests y el resto de GitHub. El servidor está en `https://api.githubcopilot.com/mcp/`.

Hace falta un token personal. Créalo en los fine-grained personal access tokens de GitHub, con acceso a los repositorios en los que trabajas. En el JSON de tu máquina, cambia `TU_GITHUB_PAT` por ese token. El token no entra en el repositorio.

```json
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer TU_GITHUB_PAT"
  }
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `github`, tipo url, URL `https://api.githubcopilot.com/mcp/`. El header es `Authorization` y el valor es `Bearer TU_GITHUB_PAT`.

En Claude Code:

```bash
claude mcp add --scope user --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer TU_GITHUB_PAT"
```

Cambia `TU_GITHUB_PAT` antes de ejecutar el comando.

## socket-mcp

Puntuación de seguridad de las dependencias. El servidor está en `https://mcp.socket.dev/`. La primera vez abre el navegador y pide iniciar sesión en Socket. No hace falta una API key.

```json
"socket-mcp": {
  "type": "http",
  "url": "https://mcp.socket.dev/"
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `socket-mcp`, tipo http, URL `https://mcp.socket.dev/`.

En Claude Code:

```bash
claude mcp add --scope user --transport http socket-mcp https://mcp.socket.dev/
```

En la sesión, `/mcp` inicia sesión en Socket.
