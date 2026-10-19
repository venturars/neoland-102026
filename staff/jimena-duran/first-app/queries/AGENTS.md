# AGENTS.md — queries

- Las consultas SQL y las funciones que las ejecutan viven en `queries/users.js`.
- Usa parámetros SQL con nombre (`:id`, `:name`, `:email`); nunca interpolar datos dentro del SQL.
- Esta carpeta solo contiene acceso a datos: no añadas reglas de negocio.
- No expongas errores internos de SQLite a la lógica ni a los clientes.
