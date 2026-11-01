# Adaptación a tu entorno

Quien use esta app cambia su IDE. Este fichero se toca solo si un servidor nuevo vale para toda la app.

Abajo hay un apartado por servidor. El título del apartado es el nombre que hay que poner en el IDE. El token y la sesión no salen de tu ordenador.

El JSON de Cursor va dentro de `mcpServers`. El comando de Claude Code deja el servidor instalado. El `README.md` de esta app dice en qué fichero pegarlo.

## playwright

Sirve para abrir una página y probarla. Corre en tu máquina. La primera ejecución de `npx` baja `@playwright/mcp@latest` y el navegador.

Node.js tiene que ser 18 o más nuevo.

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

Lee y escribe issues y pull requests. La dirección es `https://api.githubcopilot.com/mcp/`.

Hace falta un token personal, creado en [Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens), limitado a los repositorios de este trabajo. Donde pone `TU_GITHUB_PAT`, pon el token. Ese valor no se commitea.

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

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `github`, tipo url, URL `https://api.githubcopilot.com/mcp/`. El header se llama `Authorization` y su valor es `Bearer TU_GITHUB_PAT`.

### Claude Code

```bash
claude mcp add --scope user --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer TU_GITHUB_PAT"
```

Sustituye `TU_GITHUB_PAT` en el comando antes de lanzarlo.

## socket-mcp

Mira la seguridad de las dependencias. La dirección es `https://mcp.socket.dev/`.

Al conectar, el navegador pide la cuenta de Socket. No hay API key.

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

Dentro de la sesión, `/mcp` abre el inicio de sesión de Socket.
