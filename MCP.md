# MCP

Servidores MCP compartidos del repositorio. El fichero irá sumando servidores.

Cada persona los configura en su IDE. Esa configuración se queda en su máquina y no se sube al repositorio.

## Playwright

Navegador para probar la interfaz. Es un servidor local. npx descarga `@playwright/mcp@latest` la primera vez, y también el navegador.

Hace falta Node.js 18 o superior.

Fuente: Playwright MCP.

### Cursor

```json
"playwright": {
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `playwright`, tipo command, comando `npx @playwright/mcp@latest`.

La página se abre en el navegador del IDE, no en una aplicación externa.

### Claude Code

```
claude mcp add --scope user playwright -- npx @playwright/mcp@latest
```

## GitHub Copilot

Servidor remoto de GitHub. No se instala en la máquina. La URL es `https://api.githubcopilot.com/mcp/`.

Hace falta un token personal de GitHub. El token se queda en tu configuración y no se escribe en este fichero.

Fuente: GitHub MCP.

### Cursor

```json
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer TU_TOKEN"
  }
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `github`, tipo URL, dirección `https://api.githubcopilot.com/mcp/`. El token va en la cabecera `Authorization`.

### Claude Code

```
claude mcp add --scope user --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer TU_TOKEN"
```

## Socket

Servidor remoto de Socket. No se instala en la máquina. La URL es `https://mcp.socket.dev/`. La primera vez el IDE abre el navegador para iniciar sesión. No hay clave que copiar.

Fuente: Socket MCP.

### Cursor

```json
"socket": {
  "url": "https://mcp.socket.dev/"
}
```

A mano: Cursor Settings → MCP → Add new MCP Server. Nombre `socket`, tipo URL, dirección `https://mcp.socket.dev/`.

### Claude Code

```
claude mcp add --scope user --transport http socket https://mcp.socket.dev/
```
