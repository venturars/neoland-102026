# Tareas: actualizar las plantillas del flujo Git

Issue: #749 · PR: #750.
Referencias: [spec aprobada](spec.md) y [plan aprobado](plan.md).
Estado: aprobadas por Miguel el 2026-11-02.

No implementar hasta aprobar estas tareas y recibir la petición de hacerlo.
Todas las rutas son relativas a first-app-ai salvo la referencia del ejercicio.

## Preparación

- [x] **T01 · Alcance inicial — CA-05, CA-06.** Confirmar rama
  749-chore-update-git-workflow-templates y estado local. Guardar inventario y
  hashes de fuentes, incluyendo los documentos SDD aún sin seguimiento. Revisar
  AGENTS y los límites del plan. Resultado: comparación inicial reproducible sin
  datos, instalaciones ni secretos copiados al registro.
- [x] **T02 · Fuente fijada — CA-01.** Leer las doce plantillas mediante git show
  desde exercises/git-workflow-agent-template en el commit
  25208d23157626954906ffe7da32757c58d9a66e. Resultado: fuente identificada y
  disponible sin usar silenciosamente una versión posterior.

## Plantillas

- [x] **T03 · Plantillas feat — CA-01, CA-03.** Añadir
  templates/issues/feat_issue.md y
  templates/pull-request/feat-pull-request.md desde T02. Conservar su contenido,
  comentarios, secciones y casillas. Resultado: el par corresponde exactamente
  a la fuente fijada y mantiene títulos en inglés y cuerpos en español.
- [x] **T04 · Plantillas fix — CA-01, CA-03.** Añadir
  templates/issues/fix_issue.md y
  templates/pull-request/fix-pull-request.md desde T02. Conservar su contenido,
  comentarios, secciones y casillas. Resultado: el par corresponde exactamente
  a la fuente fijada y mantiene títulos en inglés y cuerpos en español.
- [x] **T05 · Plantillas docs — CA-01, CA-03.** Añadir
  templates/issues/docs_issue.md y
  templates/pull-request/docs-pull-request.md desde T02. Conservar su contenido,
  comentarios, secciones y casillas. Resultado: el par corresponde exactamente
  a la fuente fijada y mantiene títulos en inglés y cuerpos en español.
- [x] **T06 · Plantillas refactor — CA-01, CA-03.** Añadir
  templates/issues/refactor_issue.md y
  templates/pull-request/refactor-pull-request.md desde T02. Conservar su contenido,
  comentarios, secciones y casillas. Resultado: el par corresponde exactamente
  a la fuente fijada y mantiene títulos en inglés y cuerpos en español.
- [x] **T07 · Plantillas test — CA-01, CA-03.** Añadir
  templates/issues/test_issue.md y
  templates/pull-request/test-pull-request.md desde T02. Conservar su contenido,
  comentarios, secciones y casillas. Resultado: el par corresponde exactamente
  a la fuente fijada y mantiene títulos en inglés y cuerpos en español.
- [x] **T08 · Plantillas chore — CA-01, CA-03.** Añadir
  templates/issues/chore_issue.md y
  templates/pull-request/chore-pull-request.md desde T02. Conservar su contenido,
  comentarios, secciones y casillas. Resultado: el par corresponde exactamente
  a la fuente fijada y mantiene títulos en inglés y cuerpos en español.

## Instrucciones

- [x] **T09 · Creación de issues — CA-02, CA-03, CA-05.** Actualizar únicamente
  agents/create-issue.md y skills/create-issue/SKILL.md para elegir el tipo
  admitido y su plantilla. Ante un tipo sin plantilla, elegir el admitido más
  cercano, comunicarlo y conservarlo para rama y PR. Resultado: selección clara,
  manteniendo asignación, MCP, comprobaciones de duplicados y manejo de fallos.
- [x] **T10 · Tipo de rama — CA-02, CA-05.** Ajustar agents/create-branch.md para
  recibir el mismo tipo admitido de T09. Resultado: nombre coherente con las
  plantillas, helper intacto y base staging; sin renombrar ramas existentes.
