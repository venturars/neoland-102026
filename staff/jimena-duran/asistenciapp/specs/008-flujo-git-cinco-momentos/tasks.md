Issue: #751

# Tareas de corrección de la integración

Estado: C01–C20 aprobadas conjuntamente con spec y plan; implementación y comprobaciones locales completadas, pendientes de revisión. Evidencia en [verification-original-gitflow.md](verification-original-gitflow.md). C19 incluye expresamente commits y push en repositorios desechables con remoto local, sin necesitar otro permiso.

Las T01–T55 publicadas en `25a2858920c3eda5f46a199c7b9d11cfeee031c6` describen la implementación anterior. Sus resultados permanecen en `verification.md`, sin cambios; no validan los scripts originales. Se usan identificadores C para distinguir esta corrección.

Fuente: `exercises/git-workflow-agent-template` en `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`. Rutas relativas a AsistenciApp.

- [x] C01. Capturar referencia de archivos protegidos, datos y ramas antes de implementar. Resultado: conservación comprobable y trabajo independiente pausado intacto. (CA-10)
- [x] C02. Retirar las ocho herramientas `.ps1` y `tools/tests/test-git-automation.ps1` enumeradas en el plan. Resultado: no quedan implementaciones ni ensayos propios de reemplazo. (CA-07, CA-11)
- [x] C03. Incorporar `tools/check-status.sh`. Resultado: mismo nombre y contenido que el blob fijado. (CA-07)
- [x] C04. Incorporar `tools/pull-changes.sh`. Resultado: original intacto, sin mejoras locales. (CA-07, CA-11)
- [x] C05. Incorporar `tools/create-branch-from-staging.sh`. Resultado: original intacto. (CA-02, CA-07)
- [x] C06. Incorporar `tools/create-branch.sh`. Resultado: original intacto. (CA-07)
- [x] C07. Incorporar `tools/create-empty-commit.sh`. Resultado: original intacto. (CA-02, CA-07)
- [x] C08. Incorporar `tools/commit-changes.sh`. Resultado: original intacto, con límites de la fuente ya señalados en el plan. (CA-05, CA-07, CA-11)
- [x] C09. Incorporar `tools/launch-push.sh`. Resultado: original intacto, sin añadir opciones propias. (CA-05, CA-07, CA-11)
- [x] C10. Restaurar los siete archivos de `agents/` y añadir solo las referencias locales descritas al orquestador. Resultado: texto original y entrada al SDD de AsistenciApp verificables en el diff. (CA-01–CA-05, CA-07–CA-08)
- [x] C11. Restaurar las quince skills y ajustar las siete rutas de comandos a esta aplicación. Resultado: diff limitado a esas rutas y ninguna regla de comportamiento propia añadida. (CA-06–CA-07)
- [x] C12. Conservar las doce plantillas y restaurar `MCPS/github-mcp-server/mcp.txt`. Resultado: blobs iguales a la fuente; sin editar configuración personal ni instalar nada. (CA-06–CA-07, CA-10)
- [x] C13. Ajustar únicamente §4 y el texto necesario de la enmienda 3.1 en `docs/CONSTITUTION.md` según el plan aprobado. Resultado: SDD propio y cinco momentos, sin nuevas pausas o cambios del producto. (CA-08)
- [x] C14. Ajustar la integración y estado de la 008 en `AGENTS.md`. Resultado: cinco momentos de AsistenciApp y referencia breve al flujo original, sin copiar otro manual. (CA-01–CA-05, CA-08)
- [x] C15. Actualizar `docs/ARCHITECTURE.md`. Resultado: cinco carpetas de automatización y ausencia de referencias a PowerShell o ensayos retirados como implementación vigente. (CA-07–CA-08)
- [x] C16. Actualizar `docs/GIT-AUTOMATION.md`. Resultado: ejecución mediante Git Bash desde raíz, contratos originales, MCP con alternativa gh y límites de la fuente, sin garantizar controles propios eliminados. (CA-07–CA-08, CA-11)
- [x] C17. Ajustar solo las expectativas SDD afectadas en `tests/test_sdd_rules.py` y ejecutarlas con el intérprete existente. Resultado: cobertura e invariantes conservadas; pruebas funcionales, ámbito e integridad histórica intactos. (CA-01–CA-05, CA-08–CA-10)
- [x] C18. Comparar los originales y pasar `bash -n` a los siete scripts; comprobar estado en raíz y copia con espacios. Resultado: nombres, contenido LF, comandos y diferencias documentales permitidas verificados. El índice temporal de publicación confirmó los siete modos 100755 y sus blobs originales antes del commit. (CA-06–CA-07)
- [x] C19. Con autorización expresa ya concedida para las mutaciones de ensayo, comprobar los contratos originales en repositorios desechables con remoto local, según el plan. Resultado: comportamiento real registrado, sin operaciones en el repositorio de trabajo o GitHub ni nuevos tests permanentes propios. (CA-02, CA-05, CA-07, CA-10)
- [x] C20. Registrar resultados nuevos y clasificación final en `verification-original-gitflow.md`; revisar diff, espacios, hashes y ramas protegidas. Resultado: evidencia atribuida a lo ejecutado, `verification.md` intacto y cada comentario trazable sin resolver hilos. (CA-10–CA-12)

Al terminar, detenerse para revisión de comparación, pruebas y pendientes. Commit selectivo y push de la corrección autorizados en la misma rama y PR #756. Verificar los siete modos 100755 y sus blobs antes del commit; conservar Closes #751 y Development, sin respuestas a comentarios, resolución de conversaciones, cambios de revisores ni merge.
