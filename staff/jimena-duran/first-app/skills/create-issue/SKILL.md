---
name: create-issue
description: Registra una tarea concreta de first-app en GitHub antes de preparar su spec, sin crear rama ni PR.
---

# Crear la issue

La ejecuta únicamente el subagente real `agents/create-issue.md` cuando el orquestador le encarga dejar la tarea escrita. Usa lo pedido por Jimena, sin añadir funcionalidades.

1. Descubre las herramientas GitHub disponibles. Comprueba identidad y acceso al repositorio con una lectura: la cuenta de Jimena es `jiji-mena`. Prefiere MCP si coincide esa identidad y permite completar el paso. Si no, informa del motivo y usa `gh` autenticado como Jimena. En Windows el almacén de credenciales puede exigir permisos fuera del sandbox; informa del fallo antes de intentar solucionarlo. No muestres tokens.
2. Busca issues existentes por título y contexto, incluidas las cerradas si parece una reanudación. Si existe la misma tarea, devuelve su número y URL; no dupliques. No reutilices una coincidencia dudosa sin consultarlo.
3. Rellena `templates/issues/basic_issue.md`: título en inglés de menos de 72 caracteres; cuerpo en español con «Qué hay que hacer» y «Cómo probarlo». La comprobación se deduce de la tarea solicitada.
4. Crea la issue asignada a `jiji-mena` mediante el MCP comprobado. Alternativa en PowerShell, desde la raíz del repositorio: `gh issue create --repo $repository --title $title --body-file $bodyPath --assignee jiji-mena`. Escribe el cuerpo exacto en un archivo temporal UTF-8 y elimina únicamente ese archivo al acabar; no interpolar el cuerpo como código de shell. Comprueba `$LASTEXITCODE` y la respuesta.
5. Ante error o respuesta incierta, consulta el estado remoto antes de reintentar o cambiar a gh según [la regla común](../../docs/GIT-AUTOMATION.md#consultar-el-estado-remoto-antes-de-reintentar): busca la tarea, incluidas las cerradas, y verifica sus datos. Si ya se creó, reutilízala; si se confirma que no se creó, reintenta solo el paso autorizado; si no puede determinarse, detente e informa. Un 401 de gh dentro del sandbox puede deberse al acceso al almacén de Windows; compruébalo con los permisos necesarios antes de declarar inválida la credencial.
6. Devuelve número, título, asignación y URL reales. No inventes una issue ni sigas con un resultado incierto.

No prepares `docs/specs/<nombre>/` antes de obtener el número. Esta skill no escribe spec, plan ni tareas, no ejecuta Git y no abre PR. El proceso siguiente escribe `spec.md` comenzando por `Issue: #N` y `plan.md`, y se detiene para revisión; tras su aprobación se preparan tareas y se vuelve a detener antes de implementar.

En los comandos, `$repository` es el repositorio `owner/name` comprobado a partir de origin y del contexto de esta tarea. No lo tomes de un nombre personal fijo ni actúes sobre otro repositorio.
