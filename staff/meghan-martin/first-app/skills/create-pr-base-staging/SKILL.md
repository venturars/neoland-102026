# Pull request contra staging

Úsala desde `agents/create-pr.md`. No enlaza la issue y no la deja en draft: eso son otros pasos.

El servidor es el de `MCPS/github-mcp-server/mcp.txt`.

1. Base: `staging`.
2. Cabeza: la rama que acaba de subirse.
3. Título: el de la issue, en inglés, empieza por un verbo y tiene menos de 72 caracteres.
4. Cuerpo: español, con `templates/pull-request/<tipo>-pull-request.md`. El tipo es el de la issue y la rama. En el draft las casillas se quedan sin marcar. La sección Issue se queda sin el número.

Si ya hay una pull request de esa rama hacia `staging`, actualiza esa. No abras otra. Devuelve la URL.
