# Tareas · Repartir reglas Socket y referencia MCP

1. Crear `docs/specs/split-socket-package-rules/` con `spec.md`, `plan.md` y este `tasks.md`.

2. Abrir `docs/CONSTITUTIONS.md`. En `## SDD`, en el párrafo de `tasks.md`, añadir: si el desarrollo añade o cambia paquetes de Node, el primer paso de `tasks.md` dice que solo se ejecuta tras aprobación del `spec.md` y del `plan.md` (y de las alertas Socket, si las hubo). Ampliar `## Paquetes` con la regla completa (cuándo, 3 capas, resumen en plan, alertas humanas, consulta incompleta, prohibición de instalar antes de aprobar spec/plan, fuera de alcance). Sin argumentos MCP ni `pnpm view`.

3. Abrir `AGENTS.md`. Cabecera con paradas de Orden. Añadir `## Orden`. Reorganizar Reglas y Paquetes: Paquetes abre apuntando a la constitución; debajo solo procedimiento y `MCPS/socket-mcp/mcp.txt`. Corregir Comandos y Al terminar con rutas `src/`.

4. Sustituir `MCPS/socket-mcp/mcp.txt` por una sola línea: `https://docs.socket.dev/docs/remote-socket-mcp`.

5. Comprobar checklist de `spec.md` (ARCHITECTURE ya nombra el MCP de Socket; no tocar `git-workflow-agent.md` ni `TREE.md`).
