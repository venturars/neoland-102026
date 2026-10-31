# Flujo de git del curso

Issue: #586.

## Qué se pide

Que una tarea de `first-app` siga el flujo de git del curso: pensarla, dejarla escrita en una issue, empezarla en una rama que sale de `staging`, guardarla por trozos y pedir que la revisen con una pull request.

Hoy `AGENTS.md` manda abrir `docs/GIT-WORKFLOW.md` y `docs/skills/create-issue/SKILL.md`. Esos ficheros ya no existen. El flujo que queda escrito apunta a nada.

## A quién obliga

A las personas y agentes que trabajan en `first-app`.

## La regla

- Un cambio empieza por el orquestador `agents/git-workflow-agent.md`. Él elige el momento y llama al subagente o a la skill que toca.
- La issue lleva el título en inglés, con menos de 72 caracteres, y el cuerpo en español con «Qué hay que hacer» y «Cómo probarlo». Se asigna a quien está autenticado.
- La rama se llama `número-tipo-descripcion` y sale de `staging` ya adelantado.
- El primer commit está vacío y es `chore: open #N`. Después se sube la rama y se abre la pull request en draft contra `staging`.
- La pull request se enlaza con la issue con `Related to #N` y en Development. Enlazar no cierra la issue.
- Guardar un trozo es un commit pequeño con los ficheros nombrados, sin `git add -A`, y un push sin force.
- Para pedir revisión, la persona responsable nombra a los revisores y la pull request sale de draft.
- Las paradas de `first-app` siguen. No se toca código hasta que existe `docs/specs/<nombre>/` y la persona responsable confirma que la revisión está hecha. El flujo de git no las quita.
- El flujo no hace merge a `staging`.

## Ejemplo correcto

La persona responsable pide un cambio. Queda escrita una issue con qué hay que hacer y cómo probarlo. La rama nueva sale de `staging` y lleva el número de la issue. Se abre la pull request en draft y queda enlazada. Se escribe la spec y la persona responsable la revisa. Cada trozo entra como un commit pequeño. Al final la persona responsable nombra a dos revisores y la pull request sale de draft. La issue sigue abierta.

## Ejemplo que no se sigue

La rama sale de otra rama que no es `staging`. El enlace con la issue la cierra al fusionar. Se hace `git add -A` o un push con force. Se pide revisión sin nombrar revisores. `AGENTS.md` sigue apuntando a ficheros que no existen.

## Cómo se comprueba

- `tools/check-status.sh` termina bien y escribe el repositorio, la rama y el remoto.
- Todos los comandos de las skills apuntan a los scripts de `tools/` de esta aplicación, con su ruta desde la raíz del repositorio, y esos scripts existen y se pueden ejecutar.
- Ninguna ruta de `AGENTS.md` apunta a un fichero que no existe.
- `docs/TREE.md` y `docs/ARCHITECTURE.md` describen lo que hay en la carpeta.
- `logic/`, `queries/`, `db/`, `clients/` y `package.json` no cambian.

## Queda fuera

Cambiar las reglas de negocio, la base de datos, los clientes y los paquetes. Tampoco se tocan `scripts/new-issue.sh` de la raíz del repositorio, el `AGENTS.md` de `asistenciapp` ni las specs ya escritas.
