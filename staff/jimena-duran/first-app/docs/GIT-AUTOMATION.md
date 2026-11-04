# Automatización de Git en first-app

El flujo entra por [AGENTS.md](../AGENTS.md) y [agents/git-workflow-agent.md](../agents/git-workflow-agent.md). El SDD local de first-app prevalece sobre cualquier indicación del template de continuar automáticamente. Se mantienen spec y plan juntos para revisión, tareas para otra revisión e implementación autorizada.

## Fuente y ejecución

Los siete scripts proceden de `exercises/git-workflow-agent-template` en `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`, sin traducción ni cambios de código. Git Bash ya está instalado. Desde su terminal, en la raíz Git, los comandos son:

```bash
./staff/jimena-duran/first-app/tools/check-status.sh
./staff/jimena-duran/first-app/tools/pull-changes.sh
./staff/jimena-duran/first-app/tools/create-branch-from-staging.sh NUMERO TIPO DESCRIPCION
./staff/jimena-duran/first-app/tools/create-branch.sh BASE NUMERO TIPO DESCRIPCION
./staff/jimena-duran/first-app/tools/create-empty-commit.sh NUMERO
./staff/jimena-duran/first-app/tools/commit-changes.sh "tipo: description" "ruta/al/archivo"
./staff/jimena-duran/first-app/tools/launch-push.sh
```

También se pueden invocar con `bash ruta/al/script.sh`. Los parámetros y resultados son los originales; las rutas de archivos del commit parten de la raíz Git. Las siete skills de terminal contienen la ruta de first-app. Los permisos concretos de la tarea determinan qué operación se realiza; implementar no autoriza publicar.

## Instrucciones y referencias

Los siete agentes y quince skills conservan la estructura y texto originales, con el párrafo local del orquestador y las siete rutas de comandos como únicas adaptaciones. Las doce plantillas originales definen el formato de issues y PR; se utiliza la del tipo o la más cercana, como indica la fuente.

Las rutas de agentes y skills se resuelven dentro de first-app. La prioridad del SDD y sus pausas está definida en AGENTS; no se sustituyen por la secuencia automática del template.

MCP y su documentación se conservan como referencia. Se utiliza la identidad y capacidad disponible para la operación autorizada; gh autenticado sigue siendo la alternativa documentada si MCP no resulta suficiente. OWNER y REPO corresponden al repositorio comprobado. Esta integración no ejecuta los ejemplos de instalación o configuración ni modifica conexiones, tokens, headers o configuración personal.

## Límites y comprobación

Se conserva el comportamiento original: esta copia no incorpora los controles extra de las herramientas PowerShell retiradas. El plan de la entrega señala problemas presentes también en la fuente: selección de directorios borrados, sincronización de borrados preparados, carrera al avanzar staging, etiquetas implícitas en push y orden de revisores/draft. No están corregidos localmente.

Las herramientas y los contratos se comprueban en repositorios desechables con remoto local cuando esas mutaciones están autorizadas. No se conservan ensayos propios en tools/tests. La evidencia nueva se registra junto a la spec activa, separando ejecución y revisión estática; los resultados PowerShell históricos no validan los originales Bash.
