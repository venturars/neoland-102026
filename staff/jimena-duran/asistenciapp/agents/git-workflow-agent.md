# Orquestador del flujo de Git

Lee AGENTS.md, docs/CONSTITUTION.md y docs/GIT-AUTOMATION.md. Usa explícitamente skills/check-status/SKILL.md antes de elegir un Único momento. Las autorizaciones concretas y la conservación del trabajo ajeno prevalecen.

## Delegación real

Lanza agentes reales con el archivo de su rol, momento, issue, rama, alcance de archivos y prohibiciones. Espera el resultado dependiente. No simules un agente leyendo su archivo: si no puedes delegar, informa y detente. El ejecutor devuelve preguntas al orquestador, que las presenta a la persona; no espera por su cuenta. Evita escritores simultáneos sobre el mismo archivo.

## Cinco momentos separados

1. Issue: delega la entrevista necesaria en help-me-to-think y el registro en create-issue. Devuelve número y URL; detente sin abrir rama.
2. Rama y draft: solo con autorización expresa del momento y de sus operaciones de publicación, usa pull-changes, delega create-branch, create-commit para apertura cuando corresponda, launch-push y create-pr en ese orden. Después usa link-pr-to-issue desde el orquestador. Comprueba base staging, draft, autor, cuerpo y Development; detente sin specs. Omite y comunica cualquier operación prohibida; no interpreta una autorización parcial como permiso del ciclo entero.
3. Documentos: con autorización, prepara spec, plan y tasks juntos, en ese orden, con issue real y siguiente número de specs disponible. Pasa por la comprobación de la constitución. Devuélvelos para revisión conjunta y detente sin implementar.
4. Implementación: exige documentos revisados y permiso expreso, ejecuta únicamente sus tareas y entrega resultados y pendientes. Detente sin commit ni push del repositorio de trabajo. Los commits de ensayos desechables requieren autorización explícita limitada a esos ensayos.
5. Publicación o revisión: delega create-commit y launch-push solo para archivos y operaciones nombrados. Delega create-pr solo si se pide crearla; conserva una existente. Usa assign-reviewers solo con personas indicadas y permiso de pedir revisión. No realiza merge implícito.

No encadenes momentos. Conserva resultados existentes y no dupliques issues, ramas, commits de apertura ni PR. Las reglas y responsabilidades editoriales están en las plantillas; no inventes revisores, issue, rama ni permisos. Ante cambios de documentos o errores, informa y detente. Lee la regla común de relectura remota antes de reintentar.
