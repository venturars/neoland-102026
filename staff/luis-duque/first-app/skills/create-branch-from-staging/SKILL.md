### Herramienta: CREATE_BRANCH_FROM_STAGING

- **Descripción**: Úsala única y exclusivamente cuando empieza el trabajo y hay que abrir la rama desde `staging`. No la uses para guardar un commit ni para abrir la pull request.
- **Comando de Terminal**: `./staff/luis-duque/first-app/tools/create-branch-from-staging.sh "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

#### Especificación de Argumentos

1. **NUMERO** _(Obligatorio)_: El número de la issue, solo dígitos.
2. **TIPO** _(Obligatorio)_: Uno de `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
3. **DESCRIPCION** _(Obligatorio)_: Palabras en inglés, en minúsculas, separadas por guiones. Sin espacios.

El nombre resultante es `número-tipo-descripcion`.

#### Reglas de Invocación Críticas

- **Escapado de caracteres**: Si un argumento contiene comillas dobles (`"`), escápalas como `\"`.
- **Procesamiento de respuestas**: El script escribe el nombre de la rama. Si el código de salida no es 0, lee el error. Si la rama ya existía, el script se queda en ella: sigue desde ahí.
