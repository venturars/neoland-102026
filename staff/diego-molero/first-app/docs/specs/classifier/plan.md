# Plan — clasificador local

Aplican las reglas de la [constitución](../../CONSTITUTIONS.md). El almacenamiento
y el CRUD pertenecen al [plan de usuarios](../users/plan.md).

## Flujo

- `logic/users-gender-count.js` exporta `async usersGenderCount()`, sin argumentos.
  Importa findAll de queries/users.js y lee los usuarios una sola vez.
- Sin usuarios devuelve `{ women: 0, men: 0, genderUndefined: 0 }` antes de
  consultar configuración o IA.
- Envía solo nombres en lotes de seis mediante fetch nativo. La petición HTTP,
  la interpretación de respuestas y el conteo están en el mismo fichero.
- Al completar los lotes devuelve directamente `{ women, men, genderUndefined }`.
  No actualiza usuarios, no crea tablas y no guarda categorías.

## Ollama

Modelo por defecto llama3.2; OLLAMA_MODEL permite otro modelo local descargado.
OLLAMA_BASE_URL usa por defecto http://127.0.0.1:11434. Solo se admite HTTP con
hostname localhost, 127.0.0.1 o [::1].

La petición POST a /api/chat usa stream: false, temperature: 0, un timeout de
120 segundos por lote y un esquema JSON con una lista genders de longitud igual
al lote. Las etiquetas son women, men o undefined. El mensaje de sistema trata
los nombres como datos y solicita undefined para los ambiguos o desconocidos.

- women o men incrementan su contador; cualquier otra etiqueta cuenta como no definida.
- Si el JSON es ilegible, falta genders o su longitud es incorrecta, todo el lote
  cuenta como no definido. Cada nombre sigue contando una vez.
- Un fallo de lectura, configuración, transporte, timeout o estado HTTP fallido
  lanza `new Error("Could not classify the users", { cause })`. No devuelve
  resultados parciales. Los errores de sintaxis JSON cuentan como respuesta ilegible.

## Cliente y comprobación

La preparación y los comandos están en [ejecución](../../CONSTITUTIONS.md#ejecución).
El cliente users-gender-count.txt importa la operación, la llama con await y muestra
el recuento, sin try/catch/finally.

En una copia temporal sin la base personal, observar ceros sin usuarios y ejecutar
con nombres sintéticos y Ollama real. Comparar la suma con los usuarios procesados.
Comprobar lotes, nombres repetidos, respuestas desconocidas y fallos sin resultados
parciales, registrando cuáles se ejecutan en [tareas](tasks.md). Un ejemplo no mide
la precisión general del modelo.
