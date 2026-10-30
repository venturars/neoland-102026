# Instrucciones para el agente

## Qué va primero

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta, aunque el mensaje no nombre ese fichero ni diga «issue». Esta sección va antes que el resto de este manual.

Una tarea es una issue, una rama desde `staging` y una pull request en draft hacia `staging`. El orquestador elige el momento y llama al subagente o a la skill que toca.

Ese flujo no quita las paradas de este manual. Antes de crear la issue se enseñan la persona asignada y el título, y se espera el sí. No se toca código hasta que existe `docs/specs/<nombre>/` y María dice de forma explícita que la revisión está hecha.

Nombrar el fichero de destino no autoriza a editarlo. Un mensaje que a la vez describe la tarea y pide escribir ficheros cabe en dos momentos: se pregunta cuál es y se espera. No se elige editar.

El orden es: issue, después la rama, después la pull request en draft, y en esa rama la spec y este manual. La issue no sustituye a la spec de la app. La spec de la app no sustituye a la issue.

## Fuente de verdad

Lee completamente `docs/CONSTITUTION.md` antes de modificar código.

Esa guía enlaza a la arquitectura, el árbol, la base de datos, los errores y el estilo.

Respeta el árbol, el flujo y las responsabilidades definidos en esas guías. No los repitas ni los redefinas en otros documentos.

Si el código contradice esas guías, explica la contradicción y espera una decisión antes de programar.

## Antes de editar

Cuando el pedido sea una funcionalidad o una forma de trabajar, crea primero `docs/specs/<nombre-en-kebab-case>/` con `spec.md`, `plan.md` y `tasks.md`. No toques código, consultas, clientes ni la constitución hasta que esa carpeta exista y María diga de forma explícita que la revisión está hecha.

Una petición de explicación, revisión, comparación o planificación no autoriza cambios. Crear o reescribir esos tres ficheros tampoco autoriza cambios de código.

Cuando la revisión esté hecha, implementa solo ese pedido:

1. Inspecciona los archivos relacionados.
2. Sigue `tasks.md` de esa carpeta, en orden.
3. Trabaja un solo pedido a la vez.

Si un desarrollo añade o quita un fichero, su spec también actualiza `docs/TREE.md` y `docs/ARCHITECTURE.md`.

La forma de cada línea se copia de `docs/STYLE.md`. El código que ya existe sirve para ver a qué fichero se parece una función nueva. Esta issue no lo reescribe. Un desarrollo posterior puede alinearlo. Mientras tanto, un spec nuevo no se para por esa diferencia.

## Forma de trabajar

- Trabaja en pasos pequeños.
- Implementa una sola funcionalidad cada vez.
- No añadas funcionalidades no solicitadas.
- No refactorices archivos no relacionados.
- No cambies contratos existentes silenciosamente.
- No añadas dependencias sin explicar su necesidad.
- Antes de aceptar un plan que añade un paquete de Node o cambia su versión, valida ese paquete con Socket, como dice «Paquetes» en `docs/CONSTITUTION.md`.
- No hagas `commit`, `push`, merge ni pull request sin autorización.
- Si hay varias soluciones razonables, presenta primero las opciones.

Las reglas de este documento se aplican al código nuevo y a las partes que se modifiquen dentro de una tarea autorizada. No refactorices una funcionalidad antigua únicamente para adaptarla a una convención añadida después de su creación.

## Dónde están las reglas

Este manual dice cómo se trabaja una tarea. Las reglas del código están en las guías:

- `docs/STYLE.md`: nivel del código, estilo y comentarios educativos.
- `docs/DATABASE.md`: tipos y formatos de `id`, `name`, `email`, `created_at` y `updated_at`.
- `docs/CONSTITUTION.md`: validación de paquetes con Socket, contrato de las funciones (firma, actualización parcial y respuesta), reglas de implementación, seguridad y sincronización de la documentación.

Se leen antes de escribir código. Si cambian los tipos o las reglas de un campo, se actualiza `docs/DATABASE.md`.

## Al terminar una tarea

- Ejecuta `pnpm format` desde `first-app` para aplicar el formato estándar de Prettier.
- Ejecuta `pnpm lint` desde `first-app` para comprobar la sintaxis y las reglas de ESLint.
- Si alguno de los dos comandos falla, la tarea todavía no está terminada.

## Verificación

Para comprobar una funcionalidad:

1. Revisa la sintaxis.
2. Ejecuta su cliente de terminal.
3. Prueba un caso correcto.
4. Prueba al menos un caso incorrecto.
5. Utiliza una copia temporal cuando sea posible.
6. Comprueba que no se modificaron archivos no relacionados.
7. Comprueba si `docs/CONSTITUTION.md` necesita actualizarse.

Al finalizar, informa:

- qué archivos cambiaron;
- qué hace cada cambio;
- qué se comprobó;
- cuál fue el resultado;
- si se actualizó la Constitución;
- qué quedó pendiente.

No afirmes que algo funciona si no se ha comprobado.
