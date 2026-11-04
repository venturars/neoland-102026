# Spec · Consultas de usuario y clientes manuales

Issue: #742

## 1. Problema

Quien prueba la app ya puede crear, cambiar, borrar, listar y buscar usuarios por correo. Falta buscar por nombre y por identificador de forma explícita, y probar la creación de la tabla de usuarios con el mismo estilo de cliente manual (terminal y cuaderno) que el resto de funciones.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien prueba la app** | Repetir búsquedas por nombre e identificador y la creación de tabla pegando comandos o ejecutando cuadernos. |
| **Quien desarrolla** | Reglas de negocio en la capa de lógica y clientes que solo llaman a esa capa. |

## 3. Historias de usuario

- **HU-01**: Como quien prueba la app, quiero buscar usuarios por nombre exacto, para ver todos los que comparten ese nombre ordenados por identificador.
- **HU-02**: Como quien prueba la app, quiero buscar un usuario por identificador, para ver sus datos o un error claro si no existe.
- **HU-03**: Como quien prueba la app, quiero crear la tabla de usuarios desde un cliente manual, para dejar la base lista antes de otras pruebas.
- **HU-04**: Como quien prueba la app, quiero un cuaderno por cada nuevo cliente de terminal, para repetir las mismas pruebas en el navegador.

## 4. Criterios de aceptación

- **CA-01**: **Dado** un nombre con espacios al inicio o al final, **cuando** se busca por nombre, **entonces** solo cuentan los caracteres tras recortar espacios y la coincidencia respeta mayúsculas y minúsculas del nombre guardado.
- **CA-02**: **Dado** varios usuarios con el mismo nombre y correos distintos, **cuando** se busca por ese nombre, **entonces** la respuesta es una lista con todos ellos ordenada de menor a mayor identificador.
- **CA-03**: **Dado** un nombre vacío tras recortar, **cuando** se busca por nombre, **entonces** el error es `Name is empty`.
- **CA-04**: **Dado** ningún usuario con ese nombre, **cuando** se busca por nombre, **entonces** la lista está vacía (no hay error).
- **CA-05**: **Dado** un identificador de un usuario existente, **cuando** se busca por identificador, **entonces** la respuesta incluye identificador, nombre, correo y fechas visibles.
- **CA-06**: **Dado** un identificador ausente, nulo o vacío, o un usuario que no existe, **cuando** se busca por identificador, **entonces** el error es `User does not exist`.
- **CA-07**: **Dado** un fallo al leer la base en una búsqueda, **cuando** la operación no puede completarse, **entonces** el error es `Could not find the user`.
- **CA-08**: **Dado** la app, **cuando** se ejecuta el cliente de crear tabla, **entonces** la tabla de usuarios queda creada y una listación posterior puede ejecutarse sin error de tabla inexistente.
- **CA-09**: **Dado** un fallo al crear la tabla, **cuando** la operación no puede completarse, **entonces** el error es `Could not create the users table`.
- **CA-10**: **Dado** los tres clientes nuevos de terminal, **cuando** se mira la carpeta de cuadernos, **entonces** existen tres cuadernos con el mismo nombre y pruebas equivalentes.

## 5. Fuera de alcance

- Cambiar crear, actualizar, borrar, listar, buscar por correo o contar por género.
- Buscar por trozo de nombre, por correo en esta entrega, ni sustituir clientes existentes.
- Sacar la base de datos del control de versiones o cambiar el arranque de Jupyter entre sistemas.

## 6. Preguntas abiertas

Ninguna. El mensaje para identificador inexistente es `User does not exist`, alineado con buscar por correo y borrar. Tras crear tabla, el cliente comprueba con una listación vacía o con usuarios ya guardados.

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-11-02 | Spec inicial para #742 |
