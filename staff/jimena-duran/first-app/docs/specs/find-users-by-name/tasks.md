# Tareas — buscar usuarios por nombre

Autora: Jimena Durán. Issue: #219. Implementación y comprobaciones completadas.

- [x] Resolver la contradicción sobre listas vacías y aprobar la aclaración
  de la constitución. Resultado: contrato de salida coherente.
- [x] Crear la consulta SQL y añadir su carga y ejecución parametrizada.
  Resultado: `findByName(name)` obtiene todas las coincidencias exactas.
- [x] Crear la función de lógica con validación, captura de errores y limpieza.
  Resultado: lista con los cinco campos o el error establecido.
- [x] Crear el cliente de terminal que importa la lógica e imprime el resultado.
  Resultado: fragmento ejecutable desde la carpeta first-app.
- [x] Ejecutar el cliente y comprobar coincidencias múltiples y ausencia de ellas.
  Resultado: todos los usuarios esperados o `[]`, sin cambios de datos.
- [x] Comprobar vacíos y coincidencia exacta con mayúsculas, acentos y espacios.
  Resultado: `Name is empty` o resultados exactos según la spec.
- [x] Comprobar un fallo de lectura controlado sin alterar la base personal.
  Resultado: `Could not find the user`, sin propagar el error de SQLite.

Comprobación: Node.js v24.22.0, aserciones con tabla temporal en la conexión
existente y ROLLBACK. Casos previstos superados; sin modificar datos persistentes.

## Ajuste de espacios y orden

- [x] Recortar la entrada antes de validar y consultar.
  Resultado: espacios exteriores ignorados, interiores conservados.
- [x] Ordenar la consulta por ID ascendente y actualizar spec, plan y árbol.
  Resultado: comportamiento y documentación coherentes.
- [x] Verificar recorte, orden, coincidencias, vacíos y fallos de lectura.
  Resultado: casos previstos superados sin cambiar datos persistentes.

Verificado el ajuste con IDs insertados en orden 30, 10, 20: devuelve 10, 20, 30.
Cliente ejecutado correctamente y SHA256 de la base sin cambios.
