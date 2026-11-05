Issue: #1011

# Plan — Sincronizar el flujo de Git con el template

Estado: implementación autorizada por la persona responsable. La pregunta sobre las pull requests existentes se resolvió con la opción recomendada.

## Fuente

La fuente es `exercises/git-workflow-agent-template/`, en su versión de `staging`. Las rutas de la aplicación que se citan son relativas a la raíz de `first-app`.

Es una actualización de las herramientas e instrucciones de trabajo. No cambia ninguna capa, ningún recorrido de datos ni ningún contrato de `src/`.

## Comparación con el template

| Grupo                                                                                                                      | Resultado                              | Acción                              |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------- |
| `templates/` y `MCPS/github-mcp-server/`                                                                                   | Iguales                                | Ninguna                             |
| `agents/` sin cambios: `create-branch`, `create-commit`, `create-issue`, `launch-push`                                     | Iguales                                | Ninguna                             |
| Skills `check-status`, `create-branch`, `create-branch-from-staging`, `create-empty-commit`, `launch-push`, `pull-changes` | Solo difiere la ruta local de `tools/` | Ninguna: adaptación que se conserva |
| Tres agentes, cinco skills y un script                                                                                     | Novedades                              | Se detallan a continuación          |

## Archivos que cambian

| Archivo                                  | Cambio                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `agents/git-workflow-agent.md`           | Se copia del template: elección del momento, decisión sobre la issue, comprobación de pasos y `create-pr` con una skill. |
| `agents/help-me-to-think.md`             | Se copia del template: varias preguntas por ronda.                                                                       |
| `agents/create-pr.md`                    | Se copia del template, conservando la regla local.                                                                       |
| `skills/grill-me/SKILL.md`               | Se copia del template: varias preguntas por ronda.                                                                       |
| `skills/grill-with-docs/SKILL.md`        | Se copia del template: varias preguntas por ronda.                                                                       |
| `skills/create-draft/SKILL.md`           | Se copia del template.                                                                                                   |
| `skills/commit-changes/SKILL.md`         | Se añade la regla del mensaje técnico y se conserva la ruta local.                                                       |
| `skills/create-pr-base-staging/SKILL.md` | Se copia del template y el comando apunta a la ruta local de `tools/`.                                                   |
| `tools/create-pr-base-staging.sh`        | Archivo nuevo, copiado del template, con permiso de ejecución.                                                           |

## Adaptaciones locales

- `skills/create-pr-base-staging/SKILL.md` usa el mismo prefijo local que las demás skills que lanzan scripts, sin el `bash` delante. Se retira la frase sobre copiar la plantilla a un proyecto, que aquí ya no aplica.
- En el template, el script no tiene permiso de ejecución. En la app sí lo tiene, igual que los otros siete.
- El script usa GitHub CLI en lugar del MCP, así que la creación de la pull request requiere `gh` autenticado.

## Guías

| Guía                   | Cambio                                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `docs/TREE.md`         | Añade `tools/create-pr-base-staging.sh` y la carpeta de esta spec.                                                         |
| `docs/ARCHITECTURE.md` | El momento Empezar abre la pull request solo con `skills/create-pr-base-staging`, y `tools/` pasa de siete a ocho scripts. |
| `AGENTS.md`            | Se revisa y no cambia: su apartado 3 ya es compatible con el flujo nuevo y las paradas SDD siguen igual.                   |
| `docs/CONSTITUTION.md` | No cambia: no se modifican el propósito, el alcance, los principios ni las decisiones fundamentales.                       |

`skills/assign-author` y `skills/create-draft` se mantienen como herramientas de `create-pr` para una pull request que ya existe.

## Paquetes y límites

No se añaden ni se cambian paquetes, así que no hace falta revisión con Socket. No se modifican `src/`, `tests/`, `package.json`, el lockfile, el template ni las specs históricas.

## Comprobación

1. Comparar `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/github-mcp-server/` con el template, normalizando el prefijo local de `tools/`. Solo pueden quedar las adaptaciones de este plan.
2. Pasar `bash -n` y comprobar el permiso de ejecución de los ocho scripts.
3. Ejecutar `tools/check-status.sh` con la ruta de la aplicación desde la raíz del repositorio.
4. Comprobar que `create-pr-base-staging.sh` rechaza los argumentos incorrectos, sin crear ninguna pull request de prueba.
5. Buscar en las instrucciones vigentes referencias a la ruta genérica del template o al flujo anterior de tres skills.
6. Aplicar Prettier solo a los archivos de este pedido, ejecutar `pnpm lint` y `git diff --check`.
7. Revisar que el diff final solo contiene los archivos de este plan.

## Decisión sobre una pull request que ya existe

El template permitía devolver a draft una pull request en revisión sin que nadie lo pidiera. `AGENTS.md` solo saca una pull request de draft cuando la persona pide revisión, así que se conserva la protección local:

- `agents/create-pr.md` mantiene la regla local: conserva el estado de revisión y no vuelve a draft sin autorización.
- `skills/create-pr-base-staging/SKILL.md` remite a esa regla en lugar de repetirla.
- `skills/create-draft/SKILL.md` se copia del template, porque solo se usa cuando ese cambio está autorizado.

Estas dos diferencias quedan como adaptaciones locales aprobadas.

## Resultados de la comprobación

- Al normalizar el prefijo local de `tools/`, `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/github-mcp-server/` coinciden con el template, salvo las adaptaciones aprobadas en `agents/create-pr.md` y `skills/create-pr-base-staging/SKILL.md`.
- `agents/git-workflow-agent.md` difiere del template solo en espacios: Prettier ajusta la sangría al formatear. Su contenido es el mismo.
- Los ocho scripts pasan `bash -n` y tienen permiso de ejecución. `tools/check-status.sh` termina correctamente desde la raíz del repositorio.
- `tools/create-pr-base-staging.sh` rechaza la falta de argumentos y un cuerpo inexistente. No se creó ninguna pull request de prueba, así que su caso correcto queda sin ejecutar.
- No quedan referencias a la ruta genérica del template ni a las entrevistas de una sola pregunta en las instrucciones y guías vigentes.
- Prettier se aplicó solo a los archivos de este pedido. `pnpm lint` y `git diff --check` terminan sin errores.
- Se revisaron `AGENTS.md` y `docs/CONSTITUTION.md`: no necesitan cambios, porque el flujo nuevo es compatible con el apartado 3 y no cambian el propósito, el alcance ni los principios.
