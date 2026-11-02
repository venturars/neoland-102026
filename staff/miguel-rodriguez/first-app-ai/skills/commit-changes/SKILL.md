### Herramienta: COMMIT_CHANGES

- **Descripción**: Úsala única y exclusivamente para guardar un trozo con ficheros nombrados. No la uses para el commit vacío de apertura. No la uses con `git add -A` ni con el directorio entero.
- **Comando de Terminal**: `staff/miguel-rodriguez/first-app-ai/tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`

El comando se lanza desde el root del repositorio git (la raíz devuelta por git rev-parse --show-toplevel).

Fuente: un commit es un conventional commit, como en [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr). En esta plantilla caben varios commits pequeños en la misma pull request.

#### Especificación de Argumentos

1. **MENSAJE** _(Obligatorio)_: Conventional commit en inglés, `tipo: descripción`. El tipo es `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
2. **FICHERO** _(Obligatorio, uno o más)_: Ruta desde la raíz del repo. Repite el argumento por cada fichero del trozo.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script lista el mensaje y los ficheros. El commit lleva solo esos ficheros: lo que ya estuviera preparado se queda preparado. Si el código de salida no es 0, no reintentes metiendo más ficheros de los que nombró el alumno.

Cada ruta debe ser literal, dentro de first-app-ai y relativa a la raíz Git. Incluye ambos extremos de un renombre cuando corresponda. No uses glob ni directorios. Pasa argumentos separados con una API estructurada o una cita de shell correcta; no construyas comandos con eval. Si falla después del commit, lee HEAD e índice antes de reintentar: no crees un segundo commit para ocultarlo.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
