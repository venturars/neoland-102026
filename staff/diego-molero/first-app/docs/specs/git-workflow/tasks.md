# Tareas del flujo de trabajo de Git

Issue: #663. Fecha: 2026-10-30. Autorización anticipada de Diego para implementar, comprobar y entregar, sin revisión individual atribuida de estos documentos.

- [x] **T01:** Leer las guías de Diego y la plantilla; escribir spec, plan y tareas antes de copiar o adaptar automatización. CA-01, CA-03, CA-08.
- [x] **T02:** Copiar los 32 archivos de la plantilla y adaptar rutas y referencias locales sin tocar fuente ni guías compartidas. CA-01, CA-08.
- [x] **T03:** Precisar delegación real, lectura explícita de skills, autorizaciones anticipadas y acceso GitHub con alternativa oficial sin duplicados ni cambios de configuración. CA-02, CA-03, CA-04.
- [x] **T04:** Corregir únicamente riesgos concretos identificados de scripts, manteniendo operaciones pequeñas y trabajo ajeno; actualizar sus instrucciones. CA-05, CA-06.
- [x] **T05:** Validar sintaxis Bash, UTF-8 y rutas/enlaces. CA-01, CA-07, CA-08.
- [x] **T06:** Ejecutar recorridos Git en repositorios temporales con remoto bare local y registrar resultados, incluidos rechazos. CA-05, CA-06, CA-07.
- [x] **T07:** Revisar alcance, referencias y cambios; entregar evidencia y límites al principal sin escribir Git en el checkout real ni crear recursos remotos. CA-01 a CA-08.

## Evidencia

Implementación y comprobación completadas por los agentes y el principal el 2026-10-30. Las operaciones remotas de GitHub no se declararán verificadas por haber redactado sus instrucciones.

## Cierre de verificación por el principal

Los subagentes alcanzaron su límite de uso; el principal completó las comprobaciones pendientes. `python -X utf8 .venv/git-workflow-check-663-20261030.py` superó 14 recorridos en repositorios nuevos con remoto bare local: sintaxis de siete scripts, estado sin commits, ramas locales y remotas, commits vacíos y de rutas literales, conservación de staged ajeno, rechazos de directorios/patrones y ramas protegidas, push con upstream y fast-forward sin perder la rama. No se probaron esas operaciones en el repositorio compartido. Las guías comunes se integraron por el principal; UTF-8 y enlaces revisados. Las operaciones reales de entrega se registran en la PR de la issue #663. Linux/macOS no ejecutados.

## Iteración del 3 de noviembre de 2026 · Issue #774

Diego autoriza expresamente implementar, comprobar y entregar el bloque. No se atribuye una revisión individual distinta de la aprobación del plan en el chat.

- [x] **U01:** Registrar esta ampliación en spec, plan y tareas antes de cambiar la automatización. CA-09 a CA-12.
- [x] **U02:** Incorporar doce plantillas, adaptar el prefijo y retirar las dos básicas. CA-09, CA-10.
- [x] **U03:** Actualizar selección por tipo y referencias de agentes/skills, conservando enlace, delegación y protecciones. CA-09 a CA-11.
- [x] **U04:** Actualizar arquitectura y árbol, revisar UTF-8, enlaces, fuente y scripts intactos. CA-10, CA-12.
- [x] **U05:** Ejecutar y registrar recorridos Git aislados; comprobar el alcance y preparar la entrega en borrador sin merge. CA-11, CA-12.

### Evidencia de esta iteración · 2026-11-03

- Issue #774 creada mediante gh tras confirmar que el MCP solo abrió un formulario; identidad y ausencia de duplicados verificadas por el subagente. staging actualizado en fast-forward a acf36184; rama codex/774-chore-update-git-templates y apertura vacía 7209aafc publicadas con upstream.
- Documentos ampliados antes de implementar. Doce plantillas incorporadas con comentarios explicativos y prefijo codex/; dos básicas retiradas; selección por tipo y responsabilidad del orquestador revisadas en los dos agentes y las tres skills afectadas.
- El principal ejecutó `python -X utf8 staff/diego-molero/first-app/.venv/git-template-check-20261103.py` en Windows con acceso para Bash: 14 recorridos/comprobaciones correctos y sintaxis de siete scripts. Solo repositorios temporales y remoto bare local bajo .venv; las rutas se verifican antes de operar. Incluye conservación del índice ajeno, rutas literales, rechazo de ramas protegidas/HEAD separado/force, ramas locales y remotas, fast-forward y rechazo de divergencia.
- Revisión programática de 24 archivos previstos: UTF-8 estricto, enlaces locales existentes, ausencia de referencias a plantillas básicas y doce entradas del árbol. Las doce plantillas coinciden con la fuente compartida salvo el prefijo codex/ de su comentario de rama. Los siete scripts coinciden byte a byte con staging; src, scripts, dependencias, MCPS y orquestador no tienen diferencias. El contenido anterior de spec, plan y tasks se conserva como prefijo íntegro.
- `git diff --check` sin incidencias. No se ejecutó la aplicación ni se accedió a la base personal, no se añadieron paquetes ni una suite de tests. Linux y macOS no ejecutados.
- Commit de trabajo, publicación y PR en borrador se ejecutan después de estas comprobaciones con los roles correspondientes. Sus resultados finales quedan en la PR de esta issue; esta evidencia no da por hechas operaciones pendientes. El merge queda a cargo de Diego.

