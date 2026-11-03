# Alinear el flujo de git

Issue: #737.

El flujo de git de esta app es el que tenga en este momento el
ejercicio del flujo de git. Una plantilla por tipo de cambio:
funcionalidad, arreglo, documentación, refactor, prueba o
mantenimiento. El título, el tipo y el nombre de la rama se leen en
esa plantilla. El enlace de la revisión deja la línea que cierra la
tarea. Quien escribe el enlace no cierra la tarea por su cuenta: se
cierra al fusionar en la rama por defecto.

Lo usa quien construye la app con IA.

Entra un cambio de esta app. Sale escrito, empezado y pedido para
revisión con ese flujo. El proceso SDD de esta app sigue igual: primero
la tarea, después la spec y el plan, una persona los revisa, después
las tareas, otra parada, y la implementación cuando esa persona lo
pide. El flujo de git no quita esas paradas.

Ejemplo: se pide un cambio de documentación. La tarea dice qué tiene
que quedar escrito, dónde y cómo se comprueba. La revisión usa la
plantilla de documentación y deja el cierre de la tarea. La spec y el
plan se paran a la espera de una persona, como hasta ahora.

No hay un fallo de la lista «Errores». Si queda una sola plantilla para
todos los cambios, si las instrucciones repiten el título, la lista de
tipos o el nombre de la rama, si el enlace no es el del ejercicio, o si
desaparece una parada del proceso SDD, el flujo no está alineado.

Queda fuera cambiar las reglas de negocio, la base de datos, los
clientes, los paquetes, el ejercicio del que se copia el flujo, el
proceso SDD de esta app y el contenido de las specs ya escritas.
