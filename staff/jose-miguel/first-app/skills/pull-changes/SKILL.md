### Herramienta: PULL_CHANGES

- **Descripción**: Úsala única y exclusivamente para adelantar `staging` con un fast-forward de `origin/staging`. El orquestador siempre actualiza `staging`, esté en la rama que esté. No la uses si `staging` exige un merge o un rebase.
- **Comando de Terminal**: `staff/jose-miguel/first-app/tools/pull-changes.sh`

El comando se lanza desde el root del repositorio git (la carpeta que contenga el directorio .git).

#### Especificación de Argumentos

No recibe argumentos. Adelanta la rama local `staging` a `origin/staging`. No cambia de rama.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: El script escribe en qué commit quedó `staging`. Si el código de salida no es 0, `staging` no se pudo adelantar. Comunica el texto y no fuerces la integración. La rama en la que estabas no importa.