- [x] **T11 · Creación de PRs — CA-02, CA-03, CA-05.** Ajustar agents/create-pr.md
  y skills/create-pr-base-staging/SKILL.md para usar la plantilla del mismo tipo,
  distinguiendo trabajo previsto y realizado. Dejar Issue vacío para el principal
  y casillas sin marcar en draft. Resultado: conservar creación directa en draft,
  base staging, asignación, lectura posterior y protección de PRs existentes.
- [x] **T12 · Casillas al pedir revisión — CA-03, CA-05.** Ajustar
  skills/assign-reviewers/SKILL.md para comprobar cada casilla y marcar solo lo
  verificado al solicitar revisión. Comunicar una comprobación necesaria pendiente
  antes de pasar a revisión. Resultado: no inventar pruebas o revisores ni enviar
  solicitudes durante esta implementación; mantener los controles actuales.
- [x] **T13 · Cierre según configuración real — CA-04, CA-05.** Corregir
  skills/link-pr-to-issue/SKILL.md: consultar la rama predeterminada real sin
  exigir main; conservar Closes único, Development, lectura previa y posterior
  y omitir mutaciones duplicadas. Resultado: cierre automático descrito según la
  rama real, sin cierre por API ni cambio de base.
- [x] **T14 · Reglas del principal — CA-03, CA-04, CA-05.** Ajustar solamente los
  pasajes previstos de AGENTS.md y agents/git-workflow-agent.md sobre cierre y
  casillas al pedir revisión. Resultado: reglas coherentes con T12–T13; delegación,
  SDD, permisos, Socket y protecciones restantes conservados.
- [x] **T15 · Retirada de genéricas — CA-01, CA-02.** Comprobar que las referencias
  activas se han actualizado y retirar templates/issues/basic_issue.md y
  templates/pull-request/basic-pull-request.md. Resultado: solo las doce plantillas
  por tipo, sin instrucciones activas que apunten a las retiradas. No reescribir
  referencias históricas; la actualización del inventario queda en T16.
- [x] **T16 · Guías — CA-02, CA-06.** Actualizar docs/ARCHITECTURE.md y docs/TREE.md
  con las responsabilidades de las plantillas, los doce archivos y los tres
  documentos SDD de esta tarea. Resultado: inventario y responsabilidades reales,
  sin añadir archivos locales o modificar guías ajenas al alcance.

## Verificación

- [x] **T17 · Comparación y recorridos — CA-01, CA-02, CA-03.** Comparar los doce
  archivos con T02 y revisar todas sus referencias activas. Recorrer por lectura
  los seis tipos y un ejemplo sin plantilla, como maintenance → chore: mismo tipo
  admitido en issue, PR y rama prevista. Revisar draft con casillas vacías, enlace
  posterior por el principal y revisión con casillas solo verificadas. Resultado:
  instrucciones coherentes; no ejecutar helpers ni crear recursos de prueba.
- [x] **T18 · Enlace real y caso alternativo — CA-04, CA-05.** Consultar solo por
  lectura la rama predeterminada y el enlace entre #749 y #750; confirmar base
  staging y draft. Contrastar documentalmente el caso de otra rama predeterminada,
  sin mover la base ni prometer cierre al fusionar en staging en ese caso.
  Resultado: evidencia de configuración/enlace o error real registrado, sin
  mutaciones, cierre de issue ni solicitudes de revisión.
- [x] **T19 · Formato y lint — CA-06.** Crear una copia desechable sin datos ni
  secretos, reutilizando dependencias existentes sin alterar su instalación.
  Ejecutar pnpm format y después pnpm lint; impedir reinstalaciones automáticas
  en la copia mediante la opción ya utilizada en la tarea anterior si hace falta.
  No instalar paquetes ni cambiar configuración o versiones. Resultado: comandos
  y salidas reales registrados, código idéntico antes/después; si faltan
  dependencias, registrar el bloqueo, sin declarar la tarea terminada.
