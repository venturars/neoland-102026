# Plan para separar las guías de first-app-ai

Estado: aprobado por Miguel el 2026-10-27.
Spec: [spec.md](spec.md), aprobada por Miguel el 2026-10-27.
Tarea: [issue #475](https://github.com/venturars/neoland-102026/issues/475).
PR: [#482](https://github.com/venturars/neoland-102026/pull/482), en draft y dirigida a `staging`.

## Enfoque

Separar la documentación existente por tema, conservando sus contratos y decisiones. Redactar las guías para nuestra aplicación a partir de sus instrucciones y archivos actuales. La referencia de Ventura orienta la separación; no se copia su documentación ni se adopta una arquitectura distinta.

La constitución actual reúne árbol, responsabilidades, almacenamiento, contratos, errores, ejemplos, configuración, paquetes y SDD. El manual reúne procedimiento, convenciones y Socket. El traslado tendrá una fuente principal por tema; las otras páginas la enlazarán cuando sea necesario.

## Archivos afectados

Todas las rutas siguientes son relativas a `staff/miguel-rodriguez/first-app-ai/`.

| Archivo | Cambio previsto |
| --- | --- |
| `docs/ARCHITECTURE.md` | Crear la descripción de las responsabilidades y relaciones actuales. |
| `docs/TREE.md` | Crear el árbol de carpetas y archivos del proyecto. |
| `docs/DATABASE.md` | Crear la referencia de conexión, esquema, inicialización y consultas. |
| `docs/ERRORS.md` | Crear la referencia de errores de negocio y de consulta. |
| `docs/STYLE.md` | Crear las convenciones para escribir código nuevo. |
| `docs/CONSTITUTIONS.md` | Sustituir los temas trasladados por enlaces; conservar contratos, principios, paquetes y SDD. Explicitar el contrato de cuatro pasos aprobado. |
| `AGENTS.md` | Remitir a las guías y añadir su mantenimiento al procedimiento, conservando verificación y Socket. |
| `docs/specs/split-sdd-guides/` | Mantener la spec y este plan; preparar tareas tras aprobar el plan y registrar después resultados reales y aprobaciones. |

No se modifican `README.md`, código, clientes, notebooks, SQL, datos, manifiestos, lockfile, requisitos Python, configuración ni documentos de otras features. No se crean guías adicionales ni herramientas de comprobación permanentes.

## Destino de cada contenido actual

| Contenido actual | Fuente principal tras el cambio |
| --- | --- |
| Propósito, ES modules, requisitos de Node y ausencia de autenticación | Constitución. |
| Árbol incluido en la constitución | `TREE.md`. |
| Responsabilidades de conexión, consultas, lógica, clientes, documentos y arranque | `ARCHITECTURE.md`; los detalles de almacenamiento se enlazan a `DATABASE.md`. |
| Sección «Storage and queries», más detalles de ruta y carga de SQL | `DATABASE.md`. |
| Firmas y contratos de las ocho operaciones públicas, sus validaciones y efectos | Constitución. |
| Tabla de diez mensajes, tipo de error y tratamiento de fallos de consulta/carga | `ERRORS.md`. Los contratos conservan sus condiciones y enlazan esta referencia; no mantienen otra tabla. |
| Sección «Terminal examples» | Constitución, conservando las instrucciones actuales de uso. Arquitectura describe el papel de los clientes, sin repetir el procedimiento. |
| «Configuration naming» y convenciones de nombres/importaciones del manual | `STYLE.md`. |
| Reglas de escritura directa del manual y estilo nuevo aprobado | `STYLE.md`; el manual remite a ella. |
| Dependencias, versiones exactas, pnpm, lockfile y requisito Socket | Constitución, sin cambiar sus reglas. |
| Historia de la transición y proceso SDD | Constitución, sin cambiar aprobaciones ni etapas. |
| Procedimiento de trabajo, ejecución de ejemplos, copias desechables y resolución de conflictos | `AGENTS.md`. |
| Sección completa «Socket package validation» | `AGENTS.md`, sin cambios de contenido. |

Los documentos de esta feature registran la decisión y su comprobación. Las specs históricas siguen siendo registros de sus tareas; no se reescriben para eliminar las referencias anteriores.

## Contenido de las cinco guías

### ARCHITECTURE.md

Describir quién hace qué y cómo se relacionan las partes existentes:

- `db/connection.js` mantiene la conexión; los archivos SQL contienen consultas y `queries/users.js` las ejecuta.
- Cada uno de los ocho archivos de `logic/` implementa su operación pública. La lógica no imprime ni administra la conexión; sus contratos permanecen en la constitución.
- Identificar los nueve ejemplos de terminal y los nueve notebooks por operación. La inicialización es una consulta explícita, no una nueva operación pública de negocio.
- `clients/jupyter/client.py` envía operación y argumentos como JSON a Node; `run-operation.js` selecciona operaciones explícitas y presenta resultados y errores. Sus mensajes de presentación no se confunden con errores de negocio.
- `scripts/jupyter.js` prepara y arranca el entorno local existente. Explicar el papel de `requirements-jupyter.txt`, `package.json`, `pnpm-lock.yaml`, `.gitignore` y `README.md`, sin repetir versiones o instrucciones de arranque que ya tienen su fuente.
- Describir el papel de las cinco guías, la constitución, el manual y los documentos SDD. Distinguir archivos versionados de datos y entornos generados.

Se pueden agrupar archivos que comparten responsabilidad, identificando sus operaciones. No se inventan interfaces, capas, funciones ni módulos.

### TREE.md

Usar un bloque de árbol con los archivos versionados del proyecto y los documentos nuevos de esta tarea, incluidos `.gitignore`, los nueve notebooks y los cinco directorios de features. Enumerar los nombres reales, sin abreviaturas que oculten notebooks ni comentarios sobre responsabilidades.

No recorrer `node_modules`, `.venv`, cachés o bases de datos locales. Su carácter generado se explica en arquitectura; el árbol refleja la estructura versionada, no una instalación concreta.

### DATABASE.md

Conservar la conexión al archivo `db/users.sqlite` relativa al módulo, la conexión exportada y la carga única de SQL en UTF-8 con rutas relativas al módulo. Abrir la conexión no crea la tabla; SQLite puede crear el archivo de datos.

Trasladar íntegramente el esquema de cinco columnas y sus restricciones, los valores por defecto y la precisión/localidad de fechas. Mantener que SQLite no aplica el límite declarado de `VARCHAR(64)` y que la lógica comprueba la longitud de JavaScript.

Documentar las ocho funciones de consulta existentes y su archivo SQL, parámetros, ejecución y retorno: `createUsersTable`, `findByName`, `findByEmail`, `insert`, `findAll`, `findById`, `update` y `remove`. Conservar `undefined` para búsquedas sin fila, arrays para búsquedas múltiples y metadatos para `remove`.

Mantener inicialización repetible, coincidencia exacta y sensible a mayúsculas por nombre, orden por ID, `RETURNING *`, reutilización de la consulta por ID y actualización de `updatedAt` incluso con cambios vacíos. Las consultas no validan reglas de negocio ni imprimen. Enlazar la constitución para esas reglas.

### ERRORS.md

Trasladar los diez mensajes exactos y todas sus condiciones. Agrupar validación, reglas de negocio y fallos de consulta sin cambiar precedencia ni crear errores nuevos. Mantener `Error` ordinario, errores de negocio fuera de los catches de consulta, sustitución de fallos capturados por el mensaje de la operación y distinción de fallos al cargar módulos.

Conservar el caso de tabla no inicializada con entrada válida y el fallo de consulta o petición del clasificador. Los mensajes propios del adaptador Jupyter siguen siendo presentación del cliente; esta tabla no los convierte en errores de las operaciones.

### STYLE.md

Trasladar kebab-case para archivos, camelCase para funciones, exports nombrados e importaciones con `.js`. Conservar nombres de documentos prescritos y constantes de configuración en mayúsculas, sin exigir renombrar variables de texto SQL.

Describir una operación pública de negocio por archivo mediante funciones, sin clases propias ni `this` para organizar el negocio. Permitir registros ordinarios y bibliotecas existentes. Esta regla no exige dividir el módulo de consultas o los adaptadores en esta tarea ni prohíbe sus APIs existentes.

Definir pasos explícitos, una acción por línea y nombres descriptivos: separar lectura y transformación, y escribir por separado la condición y el lanzamiento del error. Evitar envoltorios de resultados, clases de error propias y ayudas o capas genéricas innecesarias. Usar ejemplos breves escritos para la guía, sin modificar código ejecutable.

Recoger el formato estándar de Prettier acordado: comillas dobles, punto y coma, coma final, dos espacios y ancho de 80. No instalar Prettier o ESLint ni añadir configuraciones o comandos. Mantener el idioma de los ejemplos existentes; esta tarea no traduce clientes.

## Constitución y procedimiento

Mantener las ocho firmas públicas, entradas tipadas previstas, orden y efectos. Las operaciones que devuelven contactos conservan los objetos con exactamente cinco campos; el clasificador conserva sus tres contadores y la eliminación devuelve `undefined`. Preservar normalización de nombres y emails, ausencia de validación adicional de ID, reglas de propiedad del email, búsqueda por nombre y contrato aprobado del clasificador.

Explicitar los cuatro pasos: validar entrada, comprobar reglas de negocio, aplicar la operación y estructurar la salida. La constitución actual describe esas responsabilidades pero no las enumera como contrato. La nueva formulación no cambia la precedencia propia de cada operación: por ejemplo, `updateUser` busca primero el ID y falla por usuario ausente antes de validar los campos. No se prescribe reordenar código existente.

El manual conservará los límites del trabajo, aprobaciones separadas, comprobación de ejemplos, uso de copias desechables y decisión humana ante conflictos. Ajustará la consulta del código existente: sirve para reconocer operaciones parecidas, mientras `STYLE.md` rige la escritura nueva. Una diferencia de estilo antigua no bloquea un desarrollo; una contradicción de comportamiento o instrucciones sí requiere resolverla.

Añadir al procedimiento que, al crear o eliminar archivos, ese mismo desarrollo actualiza `TREE.md` y las responsabilidades afectadas de `ARCHITECTURE.md`. En este cambio ambos documentos deben describir también las cinco guías y los documentos de esta feature.

## Comprobación prevista

1. Antes del traslado, guardar una referencia de los dos documentos actuales y del inventario versionado. Comparar cada sección con el destino de la tabla anterior para detectar pérdidas y duplicaciones. No leer ni copiar bases de datos locales.
2. Contrastar arquitectura y árbol con los archivos reales, incluidos los nueve notebooks y sus adaptadores. Contrastar esquema, las ocho consultas y retornos con conexión y SQL, sin ejecutar la app ni abrir una conexión a datos.
3. Comparar contratos y errores antes/después: cinco campos, normalización, precedencia de update, búsquedas sin coincidencias, timestamps, eliminación y clasificador. Comparar sin cambios el procedimiento Socket, reglas de paquetes, transición y aprobaciones SDD.
4. Leer constitución y manual siguiendo sus enlaces. Resolver los enlaces locales y confirmar una fuente principal por tema. Las referencias breves a un contrato o ejemplos no repiten la definición completa de otra guía.
5. Revisar que el manual exige mantener árbol y arquitectura y que el estilo distingue código nuevo de diferencias antiguas. Comprobar las reglas de funciones, pasos, nombres y formato frente a la spec.
6. Revisar el diff y el inventario final: solamente los dos documentos existentes, las cinco guías y los documentos de esta feature. Comparar el contenido de los demás archivos versionados con la referencia inicial; ningún código, SQL, notebook, dependencia, dato o spec histórica cambia.

La comprobación será documental, con lecturas, comparación de archivos y enlaces. No requiere instalar herramientas, arrancar Jupyter, ejecutar operaciones ni repetir consultas Socket, porque no se propone ningún paquete o versión. Registrar comandos y resultados reales en las tareas cuando se ejecute la comprobación.

## Dependencias, riesgos y decisiones

No hay firmas nuevas, SQL nuevo, dependencias ni mensajes de error de aplicación nuevos.

Los riesgos son perder reglas al trasladarlas, duplicar definiciones o describir como implementado el estilo futuro. Se controlan con el mapa de contenidos, la comparación antes/después y la lectura cruzada con los archivos reales. Si aparece una contradicción de comportamiento no resuelta por los contratos actuales, detener ese punto y pedir decisión; no corregirla mediante esta reorganización.

No quedan decisiones de alcance pendientes. Tras la aprobación humana de este plan se prepararán y revisarán las tareas; su aprobación será necesaria antes de modificar las guías, la constitución o el manual.
