# Buscar usuarios por nombre

Quien consulta usuarios puede buscar un nombre completo. Se recortan los espacios de los extremos y se exige texto no vacío. La coincidencia es exacta y distingue mayúsculas.

El resultado es una lista ordenada por identificador, con los cinco campos públicos de cada usuario. Sin coincidencias devuelve una lista vacía. Un nombre vacío muestra `Name is empty`; un valor que no es texto, `Name is invalid`; un fallo al leer, `Could not find the user`.

La búsqueda no modifica datos. Quedan fuera coincidencias parciales, búsquedas aproximadas y sustitución de las búsquedas por correo o identificador.
