# Plan de adaptación del flujo

Issue: #761. Referencia: [spec](spec.md).
Preparación y ejecución completas delegadas por Miguel el 2026-11-02.

## Referencias y alcance

Adaptar el template exercises/git-workflow-agent-template de la revisión
25208d23157626954906ffe7da32757c58d9a66e y los cinco momentos descritos en
staff/ventura-rodriguez/asistenciapp/specs/007-flujo-de-git. No copiar su
constitución: nuestra versión 4.1 conserva controles adicionales de carreras.
Corrección del 2026-11-03: los siete scripts se copian sin modificar su
implementación desde el template en 9e45fcafa3f513df57335d45b4cf260f0b5374bb.
Las siete skills de esas herramientas solo adaptan la ruta ./tools/ a la ruta
de esta app. Se conserva la delegación nativa de Codex y el SDD de cinco momentos;
no se usa first-app-ai como fuente de scripts.

## Archivos

- Crear agents/: principal git-workflow-agent y seis roles (help-me-to-think,
  create-issue, create-branch, create-commit, launch-push, create-pr).
- Crear quince skills para esos roles y las acciones del principal, siete tools
  Bash, seis plantillas de issue y seis de PR, y MCPS/github-mcp-server/mcp.txt.
- Ajustar AGENTS.md al ciclo de cinco momentos, conservando instrucciones de
  seguridad, estilo, scope, pruebas y apagado de servidores. Añadir estado de 013.
- Enmendar solo §4 de docs/CONSTITUTION.md a versión 4.2: documentos preparados
  juntos antes de implementar y autorización humana por momentos; conservar el
  orden y el resto del documento. Registrar el encargo global explícito como
  autorización de esta entrega, sin atribuir una aprobación separada inexistente.
- Actualizar docs/ARCHITECTURE.md con carpetas y responsabilidades Git. README
  añade únicamente una referencia breve al flujo de desarrollo; los pasos de uso
  permanecen igual. No tocar app.py, asistencia/, static/, tests/, requirements,
  datos ni specs anteriores. Las únicas excepciones en tests son
  tests/test_architecture.py y tests/test_registration_security.py: sustituir
  exclusivamente su versión esperada 4.1 por 4.2, manteniendo las demás
  comprobaciones de capas, privacidad y seguridad. La primera ejecución detectó
  que la versión fija anterior rechaza esta enmienda documental válida.

## Procedimiento

Los cinco momentos son issue, draft, documentos, implementación y acción sobre PR.
El agente no encadena momentos sin una petición expresa que los abarque. Dentro
del momento de documentos prepara spec→plan→tasks sin otro ok entre ficheros.
La issue no autoriza implementar por sí sola. Conflictos o dudas reales detienen
el trabajo afectado. Los seis roles Git usan delegación real nativa de Codex;
status, pull, enlace y revisores corresponden al principal.

Ramas nuevas desde staging, PRs staging desde creación. No ramas encadenadas,
force push, cambios posteriores a revisión sin petición ni cierres API. El tipo
recibido se conserva; las reglas editoriales se consultan en las plantillas, sin
forzar una conversión a seis tipos. Draft con casillas desmarcadas;
solo se marcan al pedir revisión con evidencia. Closes y Development se comprueban
sin duplicar mutaciones; el cierre automático sigue la rama predeterminada real.

## Comprobación de la constitución

- P1/P2: ninguna integración ni abstracción nueva en el producto; solo flujo local.
- P3/§3: bibliotecas y stack intactos; no hay dependencia nueva.
- P4: no se leen bases reales ni secretos; MCP usa la autenticación existente.
- P5/P6: interfaz intacta; instrucciones en español.
- §4: la enmienda específica permite los cinco momentos y mantiene documentos
  previos al código. No modifica el SDD de otras apps.
- §5: pruebas existentes y comprobaciones documentales por criterio; las reglas
  escritas no prueban el comportamiento futuro de una sesión de IA.
- §6: conserva exactamente intentos por plaza, IP de clases normales, caducidad,
  idempotencia, transacciones y origen fiable.
- §7/§8: cambios solo en esta app; versión y motivo de la enmienda registrados.

## Verificación

Comparar hashes de todos los archivos previos salvo AGENTS, constitución,
arquitectura, README y las dos expectativas de versión documentadas; contrastar la constitución original al retirar solo los
cambios previstos. Revisar rutas de skills, doce plantillas y referencias.
Ejecutar bash -n de los siete scripts y comparar byte a byte con la fuente
fijada. Comparar las siete skills permitiendo solo el cambio de ruta. Probar en
un repositorio Git desechable con origin bare local: status, pull fast-forward,
ambas herramientas de rama, commit explícito conservando índice ajeno, commit
vacío sin staged files, rechazo de directorios y de force push, y push normal.
No atribuir a los originales validaciones adicionales de nuestros scripts retirados.
Ejecutar pytest en copia sin datos usando la instalación virtual existente y las
pruebas Node sin dependencias del final de carrera/catálogo. No llamar MCP mutador
para probar instrucciones ni crear recursos externos de prueba. Registrar
resultados reales y retirar temporales propios; detener cualquier proceso propio.

La corrección también retira de create-issue/create-pr y sus skills la duplicación
de reglas editoriales, y de create-branch la conversión automática de tipos.
Las siete skills de herramientas permanecen fieles a la fuente fijada.
