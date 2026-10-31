# Actualizar el flujo de Git

Issue: #690.

Estado: borrador para revisión. La implementación todavía no está autorizada.

## Qué se pide

Poner al día la forma de trabajar con Git de `first-app` con las novedades del template del curso, conservando la adaptación que María ya hizo.

La adaptación inicial está terminada. Ahora faltan las plantillas por tipo de tarea y las nuevas instrucciones para crear ramas, enlazar issues y preparar la conexión de GitHub.

## A quién obliga

A María y al agente que trabaja con ella en `first-app`.

## La regla

- Cada issue y cada pull request usa la plantilla de su tipo: `feat`, `fix`, `docs`, `refactor`, `test` o `chore`. Si no hay una para el tipo pedido, se elige la más cercana.
- La forma del título y del cuerpo se consulta en esa plantilla. Las instrucciones generales no mantienen otra versión de esas reglas.
- Las rutas adaptadas a la copia de María siguen funcionando. La actualización no vuelve a las rutas genéricas del template.
- La pull request incluye `Closes #N` y queda enlazada con la issue. El agente no cierra la issue manualmente. La issue sigue abierta mientras el trabajo está en borrador.
- El cierre automático depende de fusionar en la rama predeterminada de GitHub. Si esa rama sigue siendo `main`, fusionar en `staging` no cierra la issue.
- Las instrucciones de la conexión de GitHub explican la configuración de Cursor que incorpora el template. Esta tarea actualiza esa documentación, sin cambiar la configuración personal ni las credenciales.
- Se conservan las paradas SDD de `first-app`: María revisa la spec, el plan y las tareas antes de autorizar la implementación.
- Las guías describen la organización real cuando termine la actualización.

## Ejemplo correcto

María pide una tarea de mantenimiento. La issue y su pull request usan la plantilla de `chore`. La rama parte de `staging`; la pull request queda en borrador, asignada y enlazada. María revisa los tres documentos antes de programar. El agente no cierra la issue por su cuenta.

## Ejemplo que no se sigue

Se sigue usando una plantilla básica retirada, una instrucción apunta fuera de la copia de María o el agente empieza a implementar solo porque ya existe la pull request. También falla prometer que fusionar en `staging` cerrará la issue cuando la rama predeterminada sigue siendo `main`.

## Cómo se comprueba

- Hay una plantilla de issue y otra de pull request para cada uno de los seis tipos, y las instrucciones vigentes las utilizan.
- La comprobación de estado muestra el repositorio, la rama y el remoto sin errores. Las instrucciones conservan las rutas locales necesarias.
- El enlace con la issue sigue la regla nueva y explica cuándo se produce el cierre, sin cerrar ninguna issue como prueba.
- La documentación de la conexión incluye la configuración prevista y ningún secreto real.
- La revisión confirma que las paradas SDD siguen presentes y que los comandos de formato y comprobación del proyecto terminan bien.

## Queda fuera

Crear el cliente web, añadir notas, cambiar las operaciones de usuarios, la base de datos o las dependencias, modificar AsistenciApp y rehacer la adaptación inicial. Tampoco se reescriben las especificaciones históricas ni se modifica la configuración personal de Cursor.
