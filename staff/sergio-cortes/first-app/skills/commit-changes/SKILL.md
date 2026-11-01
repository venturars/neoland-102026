### Herramienta: COMMIT_CHANGES

- **Descripción**: Úsala única y exclusivamente para guardar un trozo con ficheros nombrados. No la uses para el commit vacío de apertura. No la uses con `git add -A` ni con el directorio entero.
- **Comando de Terminal**: `staff/sergio-cortes/first-app/tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

Fuente: un commit es un conventional commit, como en [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr). En esta plantilla caben varios commits pequeños en la misma pull request.

#### Especificación de Argumentos

1. **MENSAJE** _(Obligatorio)_: Conventional commit en inglés, `tipo: descripción`. El tipo es `feat`, `fix`, `docs`, `refactor`, `test` o `chore`.
2. **FICHERO** _(Obligatorio, uno o más)_: Ruta desde la raíz del repo. Repite el argumento por cada fichero del trozo.

#### Reglas de Invocación Críticas

- **Escapado de caracteres**: Si el mensaje contiene comillas dobles (`"`), escápalas como `\"`.
- **Procesamiento de respuestas**: El script lista el mensaje y los ficheros. El commit lleva solo esos ficheros: lo que ya estuviera preparado se queda preparado. Si el código de salida no es 0, no reintentes metiendo más ficheros de los que nombró el alumno.
