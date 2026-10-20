# Clasificador de géneros

**Estado:** implementado y verificado. Incluye la creación explícita de la tabla,
la conexión compartida y el clasificador local.

## Objetivo

Permitir que quien utiliza la aplicación obtenga un recuento de los usuarios
guardados según la clasificación de sus nombres: mujeres, hombres y no definidos.
La clasificación la realizará una IA local, sin servicios de pago.

## Entrada y resultado

No se introducen nombres nuevos ni filtros. Se procesan todos los usuarios
guardados y se utiliza únicamente su nombre para clasificarlos.

El resultado contiene tres recuentos: `women`, `men` y `genderUndefined`.
Por ejemplo, si la clasificación de tres nombres fuera mujer, hombre y no
definido, los datos del resultado serían:

```json
{ "women": 1, "men": 1, "genderUndefined": 1 }
```

Cada usuario cuenta una vez, aunque comparta nombre con otro. La suma de los tres
recuentos debe coincidir con el número de usuarios procesados. Las categorías
describen la clasificación del nombre, no una identidad confirmada del usuario.

## Reglas y fallos

- Si no hay usuarios, los tres recuentos son cero y no se consulta la IA.
- Un nombre incierto o una respuesta sin una categoría reconocible cuentan como
  no definido.
- Los correos y los demás datos del usuario no se envían al servicio de IA.
- La consulta no modifica usuarios ni guarda categorías o columnas nuevas.
- Si falla la lectura de usuarios o la comunicación con el servicio, se comunica
  que no se han podido clasificar los usuarios. No se presenta un resultado
  parcial como completo.

## Criterios del clasificador completo

- **CA-01:** procesar todos los usuarios guardados utilizando solo sus nombres.
- **CA-02:** devolver los tres recuentos, cuya suma coincide con los usuarios
  procesados, contando por separado a usuarios con el mismo nombre.
- **CA-03:** devolver tres ceros sin consultar la IA cuando no haya usuarios.
- **CA-04:** incluir en no definidos los nombres inciertos o las categorías no
  reconocidas.
- **CA-05:** ejecutar la clasificación localmente, sin enviar correos ni modificar
  los datos guardados.
- **CA-06:** comunicar un fallo de lectura o de comunicación sin devolver un
  recuento parcial como si estuviera completo.

## Etapas y límites

El almacenamiento se prepara explícitamente conservando los datos existentes.
Las decisiones técnicas están en el [plan](plan.md) y sus pasos en las
[tareas](tasks.md). Esta iteración incorpora también la clasificación local.
Quedan fuera la autenticación, el frontend, los servicios de IA de pago y guardar
el género de cada usuario.
