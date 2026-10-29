# Arquitectura de AsistenciApp

AsistenciApp pasa lista. El profesor abre una clase y enseña un código. El alumno escribe su nombre y ese código. El profesor ve la lista, puede cerrar la clase y descargarla.

Hay cuatro responsabilidades. Cada una solo depende de las que tiene debajo.

| Parte | Dónde | Qué hace |
| --- | --- | --- |
| Dominio | `asistencia/domain/` | Reglas independientes: el código, el nombre, si una clase existe, sigue abierta y acepta ese código, y el tope de intentos. No abre la base y no habla con el navegador. |
| Acciones | `asistencia/usecases/attendance.py` | Las acciones coordinan un caso: registrar, abrir, cerrar, listar, ver, quitar y exportar. Reciben la ruta del archivo y un reloj. |
| Almacenamiento | `asistencia/storage/sqlite.py` | Lee y escribe en `data/asistencia.db`. Abre y cierra la conexión en cada operación. No decide reglas. |
| Entrada HTTP | `app.py` | Comunicación con el navegador: lee la petición, llama a la acción y convierte el resultado en la respuesta. Las pantallas están en `static/`. |
| Presentación | `static/` | Muestra el inicio, el panel del profesor y el registro del alumno. Solo presenta datos que llegan de `app.py`; no decide reglas de asistencia. |

La dirección es esta: el navegador entra por `app.py`, que llama a una acción. La acción llama al dominio y al almacenamiento. El dominio no llama al almacenamiento ni a `app.py`. El almacenamiento no llama al dominio.

Un registro recorre ese camino. `check_in` anota antes el intento de esa dirección. `domain/attempts.py` decide si se pasó de 5 en el último segundo o de 20 en el último minuto. Si se pasó, o si la dirección ya está bloqueada, no se guarda la asistencia. `app.py` elige la dirección: en este ordenador usa `CF-Connecting-IP` cuando es una sola dirección válida; si no, usa la conexión. No lee una dirección escrita en el registro ni `X-Forwarded-For`. Luego comprueba que la clase exista, que esté abierta, el nombre y el código. Si falla, lanza un error con nombre. `app.py` lo traduce al mensaje que ya ve el alumno, y el bloqueo a la respuesta 429. Si vale, el almacenamiento guarda el nombre y la hora. Las marcas de intentos que ya salen del último minuto se tiran. La lista de bloqueo se queda en el mismo archivo.

`export.py` convierte filas ya cargadas en CSV. `tunnel.py` solo lo usa el arranque, para que la clase se abra desde casa. `storage/` es código: la base sigue en `data/`.

## Presentación en el navegador

Las tres páginas comparten `styles.css`. La hoja contiene la identidad visual y un único tema oscuro, por lo que no necesita JavaScript, opciones guardadas ni datos adicionales en el navegador.

El panel normal y Aula en directo muestran la misma sesión cargada por `profesor.js`. El panel normal conserva las acciones privadas de cerrar y descargar. Aula en directo es una presentación pensada para proyectar: destaca el código, la cuenta atrás y las llegadas, pero no duplica la sesión ni hace peticiones a rutas nuevas.

`alumno.js` conserva la misma petición de registro y organiza la interfaz en tres pasos: Nombre, Código y Listo. Los pasos son una ayuda visual; la validación del dominio y el almacenamiento continúan detrás de `app.py`.

## Pendiente de otra spec

Estos tres fallos se han visto y no están corregidos. Que la suite actual pase no los da por buenos. Hace falta una spec de validación.

- Un cuerpo JSON que es una lista no vacía provoca un error 500: la entrada llama a `.get` sobre esa lista. Una lista vacía hoy se trata como cuerpo vacío, porque es un valor falso.
- Un nombre enviado como número, distinto de cero, provoca un error 500: el dominio llama a `.strip` sobre ese número.
- Un código con cifras de ancho completo, como `１２３４`, provoca un error 500: la comparación del código no acepta esos caracteres.