- [x] **T20 · Conservación y revisión final — CA-01 a CA-06.** Contrastar estado,
  inventario y hashes con T01 y revisar el contenido de cada cambio permitido.
  Confirmar scripts, src, configuración, dependencias, referencia MCP,
  constitución y specs históricas intactos. Ejecutar git diff --check y revisar
  también los archivos nuevos aún sin seguimiento. Resultado: únicamente el
  alcance del plan, sin pérdida de controles ni cambios de aplicación.
- [x] **T21 · Evidencia y limpieza — CA-01 a CA-06.** Registrar aquí resultados de
  T01–T20, comandos y bloqueos. Retirar solamente temporales propios después de
  guardar la evidencia. Resultado: distinguir comprobaciones documentales de
  ejecuciones reales, sin atribuir pruebas Git o revisiones no realizadas.

## Entrega posterior

- [ ] **T22 · Publicación autorizada — CA-05, CA-06.** Solo cuando Miguel pida
  guardar y publicar, delegar commits pequeños y push de archivos explícitos.
  Actualizar #750 con la plantilla chore, trabajo y comprobaciones reales,
  manteniendo staging, draft, Closes #749 y Development. Las casillas permanecen
  vacías mientras siga en draft. No pedir revisores hasta recibir sus nombres,
  no fusionar ni cerrar la issue. Resultado: publicación verificada por lectura;
  no añadir otro commit solo para marcar esta tarea después de aprobaciones.

## Evidencia

Implementación y comprobaciones T01–T21 realizadas el 2026-11-02.
T22 queda pendiente de petición expresa para commits y push.

- T01–T02: rama 749, HEAD add6628c; inventario inicial de fuentes mediante git
  ls-files --cached --others --exclude-standard y hashes SHA-256. Fuente leída
  mediante git show en 25208d23157626954906ffe7da32757c58d9a66e.
- T03–T08: las doce plantillas comparadas byte a byte con esa revisión: idénticas.
- T09–T16: instrucciones y guías actualizadas dentro del listado del plan; dos
  plantillas genéricas retiradas. Sin referencias activas a sus nombres en agentes,
  skills o registros Cursor. Referencias históricas conservadas.
- T17: recorridos documentales de feat, fix, docs, refactor, test y chore:
  cada tipo tiene su par de plantillas y el mismo tipo de rama previsto.
  maintenance se interpreta como chore, sin pasar maintenance al helper.
  Revisados título/idiomas, draft sin casillas marcadas, enlace por el principal
  y comprobación de evidencia antes de pedir revisión. No se ejecutaron acciones
  Git de prueba ni se publicaron recursos para comprobar estas instrucciones.
- T18: gh api graphql confirmó defaultBranchRef staging, issue #749 abierta
  enlazada con #750, PR con base staging, head 749-chore-update-git-workflow-templates
  y draft true. Solo lectura. En el caso conceptual de main predeterminada,
  las instrucciones mantienen staging y no prometen cierre al fusionar allí.
- T19: en copia temporal sin datos ni secretos y con node_modules existente
  copiado, pnpm --config.verifyDepsBeforeRun=false format y después
  pnpm --config.verifyDepsBeforeRun=false lint: ambos salida 0. La opción evita
  reinstalar automáticamente en esa copia, sin cambiar configuración del proyecto.
  Los 13 archivos JavaScript conservaron sus hashes después de formatear.
- T20: comparación con inventario inicial: once documentos existentes modificados,
  dos genéricas retiradas y doce plantillas añadidas; los documentos SDD de esta
  tarea ya figuraban en el inventario inicial. Scripts Git, src, scripts Jupyter,
  paquetes, lockfile, configuración, referencias MCP, registros Cursor,
  constitución y specs históricas permanecen idénticos. Árbol actualizado y
  git diff --check correcto; archivos nuevos revisados por separado.
- T21: retirados la copia temporal y los ejecutores/inventarios propios tras
  registrar los resultados. Sin cambios de datos, instalaciones o credenciales;
  sin commits, push, solicitudes de revisión ni cambios de base o estado de PR.