## Iteración del 4 de noviembre de 2026 · Issue #855

- [x] **V01:** Comparar la plantilla vigente de `staging` con la copia y documentar criterios CA-13 a CA-15.
- [x] **V02:** Actualizar el orquestador y la validación de issue, conservando las decisiones y protecciones locales.
- [x] **V03:** Comprobar los siete scripts, plantillas, referencias, UTF-8 y recorridos Git en repositorios temporales; registrar evidencia real.

El 4 de noviembre, el comprobador aislado `.venv/git-template-check-20261104-855-elevated.py` pasó las siete sintaxis Bash y 14 recorridos con repositorios temporales y remoto bare local. Los siete scripts conservan el contenido de `staging`. Las plantillas existentes siguen siendo seis parejas por tipo y la selección no cambia. La validación añadida en agentes se coteja con la fuente vigente; se mantienen el prefijo `codex/`, la delegación real, el enlace por el orquestador y la alternativa `gh` sin tocar configuración personal.

## Iteración del 4 de noviembre de 2026 · Issue #957

- [x] **W01:** Registrar criterios y plan de la caché antes de modificar el workflow.
- [x] **W02:** Implementar la caché persistente y su consulta, alta y corrección local.
- [x] **W03:** Integrar su uso en la asignación de revisores y actualizar arquitectura y árbol.
- [x] **W04:** Verificar casos relevantes en copia temporal, UTF-8, sintaxis y alcance; entregar PR en borrador sin pedir revisores ni fusionar.

La comprobación en Windows usó una copia bajo .venv/reviewer-cache-check-957: aciertos con tildes y mayúsculas, ausencias, persistencia entre procesos, aislamiento entre repositorios, conflicto rechazado (exit 1), sustitución explícita, borrado y JSON dañado rechazado (exit 1). node --check y git diff --check correctos. Solo se usó Node local; no se pidieron revisiones reales para verificarlo. Linux/macOS pendientes.

- [x] **W05:** Recorrer colaboradores actuales y sus nombres públicos o aportaciones, ampliar alias inequívocos y comprobar la caché ampliada.

La API de GitHub devolvió 16 colaboradores. Se consultaron sus nombres públicos y, para perfiles sin nombre, las cuentas atribuidas a commits de carpetas personales. La caché ampliada contiene 46 alias y cubre los 16 logins; cada alias se consultó con la herramienta local sin fallos. `diego` y `sergio` quedan sin asociación por existir dos compañeros con cada nombre. `mdiazcaballero` conserva solo el login: su perfil no publica nombre y no se pudo atribuirle un nombre personal con la evidencia consultada. Se comprobaron sintaxis Node y `git diff --check` en Windows.

## Iteración del 5 de noviembre de 2026 · Issue #1098

- [x] **X01:** Registrar caducidad, migración y verificación antes de cambiar la herramienta.
- [x] **X02:** Implementar limpieza automática al acceder tras 48 horas y documentarla.
- [x] **X03:** Comprobar límite temporal, migración, errores y alcance en copia temporal; entregar en la PR nueva en borrador.

La comprobación local en Windows usó una copia temporal ignorada: un ciclo de 47 horas y 59 minutos conserva el alias; uno de más de 48 horas lo vacía y guarda el JSON vacío. Se volvió a aprender el alias, se migró una caché de versión 1 conservando sus datos y se rechazó una fecha inválida sin reescribir el archivo. `node --check`, lectura UTF-8 y `git diff --check` correctos. No se ejecutó la aplicación ni se solicitó revisión; Linux/macOS no comprobados.
