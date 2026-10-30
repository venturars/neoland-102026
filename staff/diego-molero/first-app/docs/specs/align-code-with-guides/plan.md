# Plan — alinear el código con las guías

Separar lecturas, normalización, comprobaciones y llamadas encadenadas en db, queries y logic. Usar bloques explícitos para fallos y mantener una operación por fichero de lógica.

Mantener SQL parametrizado, traducción del conflicto UNIQUE en consultas, fetch nativo a Ollama y retornos directos. No añadir clases de errores, envoltorios de resultado ni dependencias para refactorizar.

Antes del cambio capturar resultados del código actual con datos sintéticos. Compararlos después para CRUD, validaciones y clasificación controlada en copias temporales. Verificar además el clasificador con Ollama real cuando esté disponible.
