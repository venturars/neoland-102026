# Validar paquetes nuevos y cambios de versión con Socket

Estado: spec aprobada por Miguel el 2026-10-27.
Tarea: [issue #435](https://github.com/venturars/neoland-102026/issues/435).

## Propósito y usuarios

Quien propone añadir un paquete de Node o cambiar su versión necesita conocer los avisos de Socket antes de aprobar el plan. La persona que revisa el plan recibe un resumen y decide si acepta los riesgos o la información que falta.

La constitución establece que se usa Socket para esta validación. Las instrucciones de trabajo explican cómo realizarla y presentar sus resultados.

## Entrada y resultado

Entran el nombre y la versión exacta de cada paquete propuesto. Se revisan tres capas en total: la primera es el paquete propuesto; la segunda, sus dependencias directas; la tercera, las dependencias de esas dependencias. Todas se revisan con los mismos criterios.

Antes de aprobar el plan, queda en él un resumen que identifica cada paquete y versión revisados e indica:

- Si esa versión está afectada por una campaña.
- Las alertas encontradas y lo que significan.
- Las estadísticas disponibles de Socket y cuáles están por debajo de 50 puntos sobre 100.
- Qué comprobaciones no pudieron realizarse y por qué.

El resumen distingue entre un aviso encontrado, una comprobación completada sin avisos y una comprobación sin información suficiente. La falta de acceso, de resultados o de cobertura no se presenta como ausencia de riesgos. Una puntuación no sustituye la comprobación de alertas o campañas.

Quien revisa el plan decide sobre los avisos y las comprobaciones incompletas. Su decisión queda registrada antes de continuar con la incorporación del paquete. El agente no acepta esos riesgos por su cuenta.

## Ejemplos

- Se propone un paquete en una versión concreta. Antes de aprobar el plan se presenta la revisión de las tres capas: el propio paquete, sus dependencias directas y las dependencias de estas.
- Una dependencia tiene una estadística de 49. El resumen la señala, aunque las demás superen 50. Una puntuación de 50 no está por debajo del umbral.
- Socket devuelve estadísticas, pero no permite comprobar las alertas de esa versión. El resumen indica esa limitación; no dice «sin alertas». La persona decide si acepta continuar con esa información incompleta.

## Fallos visibles y comprobación

Esta tarea establece reglas de trabajo; no añade errores a las operaciones de contactos.

La tarea no está completa si las instrucciones permiten aprobar el plan sin el resumen, omiten alguno de los tres criterios o alguna de las tres capas, convierten información desconocida en una revisión favorable, o dejan al agente decidir por la persona.

La revisión contrasta las comprobaciones descritas con las herramientas disponibles y deja constancia de su cobertura y sus limitaciones reales. No basta con que una herramienta aparezca instalada para dar por comprobado su funcionamiento.

## Fuera de alcance

- Instalar paquetes, cambiar versiones o modificar dependencias existentes como parte de esta tarea.
- Revisar paquetes cuya versión no cambia, paquetes ajenos a Node o dependencias más allá de la tercera capa, contando el paquete propuesto como la primera.
- Cambiar operaciones, datos, clientes o seguridad de la aplicación en ejecución.
- Crear un servicio de escaneo, automatizaciones de GitHub o una herramienta nueva de análisis.
- Reorganizar las otras guías de la aplicación o refactorizar código.

## Preguntas pendientes

Ninguna decisión de alcance pendiente. La cobertura efectiva de Socket se investigará al preparar el plan; cualquier limitación quedará explícita antes de aprobarlo.
