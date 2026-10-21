# Constitución — first-app

Reglas de organización y desarrollo del proyecto. Las specs de cada funcionalidad
recogen sus requisitos, implementación y tareas.

## Organización

```text
first-app/
  AGENTS.md
  package.json
  pnpm-lock.yaml
  db/
    connection.js
    users.sqlite
  queries/
    queries/             Un fichero SQL por consulta
    users.js             Ejecución de consultas
  logic/                 Una operación por fichero
  clients/terminal/      Ejemplos manuales .txt
  docs/
    CONSTITUTIONS.md
    specs/
      users/             spec.md, plan.md, tasks.md
      classifier/        spec.md, plan.md, tasks.md
```

## Responsabilidades

- `db/` abre la base; no aplica reglas de negocio ni crea tablas al importar.
- `queries/queries/` contiene SQL parametrizado. `queries/users.js` lo carga en
  UTF-8, lo ejecuta y normaliza filas y errores del motor, sin validar negocio.
- `logic/` valida entradas, aplica reglas y devuelve los datos de la operación.
  Sus reglas no se trasladan a consultas ni a clientes. Cada operación tiene
  su fichero y no sustituye a otra funcionalidad.
- `clients/terminal/` contiene ejemplos simples: importar, llamar y mostrar el
  resultado, sin try/catch/finally. Node muestra las excepciones y termina con
  error. Al terminar cada proceso se libera la conexión.

Las operaciones llaman directamente a las consultas. La integración de IA vive
actualmente en la operación del clasificador; sus detalles están en su plan.

## Datos y errores

Hay una base `db/users.sqlite` y un singleton por proceso, exportado como `db`
por `db/connection.js`, con ruta fija junto al módulo. Crear tablas es explícito
y repetirlo conserva los datos. Los cambios de esquema requieren una migración.
Se conservan el esquema existente y las fechas UTC.

Una operación devuelve directamente su dato: un usuario, una lista o un recuento.
Si no tiene datos de salida, no devuelve nada. No se añaden indicadores de éxito
ni objetos que representen errores.

Los fallos se señalan con `throw new Error("...")`, usando mensajes claros en
inglés. No se crean códigos ni clases de error propias. Los mensajes de cada
funcionalidad están en su plan. Los fallos técnicos se propagan como excepciones;
los clientes no añaden reglas de negocio.

Las bases, credenciales y archivos generados no se versionan. La clasificación
usa IA local, envía solo los datos necesarios y no guarda categorías en la base.

## Specs

Un trío por funcionalidad, agrupando sus operaciones relacionadas:

- `spec.md`: objetivo, reglas de negocio y criterios de aceptación.
- `plan.md`: implementación, archivos, contratos y comprobaciones.
- `tasks.md`: pasos, estado y evidencia de comprobación.

Una funcionalidad nueva con alcance propio recibe su carpeta. Las ampliaciones
pequeñas actualizan el trío existente; las correcciones menores no necesitan uno
nuevo. Se conserva el registro de tareas terminadas. No marcar como comprobado
algo que solo se ha descrito o implementado.

- Usuarios: [spec](specs/users/spec.md), [plan](specs/users/plan.md),
  [tareas](specs/users/tasks.md).
- Clasificador: [spec](specs/classifier/spec.md),
  [plan](specs/classifier/plan.md), [tareas](specs/classifier/tasks.md).

La constitución contiene reglas compartidas. AGENTS indica cómo trabajar y
remite a ellas. Los detalles particulares se mantienen en el trío afectado.

## Ejecución

Esta sección reúne todas las instrucciones de pnpm. El resto de documentos y
los ejemplos de terminal enlazan aquí para evitar instrucciones repetidas.
package.json mantiene la configuración ejecutable del proyecto.

Se requiere Node.js 24.14 o posterior, con módulos ES, y pnpm 11.25.0.
Se conserva pnpm-lock.yaml. Ejecutar desde first-app, en PowerShell:

```powershell
pnpm install --frozen-lockfile
pnpm run db:init
pnpm run create-user
pnpm run find-user-by-email
pnpm run find-user-by-id
pnpm run update-user
pnpm run list-users
pnpm run classify
pnpm run delete-user
```

Los scripts pasan el JavaScript de cada .txt a Node por stdin. No necesitan Bash.
Los ejemplos crean Ada con correo ada@example.com, buscan ese correo o el ID 1,
actualizan ese ID a Ada Lovelace y lo eliminan. Se pueden editar para otros datos.
El cliente db:init muestra las tablas. Repetir create-user lanza Email is already used.
Eliminar muestra una confirmación, ya que la operación no devuelve datos.

Para clasificar, abrir Ollama y descargar llama3.2 con `ollama pull llama3.2`.
Si no está en el PATH, usar la ruta completa del ejecutable instalado. Se puede
cambiar el modelo y la URL local mediante las variables descritas en el plan
del clasificador.

## Comprobación y estilo

No se utilizan tests automatizados. Las operaciones se comprueban en una copia
temporal sin la base personal y se registran los resultados reales.
La revisión documental comprueba coherencia, enlaces y UTF-8.

Todo el código y los textos se guardan en UTF-8. Documentación y comentarios
en español, identificadores camelCase y archivos kebab-case, salvo los nombres
establecidos AGENTS.md y CONSTITUTIONS.md. Las funcionalidades nuevas incluyen
algún comentario corto y explicativo.
