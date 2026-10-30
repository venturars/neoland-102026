### Herramienta: LAUNCH_PUSH

- **Descripción**: Úsala única y exclusivamente para subir la rama actual a `origin` y fijar el upstream. No la uses para hacer commit. No la uses con force push.
- **Comando de Terminal**: `staff/raul-santamaria/mi-primer-proyecto/tools/launch-push.sh`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

#### Especificación de Argumentos

No recibe argumentos. Equivale a `git push -u origin HEAD`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si el código de salida es 0, la rama ya está en el remoto. Si no es 0, comunica el rechazo. No vuelvas a lanzarla con `--force` ni con `-f`.
