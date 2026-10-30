Issue: #588

# Tareas de automatización de Git

Spec, plan y T01–T23 aprobados por Jimena, incluidas implementación y verificaciones aisladas. Resultados y límites en [verification.md](verification.md). La aprobación inicial no autorizaba publicación; Jimena autorizó después commit selectivo, push y actualización de #600, además de esta corrección documental. Se mantienen draft, base staging y las restricciones sobre merge y revisores.

Todas las rutas son relativas a staff/jimena-duran/first-app. Cada tarea debe registrar su resultado y cualquier comprobación pendiente.

- [x] T01. Inspeccionar rama, índice, cambios locales y herramientas antes de implementar.
  Resultado: estado documentado en jimena-duran-291020262, sin incorporar archivos ajenos ni resolver bloqueos sin informar. Criterios: 6 y 7.
- [x] T02. Crear agents/git-workflow-agent.md con selección de momento, delegación real y respeto del alcance autorizado.
  Resultado: orquestador con entradas y salidas verificables y ambas pausas humanas. Criterios: 1, 2 y 7.
- [x] T03. Crear agents/help-me-to-think.md para entrevistar y devolver preguntas al orquestador.
  Resultado: rol sin escrituras ni ejecución de otros momentos. Criterio: 1.
- [x] T04. Crear agents/create-issue.md, create-branch.md, create-commit.md, launch-push.md y create-pr.md.
  Resultado: responsabilidades separadas, resultados verificables y ramas recibidas del contexto de cada tarea. Criterios: 1, 3, 4 y 7.
- [x] T05. Crear skills/grill-with-docs/SKILL.md y skills/grill-me/SKILL.md.
  Resultado: entrevistas con alcance definido y devolución de dudas sin inventar requisitos. Criterio: 1.
- [x] T06. Crear skills/create-issue, assign-author, create-pr-base-staging, create-draft, link-pr-to-issue y assign-reviewers, cada una con SKILL.md.
  Resultado: operaciones GitHub con identidad comprobada, plantillas, control de duplicados y errores visibles. Criterios: 2, 3, 4 y 6.
- [x] T07. Crear skills/check-status, pull-changes, create-branch-from-staging y create-branch, cada una con SKILL.md.
  Resultado: instrucciones con rutas locales y parámetros para ramas futuras, sin fijar el nombre de esta entrega. Criterios: 3, 5, 6 y 7.
- [x] T08. Crear skills/create-empty-commit, commit-changes y launch-push, cada una con SKILL.md.
  Resultado: acciones limitadas a archivos y rama autorizados, sin publicación implícita. Criterios: 3, 6 y 7.
- [x] T09. Crear tools/check-status.ps1 con resolución de raíz y comprobación de códigos de salida nativos en PowerShell 5.1.
  Resultado: resumen de rama, remoto, índice y cambios locales desde raíz o aplicación. Criterios: 3, 5 y 6.
- [x] T10. Crear tools/pull-changes.ps1 con actualización de staging solo mediante fast-forward y protección de worktrees y cambios locales.
  Resultado: divergencias y bloqueos detienen el paso sin sobrescribir trabajo. Criterios: 3 y 6.
- [x] T11. Crear tools/create-branch-from-staging.ps1 y tools/create-branch.ps1 con parámetros validados.
  Resultado: creación o recuperación de ramas de cada tarea conservando su trabajo; ninguna rama personal fijada permanentemente. Criterios: 3, 5, 6 y 7.
- [x] T12. Crear tools/create-empty-commit.ps1 y tools/commit-changes.ps1 con índice temporal y restauración de entorno ante fallos.
  Resultado: commits limitados al alcance indicado y conservación del índice ajeno. Criterios: 3 y 6.
- [x] T13. Crear tools/launch-push.ps1 con validación de rama autorizada y prohibición de force push.
  Resultado: publicación explícita de la rama correcta, con fallos visibles. Criterios: 3, 6 y 7.
- [x] T14. Crear templates/issues/basic_issue.md y templates/pull-request/basic-pull-request.md.
  Resultado: cuerpos en español con secciones coherentes y referencia `Closes #N` y comprobación separada de Development; el cierre depende de que la PR apunte a la rama predeterminada. Criterios: 2 y 4.
- [x] T15. Crear MCPS/github-mcp-server/mcp.txt y docs/GIT-AUTOMATION.md.
  Resultado: referencias y uso en Windows/VS Code/Codex, capacidades reales, autenticación y alternativa gh documentados sin secretos. Criterios: 5, 6 y 8.
- [x] T16. Integrar orquestación y orden de revisión en el AGENTS.md existente sin duplicar instrucciones.
  Resultado: issue antes de spec, revisión de spec/plan y tareas, e implementación solo autorizada; ramas futuras admitidas. Criterios: 1, 2 y 7.
- [x] T17. Actualizar docs/TREE.md y docs/ARCHITECTURE.md con las carpetas y responsabilidades añadidas.
  Resultado: documentación coherente con los archivos reales sin reorganizar el código de negocio. Criterio: 8.
- [x] T18. Analizar los .ps1 y comprobar las operaciones de lectura desde raíz, aplicación y ruta con espacios.
  Resultado: compatibilidad PowerShell registrada con comandos y resultados reales. Criterios: 5 y 6.
- [x] T19. Tras autorización de pruebas con mutaciones locales, verificar Git en un repositorio desechable con remoto local.
  Resultado: ramas con nombres distintos al de esta entrega, divergencias, cambios locales, índices y fallos cubiertos sin mutar el repositorio personal. Criterios: 3, 6 y 7.
- [x] T20. Verificar delegación real y pausas del flujo reutilizando #588, sin crear issues ni PR de prueba.
  Resultado: evidencia de agentes reales y detención en los puntos de revisión; operaciones remotas no ejecutadas identificadas. Criterios: 1, 2 y 4.
- [x] T21. Verificar las operaciones de usuarios y clientes existentes en una copia temporal con base desechable.
  Resultado: regresión documentada y ejecución de notebooks o limitación de kernel explícita, sin tocar la base personal. Criterio: 8.
- [x] T22. Localizar pnpm y ejecutar pnpm format y pnpm lint; informar antes de resolver una herramienta ausente.
  Resultado: salidas registradas y cambios de formato revisados; el marcador pnpm test no cuenta como prueba. Criterios: 6 y 8.
- [x] T23. Revisar diff, sintaxis documental y ausencia de nombres de rama fijados en componentes reutilizables.
  Resultado histórico inicial: solo cambios aprobados, sin referencias de procedencia, src, Socket nuevo ni secretos; en esa fase aún no se habían realizado commit, push ni PR. La publicación posterior autorizada está registrada en verification.md. Criterios: 7 y 8.

## Parada de revisión

La revisión y autorización de estas tareas ya se realizaron. La restricción a jimena-duran-291020262 solo afecta a esta entrega; no se convierte en una restricción permanente de la automatización. Los resultados de publicación, escritura por gh y vínculo Development, junto al fallo de escritura MCP que sigue sin validar, se detallan en verification.md.
