# Arquitectura de AsistenciApp

AsistenciApp pasa lista. El profesor abre una clase y enseña un código. El alumno escribe su nombre y ese código. El profesor ve la lista, puede quitar un nombre, cerrar la clase y descargarla.

Hay cuatro responsabilidades. Cada una solo depende de las que tiene debajo.

| Parte | Dónde | Qué hace |
| --- | --- | --- |
| Dominio | `asistencia/domain/` | Reglas independientes: el código, el nombre y si una clase existe, sigue abierta y acepta ese código. No abre la base y no habla con el navegador. |
| Acciones | `asistencia/usecases/attendance.py` | Las acciones coordinan un caso: registrar, abrir, cerrar, listar, ver, quitar y exportar. Reciben la ruta del archivo y un reloj. |
| Almacenamiento | `asistencia/storage/sqlite.py` | Lee y escribe en `data/asistencia.db`. Abre y cierra la conexión en cada operación. No decide reglas. |
| Entrada HTTP | `app.py` | Comunicación con el navegador: lee la petición, llama a la acción y convierte el resultado en la respuesta. Las pantallas están en `static/`. |

La dirección es esta: el navegador entra por `app.py`, que llama a una acción. La acción llama al dominio y al almacenamiento. El dominio no llama al almacenamiento ni a `app.py`. El almacenamiento no llama al dominio.

Un registro recorre ese camino. `check_in` comprueba dentro que la clase exista, que esté abierta, el nombre y el código. Si falla, lanza un error con nombre. `app.py` lo traduce al mensaje que ya ve el alumno. Si vale, el almacenamiento guarda el nombre y la hora.

`export.py` convierte filas ya cargadas en CSV. `tunnel.py` solo lo usa el arranque, para que la clase se abra desde casa. `storage/` es código: la base sigue en `data/`.

## Pendiente de otra spec

Estos tres fallos se han visto y no están corregidos. Que la suite actual pase no los da por buenos. Hace falta una spec de validación.

- Un cuerpo JSON que es una lista no vacía provoca un error 500: la entrada llama a `.get` sobre esa lista. Una lista vacía hoy se trata como cuerpo vacío, porque es un valor falso.
- Un nombre enviado como número, distinto de cero, provoca un error 500: el dominio llama a `.strip` sobre ese número.
- Un código con cifras de ancho completo, como `１２３４`, provoca un error 500: la comparación del código no acepta esos caracteres.
