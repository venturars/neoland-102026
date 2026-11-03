# Instrucciones de trabajo — First App

Este manual define el proceso de trabajo. La constitución recoge los principios del proyecto; las guías técnicas describen cómo se aplican.

## 1. Alcance y redacción

Trabaja dentro de esta aplicación y solo sobre el pedido autorizado. Usa roles generales y rutas relativas a su raíz en la documentación. Los comandos conservan las rutas necesarias para ejecutarse desde el directorio indicado.

Evita nombres personales, comparaciones con copias de otras personas y apartados de punto de partida ligados a ramas o commits. Las referencias de trabajo son las guías de esta app y los templates compartidos.

Una petición de explicación, revisión o comparación es de lectura. Una petición explícita de editar o implementar autoriza esos cambios dentro del alcance y de la fase aprobada. Nombrar un archivo no es, por sí solo, una orden de editarlo.

## 2. Qué documento consultar

Antes de editar, lee la [constitución](docs/CONSTITUTION.md), este manual y la spec local que cubre la tarea. Después consulta las guías relacionadas:

| Documento                            | Fuente para                                                     |
| ------------------------------------ | --------------------------------------------------------------- |
| [Arquitectura](docs/ARCHITECTURE.md) | Responsabilidades, dependencias y recorrido de los datos.       |
| [Estilo](docs/STYLE.md)              | Código sencillo, funciones de negocio y comentarios educativos. |
| [Base de datos](docs/DATABASE.md)    | Esquema, tipos, validación de campos y consultas.               |
| [Errores](docs/ERRORS.md)            | Errores de negocio y su presentación al cliente.                |
| [Árbol](docs/TREE.md)                | Ubicación de archivos y carpetas.                               |
| [README](README.md)                  | Preparación, arranque y comandos de uso.                        |

No copies reglas de una guía a otra. Si una contradicción afecta al pedido, explícalo antes de implementar y solicita la decisión necesaria. No cambies una regla de producto o un contrato para acomodar el código sin autorización.

## 3. Flujo Git y autorizaciones

Las operaciones de Git siguen el [orquestador local](agents/git-workflow-agent.md). Antes de elegir una operación, consulta [check-status](skills/check-status/SKILL.md).

Una tarea nueva se registra con una issue, una rama desde `staging` y una PR en borrador hacia `staging`. Las [plantillas de issues](templates/issues/) y de [PR](templates/pull-request/) definen el título, el cuerpo y el tipo de rama; no dupliques esas reglas aquí.

Antes de crear la issue, comunica el título y la cuenta asignada y obtén autorización. Si esa creación ya está autorizada para la tarea actual, continúa sin repetir la confirmación. La cuenta asignada es la autenticada en GitHub.

El orden de preparación es issue → rama → PR en borrador → documentos SDD. Una issue o una PR no sustituye la revisión del SDD ni autoriza código pendiente de aprobación.

No hagas commit, push, merge ni cambios de estado de una PR sin autorización que cubra esa operación. Reutiliza la autorización vigente; no la amplíes a otra tarea. Una PR ya lista para revisión conserva su estado salvo petición expresa.

## 4. SDD de esta aplicación

Todo cambio de un archivo de la app necesita su spec: una funcionalidad, una forma de trabajo, una corrección o un cambio solo de documentación. Después de la PR en borrador, prepara `docs/specs/<nombre-en-kebab-case>/` con estos tres documentos:

| Documento  | Contenido                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `spec.md`  | Qué se necesita y por qué, alcance, caso correcto, caso que debe fallar y resultado observable. Describe el comportamiento en el cliente afectado, sin archivos, SQL ni capas. |
| `plan.md`  | Cómo se construirá: capas y archivos afectados, entradas y salidas de la lógica, dependencias y verificación. No repite reglas de las guías.                                   |
| `tasks.md` | Pasos pequeños y ordenados, cada uno con una acción y un resultado comprobable. Cada paso ocupa como máximo cuatro líneas.                                                     |

Si el pedido es una regla de trabajo, la spec explica la regla, a qué operaciones obliga y cómo se comprueba.

Esta app revisa el conjunto `spec.md`, `plan.md` y `tasks.md` antes de implementar. No modifiques ningún archivo de la app (código, consultas, clientes, guías ni la constitución) hasta que exista la carpeta y la persona responsable confirme explícitamente que la revisión está hecha. Crear los documentos no equivale a aprobarlos.

Antes de implementar, lee completos los tres archivos y sigue `tasks.md` en orden. Una spec describe un pedido y su aceptación; las guías describen el proyecto vigente. Si el plan necesita un cambio de alcance o contrato, presenta ese cambio para revisión antes de continuar con él.

## 5. Paquetes

El gestor Node del proyecto es pnpm 10. La versión exacta está en `packageManager` de `package.json`. Se conserva `pnpm-lock.yaml`; no se genera `package-lock.json`.

No se utilizan npm, npx, yarn ni bun para las dependencias Node de esta app.

| Operación                                  | Comando desde la raíz de la app |
| ------------------------------------------ | ------------------------------- |
| Instalar lo declarado                      | `pnpm install`                  |
| Añadir una dependencia aprobada            | `pnpm add <paquete>`            |
| Ejecutar un script del proyecto            | `pnpm run <script>`             |
| Ejecutar una herramienta instalada         | `pnpm exec <herramienta>`       |
| Ejecutar una herramienta temporal revisada | `pnpm dlx <herramienta>`        |

