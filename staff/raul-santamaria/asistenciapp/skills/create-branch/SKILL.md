### Herramienta: CREATE_BRANCH

- **Descripción**: Úsala cuando hay que abrir la rama `número-tipo-descripcion` desde una base que no es `staging`. Si la base es `staging`, usa `create-branch-from-staging`. No la uses para guardar un commit ni para abrir la pull request.
- **Comando de Terminal**: `staff/raul-santamaria/asistenciapp/tools/create-branch.sh "[BASE]" "[NUMERO]" "[TIPO]" "[DESCRIPCION]"`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

#### Especificación de Argumentos

1. **BASE** _(Obligatorio)_: La rama de partida. Puede ser local (`main`) o remota (`origin/main`). No uses `staging`: para esa base está la otra skill.
2. **NUMERO** _(Obligatorio)_: El número de la issue, solo dígitos.
3. **TIPO** _(Obligatorio)_: Uno de `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
4. **DESCRIPCION** _(Obligatorio)_: Palabras en inglés, en minúsculas, separadas por guiones. Sin espacios.

El nombre resultante es `número-tipo-descripcion`.

#### Reglas de Invocación Críticas

- **Escapado de caracteres**: Si un argumento contiene comillas dobles (`"`), escápalas como `\"`.
- **Procesamiento de respuestas**: El script escribe el nombre de la rama y la base usada. Si el código de salida no es 0, lee el error. Si la rama ya existía, el script se queda en ella: sigue desde ahí.
