# Plan 006 · Comprobar el nombre antes de la lista

Estado: aprobado el 2026-10-29.
Spec: [spec.md](spec.md), aprobada el 2026-10-29.

## 1. Qué se toca

La comprobación entra en el registro que ya existe. No hay pantalla nueva.

Orden, dentro de `register` en `asistencia/acciones.py`, después de las reglas que ya rechazan la sesión cerrada, el nombre vacío y el código inválido:

1. Se pasa el texto a minúsculas. Si ese texto ya se comprobó mientras la app sigue abierta, se usa el resultado guardado y no se vuelve a preguntar. El registro es temporal: no entra en la descarga y se pierde al cerrar la app.
2. Si no estaba, se pregunta en el ordenador del profesor si es un nombre real y se guarda el resultado.
3. Si lo es, se guarda en la lista con la primera letra de cada palabra en mayúscula. "maría de la cruz" sale como "María De La Cruz".
4. Si no lo es, no se guarda. Un alias o un mote responde: "El nombre no es válido porque es un alias o un mote." Un texto que no es nombre, ni alias, ni mote, como "12345", tampoco se guarda y responde: "El nombre no es válido."
5. Si la pregunta no se puede hacer, se guarda igual y no se envía ese mensaje.

El alumno ya espera la respuesta del formulario y solo guarda el registro en el navegador cuando el alta sale bien. Un nombre rechazado sigue ese camino de error, así que puede intentar otro texto. El profesor no recibe ningún aviso de la comprobación: su lista solo muestra quien quedó guardado.

La pregunta la hace un módulo nuevo, `asistencia/comprobar_nombre.py`. Habla solo con `127.0.0.1`, puerto `11434`, con la biblioteca estándar. El modelo es `nimble-v3`, ya instalado en Ollama. No se añade ninguna librería a `requirements.txt`.

La respuesta trae una certeza de 0 a 1 de que el texto es un nombre real. Con 0,5 o más, entra. Con menos de 0,5, no entra: vale para un alias, un mote y también para un texto que no es ninguna de las dos cosas. "Pepe" y "Dani" cuentan como nombre real. La llamada espera hasta que haya respuesta. Si falla, se toma como que no se pudo comprobar.

`create_app` recibe la función de comprobación. En la app real es la llamada a Ollama. En los tests es una función fija, para que los casos de siempre no dependan de tener Ollama en marcha. Los tests nuevos cubren el sí, el no y el fallo.

`README.md` dice que, con Ollama y `nimble-v3` en marcha, un alias no entra en la lista, y que si no están, el nombre entra igual.

## 2. Comprobación de la constitución

P1. El registro sigue sin depender de una plataforma. Ollama corre en el ordenador del profesor.

P2. Se reutiliza el formulario y el registro. No hay pantalla ni módulo de más. La llamada espera la respuesta y no corta por tiempo.

P3. No entra una dependencia de Python. Hace falta un juicio que una lista de palabras no resuelve: "Pepe" es un nombre y "el moto" no. La llamada usa la biblioteca estándar y no sale de `127.0.0.1`. `nimble-v3` es de uso no comercial.

P4. Si el nombre no vale, no se guarda en la lista ni en la descarga. El registro temporal solo vive en memoria mientras la app está abierta. Si vale, se guarda el nombre ya escrito con las mayúsculas, y la hora. El texto no sale del ordenador.

P5. No hay pantalla nueva. El mensaje de error usa el aviso que ya existe, en el móvil igual que el resto.

P6. El mensaje al alumno está en español.

§5. CA-01, CA-02, CA-04, CA-07, CA-08, CA-09 y CA-11 tienen test de API. CA-03 comprueba el texto del mensaje. CA-06 comprueba que la llamada solo apunta a `127.0.0.1`. CA-05 y CA-10 se ven en la app: el profesor no tiene un aviso nuevo y no hay pantalla nueva.

§6. El código inválido y la sesión cerrada se rechazan antes de preguntar. El nombre se sigue mostrando como texto, sin interpretarse.

