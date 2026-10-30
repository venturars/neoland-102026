# Spec 006 · Comprobar el nombre antes de la lista

Estado: aprobada el 2026-10-29. Issue #569.
Ámbito: asistenciapp.

## 1. Problema

Un alias o un mote en la lista no dice quién estuvo en clase. Antes de salir en la lista, el nombre se comprueba en el ordenador del profesor, en segundo plano. Si no es un nombre válido, no sale. La comprobación no se muestra.

## 2. Historias de usuario

HU-01. Como profesor, quiero que un nombre válido aparezca en la lista sin ver la comprobación.

HU-02. Como profesor, quiero que un alias o un mote no salga en la lista, en el total ni en la descarga.

HU-03. Como profesor, quiero que la comprobación ocurra en mi ordenador y el texto no salga de ahí.

HU-04. Como alumno, quiero que un nombre no válido no me deje registrado y, al rato, ver que no vale porque es un alias o un mote.

## 3. Criterios de aceptación

CA-01. Dado una sesión abierta, cuando un alumno envía "Ana García" y el código vigente, entonces aparece en la lista con su nombre y su hora, y no se ve la comprobación.

CA-02. Dado una sesión abierta, cuando un alumno envía "el moto" y el código vigente, entonces no aparece en la lista en vivo, ni en el total, ni en la lista descargada.

CA-03. Dado un alumno que envió un alias o un mote, cuando pasa un momento, entonces ve que el nombre no es válido porque es un alias o un mote.

CA-04. Dado una sesión abierta, cuando un alumno envía "Pepe" o "Dani" y el código vigente, entonces sale en la lista, porque ese diminutivo se puede usar como nombre real.

CA-05. Dado el profesor mirando la sesión, cuando se comprueba un nombre, entonces no aparece ningún mensaje ni pantalla de esa comprobación.

CA-06. Dado un nombre enviado por un alumno, cuando se comprueba, entonces ocurre en el ordenador del profesor y el texto no sale de ese ordenador.

CA-07. Dado un nombre que no ha salido en la lista por no ser válido, cuando se consultan las sesiones o se descarga la lista, entonces ese texto no está guardado.

CA-08. Dado un alumno al que no se le aceptó el texto, cuando vuelve a enviar otro texto con un código vigente desde el mismo navegador, entonces ese intento se comprueba de nuevo.

CA-09. Dado un código incorrecto o una sesión cerrada, cuando el alumno envía su nombre, entonces sigue viendo el mensaje de la spec 001.

CA-10. Dado un móvil de unos 400 px de ancho, cuando el alumno se registra y el profesor mira la lista, entonces no hay una pantalla nueva de comprobación.

CA-11. Dado que en ese momento no se puede comprobar el nombre, cuando un alumno envía un texto y el código vigente, entonces el nombre entra en la lista.

CA-12. Dado una sesión abierta, cuando un alumno envía "12345" y el código vigente, entonces no aparece en la lista y ve que el nombre no es válido. No es un nombre, ni un alias, ni un mote.

CA-13. La comprobación usa el texto en minúsculas. Dado que "maría garcía" ya se aceptó mientras la app sigue abierta, cuando alguien envía "María García" o "MARÍA GARCÍA", entonces no se vuelve a comprobar.

CA-14. Dado que "el moto" ya se rechazó mientras la app sigue abierta, cuando alguien envía "El Moto", entonces se rechaza otra vez y no se vuelve a comprobar.

CA-15. Dado una sesión abierta, cuando un alumno envía "maría de la cruz" y el código vigente, entonces en la lista se ve "María De La Cruz". El registro temporal no sale en la descarga y se pierde al cerrar la app.

## 4. Fuera de alcance

Cambiar el código de la clase, el cierre de la sesión o las columnas de la descarga.
