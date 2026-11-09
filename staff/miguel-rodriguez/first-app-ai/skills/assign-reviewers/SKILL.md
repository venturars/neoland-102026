### ASSIGN_REVIEWERS

La ejecuta `create-pr` con la PR y los logins ya resueltos. Usar el MCP GitHub disponible o `gh` con la misma cuenta y repositorio.

1. Leer autor, borrador y revisores actuales. Excluir al autor y deduplicar logins.
2. Verificar en vivo que cada login sigue siendo colaborador mediante `gh api repos/OWNER/REPO/collaborators/LOGIN` o su equivalente MCP; un rechazo no autoriza a escoger otra persona.
3. Solicitar solo revisores que falten y pasar a lista para revisión cuando se haya pedido. Con `gh`: `gh pr edit NUMERO --repo OWNER/REPO --add-reviewer LOGIN` y `gh pr ready NUMERO --repo OWNER/REPO` si estaba en borrador.
4. Consultar la PR para confirmar resultado. Si una escritura falla o se interrumpe, leer antes de repetir; no presentar una revisión como pedida sin verificarla.

No asignar al autor ni modificar tokens. Un fallo de permisos no borra alias ni acredita una solicitud de revisión.

Antes de salir de draft coteja las casillas con la evidencia. Marca solo las
comprobadas y conserva el cuerpo y Closes #N. Si falta una comprobación necesaria,
detente. No cambia base, head o commits. Resuelve todas las identidades antes de
pedir revisión; no repitas solicitudes existentes.
