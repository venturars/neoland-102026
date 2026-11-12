# Plan: Clasificador de género

Implementa [spec.md](spec.md). Todo respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md): sin cambios de esquema, sin dependencias nuevas y sin tocar los datos.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| Modelo de IA | `nimble-v3:latest` (9B, Q8_0) servido por **Ollama** en local | Ya está descargado en el PC y no tiene coste de API |
| Tipo de modelo | Es un modelo de **decisión** (`capabilities: ["decision"]`): no sirve para chat ni `generate`, solo para `/v1/systemone` | Comprobado en T2: `/api/chat` y `/api/generate` responden `does not support chat/generate` |
| Acceso a Ollama | `fetch` nativo de Node a `POST http://localhost:11434/v1/systemone` | No añade dependencias npm |
| Dato enviado al modelo | Solo la columna `name` | Lo pide el spec |
| Petición | `{ model, state, questions }`. Cada nombre es una **pregunta con nombre propio** (`q1`, `q2`...) de tipo `choice` con tres opciones en `criteria`: `male`, `female` y `undefined` (nombre neutro, ambiguo o desconocido) | Formato documentado del endpoint; la opción `undefined` da una salida explícita al modelo |
| Few-shot | 7 ejemplos dentro del `state`: Ricardo → male, Eduardo → male, Gabriela → female, Verónica → female, Casey → undefined, Frankie → undefined, Brzzk → undefined | Probado con 100 nombres: sube de 96/100 (zero-shot) a 99/100, sin perder aciertos en los nombres claros (80/80). Mejora sobre todo los casos dudosos, que el spec pide contar como "no definido" |
| Respuesta del modelo | `answers.<pregunta>.choice` con la opción elegida (más `probabilities` y `confidence`, que no se usan) | Respuesta tipada: no hay texto libre que interpretar y cada resultado va ligado a su pregunta, sin depender del orden |
| Peticiones | **6 nombres (6 preguntas) por petición**, en **batches de 6**. Las peticiones se hacen de una en una, en secuencia | Menos llamadas al modelo; en secuencia porque Ollama procesa de una en una en local |
| Base de datos vacía | Si no hay usuarios, **no se llama al modelo** | Lo pide el usuario; evita una llamada inútil y permite devolver `0 / 0 / 0` aunque Ollama esté apagado |
| Datos | Solo lectura, con `selectAllUsers()` ya existente | No hace falta SQL nuevo |

## Arquitectura
Se mantiene el flujo `terminal → logic → queries → db/connection.js`. El modelo de IA es un servicio externo local, no una capa de datos, y se llama desde `logic/`.

```
terminal/classifyGender.txt     comando para ejecutar a mano
logic/classifyGender.js         lee usuarios, pregunta al modelo y cuenta
queries/users.js                SIN cambios (reutiliza selectAllUsers)
db/                             SIN cambios
```

Solo se crean 2 archivos. No se crea un archivo aparte para el cliente de Ollama: vive dentro de `logic/classifyGender.js` como funciones internas, porque la constitución fija "una operación = un archivo en `logic/` + un `.txt` en `terminal/`".

## Diseño de `logic/classifyGender.js`
Sigue la plantilla [logic/createUser.js](../../../logic/createUser.js) y el estilo de [logic/listUsers.js](../../../logic/listUsers.js): comentario inicial en español, función exportada, bloque `isRunFromTerminal`, código explícito.

Constantes al inicio del archivo:
- `OLLAMA_URL = 'http://localhost:11434/v1/systemone'`
- `MODEL_NAME = 'nimble-v3:latest'`
- `REQUEST_TIMEOUT_MS = 60000`
- `BATCH_SIZE = 6`
- `ALLOWED_GENDERS = ['male', 'female', 'undefined']`: las únicas respuestas válidas.
- `GENDER_CRITERIA`: las tres opciones de cada pregunta, con su descripción (`Typically a man's name`, `Typically a woman's name`, `Neutral, ambiguous or unrecognized name`).
- `FEW_SHOT_EXAMPLES`: lista de 7 objetos `{ name, gender }` con los ejemplos del modelo.

Funciones:
- `buildState()` (interna): devuelve el texto del `state`: `Classify the most likely gender of each first name. Examples: Ricardo -> male; ...; Brzzk -> undefined.` Los ejemplos salen de `FEW_SHOT_EXAMPLES`.
- `askModelForGenders(names)` (interna, `async`): envía a Ollama (`/v1/systemone`) hasta 6 nombres en una sola petición y devuelve una lista de la misma longitud y orden que `names`, con `'male'`, `'female'` o `'undefined'` para cada nombre.
  - Construye una pregunta por nombre (`q1`...`q6`), todas con las mismas tres opciones en `criteria`. El nombre va en `instructions` (por ejemplo: `Is the first name 'Ana' most likely male or female?`). Las opciones salen de `GENDER_CRITERIA`. El campo `state` lo genera `buildState()`, con la tarea y los 7 ejemplos few-shot.
  - **Modelo sin respuesta** (Ollama apagado, modelo no descargado, error de red, timeout o respuesta HTTP con error): lanza `throw new Error(...)` con la causa. No se devuelve ningún resultado.
  - **Respuesta no válida**: el JSON no se puede leer, falta `answers`, o la respuesta de una pregunta falta o no es una de las tres opciones. Como cada respuesta va ligada a su pregunta, **solo esa pregunta** cuenta como `'undefined'` y el resto del grupo se aprovecha.