Revisa las dependencias y sus scripts de instalación antes de autorizar su ejecución. No autorices scripts bloqueados de forma global por comodidad. El control `preinstall` de este proyecto rechaza gestores distintos de pnpm; no sustituye la revisión de seguridad.

El cliente Jupyter utiliza `notebook` e `ipykernel`, instalados con pip dentro del entorno virtual de la app. Esa instalación Python no modifica las dependencias Node.

### Revisión con Socket

Antes de aceptar un plan que añada un paquete Node o cambie su versión, revisa el paquete y la versión propuestos con el MCP `socket-mcp`. Comprueba:

- si están afectados por una campaña;
- si tienen alertas;
- si alguna puntuación (`stat`) está por debajo de 50.

La referencia del servidor está en `MCPS/socket-mcp/mcp.txt`. Cada dato se escribe con la herramienta que le corresponde:

- Las puntuaciones salen de `depscore`, con la versión exacta. Una puntuación por debajo de 50 se escribe; 50 no baja.
- Las alertas salen de `alerts`, con el `org_slug` que devuelve `organizations`. Una lista vacía es la lista de la organización: no dice que esa versión no tenga alertas.
- La campaña sale de `threat_feed`, con ese mismo `org_slug`.

Repite la revisión sobre sus dependencias hasta tres niveles de profundidad. Registra en el plan el paquete, la versión, el alcance revisado, los hallazgos de cada nivel y las alertas pendientes. La persona que aprueba el plan decide sobre esas alertas.

Si una herramienta no puede contestar, el resumen dice el motivo que devolvió. No se escribe «no consta» sin haberla llamado. Indica qué no se pudo revisar. No presentes la validación como superada ni aceptes el plan sin ese resumen y las decisiones requeridas.

## 6. Implementación

- Trabaja un pedido cada vez y en pasos pequeños.
- Usa las responsabilidades y funciones existentes antes de crear otras.
- Aplica [STYLE.md](docs/STYLE.md) al código nuevo y a las partes modificadas.
- Conserva las funcionalidades, contratos y archivos ajenos al pedido.
- Justifica cualquier dependencia nueva y completa la revisión con Socket antes de aceptar el plan, según el apartado 5.
- Usa el criterio técnico para decisiones rutinarias dentro de lo aprobado. Presenta opciones cuando cambien el alcance, el contrato, los datos o una decisión fundamental.
- Usa datos ficticios y copias temporales para las comprobaciones que escriban o borren datos.

No refactorices código antiguo solo para adaptarlo a una convención posterior. Una diferencia de estilo ajena al pedido no bloquea por sí sola una tarea nueva.

## 7. Comprobaciones y cierre

Desde la carpeta de la app, aplica el formato de Prettier con `pnpm format` y comprueba JavaScript con `pnpm lint`. Limita cualquier formateo a los archivos del pedido para no introducir cambios ajenos. Si falla una comprobación requerida, el trabajo sigue pendiente.

Si cambia una funcionalidad, comprueba el caso correcto, al menos un caso incorrecto y el cliente afectado; actualiza el ejemplo de terminal cuando cambie su contrato. Ejecuta las pruebas relacionadas. Para una edición solo documental, comprueba enlaces, coherencia y conservación de las reglas.

Actualiza en la misma tarea únicamente los documentos afectados por el cambio:

| Si cambia…                                                | Actualiza…                                                              |
| --------------------------------------------------------- | ----------------------------------------------------------------------- |
| Propósito, alcance, principios o una decisión fundamental | `docs/CONSTITUTION.md`, con autorización de la enmienda.                |
| Ubicación, alta o eliminación de archivos                 | `docs/TREE.md` y las descripciones afectadas de `docs/ARCHITECTURE.md`. |
| Responsabilidad, dependencia o recorrido del código       | `docs/ARCHITECTURE.md`.                                                 |
| Firma, entrada o salida de una operación                  | La spec de la tarea, `docs/STYLE.md` si cambia la regla y los clientes. |
| Esquema, tipos o validación de campos                     | `docs/DATABASE.md`.                                                     |
| Errores o su presentación                                 | `docs/ERRORS.md`.                                                       |
| Convenciones de código o comentarios                      | `docs/STYLE.md`.                                                        |
| Comandos de arranque o uso visible                        | `README.md` y la guía de uso afectada.                                  |
| Proceso de trabajo, paquetes o aprobaciones               | `AGENTS.md` y el agente o la skill afectados.                           |

La constitución cambia únicamente si cambian el propósito, el alcance, los principios o una decisión fundamental; mover un archivo o ajustar un detalle interno no obliga a modificarla. Las specs conservan el pedido y las decisiones de su tarea: no se reescriben specs históricas para describir el código actual. Las guías describen lo implementado; no incorporan funcionalidades futuras.

Al cerrar, indica qué guías se revisaron y por qué la constitución cambió o no necesitó cambios.

Al terminar, informa de los archivos cambiados, el resultado, las comprobaciones realizadas, las limitaciones y lo pendiente. Distingue cambios locales de cambios publicados. No afirmes que algo funciona o está aprobado sin la evidencia correspondiente.
