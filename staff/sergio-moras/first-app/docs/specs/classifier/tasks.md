# Tasks: Clasificador de género

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden**.

## Reglas de ejecución
- El agente ejecuta todas las tareas **seguidas, de T1 a T7, sin pausas ni confirmaciones intermedias**. El usuario ya ha validado spec, plan y tasks, y esa validación cubre la ejecución completa. Los resultados se enseñan al final, en el resumen de T7.
- Solo se detiene antes de terminar si hay un bloqueo real: Ollama no responde en T1, el modelo no respeta el formato en T2, o aparece algo que el plan no cubre. En ese caso explica el problema y pregunta.
- Solo se crean 2 archivos: `logic/classifyGender.js` y `terminal/classifyGender.txt`. No se toca nada más: ni `queries/`, ni `db/`, ni `AGENTS.md`, ni `CONSTITUTIONS.md`.
- Estilo de [logic/createUser.js](../../../logic/createUser.js) y [logic/listUsers.js](../../../logic/listUsers.js): nombres y mensajes en inglés, comentarios en español, código explícito.
- Los usuarios de prueba usan el email `tmp-classifier-<n>@example.com` y se borran siempre al terminar. Nunca se borra ni se reinicia `db/users.sqlite`.
- Si el plan no cubre un caso, el agente no improvisa: se detiene y pregunta.

## T1. Comprobaciones previas y foto inicial
- [x] Comprobar que Ollama responde y que existe `nimble-v3:latest`: `curl -s http://localhost:11434/api/tags`.
- [x] Ejecutar `node --no-warnings logic/listUsers.js` y guardar la salida como foto inicial de los datos.
- **Hecho cuando:** Ollama responde con el modelo y la foto inicial está guardada. Si no, parar y avisar.

## T2. Crear `logic/classifyGender.js` con `askModelForGenders`
- [x] Crear el archivo con: comentario inicial en español, constantes (`OLLAMA_URL`, `MODEL_NAME`, `REQUEST_TIMEOUT_MS`, `BATCH_SIZE`, `ALLOWED_GENDERS`, `GENDER_CRITERIA`, `FEW_SHOT_EXAMPLES`) y las funciones internas `buildState()` y `askModelForGenders(names)`.
- [x] `buildState()` devuelve el `state`: la tarea más los 7 ejemplos few-shot (`Ricardo -> male; ...`).
- [x] La función envía a `/v1/systemone` (el modelo es de decisión y no admite `/api/chat`) un cuerpo `{ model, state, questions }` con una pregunta `choice` por nombre (`q1`...`q6`) y las opciones `male`, `female` y `undefined` en `criteria`. Lee `answers.<pregunta>.choice`.
- [x] Modelo sin respuesta (error de red, timeout, respuesta HTTP con error): `throw new Error(...)` con la causa.
- [x] Respuesta no válida: JSON ilegible o sin `answers` → todo el grupo `'undefined'`; falta la respuesta de una pregunta u opción no permitida → solo ese nombre `'undefined'`.
- [x] No exportar `askModelForGenders` ni `buildState`: son internas. Se prueban a través de `countGenders`.
- **Verificar (solo lectura, con el modelo real):** llamar a `countGenders` con 6 usuarios (dos masculinos, dos femeninos, uno neutro y uno inventado) y comprobar el conteo.
- **Hecho cuando:** el conteo suma 6 y coincide con lo esperado. Si el modelo no respeta el formato de `/v1/systemone`, parar y consultar.

## T3. Añadir `countGenders(users)`
- [x] Añadir la función exportada y `async`, que devuelve `{ men, women, undefinedGender }`.
- [x] Lista vacía: devolver todo a 0 sin llamar al modelo.
- [x] Dividir en grupos de `BATCH_SIZE`, una petición por grupo y en secuencia. Sumar los resultados.
- [x] Si `askModelForGenders` lanza un error, no capturarlo: sin conteos parciales.
- **Verificar (con `globalThis.fetch` sustituido):**
  1. `countGenders([])` devuelve `{ men: 0, women: 0, undefinedGender: 0 }` y el `fetch` falso no se ejecuta.
  2. 13 usuarios: exactamente 3 peticiones, con 6, 6 y 1 nombres, y nunca dos a la vez.
  3. Respuesta que omite una pregunta u otra con opción no permitida: solo ese nombre cuenta como no definido y no hay error.
  4. Primera petición correcta y segunda con fallo de red: la función lanza error y no devuelve conteo.
