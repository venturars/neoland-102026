# Guías SDD separadas por tema

Issue: #416.

## Qué se pide

Quien construye la app con IA lee cada tema en su propio sitio. La arquitectura, el árbol, la base de datos con las queries, los errores y el estilo ya no comparten un solo documento largo.

Entra lo que hoy está repartido entre la constitución y las reglas de estilo del agente, más la regla acordada de escribir el código nuevo de forma legible para juniors: una acción por línea, estilo hecho a mano, paradigma funcional.

La constitución conserva el flujo SDD, que logic no se reemplaza y el contrato de un fichero de logic. Los nombres de función que aparecen ahí como ejemplo no son una lista que haya que ampliar en cada funcionalidad nueva.

Los errores siguen siendo clases; la única excepción a «no hay clases» en el resto del código. Pueden añadirse más clases de error en el mismo fichero que ya las define. Cómo usarlas se documenta en la guía de errores, no en la de estilo.

Si un desarrollo añade o quita un fichero del proyecto, también actualiza el árbol y la arquitectura. La forma de una línea nueva se copia de la guía de estilo. El código que ya existe sirve para ver a qué función se parece una nueva. Un desarrollo nuevo no se para porque el código viejo junte varias acciones en una línea.

## Quién lo usa

Quien escribe un desarrollo con IA, quien comprueba que cabe en las guías y quien lee la constitución antes de tocar código.

## Entrada

La documentación base actual de first-app: constitución, reglas del agente y el código tal como está (sin reescribirlo).

## Salida

Cinco guías por tema, más constitución y agente actualizados:

- Arquitectura por capas y responsabilidad de cada fichero relevante, con los nombres reales del proyecto.
- Árbol que solo lista carpetas y ficheros, incluidas las guías nuevas.
- Base de datos y queries en un solo sitio.
- Errores con el mismo significado que antes; el fichero de clases de error no cambia.
- Estilo con las convenciones ya acordadas, la regla de una acción por línea y la excepción de las clases de error.

La constitución enlaza a esas guías y deja de repetir su contenido. El agente apunta a las guías y deja de duplicar el estilo.

Ejemplo: alguien busca cómo se valida un email antes de crear un usuario. Lee la guía de errores para los mensajes y el estilo para cómo escribir las comprobaciones; no abre un único documento que mezcle árbol, SQL y convenciones.

## Fallo

No hay un fallo de la lista «Errores».

Si un tema sigue escrito en dos guías, la separación no está hecha. Si falta alguna de las cinco guías o la constitución no enlaza a todas, el desarrollo no está hecho.

## Fuera

- Reescribir JavaScript, SQL, clientes ni `package.json`.
- Cambiar los cuatro pasos de un fichero de logic.
- Cambiar las specs ya escritas en `docs/specs/` (salvo esta).
- Alinear el código existente con la regla de una acción por línea.
- Cambiar las reglas de paquetes ni otras tareas ya definidas en issues distintas.
