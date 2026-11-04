Issue: #1011

# Sincronizar el flujo de Git con el template

Estado: borrador para revisión. La implementación todavía no está autorizada.

## Qué se pide y por qué

Traer a `first-app` todas las novedades del template del flujo de Git del curso. El template ha cambiado desde la última actualización y esta app sigue con instrucciones anteriores. Mientras no se pongan al día, quien trabaja aquí sigue un flujo distinto al del curso.

## A quién obliga

A las personas y agentes que trabajan en `first-app` cuando usan el flujo de Git. Quien usa la app no ve ningún cambio.

## La regla

Después de la sincronización, el flujo funciona así:

- El orquestador elige el momento según el estado real de la tarea, no según cómo esté escrita la petición.
- Si el problema, el resultado, el alcance y la comprobación están claros y son coherentes con el proyecto, la issue se crea y se explica brevemente por qué. Si quedan dudas o contradicciones, primero se entrevista a la persona.
- Una entrevista ya resuelta no se repite, salvo que haya cambios o decisiones nuevas.
- Cada entrevista puede hacer varias preguntas por ronda. Después se para hasta recibir las respuestas.
- Los cambios en un proyecto se hacen desde una rama nueva y una pull request nueva en draft.
- La pull request se crea en draft y asignada a la cuenta autenticada en una sola operación.
- El orquestador confirma que cada paso ha ido bien antes de pasar al siguiente. Si uno falla, comunica el error y continúa cuando se resuelva.
- El mensaje de un commit nombra el fichero o la función y el cambio, en una sola línea. El commit vacío de apertura no cambia.

Las rutas adaptadas a esta app se conservan: la sincronización no vuelve a las rutas genéricas del template. Las paradas SDD de esta app también se conservan.

## Ejemplo correcto

La persona responsable pide una tarea clara. El agente crea la issue y explica por qué no hace falta entrevista. Abre la rama desde `staging`, sube el commit vacío y crea la pull request de una vez, ya en draft y asignada. Después la enlaza con la issue y prepara los documentos SDD.

## Ejemplo que no se sigue

El agente hace una sola pregunta y sigue sin esperar la respuesta, crea la pull request en varios pasos, o llama a un script con la ruta genérica del template y falla. También falla empezar a implementar solo porque la pull request ya existe.

## Cómo se comprueba

- Al comparar el flujo de la app con el template, solo quedan las rutas adaptadas y las decisiones aprobadas en el plan.
- Todos los scripts del flujo tienen una sintaxis válida y permiso de ejecución.
- La comprobación de estado funciona desde la raíz del repositorio.
- Las guías describen el flujo nuevo y las paradas SDD siguen presentes.
- Los comandos de formato y comprobación del proyecto terminan bien.

## Queda fuera

Cambiar el código de la app, los clientes, la base de datos o los paquetes. Tampoco se modifica el template, ni la configuración personal de las herramientas, ni las specs históricas.
