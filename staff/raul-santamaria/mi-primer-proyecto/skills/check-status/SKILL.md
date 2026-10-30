### Herramienta: CHECK_STATUS

- **Descripción**: Úsala única y exclusivamente cuando necesites saber la rama actual, si hay cambios sin commit y si la rama sigue a un remoto.

- **Comando de Terminal**: `staff/raul-santamaria/mi-primer-proyecto/tools/check-status.sh`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

#### Especificación de Argumentos

No recibe argumentos.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script escribe, en este orden, el repositorio, la rama, el remoto con los commits por subir y por bajar, el último commit, los ficheros preparados, los modificados sin preparar y los que no tienen seguimiento. Si el código de salida no es 0, lee el error y comunícalo. No inventes la rama ni los ficheros.
