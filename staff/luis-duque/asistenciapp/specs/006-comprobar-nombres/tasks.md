# Tareas 006 · Comprobar el nombre antes de la lista

Estado: aprobadas el 2026-10-29.
Plan: [plan.md](plan.md), aprobado el 2026-10-29.
Spec: [spec.md](spec.md), aprobada el 2026-10-29.

- [x] T01. Test de `asistencia/comprobar_nombre.py`: la llamada va solo a `127.0.0.1` en el puerto `11434`, con el modelo `nimble-v3`. La respuesta trae una certeza de 0 a 1. Con 0,5 o más, es un nombre real. Con menos de 0,5, no. Si la llamada falla, no se pudo comprobar. No hay límite de tiempo. Luego el módulo. Cubre CA-06.

- [x] T02. Tests del registro, con una función fija en vez de Ollama. "Ana García" entra en la lista con su hora. "el moto" no entra en la lista, ni en el total, ni en la descarga, y la respuesta es "El nombre no es válido porque es un alias o un mote." "12345" tampoco entra y la respuesta es "El nombre no es válido." "Pepe" y "Dani" entran. "maría de la cruz" sale en la lista como "María De La Cruz". Si "maría garcía" ya se aceptó, "MARÍA GARCÍA" no vuelve a llamar a la función. Si "el moto" ya se rechazó, "El Moto" tampoco vuelve a llamarla. Un texto rechazado no queda guardado y otro texto distinto, con código vigente, se comprueba. Un código inválido o una sesión cerrada no llegan a la pregunta. Si la función falla, el nombre entra y no sale el mensaje de alias. Luego el cambio en `acciones.py` y en `app.py`. Cubre CA-01, CA-02, CA-03, CA-04, CA-07, CA-08, CA-09, CA-11, CA-12, CA-13, CA-14 y CA-15.

- [x] T03. `create_app` usa la llamada real. Los tests que ya existían reciben una función que siempre acepta el nombre, para no depender de Ollama. Cubre CA-01.

- [x] T04. En `README.md`, una frase: con Ollama y `nimble-v3` en marcha, un alias no entra en la lista; si no están, el nombre entra igual.

- [x] T05. Mirar el panel del profesor y la página del alumno: no hay pantalla nueva ni un aviso de que se está comprobando. Cubre CA-05 y CA-10.

- [x] T06. `pytest` en verde.
