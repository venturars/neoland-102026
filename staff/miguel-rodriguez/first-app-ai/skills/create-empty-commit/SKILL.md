### Herramienta: CREATE_EMPTY_COMMIT

- **Descripción**: Úsala única y exclusivamente para el commit vacío de apertura, `chore: open #N`. No la uses para guardar ficheros.
- **Comando de Terminal**: `staff/miguel-rodriguez/first-app-ai/tools/create-empty-commit.sh "[NUMERO]"`

El comando se lanza desde el root del repositorio git (la raíz devuelta por git rev-parse --show-toplevel).

Fuente del mensaje: el tipo `chore` de [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr).

#### Especificación de Argumentos

1. **NUMERO** _(Obligatorio)_: El número de la issue, solo dígitos. El script escribe el mensaje `chore: open #N`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si el código de salida es 0, el commit vacío ya está en la rama y no incluye ficheros preparados. Si no es 0, comunica el texto de git y no cambies el mensaje.

El orquestador confirma la issue y la rama. Antes de ejecutar, comprueba con git log si el commit exacto de apertura ya existe en los commits propios de esta rama: si existe, devuélvelo sin duplicarlo. No basta encontrar un commit de otra issue heredado de staging.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
