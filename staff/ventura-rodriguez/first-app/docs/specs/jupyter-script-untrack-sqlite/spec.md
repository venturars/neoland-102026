# Script de Jupyter y base fuera de git

Issue: #392.

Quien prueba la app abre Jupyter con `pnpm run jupyter`. Ese comando lanza
el script de la app, que prepara y abre Jupyter. No queda un lanzador de Node
aparte.

La base de usuarios sigue en la app y deja de estar en git. Quien clona el
repositorio no recibe los usuarios ya guardados.

Ejemplo: la persona ejecuta el arranque y ve los mismos notebooks. En git, la
base de usuarios no aparece.

Si falta Python 3, el arranque lo indica y termina con error. Si falla la
preparación o el arranque, se muestra el error y el comando termina con fallo.

Quedan fuera las acciones de los notebooks, los resultados que ya muestran, la
frase con la que se abren y borrar la base que ya está en el ordenador. Las
specs ya escritas no se modifican.
