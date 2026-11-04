# Política de privacidad de AsistenciApp

> Última actualización: 4 de noviembre de 2026

AsistenciApp es una app de escritorio para que un **profesor** pase lista en sus clases online. Cada profesor instala su propia copia en su ordenador. Esta página explica qué datos usa la app, para qué y dónde quedan.

## Qué datos se guardan

De cada **alumno** que asiste a una clase, la app guarda solo:

- su **nombre** (y apellidos), tal como lo escribe él (modo *código*) o tal como aparece en Google Meet (modo *automático*);
- la **hora** a la que se registró.

**No** se guardan emails, direcciones IP, identificadores de dispositivo ni ningún otro dato, aunque la plataforma de videollamada los facilite.

## Dónde se guardan

Todo se guarda **solo en el ordenador del profesor** que usa la app. Ni el autor de AsistenciApp ni ningún servicio de terceros reciben ni almacenan estos datos.

Para que los alumnos lleguen a la app desde sus casas, el tráfico pasa **cifrado (HTTPS)** por Cloudflare, que no lo almacena.

## Uso de los datos de Google

En el modo automático, la app pide a Google, con el permiso del profesor, **solo lectura** de sus reuniones de Meet (`meetings.space.readonly`) para saber quién está o ha estado en una reunión. No pide su email ni ningún otro permiso.

- De la lista de participantes solo se usa el **nombre visible** de cada uno, para registrarlo en la clase.
- El permiso de Google se guarda **solo en el ordenador del profesor** y puede retirarse cuando quiera desde [myaccount.google.com/permissions](https://myaccount.google.com/permissions).
- Los datos obtenidos de Google no se venden, no se comparten con nadie, no se usan para publicidad ni para entrenar modelos de inteligencia artificial, y solo se usan para pasar lista.

El uso que hace AsistenciApp de la información recibida de las API de Google cumple la [Política de datos de usuario de los servicios de API de Google](https://developers.google.com/terms/api-services-user-data-policy), incluidos los requisitos de uso limitado.

## Borrar los datos

- El profesor puede **quitar** a cualquier alumno de una lista desde la app: se borra de verdad.
- Desinstalar la app y borrar su carpeta de datos (`~/Library/Application Support/AsistenciApp/` en macOS, `%APPDATA%\AsistenciApp\` en Windows) elimina todas las listas y el permiso de Google.
- Un alumno que quiera que se borre su nombre de una lista debe pedírselo a su profesor, que es quien tiene los datos.

## Contacto

Para cualquier pregunta sobre esta política, abre una *issue* en [github.com/ChangVictor/asistenciapp](https://github.com/ChangVictor/asistenciapp/issues).
