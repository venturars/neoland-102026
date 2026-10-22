# Buscar usuarios por nombre

Autora: Jimena Durán. Issue: #219.

La persona que consulta introduce un nombre y obtiene todos los usuarios
registrados cuyo nombre coincide exactamente, respetando mayúsculas,
acentos y espacios interiores. Se eliminan los espacios iniciales y finales de la entrada antes de buscar. No se buscan fragmentos ni se modifican los nombres almacenados.

La entrada es una cadena. Una cadena vacía o formada solo por espacios
produce `Name is empty`.

El resultado es una lista de usuarios con id, name, email, createdAt y
updatedAt. Si hay varios con el mismo nombre, aparecen todos, ordenados por ID ascendente. Si no hay
coincidencias, el resultado es `[]`, también si no hay usuarios registrados.

Ejemplo: buscar `Jimena` devuelve todos los usuarios llamados exactamente
`Jimena`; no incluye `jimena` ni `Jimena Durán`.

Si falla la lectura de datos, se muestra `Could not find the user`.
La búsqueda no modifica usuarios. No se especifica validación de otros tipos
de entrada.
