# Tareas — clasificador de género

1. Abre [logic/list-users.js](../../../logic/list-users.js). Mira la lectura con `findAll` y el `DatabaseError`. No cambies ese fichero.

2. En `first-app`, ejecuta `pnpm add openai`. Abre `package.json`. `openai` figura en las dependencias.

3. Crea `logic/user-gender-count.js`. Sigue el plan: `usersGenderCount`, lotes de 6 y una llamada por lote. Abre el fichero: exporta la función y no escribe en la base.

4. Crea `clients/terminal/user-gender-count.txt`. Importa `usersGenderCount`, hace `await` y `console.log`. No captura el error.

5. Con el directorio en `first-app` y Ollama en marcha, pega el cliente. La terminal muestra un objeto con tres números.

6. Para Ollama y vuelve a pegar el cliente. La terminal muestra `Could not classify the users`.