- `countGenders(users)` (exportada, `async`): devuelve `{ men, women, undefinedGender }`.
  1. **Si la lista está vacía, devuelve todo a 0 y termina sin llamar al modelo.**
  2. Divide la lista en grupos de `BATCH_SIZE` (6) usuarios.
  3. Recorre los grupos uno tras otro; por cada grupo hace una sola petición con `askModelForGenders` enviando los 6 nombres (el último grupo puede tener menos).
  4. Suma cada resultado del grupo en su contador.
  5. Si `askModelForGenders` lanza un error, no se captura aquí: la operación entera se detiene y no se devuelve ningún conteo parcial.
- `classifyGender()` (exportada, `async`): obtiene los usuarios con `selectAllUsers()` y devuelve `await countGenders(users)`. Si falla la lectura de la base de datos o la llamada al modelo, lanza `throw new Error('Users could not be classified: <causa>')`.
- El bloque `isRunFromTerminal` usa `await`, porque `classifyGender` es asíncrona (Node 24 permite `await` de nivel superior en ESM).
- Solo se exportan `countGenders` y `classifyGender`. `askModelForGenders` y `buildState` son internas.

Salida por terminal (en inglés, según `AGENTS.md`):
```
Men: 12
Women: 9
Undefined: 4
```
Si la clasificación no se puede hacer, **no se muestran los tres números**; solo el mensaje, igual que el resto de comandos (`Error: <mensaje>` con `process.exit(1)`):
```
Error: Users could not be classified: the model did not respond
```

## Fallos: qué se cuenta como "no definido" y qué es un error
Decisión del usuario, con dos casos distintos:

| Situación | Resultado |
|---|---|
| El modelo **no responde** (Ollama apagado, modelo no descargado, error de red, timeout) | Mensaje de que no se pudo clasificar. **No se suma a "no definido"** y no se muestran números |
| Falla la **lectura de la base de datos** | Igual: mensaje de que no se pudo clasificar |
| El modelo responde pero la respuesta **no es válida** (JSON ilegible, falta `answers`, falta la respuesta de una pregunta o la opción no está permitida) | Los nombres afectados se suman a "no definido" y el comando termina bien |
| El modelo responde con `undefined` para un nombre | Se suma a "no definido" |

Así un fallo del modelo nunca se confunde con un resultado real (`Men: 0 / Women: 0 / Undefined: <total>`).

Si el fallo ocurre en mitad del proceso (por ejemplo, en el grupo 3 de 5), se descarta todo: no se muestran conteos parciales, porque serían engañosos.

## Fuera del plan
- Cambios en `queries/`, `db/` o en el esquema.
- Dependencias npm nuevas.
- Editar `AGENTS.md` o `CONSTITUTIONS.md` (el flujo SDD solo aplica a esta conversación).

## Estrategia de verificación
Según los principios 6 y 7 de la constitución:
1. Con Ollama en marcha, crear usuarios temporales con `createUser.js` (nombres claramente masculino, femenino, neutro y desconocido) y ejecutar `node --no-warnings logic/classifyGender.js`.
2. Comprobar que los tres números suman el total de usuarios de `listUsers.js`.
3. Caso sin usuarios: como no se puede vaciar la base de datos, se prueba `countGenders([])` importando la función con `node --no-warnings -e`. Antes de llamarla se sustituye `globalThis.fetch` por una función que lanza un error; debe devolver todo a 0 y no ejecutar ese `fetch`, lo que demuestra que no se llama al modelo.
3b. Batches de 6: con una lista de 13 usuarios, llamar a `countGenders` con un `fetch` sustituido que registre cada petición y devuelva una respuesta válida. Debe haber 3 peticiones, con 6, 6 y 1 nombres, y nunca dos a la vez.
3c. Respuesta inválida: con un `fetch` sustituido que omita la respuesta de una pregunta, o devuelva una opción no permitida, solo ese nombre debe contar como no definido y el comando debe terminar bien. Con un JSON sin `answers`, todo el grupo cuenta como no definido.
4. Modelo sin respuesta: probar con un `MODEL_NAME` inexistente de forma temporal (o con Ollama parado, si lo prefieres) y comprobar que sale `Error: Users could not be classified: the model did not respond (HTTP 404)`, que no se muestran números y que el código de salida es 1. Restaurar `MODEL_NAME` después.
4b. Fallo en mitad: con un `fetch` sustituido que funcione en la primera petición y falle en la segunda, comprobar que no se devuelve ningún conteo parcial.
5. Borrar los usuarios temporales y comprobar con `listUsers.js` que los datos existentes siguen intactos.
6. Precisión: probar `countGenders` con 100 nombres con la etiqueta esperada conocida (40 masculinos, 40 femeninos, 10 neutros y 10 inventados), sin tocar la base de datos. Resultado medido: **99/100** con few-shot (96/100 sin ellos). Los 80 nombres claros acertaron todos; el único fallo fue Andrea, un nombre ambiguo. Es una muestra pequeña de nombres sobre todo occidentales, así que no equivale a la precisión real con cualquier usuario. El script de esta prueba no forma parte del proyecto.
