### Herramienta: CREATE_BRANCH_FROM_STAGING

- **Descripción**: Úsala única y exclusivamente cuando empieza el trabajo y hay que abrir la rama desde `staging`. No la uses para guardar un commit ni para abrir la pull request.
- **Comando de Terminal**: `staff/miguel-rodriguez/first-app-ai/tools/create-branch-from-staging.sh "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`

El comando se lanza desde el root del repositorio git (la raíz devuelta por git rev-parse --show-toplevel).

#### Especificación de Argumentos

1. **NUMERO** _(Obligatorio)_: El número de la issue, solo dígitos.
2. **TIPO** _(Obligatorio)_: Uno de `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
3. **DESCRIPCION** _(Obligatorio)_: Palabras en inglés, en minúsculas, separadas por guiones. Sin espacios.

El nombre resultante es `número-tipo-descripcion`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script escribe el nombre de la rama. Si el código de salida no es 0, lee el error. Si la rama ya existía, el script se queda en ella: informa del estado antes de continuar, sin recrear ni actualizar su base.

Requiere pull-changes completado. Si la rama existe, verifica que pertenece a la misma issue y tarea antes de reutilizarla. No cambies bases ni mezcles trabajo pendiente de otra tarea.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
