# Script de arranque de Jupyter

Issue: #557.

Quien trabaja en la app abre Jupyter con el script `jupyter` del paquete. Ese
comando delega en `scripts/jupyter.sh`, que prepara el entorno si hace falta y
arranca los cuadernos de `clients/jupyter/`.

El arranque debe funcionar en Mac, Linux y Windows (Git Bash, MSYS o entorno
equivalente donde `sh` ejecute el script).

La lógica de preparación y arranque no queda escrita en línea dentro de
`package.json`.

Ejemplo: la persona ejecuta `pnpm run jupyter` desde la raíz de first-app y ve
los mismos cuadernos que antes.

Si falta Python 3, el script lo indica y termina con error. Si falla la
preparación o el arranque, se muestra el error del proceso y el comando termina
con un código distinto de cero.

Quedan fuera el contenido de los notebooks, nuevas dependencias de Node y
cambios en `logic/` o en la base de datos.
