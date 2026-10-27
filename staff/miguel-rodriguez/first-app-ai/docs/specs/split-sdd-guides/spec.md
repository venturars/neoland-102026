# Guías de la aplicación separadas por responsabilidad

Estado: aprobada por Miguel el 2026-10-27.
Tarea: [issue #475](https://github.com/venturars/neoland-102026/issues/475).

## Propósito y usuarios

Quien desarrolla o revisa first-app-ai necesita encontrar cada regla en un sitio claro, sin buscarla entre contratos, instrucciones de trabajo y explicaciones del almacenamiento.

La documentación debe describir nuestra aplicación, incluidos sus clientes de terminal y Jupyter, y orientar los próximos cambios con un estilo sencillo que un alumno pueda leer y explicar.

## Entrada y resultado

Entran las instrucciones actuales de la aplicación, sus contratos y las reglas de estilo acordadas. Salen cinco guías con responsabilidades distintas:

| Guía | Contenido |
| --- | --- |
| Arquitectura | Responsabilidad de cada capa y archivo relevante; relación entre almacenamiento, operaciones, clientes y arranque. |
| Árbol | Carpetas y archivos, sin explicaciones de responsabilidades. |
| Base de datos | Esquema, conexión, inicialización y consultas existentes, con sus resultados y efectos sobre los datos. |
| Errores | Mensajes exactos y condiciones actuales, distinguiendo validación, reglas de negocio y fallos de consulta. |
| Estilo | Convenciones de nombres, forma de escribir los pasos y formato del código nuevo. |

La constitución conserva los principios, los contratos públicos y de las operaciones, el proceso SDD y las reglas de paquetes. Mantiene el orden de validar entrada, comprobar reglas de negocio, aplicar la operación y estructurar la salida. Enlaza las guías sin repetir los temas trasladados.

El manual del agente conserva el procedimiento de trabajo, la verificación, las aprobaciones y el procedimiento Socket. Remite a la guía de estilo para las convenciones de escritura. Cada tema tiene una fuente principal; las otras guías lo enlazan cuando necesitan referirse a él. Las referencias y los ejemplos breves no sustituyen ni duplican la definición completa de otra guía.

## Estilo para los próximos cambios

- Una operación pública de negocio por archivo, mediante funciones, sin clases propias ni uso de this para organizar el negocio. Se conservan los registros de datos ordinarios y el uso de las bibliotecas existentes.
- Pasos explícitos, una acción por línea y nombres que expliquen lo que se obtiene o comprueba. Leer un valor y transformarlo son pasos distintos. La condición de un error y el lanzamiento del mensaje se escriben por separado.
- Convenciones existentes de nombres e importaciones, con constantes de configuración en mayúsculas. Sin envoltorios de resultados, clases de error propias, ayudas genéricas ni capas que oculten una operación sencilla.
- Formato estándar de Prettier: comillas dobles, punto y coma, coma final, dos espacios y ancho de 80. El formato no reemplaza la separación de pasos ni implica instalar herramientas en esta tarea.

Estas reglas describen cómo escribir el código nuevo. Las guías no afirman que el código anterior ya las cumpla.

## Ejemplos y mantenimiento

- Para saber cómo se guarda un contacto se consulta la guía de base de datos. Para saber qué parte decide si su email puede utilizarse se consulta la arquitectura y el contrato de la operación.
- Para comprobar un fallo se consulta su mensaje y condición en la guía de errores; el manual remite a ella en lugar de mantener otra lista.
- Al añadir o quitar un archivo en un desarrollo posterior, se actualizan también el árbol y las responsabilidades afectadas dentro de ese desarrollo.
- El código existente ayuda a reconocer una operación parecida. La guía de estilo determina la forma del código nuevo. Una diferencia de estilo del código antiguo no bloquea un nuevo desarrollo; una contradicción de comportamiento o de instrucciones sigue requiriendo una decisión.

## Conservación y comprobación

Los contratos actuales se conservan: entradas, salidas, validaciones, orden de las comprobaciones, mensajes, fechas y efectos sobre los datos. Se mantienen las decisiones propias aprobadas, incluido el comportamiento del clasificador, los clientes y sus requisitos.

Las reglas Socket, su decisión sobre cobertura limitada de campañas y las aprobaciones separadas de spec, plan y tareas permanecen vigentes. La separación de guías no modifica esos procedimientos ni atribuye nuevas aprobaciones.

La tarea está completa cuando se puede localizar cada tema en su guía, los enlaces llevan a su fuente, el árbol y las responsabilidades corresponden a nuestra app y los contratos trasladados conservan su significado. Una regla perdida, duplicada o contradictoria, un enlace roto o una guía que describe cambios aún no hechos impide darla por terminada. No se añaden mensajes de error a la aplicación por esta tarea.

## Fuera de alcance

- Cambiar código, consultas, datos, esquema, conexiones, resultados o contratos de la aplicación.
- Refactorizar el código existente para aplicar el estilo nuevo.
- Instalar o configurar herramientas de formato o lint, añadir comandos o cambiar dependencias.
- Modificar specs históricas, copiar los documentos de Ventura o cambiar otros proyectos, incluida AsistenciApp.
- Crear una arquitectura nueva, capas adicionales o un sistema de documentación más complejo que las cinco guías solicitadas.

## Preguntas pendientes

Ninguna decisión de alcance pendiente. El plan definirá los archivos y el traslado concreto de cada contenido, conservando las reglas y contratos indicados.
