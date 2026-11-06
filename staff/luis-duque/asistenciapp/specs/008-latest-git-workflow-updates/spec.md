# Spec 008 · Lo último del flujo de git

Estado: aceptada el 2026-11-06. Plan aceptado el 2026-11-06. Tareas ejecutadas.
Issue: #1163.
Ámbito: first-app y asistenciapp. Una sola issue.

## 1. Problema

Quien pide un cambio en first-app o en asistenciapp usa el flujo de git de cada app. Ese flujo ya está y cada app tiene ajustes pequeños propios. Falta recoger solo lo último del curso, el mismo en las dos apps, sin sustituir lo que ya se adaptó.

## 2. Usuarios

- Quien pide un cambio: quiere abrir la petición en borrador, asignada a sí, y pedir revisión con nombres de compañeros, como ahora se hace en el curso.
- Quien aprueba: quiere que las paradas de spec, plan, tareas e implementación sigan.
- Quien pasa lista: no nota ningún cambio.
- Quien lista usuarios: no nota ningún cambio.

## 3. Historias de usuario

- HU-01: Como quien empieza un cambio, quiero que la petición nazca en borrador y quede asignada a mí en un solo paso.
- HU-02: Como quien pide revisión, quiero reutilizar los nombres ya resueltos y no inventar un login.
- HU-03: Como quien deja escrito lo aprendido, quiero un tipo de tarea con su plantilla de issue y de petición.
- HU-04: Como quien guarda un trozo, quiero poder usar ese tipo en el mensaje y el detalle de ese commit.
- HU-05: Como quien piensa una tarea, quiero las preguntas que hagan falta de una vez, cada una con una respuesta recomendada. Si ya está claro, quiero dejarla escrita sin otra entrevista.
- HU-06: Como quien ya adaptó el flujo, quiero que esos textos se queden.
- HU-07: Como quien pasa lista o lista usuarios, quiero que la aplicación siga igual.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dado un cambio que empieza, cuando se abre la petición, entonces nace en borrador y queda asignada a quien la abre, en un solo paso, en first-app y en asistenciapp.
- CA-02 (HU-02): Dados nombres de compañeros al pedir revisión, cuando ya se resolvieron, entonces se piden esas revisiones. Si un nombre no está claro, se pregunta y no se asigna un login inventado.
- CA-03 (HU-03): Dado el flujo de cada app, cuando se mira, entonces hay un tipo para dejar escrito lo aprendido, con plantilla de issue y de petición.
- CA-04 (HU-04): Dado un trozo a guardar, cuando se escribe el mensaje, entonces cabe ese tipo y el detalle de ese commit.
- CA-05 (HU-05): Dada una tarea a pensar, cuando faltan datos, entonces las preguntas salen de una vez con una respuesta recomendada y se espera. Si el problema, el resultado, el alcance y cómo comprobarlo ya están claros, se deja escrita sin otra entrevista.
- CA-06 (HU-06): Dados los textos que ya decían que un pedido entra por el flujo y que hay paradas, cuando se aplica este cambio, entonces siguen. No se sustituye el flujo entero.
- CA-07 (HU-07): Dado el paso de lista y el listado de usuarios, cuando se aplica este cambio, entonces el comportamiento de la aplicación no cambia.

## 5. Fuera de alcance

- Sustituir el flujo entero por una copia del curso.
- Reescribir los ajustes pequeños que ya tiene cada app.
- Cambiar lo que hace first-app con los usuarios.
- Cambiar lo que hace asistenciapp al pasar lista.
- El cliente HTTP de Node de first-app.
- Un paquete nuevo y un mensaje nuevo de la aplicación.

## 6. Preguntas abiertas

Ninguna.
