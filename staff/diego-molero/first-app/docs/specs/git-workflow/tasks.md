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
