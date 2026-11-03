# Flujo de Git en AsistenciApp

El punto de entrada es [AGENTS.md](../AGENTS.md) y el orquestador está en [agents/git-workflow-agent.md](../agents/git-workflow-agent.md). El SDD local de AsistenciApp prevalece sobre cualquier indicación del template de continuar automáticamente. Se mantienen sus cinco momentos, sin permisos intermedios entre spec, plan y tasks.

## Fuente y ejecución en Windows

La copia procede de `exercises/git-workflow-agent-template` en `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`. Los siete scripts son los originales, sin traducción ni cambios de código. Git Bash ya está instalado; no se necesita instalarlo ni cambiar PowerShell.

Desde Git Bash, en la raíz Git, y solo para la operación solicitada:

```bash
./staff/jimena-duran/asistenciapp/tools/check-status.sh
./staff/jimena-duran/asistenciapp/tools/pull-changes.sh
./staff/jimena-duran/asistenciapp/tools/create-branch-from-staging.sh NUMERO TIPO DESCRIPCION
./staff/jimena-duran/asistenciapp/tools/create-branch.sh BASE NUMERO TIPO DESCRIPCION
./staff/jimena-duran/asistenciapp/tools/create-empty-commit.sh NUMERO
./staff/jimena-duran/asistenciapp/tools/commit-changes.sh "tipo: description" "ruta/al/archivo"
./staff/jimena-duran/asistenciapp/tools/launch-push.sh
```

También puede invocarse el intérprete como `bash ruta/al/script.sh`. Las rutas de archivos del commit parten de la raíz Git; cada archivo es un argumento. Las siete skills de terminal contienen la ruta de esta aplicación. Los parámetros y resultados son los del original; no existen `-ExpectedBranch`, `-Paths` ni un nombre de rama explícito añadido por esta copia.

Las doce plantillas originales definen forma y reglas editoriales. Agentes y skills seleccionan la del tipo o la más cercana, como indica la fuente.

## SDD y acceso remoto

Las cinco decisiones humanas están en AGENTS y §4 de la constitución. Una indicación del template de continuar sin esperar no autoriza encadenar momentos ni publicar durante la implementación. Los permisos y prohibiciones de la tarea concreta se conservan.

MCP es la vía de las skills originales cuando la identidad y las capacidades corresponden a la cuenta autorizada. gh autenticado es la alternativa si MCP no resulta suficiente; explicar el motivo y verificar identidad, repositorio y resultado. La skill original de enlace utiliza gh para Development y distingue ese enlace de `Closes #N`.

El fichero MCP y los enlaces de instalación de las skills son referencias. Esta integración no instala skills ni modifica tokens, headers, conexiones o configuración personal. OWNER y REPO se obtienen del repositorio comprobado, sin fijar una cuenta en los componentes.

## Límites de la copia original

Los scripts conservan exactamente su comportamiento de origen. Esta copia no añade los controles de las herramientas PowerShell retiradas. Se han señalado en el plan de la 008 cinco problemas también presentes en la fuente: directorios borrados, actualización de staging con referencias cambiantes, orden de revisores y draft, sincronización de borrados preparados y etiquetas implícitas al hacer push. No se corrigen localmente ni se afirma que estén cubiertos por garantías ausentes del original.

La sintaxis y los contratos se comprueban sobre copias desechables. Commits y push de ensayo requieren autorización limitada a repositorios temporales con remoto local y no autorizan escrituras en GitHub o publicaciones del repositorio de trabajo.

Los resultados nuevos se registran en `specs/008-flujo-git-cinco-momentos/verification-original-gitflow.md`. La evidencia anterior permanece intacta y no valida estos scripts.
