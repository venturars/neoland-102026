# Formato y lint

Issue: #465.

Quien termina una tarea formatea el código con Prettier y lo comprueba
con ESLint.

Lo usa quien construye la app con IA.

Entra el código JavaScript de la app. El comando de formato se llama
`format`. El comando de comprobación se llama `lint`.

Sale el código en el formato estándar de Prettier. Ese formato es el de
ahora: comillas dobles, punto y coma, coma final, indentación de 2
espacios y ancho de 80. No hay una configuración propia de formato.
ESLint informa de los errores de código y de la sintaxis que impide
ejecutar el código.

Ejemplo: se termina una tarea. `format` deja el JavaScript en el formato
estándar. `lint` se lanza. Si hay un error de sintaxis, ESLint lo
muestra. Si no hay errores, no muestra ninguno.

No hay un fallo de la lista «Errores». Si `format` no lanza Prettier, si
`lint` no lanza ESLint, o si al terminar una tarea no se lanzan los dos,
el desarrollo no está hecho.

Queda fuera cambiar las reglas de negocio, reescribir el código viejo
para dejar una acción por línea, formatear notebooks u otros entornos
ajenos al JavaScript de la app, y dar una configuración propia a
Prettier.
