# Formato y comprobación del JavaScript de first-app-ai

Estado: aprobada por Miguel el 2026-10-27.
Tarea: [issue #496](https://github.com/venturars/neoland-102026/issues/496).

## Propósito y usuarios

Quien desarrolla o revisa la aplicación necesita dos comandos sencillos para dejar el JavaScript con un formato consistente y comprobar errores antes de dar una tarea por terminada.

El resultado debe seguir lo solicitado por Ventura para formato y lint, conservando los contratos y las decisiones propias ya aprobadas.

## Entrada y resultado

Entra el JavaScript propio de first-app-ai. Quedan fuera el código de dependencias instaladas, entornos generados y otros proyectos.

- `pnpm format` ejecuta Prettier y aplica su formato estándar: comillas dobles, punto y coma, coma final, indentación de dos espacios y ancho de 80. No hay configuración propia de Prettier.
- `pnpm lint` ejecuta ESLint y comunica los errores de código y sintaxis que comprueba. Es una comprobación, no una reescritura del código. Si detecta un error, el comando termina con error; para el código entregado debe terminar sin errores.
- Al terminar una tarea, el procedimiento exige ejecutar ambos comandos y atender sus fallos antes de darla por terminada.

El formato puede cambiar la presentación del JavaScript existente, pero no sus resultados, validaciones, orden de comprobaciones, mensajes ni efectos sobre los datos. No separa las acciones de una línea para adaptar el código antiguo a la guía de estilo; ese trabajo pertenece a otra tarea. Una comprobación de lint satisfactoria no acredita por sí sola todas las reglas de estilo ni el comportamiento de las operaciones.

## Ejemplos y fallos visibles

1. Se termina un cambio JavaScript. Se ejecuta `pnpm format`; el código queda con el formato estándar. Después se ejecuta `pnpm lint`; si no detecta errores, termina correctamente.
2. En una copia desechable se introduce un error de sintaxis en un archivo JavaScript propio. `pnpm lint` lo comunica y termina con error. La copia se retira después de comprobarlo.
3. Se ejecuta el formato y la comprobación sobre la app: sus archivos Python, SQL, notebooks, ejemplos de terminal y datos permanecen sin cambios.

Si un comando no puede ejecutarse o falla, su fallo debe ser visible y no se declara terminada la tarea. Son fallos de las herramientas de desarrollo; no se añaden errores al contrato de las operaciones de contactos.

## Conservación y documentación

Se conservan los contratos públicos, el clasificador, los clientes y los requisitos existentes. La configuración de ESLint será sencilla y adecuada para el JavaScript de esta app; esta tarea no crea un sistema propio de análisis ni convierte la separación de acciones en un requisito de lint para el código antiguo.

Las instrucciones de trabajo recogen los dos comandos y su uso al finalizar una tarea. Cuando se añadan archivos, el árbol y la descripción de sus responsabilidades se actualizan en este mismo desarrollo.

Se mantienen las aprobaciones separadas de spec, plan y tareas y las reglas de paquetes vigentes: versiones exactas y revisión Socket antes de aprobar el plan e instalar paquetes. Esta spec no elige versiones ni autoriza instalaciones; el plan presentará la propuesta y los resultados de esa revisión, incluida cualquier cobertura limitada.

## Criterios de finalización

La tarea está completa cuando ambos comandos ejecutan las herramientas previstas sobre el JavaScript propio de la app, el formato coincide con el estándar, lint termina sin errores para la entrega y detecta el error de sintaxis de la copia desechable. También deben estar actualizadas las instrucciones, el árbol y las responsabilidades afectadas.

La revisión debe confirmar que el JavaScript existente de la aplicación solo recibe cambios de formato. Se permite añadir la configuración mínima necesaria para las herramientas de desarrollo, sin configuración propia de Prettier. Se mantienen los contratos; SQL, datos, Python, notebooks y ejemplos de terminal permanecen intactos. Las comprobaciones y resultados reales se registrarán en las tareas.

## Fuera de alcance

- Añadir funcionalidades o cambiar reglas de negocio, resultados, mensajes, SQL o datos.
- Reescribir el código antiguo para separar acciones, introducir ayudas genéricas o cambiar la arquitectura.
- Formatear Python, SQL, notebooks, ejemplos de terminal, documentación, dependencias instaladas o archivos de otros proyectos.
- Añadir una configuración propia de Prettier, un analizador propio, automatizaciones de CI o hooks de Git.
- Modificar specs históricas o aprovechar la instalación para actualizar paquetes ajenos a esta tarea.

## Preguntas pendientes

Ninguna decisión de alcance pendiente. El plan definirá los archivos afectados, los comandos concretos, la configuración mínima de ESLint, las versiones propuestas y su revisión Socket.
