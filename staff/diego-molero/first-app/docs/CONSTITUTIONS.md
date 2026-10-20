# Constitución — first-app

Aplicación de aprendizaje para gestionar usuarios y clasificar sus nombres con
Ollama local. El árbol coincide con la PR #139; se conservan nuestras reglas,
respuestas, esquema y configuración de IA.

## Árbol

```text
first-app/
  .gitignore
  AGENTS.md
  package.json
  pnpm-lock.yaml
  db/
    connection.js
    users.sqlite
  queries/
    queries/
      create-users-table.sql
      find-all.sql
      find-by-email.sql
      find-by-id.sql
      insert.sql
      remove.sql
      update.sql
    users.js
  logic/
    create-user.js
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-email.js
    find-user-by-id.js
    users-gender-count.js
  clients/terminal/
    create-user.txt
    create-users-table.txt
    delete-user.txt
    find-user-by-email.txt
    find-user-by-id.txt
    list-users.txt
    update-user.txt
    users-gender-count.txt
  docs/
    CONSTITUTIONS.md
    specs/classifier/
      spec.md
      plan.md
      tasks.md
```

## Ejecución con pnpm

Requiere Node.js 24.14+ y pnpm 11.25.0, fijado en package.json. El lockfile se
versiona; las bases y node_modules quedan fuera de Git. No hay dependencias
externas. Ejecutar desde first-app, en PowerShell:

```powershell
pnpm install --frozen-lockfile
pnpm run db:init
pnpm run create-user
pnpm run list-users
pnpm run find-user-by-email
pnpm run find-user-by-id
pnpm run update-user
pnpm run classify
pnpm run delete-user
```

Los clientes .txt contienen JavaScript que los scripts pasan a Node por entrada
estándar; no necesitan Bash. Son ejemplos editables: crear registra Ada con
ada@example.com, las búsquedas usan ese correo o el ID 1, actualizar cambia el
nombre del ID 1 y eliminar borra ese ID. Listar y clasificar leen todos los usuarios.
Como en la PR, los clientes importan, llaman a la función y muestran el resultado,
sin try/catch/finally. Los fallos técnicos los muestra Node directamente y terminan
el proceso con error. Repetir create-user muestra EMAIL_ALREADY_USED.
El cliente db:init muestra las tablas existentes. No hay demos agrupadas ni tests.

## Capas y base de datos

La conexión es idéntica a la PR: un db compartido por proceso y ruta fija junto
al módulo. Importarlo abre db/users.sqlite pero no crea la tabla. Cada cliente
es una ejecución corta: al terminar el proceso se libera la conexión, sin
importarla ni cerrarla manualmente en cada ejemplo de lógica.

queries/queries contiene un SQL por consulta; queries/users.js importa el
singleton, lee los textos en UTF-8 y los ejecuta con parámetros. Convierte las
filas a objetos normales y los conflictos de unicidad a EMAIL_ALREADY_USED.
logic importa esas consultas, valida, aplica las reglas y estructura el resultado.
La llamada HTTP y la interpretación de Ollama están en users-gender-count.js.

El esquema propio se conserva: id INTEGER PRIMARY KEY AUTOINCREMENT, nombre y
correo obligatorios, correo único y createdAt/updatedAt como texto UTC ISO 8601.
Inicializar de nuevo conserva los datos; cambiar una tabla existente requiere
una migración explícita. No se guarda el género.

## Reglas propias

Solo se admiten name y email como campos de entrada. El nombre es texto
obligatorio y se recorta. El correo se recorta y se pasa a minúsculas: un único
@, contenido a ambos lados, ningún espacio interior y máximo de 64 caracteres.
El ID debe ser un entero positivo seguro. Actualizar conserva los campos omitidos
o undefined, rechaza null y exige algún cambio definido. Eliminar es definitivo.
Las búsquedas devuelven los cinco campos públicos y no modifican datos.

Crear, actualizar y buscar devuelven { ok: true, user }; listar devuelve
{ ok: true, users }; eliminar devuelve { ok: true }. Los errores esperados son
{ ok: false, error: CODIGO }, con INVALID_INPUT, INVALID_ID, INVALID_NAME,
INVALID_EMAIL, EMPTY_CHANGES, EMAIL_ALREADY_USED o USER_NOT_FOUND. Los fallos
inesperados se propagan como excepciones. El CRUD es síncrono.

## Ollama

Abrir Ollama y descargar llama3.2 con `ollama pull llama3.2`. Si ollama no está
en el PATH, puede utilizarse la app instalada o la ruta completa del ejecutable.
OLLAMA_MODEL permite otro modelo local ya descargado. OLLAMA_BASE_URL permite
una URL HTTP de loopback; por defecto http://127.0.0.1:11434.

usersGenderCount() es asíncrono y devuelve { ok: true, women, men, genderUndefined }.
Solo envía nombres, en lotes de seis, mediante fetch, JSON estructurado y
temperatura 0, con timeout de 120 segundos por lote. Sin usuarios devuelve ceros
sin consultar IA. Un lote incompleto o ilegible cuenta como no definido; categorías
inciertas o desconocidas también. Un fallo técnico lanza Could not classify the
users, sin devolver un recuento parcial. Son categorías inferidas de nombres,
no identidades confirmadas. El resultado no modifica los usuarios.

## SDD y comprobación

Cada desarrollo usa spec.md (negocio), plan.md (técnica) y tasks.md (pasos
verificables). Se actualizan antes del código cuando cambie el alcance y se
marcan tareas tras comprobarlas. El desarrollo vigente está en
[la spec](specs/classifier/spec.md), [el plan](specs/classifier/plan.md) y
[las tareas](specs/classifier/tasks.md).

No se utilizan tests automatizados. La comprobación es manual: ejecutar los
clientes en una copia temporal del código sin copiar la base personal. Registrar
los comandos y resultados reales, diferenciando IA real de comprobaciones de
validación. No añadir directorios extras para estas verificaciones.

Todo el código y los textos se guardan en UTF-8. La documentación y los comentarios
están en español, con un comentario breve por funcionalidad. Los nombres del
código mantienen camelCase y los archivos kebab-case.
