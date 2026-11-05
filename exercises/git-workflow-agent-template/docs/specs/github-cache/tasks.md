# Comprobación de la caché

- [x] Implementar herramienta y skill en la plantilla compartida y añadir las exclusiones de Git.
- [x] Delegar revisiones en `create-pr` y retirar la caché personal y sus referencias.
- [x] Comprobar alias, ambigüedad, corrección, borrado, caducidad y reconstrucción.
- [x] Simular `200`, `304`, paginación, errores y escrituras concurrentes en directorios temporales.
- [x] Comprobar aislamiento, ausencia de credenciales, UTF-8, sintaxis, enlaces y alcance del diff.

Windows: recorridos temporales con respuestas HTTP simuladas, límite exacto de 48 horas y concurrencia correctos. Consultas reales de colaboradores y perfil, ETag con respuesta `304` y exclusiones Git comprobados. Validación de skill y sintaxis correctas; simulación independiente del rol con nombres ambiguos. Sin solicitudes reales de revisión. Linux y macOS no ejecutados.
