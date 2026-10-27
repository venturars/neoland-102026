# Constitución de first-app

first-app es una aplicación educativa para practicar los fundamentos de login. El desarrollo se organiza con SDD.

## Guías

- [Arquitectura](ARCHITECTURE.md)
- [Estructura del proyecto](TREE.md)
- [Base de datos y consultas](DATABASE.md)
- [Valores y errores](ERRORS.md)
- [Estilo](STYLE.md)

## Documentación de funcionalidades

`spec.md` explica el comportamiento desde el punto de vista del negocio: usuario, entradas, salidas ejemplificadas, errores visibles y límites. No incluye nombres de archivos, funciones ni SQL. Cada error debe corresponder a un mensaje de [ERRORS.md](ERRORS.md).

`plan.md` describe la solución técnica: archivos afectados, una implementación existente que sirva de referencia sin copiarla, firma de la función, SQL con parámetros nombrados (`:id`, `:name`, `:email`) y el error asociado a cada caso de la spec.

Una funcionalidad nueva ocupa un archivo nuevo. Si las reglas, el código y la spec discrepan, la duda se anota al final del plan y se detiene el trabajo hasta resolverla. `tasks.md` divide el trabajo en acciones ordenadas, cada una con un único resultado comprobable y no más de cuatro líneas. Para cambios que no agregan una funcionalidad se conserva ese mismo nivel de detalle: inspeccionar, modificar y verificar.

La documentación debe ser breve, concreta y determinista; no se añade complejidad que dificulte leerla.

El nombre de cada spec usa kebab-case.

## Paquetes

Es obligatorio validar con Socket cada paquete de Node que se incorpore
y cada cambio de versión.

## Pasos de la lógica

El cuerpo de una función mantiene este orden:

1. Comprobar los argumentos recibidos.
2. Comprobar las demás reglas del negocio.
3. Ejecutar la operación de negocio.
4. Preparar y limpiar el valor que se devuelve.
