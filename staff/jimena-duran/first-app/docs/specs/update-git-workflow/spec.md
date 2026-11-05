Issue: #1015

# Actualización del flujo de trabajo Git

Quien trabaja en first-app necesita que el flujo coordine las etapas según
el estado real de la tarea, sin repetir decisiones resueltas.

Si el problema, el resultado esperado, el alcance y la comprobación están
claros y son coherentes con el proyecto, se crea la issue y se explica
brevemente la decisión. Si quedan dudas o contradicciones, se entrevista
antes de escribirla. Una entrevista resuelta solo se retoma cuando hay
cambios o decisiones nuevas.

La entrevista devuelve las preguntas necesarias, cada una con una respuesta
recomendada, y se detiene hasta recibir las respuestas. Conserva el historial
completo al continuar con otro agente. Cuando no quedan dudas, devuelve un
resumen de lo que hay que hacer y cómo comprobarlo.

Con la issue escrita y cambios por realizar, se prepara una rama nueva desde
staging antes de editar. Cada paso debe terminar correctamente antes del
siguiente; los fallos se comunican y el proceso continúa al resolverse.

Los mensajes de commit indican el archivo o la función y el cambio, en una
sola línea. El commit vacío de apertura conserva su formato actual.

Una PR nueva se abre con una sola invocación que establece staging como
base, draft y asignación al usuario autenticado. Su cuerpo se entrega mediante
un archivo temporal. Si ya hay una PR de esa rama hacia staging, se reutiliza:
se actualizan cuerpo, asignación y draft conservando el vínculo con la issue.
El orquestador sigue siendo responsable del enlace.

Se conservan la organización, los nombres y las partes que ya coinciden.
La ejecución utiliza Windows con Git Bash y las rutas de first-app.
La guía de uso, el árbol y la arquitectura describen el flujo actualizado.

Las pausas SDD siguen vigentes: spec y plan requieren revisión humana; las
tareas requieren otra revisión; implementar exige autorización posterior.
Implementar tampoco autoriza por sí solo commit, push, PR ni merge.

Quedan fuera cambios de aplicación o clientes, dependencias nuevas,
reestructuración, renombrado, configuración de cuentas o credenciales y
ensayos que muten repositorios. Los fallos de herramientas se comunican tal
como se reciben; no se inventan mensajes de negocio.

