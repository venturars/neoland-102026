### Herramienta: COMMIT_CHANGES

- **Descripción**: Úsala única y exclusivamente para guardar un trozo con ficheros nombrados. No la uses para el commit vacío de apertura. No la uses con `git add -A` ni con el directorio entero.
- **Comando de Terminal**: `./tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

Fuente: un commit es un conventional commit, como en [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr). En esta plantilla caben varios commits pequeños en la misma pull request.

#### Especificación de Argumentos

1. **MENSAJE** _(Obligatorio)_: Conventional commit en inglés, `tipo: descripción`. El tipo es `feat`, `fix`, `docs`, `refactor`, `test`, `chore` o `knowledge`.
2. **FICHERO** _(Obligatorio, uno o más)_: Ruta desde la raíz del repo. Repite el argumento por cada fichero del trozo.

#### Reglas de Invocación Críticas

- **Mensaje técnico:** La primera línea es `tipo: descripción` o `tipo(ámbito): descripción`, en inglés, en imperativo y sin punto final. Dice qué cambió. Apunta a 50 caracteres y no pasa de 72. No pongas la ruta del fichero en esa línea, ni un verbo suelto (`update files`), ni un pasado (`added`). El commit vacío sigue siendo `chore: open #N`, sin cuerpo.
- **Desglose:** Una línea en blanco y el detalle técnico de este commit, en inglés. Puede ocupar varias líneas. Cada línea puede nombrar el fichero o la función y decir qué cambió ahí, y por qué si no es obvio. No repite la primera línea. Si la pull request tiene varios commits, este texto cubre solo este. El commit vacío no lleva desglose.
- **Ejemplo:** Muestra la forma. No se copia.

  ```
  feat(reports): print the stored total

  printTotal returns the total addLine stored.
  src/reports/print-total.js prints that total instead of summing the lines again.
  ```
- **Escapado de caracteres**: Si el mensaje contiene comillas dobles (`"`), escápalas como `\"`.
- **Procesamiento de respuestas**: El script lista el mensaje y los ficheros. El commit lleva solo esos ficheros: lo que ya estuviera preparado se queda preparado. Si el código de salida no es 0, no reintentes metiendo más ficheros de los que nombró el alumno.
