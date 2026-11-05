# Caché de identidades de GitHub

El workflow compartido reutiliza alias, colaboradores y nombres públicos para resolver revisores con menos consultas.

- La caché es local, ignorada por Git y separada por servidor, cuenta y repositorio. No contiene credenciales ni correos.
- Todos sus datos y ETags caducan juntos a las 48 horas; el primer acceso posterior los vacía. Un uso normal no prolonga el ciclo.
- Los alias se normalizan sin distinguir mayúsculas, tildes ni espacios repetidos. Una coincidencia ambigua requiere aclaración.
- Las consultas condicionales reutilizan respuestas sin cambios. Permisos, aprobaciones, checks y estado de PR se comprueban en vivo.
- El subagente `create-pr` lee la skill de caché al gestionar revisores. El orquestador solo delega.
- La ausencia o corrupción del archivo inicia una caché vacía. Si no se puede usar la caché, se consulta GitHub sin dar una identidad por confirmada.
