## Adaptación a tu entorno

Esta sección es para las personas del equipo. Edita la configuración de tu IDE, no este fichero, salvo que el cambio sea un servidor para todo el repositorio.

Cada apartado de abajo es un servidor. El nombre del encabezado es el nombre que tiene que quedar en tu IDE. Los tokens y el inicio de sesión se quedan en tu máquina.

En cada apartado, el bloque de Cursor es la entrada que añades dentro de `mcpServers`. El comando de Claude Code instala ese servidor. Los pasos de dónde pegarlo están en el `README.md` de la raíz.

## playwright

Navegador para probar la interfaz. Es un servidor local. `npx` descarga `@playwright/mcp@latest` la primera vez, y también el navegador.

Hace falta Node.js 18 o superior.

Fuente: [Playwright MCP](https://playwright.dev/docs/getting-started-mcp).

### Cursor

```json
"playwright": {
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `playwright`, tipo command, comando `npx @playwright/mcp@latest`.

### Claude Code

```bash
claude mcp add --scope user playwright -- npx @playwright/mcp@latest
```

## github

Repositorios, issues y pull requests de GitHub. Es un servidor remoto en `https://api.githubcopilot.com/mcp/`.

Pide un token personal. Créalo en [Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens) con acceso a los repositorios en los que trabajas. En la configuración local sustituye `TU_GITHUB_PAT` por ese token. El token no entra en el repositorio.

Fuente: [GitHub MCP remoto](https://github.com/github/github-mcp-server/blob/main/docs/remote-server.md).

### Cursor

```json
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer TU_GITHUB_PAT"
  }
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `github`, tipo url, URL `https://api.githubcopilot.com/mcp/`. El header es `Authorization` con el valor `Bearer TU_GITHUB_PAT`.

### Claude Code

```bash
claude mcp add --scope user --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer TU_GITHUB_PAT"
```

Sustituye `TU_GITHUB_PAT` antes de ejecutar el comando.

## socket-mcp

Puntuación de seguridad de dependencias. Es un servidor remoto en `https://mcp.socket.dev/`.

La primera vez abre el navegador y pide iniciar sesión en Socket. No hace falta una API key.

Fuente: [Socket MCP remoto](https://docs.socket.dev/docs/remote-socket-mcp).

### Cursor

```json
"socket-mcp": {
  "type": "http",
  "url": "https://mcp.socket.dev/"
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `socket-mcp`, tipo http, URL `https://mcp.socket.dev/`.

### Claude Code

```bash
claude mcp add --scope user --transport http socket-mcp https://mcp.socket.dev/
```

En la sesión, `/mcp` inicia sesión en Socket.
