Issue: #757

# Tareas del servidor SQL

Trabajo local autorizado y T01–T13 completadas el 2026-11-03. Resultados y límites en [verification.md](verification.md); pendiente revisión humana, sin commit ni publicación.

- [x] T01. Capturar referencias, datos y hashes protegidos antes de implementar.
  Resultado: se puede verificar la conservación de trabajo ajeno y SQLite personal. (CA-07)
- [x] T02. Preparar los nueve módulos .js de constantes SQL con nombres y parámetros de referencia.
  Resultado: imports ESM sin lectura de .sql desde queries. (CA-01–CA-03)
- [x] T03. Implementar src/db/server.js con SQLite y protocolo /execute de referencia.
  Resultado: exec/get/all/run, parámetros, fila nula, CORS y estados previstos. (CA-01–CA-05)
- [x] T04. Implementar queries asíncronas, incluidas createUsersTable y listTables.
  Resultado: acceso al servidor sin fs, SQLite o conexión alternativa desde clientes. (CA-01–CA-05)
- [x] T05. Adaptar las ocho funciones de logic con await y nombres de referencia.
  Resultado: reglas, tipos y mensajes conservados; clasificación sin cambios de comportamiento. (CA-02–CA-06)
- [x] T06. Adaptar los nueve clientes terminal a PowerShell y resultados esperados con await.
  Resultado: ejemplos ejecutables en Windows, sin abrir SQLite directamente ni imprimir promesas. (CA-01–CA-05)
- [x] T07. Adaptar los nueve notebooks a resultados esperados con await e imports coherentes.
  Resultado: comparten datos mediante el servidor y conservan presentación y contratos. (CA-01–CA-06)
- [x] T08. Añadir el script server sin modificar paquetes o versiones.
  Resultado: inicia únicamente el servidor SQL desde first-app. (CA-07)
- [x] T09. Documentar uso, datos, arquitectura, árbol y Jupyter del servidor SQL.
  Resultado: rutas, nombres, responsabilidades y arranque Windows coherentes. (CA-07)
- [x] T10. Preparar una copia desechable y comprobar protocolo y operaciones con usuarios ficticios.
  Resultado: resultados y errores contrastados sin tocar datos personales ni ejecutar IA real. (CA-01–CA-07)
- [x] T11. Comprobar clientes terminal/Jupyter sobre la misma base y reejecutar listados tras escrituras.
  Resultado: ocho clientes terminal y ocho notebooks reales comparten datos; clasificación comprobada estáticamente, sin IA real. (CA-04, CA-06, CA-07)
- [x] T12. Comprobar formato/lint, nombres, extensiones, diff y conservación del alcance protegido.
  Resultado: contratos y trabajo ajeno preservados, sin nuevas dependencias. (CA-07)
- [x] T13. Registrar resultados, comandos, límites y pendientes en verification.md.
  Resultado: cada criterio tiene evidencia real o un pendiente explícito, sin commit ni publicación. (CA-01–CA-07)
