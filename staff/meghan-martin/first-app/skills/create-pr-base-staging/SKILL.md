# Pull request contra staging

Úsala desde `agents/create-pr.md`. No enlaza la issue y no la deja en draft: eso son otros pasos.

El servidor es el de `MCPS/github-mcp-server/mcp.txt`.

1. Base: `staging`.
2. Cabeza: la rama que acaba de subirse.
3. Título: el de la issue, en inglés.
4. Cuerpo: español, con `templates/pull-request/basic-pull-request.md`. La sección Issue se deja vacía.

Si ya hay una pull request de esa rama hacia `staging`, actualiza esa. No abras otra. Devuelve la URL.
