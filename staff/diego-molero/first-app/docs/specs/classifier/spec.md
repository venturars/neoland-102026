# Clasificador de géneros

**Estado:** implementado, con comprobaciones manuales registradas en
[tareas](tasks.md). Esta spec solo describe la clasificación.

## Objetivo

Obtener un recuento de los usuarios guardados según la clasificación de sus
nombres: mujeres, hombres y no definidos. Se utiliza IA local, sin servicios de pago.

## Entrada y resultado

No se introducen nombres nuevos ni filtros. Se procesan todos los usuarios
guardados utilizando únicamente su nombre. El resultado contiene los recuentos
women, men y genderUndefined, devueltos directamente. Por ejemplo:

```json
{ "women": 1, "men": 1, "genderUndefined": 1 }
```

Cada usuario cuenta una vez, aunque comparta nombre con otro. La suma coincide
con el número de usuarios procesados. Las categorías describen la clasificación
del nombre, no una identidad confirmada del usuario.

## Reglas y criterios de aceptación

- **CA-01:** procesar todos los usuarios guardados utilizando solo sus nombres,
  sin enviar correos ni otros campos al servicio.
- **CA-02:** devolver los tres recuentos, cuya suma coincide con los usuarios
  procesados, contando por separado a usuarios con el mismo nombre.
- **CA-03:** devolver tres ceros sin consultar IA cuando no haya usuarios.
- **CA-04:** contar como no definido los nombres inciertos, categorías no
  reconocidas o respuestas sin una clasificación interpretable.
- **CA-05:** ejecutar localmente, sin modificar usuarios ni guardar categorías
  o columnas nuevas.
- **CA-06:** lanzar una excepción ante un fallo de lectura o comunicación sin presentar un
  recuento parcial como completo.

## Dependencias y límites

Depende de la [gestión de usuarios](../users/spec.md), que prepara el
almacenamiento explícitamente conservando los datos existentes.
Las decisiones técnicas están en el [plan](plan.md) y las comprobaciones en
[tareas](tasks.md). Los criterios no implican que todas sus variantes se hayan
comprobado manualmente.

Quedan fuera autenticación, frontend, servicios de IA de pago y guardar el género
de cada usuario.
