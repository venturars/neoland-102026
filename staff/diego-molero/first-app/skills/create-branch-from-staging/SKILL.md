### Herramienta: CREATE_BRANCH_FROM_STAGING

- **Descripción**: Úsala única y exclusivamente cuando empieza el trabajo y hay que abrir la rama desde `staging`. No la uses para guardar un commit ni para abrir la pull request.
- **Comando de Terminal**: `bash staff/diego-molero/first-app/tools/create-branch-from-staging.sh "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

#### Especificación de Argumentos

1. **NUMERO** _(Obligatorio)_: El número de la issue, solo dígitos.
2. **TIPO** _(Obligatorio)_: Uno de `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
3. **DESCRIPCION** _(Obligatorio)_: Palabras en inglés, en minúsculas, separadas por guiones. Sin espacios.

El nombre resultante es `codex/número-tipo-descripcion`.

#### Reglas de Invocación Críticas

- **Argumentos**: Pasa cada dato por separado con el escapado de la shell utilizada; no construyas un comando con interpolación de datos.
- **Procesamiento de respuestas**: El script escribe el nombre de la rama. Si el código de salida no es 0, lee el error. Si la rama ya existía, el script se queda en ella: sigue desde ahí.

Antes de decidir si la rama remota existe, se refrescan las referencias de origin. Se rechaza cambiar de rama con trabajo local pendiente y se usa el prefijo codex/. Un nombre exacto elegido por la persona no se sustituye automáticamente.
