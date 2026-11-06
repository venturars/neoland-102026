### Herramienta: COMMIT_CHANGES

- **Descripción**: Úsala única y exclusivamente para guardar un trozo con ficheros nombrados. No la uses para el commit vacío de apertura. No la uses con `git add -A` ni con el directorio entero.
- **Comando de Terminal**: `./staff/luis-duque/asistenciapp/tools/commit-changes.sh "[MENSAJE]" "[FICHERO_1]" "[FICHERO_2]"`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

Fuente: un commit es un conventional commit, como en [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr). En esta plantilla caben varios commits pequeños en la misma pull request.

#### Especificación de Argumentos

1. **MENSAJE** _(Obligatorio)_: Conventional commit en inglés, `tipo: descripción`. El tipo es `feat`, `fix`, `docs`, `refactor`, `test`, `chore` o `knowledge`.
2. **FICHERO** _(Obligatorio, uno o más)_: Ruta desde la raíz del repo. Repite el argumento por cada fichero del trozo.

#### Reglas de Invocación Críticas

- **Mensaje técnico:** Primera línea `tipo: descripción` o `tipo(ámbito): descripción`, en inglés, en imperativo, sin punto final. Dice qué cambió. Apunta a 50 caracteres, máximo 72. Sin rutas de fichero, sin verbos sueltos (`update files`), sin pasado (`added`). Un cambio incompatible lleva `!` tras el tipo: `feat(api)!: …`. El commit vacío sigue siendo `chore: open #N`, sin cuerpo.
- **Desglose:** Tras una línea en blanco, el detalle técnico de este commit, en inglés. Cada línea cabe en 72 caracteres. Nombra las funciones, los campos o los ficheros implicados. Explica por qué se hizo y, si el diff no lo deja claro, qué cambió. No repite la primera línea. Si la pull request tiene varios commits, cubre solo este. En un commit trivial puede omitirse.
- **Pie:** Tras otra línea en blanco, la referencia a la issue: `Closes #N` o `Refs #N`. Si el tipo lleva `!`, añade `BREAKING CHANGE:` y qué deja de funcionar.
- **Ejemplo:** Muestra la forma. No se copia.

  ```
  feat(reports): print the stored total

  printTotal recomputed the sum from report.lines on every call, so it
  ignored the discounts addLine already applies to report.total.
  src/reports/print-total.js now reads report.total instead of reducing
  lines; the sum helper is removed.

  Closes #42
  ```
- **Escapado de caracteres**: Si el mensaje contiene comillas dobles (`"`), escápalas como `\"`.
- **Procesamiento de respuestas**: El script lista el mensaje y los ficheros. El commit lleva solo esos ficheros: lo que ya estuviera preparado se queda preparado. Si el código de salida no es 0, no reintentes metiendo más ficheros de los que nombró el alumno.
