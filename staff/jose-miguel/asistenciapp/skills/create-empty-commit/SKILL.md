### Herramienta: CREATE_EMPTY_COMMIT

- **Descripción**: Úsala única y exclusivamente para el commit vacío de apertura, `chore: open #N`. No la uses para guardar ficheros.
- **Comando de Terminal**: `staff/jose-miguel/asistenciapp/tools/create-empty-commit.sh "[NUMERO]"`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

Fuente del mensaje: el tipo `chore` de [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr).

#### Especificación de Argumentos

1. **NUMERO** _(Obligatorio)_: El número de la issue, solo dígitos. El script escribe el mensaje `chore: open #N`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si el código de salida es 0, el commit vacío ya está en la rama y no incluye ficheros preparados. Si no es 0, comunica el texto de git y no cambies el mensaje.
