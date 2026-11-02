# Plan — Reorganizar los documentos SDD

Issue: #754.

Estado: implementado y comprobado en local, tras la autorización expresa. Pendiente de commit.

Todas las rutas son relativas a la raíz de `first-app`.

## Recorrido y contratos

Es un cambio solo de documentación. No cambia ninguna capa ni el recorrido de los datos. No hay entradas, salidas, contratos ni SQL nuevos en `src/logic/`. No hay paquetes nuevos, así que no hace falta la revisión con Socket.

No se crea ningún documento en `docs/`. Las reglas técnicas van a documentos que ya existen y que tienen también las demás copias del grupo.

## Archivos

| Archivo                        | Cambio                                                                                                                                                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/CONSTITUTION.md`         | Se reescribe con seis apartados: propósito y alcance, principios de diseño, decisiones tecnológicas, seguridad y datos, gobierno y guías.                                                                             |
| `AGENTS.md`                    | Se reescribe por apartados. El SDD exige `docs/specs/<nombre>/` para cualquier cambio de un archivo de la app. Un apartado de paquetes recoge pnpm y Socket. El cierre recoge la tabla de qué documento se actualiza. |
| `docs/STYLE.md`                | Añade un apartado de funciones de negocio: firma, orden de los pasos, actualización parcial y respuesta.                                                                                                              |
| `agents/git-workflow-agent.md` | El procesamiento respeta las aprobaciones SDD. El paso de empezar termina remitiendo al SDD de `AGENTS.md`. Un fallo se informa sin dar el paso por completado.                                                       |
| `agents/create-pr.md`          | Si la pull request ya existe, se reutiliza y conserva su estado de revisión.                                                                                                                                          |
| `docs/ARCHITECTURE.md`         | Se corrige la frase de las llamadas entre capas. La descripción de la constitución dice que recoge principios y remite a `AGENTS.md` y `docs/STYLE.md` para lo que sale de ella.                                      |
| `docs/TREE.md`                 | Añade `docs/specs/reorganize-sdd-docs/` y `docs/specs/socket-mcp-reference/`, que faltaba desde la issue #651. No añade documentos nuevos en `docs/`.                                                                 |

## De dónde sale cada regla

| Regla de la constitución anterior                           | Destino                                           |
| ----------------------------------------------------------- | ------------------------------------------------- |
| Objetivo, alcance y decisiones fundamentales                | `docs/CONSTITUTION.md`                            |
| Flujo de una operación                                      | `docs/ARCHITECTURE.md`, donde ya estaba           |
| Specs (`spec.md`, `plan.md`, `tasks.md`)                    | `AGENTS.md`, apartado SDD                         |
| Gestión de dependencias y Paquetes (con las reglas de #651) | `AGENTS.md`, apartado de paquetes                 |
| Orden de una función y contrato de las funciones            | `docs/STYLE.md`, apartado de funciones de negocio |
| Reglas de implementación y seguridad                        | `docs/CONSTITUTION.md` y `AGENTS.md`              |
| Sincronización de la documentación                          | `AGENTS.md`, cierre                               |

## Verificación

- Comparar la constitución anterior con los documentos nuevos regla por regla, con la tabla de arriba.
- Comprobar que `docs/` tiene los mismos documentos que antes y que los enlaces relativos apuntan a archivos existentes.
- Ejecutar `pnpm format` limitado a los archivos de la tarea y comprobar que no cambia otros.
- `pnpm lint` no aplica: no hay JavaScript modificado.
