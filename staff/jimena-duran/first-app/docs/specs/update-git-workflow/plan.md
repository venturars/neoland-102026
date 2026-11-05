Issue: #1015

# Plan de actualización del flujo Git

## Alcance

Completar únicamente las diferencias pendientes del workflow local.
Se conserva la organización de siete agentes y quince skills, las doce
plantillas, los siete scripts existentes y sus rutas locales. Se incorpora
un octavo script. No hay funcionalidad de usuarios, firma ni SQL nuevos;
no cambia la aplicación, sus clientes, dependencias ni lockfile.

Los componentes del workflow se copian literalmente desde
`exercises/git-workflow-agent-template`, adaptando únicamente las rutas a
`staff/jimena-duran/first-app/`. Se conservan sus referencias originales y
las referencias y pausas SDD locales. No se parafrasean instrucciones ni
se incorporan reglas propias. Las coincidencias permanecen intactas.

## Archivos

Dentro de `staff/jimena-duran/first-app/` se actualizan:

- `agents/git-workflow-agent.md`
- `agents/help-me-to-think.md`
- `agents/create-pr.md`
- `skills/grill-me/SKILL.md`
- `skills/grill-with-docs/SKILL.md`
- `skills/commit-changes/SKILL.md`
- `skills/create-pr-base-staging/SKILL.md`
- `skills/create-draft/SKILL.md`
- `docs/GIT-AUTOMATION.md`
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

Se crea `tools/create-pr-base-staging.sh`. Son doce archivos operativos:
once actualizaciones y una incorporación. Esta etapa crea además únicamente
`docs/specs/update-git-workflow/spec.md` y `plan.md`.

## Coordinación y entrevistas

El orquestador selecciona la etapa por el estado real. Crea la issue cuando
problema, resultado, alcance y comprobación están claros y son coherentes;
entrevista si faltan decisiones o hay contradicciones. No repite entrevistas
resueltas salvo cambios o decisiones nuevas. Si cambia el agente, transmite
el historial completo de preguntas y respuestas.

Con issue escrita y cambios pendientes, el momento es Empezar: actualizar
staging y preparar rama nueva antes de editar. Se mantiene el orden del flujo
y se confirma el éxito de cada paso antes del siguiente. La llamada a
create-pr utiliza solo create-pr-base-staging; el orquestador conserva
el enlace de la issue.

help-me-to-think y ambas skills de entrevista permiten las preguntas
necesarias con recomendación, devuelven las preguntas al orquestador y
se detienen hasta recibir respuestas. El resumen final se entrega cuando
no quedan dudas. No se crean archivos de entrevistas.

La skill commit-changes exige descripción técnica en inglés de archivo
o función y cambio, en una línea. Se conserva `chore: open #N` para el
commit vacío y el comando local existente.

## Creación de PR

create-pr abre una PR nueva mediante una sola invocación que ya establece
base staging, draft y asignación al usuario autenticado. Devuelve título,
base, autor, asignación y URL. Ante una PR existente, conserva el enlace y
actualiza cuerpo, asignación mediante assign-author y draft mediante
create-draft. Esta última confirma o conserva draft y comunica si no existe.

La skill create-pr-base-staging pasa a utilizar:

```bash
bash ./staff/jimena-duran/first-app/tools/create-pr-base-staging.sh "[RAMA]" "[TITULO]" "[CUERPO]"
```

Se ejecuta desde la raíz Git en Git Bash, también invocable desde PowerShell
con Bash. CUERPO es una ruta a un archivo temporal con la plantilla local
rellenada en español y la sección Issue vacía para una PR nueva.
Se requiere GitHub CLI autenticado. No se instala ni configura durante esta tarea.

El nuevo script Bash mantiene nombre, organización y comportamiento:
`set -euo pipefail`, localización de la raíz Git, validación de tres
argumentos no vacíos y archivo de cuerpo legible. La operación final es:

```bash
gh pr create --base staging --head "$1" --title "$2" --body-file "$3" --draft --assignee "@me"
```

Si una herramienta falla, se comunica su salida sin inventar URL o estado.
La comprobación de PR existente pertenece al agente y su skill; el script
solo ejecuta la creación solicitada.

## Documentación y límites

GIT-AUTOMATION describe ocho scripts y ocho rutas de terminal, conservando
siete agentes y quince skills. Añade el comando con rama, título y ruta
al cuerpo; explica Git Bash, gh autenticado y creación conjunta.
TREE y ARCHITECTURE incorporan el octavo script y el comportamiento
de coordinación, entrevistas, commits y PR.

Se conserva el párrafo local que remite a AGENTS, constitución y guía.
Las pausas SDD y los permisos concretos de cada tarea prevalecen sobre
cualquier continuación automática. El momento Empezar incluye rama, commit
vacío de apertura, push y PR en draft; las pausas SDD se conservan y publicar
la implementación requiere autorización propia. AGENTS no necesita modificarse.

No se alteran las coincidencias, las plantillas ni los siete scripts
existentes. No se cambian nombres, rutas de otros proyectos, configuración
personal, MCP, credenciales ni dependencias.

## Comprobación

Revisar por lectura y contraste únicamente las diferencias descritas:
coordinación, continuidad de entrevistas, regla técnica de commit,
creación conjunta de PR y documentación. Confirmar rutas locales,
organización y pausas SDD. Ejecutar `bash -n` sobre el nuevo script.
No se crean PR ni se ejecutan ensayos mutantes para comprobar esta entrega.

## Revisión

Se entregan solo spec y plan para revisión humana.
No se preparan tareas ni se implementa antes de sus autorizaciones.