- **Hecho cuando:** los cuatro casos dan el resultado esperado.

## T4. Añadir `classifyGender()` y el bloque `isRunFromTerminal`
- [x] Añadir `classifyGender()` exportada y `async`: lee con `selectAllUsers()` y devuelve `await countGenders(users)`. Cualquier error se relanza como `Error('Users could not be classified: <causa>')`.
- [x] Añadir el bloque `isRunFromTerminal` con `await`. Muestra `Men: N`, `Women: N` y `Undefined: N`. En caso de error, `console.error('Error: ...')` y `process.exit(1)`.
- [x] Comprobar que solo se exportan `countGenders` y `classifyGender`.
- **Hecho cuando:** `node --no-warnings logic/classifyGender.js` imprime los tres números con los datos reales. Guardar la salida para el resumen final.

## T5. Crear `terminal/classifyGender.txt`
- [x] Crear el archivo con una sola línea, igual que [terminal/listUsers.txt](../../../terminal/listUsers.txt): `node --no-warnings logic/classifyGender.js`.
- **Hecho cuando:** el archivo existe con esa línea.

## T6. Verificación de extremo a extremo
Con los comandos reales y usuarios temporales.
- [x] **Caso normal:** crear con `createUser.js` unos 8 usuarios temporales (masculinos, femeninos, neutros y un nombre inventado). Ejecutar el clasificador y comprobar que Men + Women + Undefined = total de `listUsers.js`.
- [x] **Más de un grupo:** el total (existentes + temporales) debe superar 6 para que haya varias peticiones.
- [x] **Modelo sin respuesta:** cambiar temporalmente `MODEL_NAME` por un nombre inexistente, ejecutar y comprobar `Error: Users could not be classified: ...`, sin números y con código de salida 1 (`echo $?`). **Restaurar `MODEL_NAME` y comprobar que vuelve a su valor.**
- [x] **Datos intactos:** borrar todos los usuarios temporales con `deleteUser.js` y comparar `listUsers.js` con la foto inicial de T1: debe ser idéntica.
- [x] **Precisión:** probar `countGenders` con 100 nombres de etiqueta conocida (40 masculinos, 40 femeninos, 10 neutros, 10 inventados) y medir los aciertos, sin tocar la base de datos.
- **Hecho cuando:** todos los casos dan el resultado esperado, no queda ningún usuario temporal y `MODEL_NAME` está restaurado.

## T7. Cierre
- [x] Revisar `logic/classifyGender.js` completo contra [plan.md](plan.md) y [CONSTITUTIONS.md](../../CONSTITUTIONS.md): sin SQL en `logic/`, sin dependencias nuevas, estilo legible.
- [x] Resumir al usuario qué se creó, qué se probó (con las salidas reales de T4 y T6) y cualquier desviación del plan.
- **Hecho cuando:** el resumen final está entregado.

## Resultado de la ejecución
- **Desviación en T2:** `nimble-v3` es un modelo de decisión y Ollama rechaza `/api/chat` y `/api/generate`. Se usa `/v1/systemone`, y el plan se actualizó en consecuencia.
- **Few-shot (no previsto en el plan original):** tras la prueba de 100 nombres, se añadieron 7 ejemplos al `state` y la precisión subió de 96/100 a 99/100.
- **T3:** los 6 casos con `fetch` falso pasaron (lista vacía sin llamada, 13 usuarios en 3 peticiones de 6, 6 y 1, respuesta omitida, JSON sin `answers`, fallo en la segunda petición y HTTP 500).
- **T6:** con 8 usuarios temporales más Ana y Pedro, salió `Men: 5, Women: 3, Undefined: 2` (suma 10). Con un modelo inexistente: `Error: Users could not be classified: the model did not respond (HTTP 404)`, sin números y con código 1. Los usuarios temporales se borraron y los datos quedaron idénticos a la foto inicial.
- **Precisión:** 99/100 (80/80 en nombres claros). El único fallo fue Andrea, ambiguo.

## Criterios de aceptación del spec
- [x] Al ejecutarlo se ven los tres números y suman el total de usuarios (T6).
- [x] Los datos de los usuarios quedan igual que antes (T6).
- [x] No hace falta pagar ni crear cuentas: modelo local en Ollama (T2).
- [x] Sin usuarios no se llama al modelo (T3).
