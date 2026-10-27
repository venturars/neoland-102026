# Script de Jupyter

## Recorrido

No hay capa nueva, ni SQL, ni cambio en `logic/`. El pedido mueve un comando de arranque y deja la base de usuarios fuera del repositorio.

Después de integrar `staging`, esta rama ya contiene el cliente Jupyter. El comando está dentro de `package.json`:

```text
.venv/bin/jupyter notebook clients/jupyter --ip=127.0.0.1 --port=8888
```

El comando sale del paquete y pasa a `scripts/jupyter.sh`. Por tanto, `pnpm jupyter` desaparece y la guía de arquitectura debe indicar el nuevo modo de arranque.

`db/users.sqlite` no está en el git. `.gitignore` ya ignora `db/*.sqlite`, por lo que el fichero puede seguir en el disco.

## Qué se escribe

Cuando esa decisión esté tomada:

- `scripts/jupyter.sh`, en la raíz de `first-app`. Empieza por `#!/bin/sh`, entra en esa raíz y ejecuta el mismo comando que hoy está en el script `jupyter`. Las rutas son relativas a la app, así que el directorio de trabajo tiene que ser la raíz.
- En `package.json` se borra la clave `jupyter`. No se deja una llamada al shell en su lugar: el pedido pide que el script ya no esté en el paquete.
- Si `git ls-files` lista `db/users.sqlite`, se quita del índice y el fichero se queda en el disco. Si no la lista, no hay nada que quitar.
- La guía de arquitectura deja de decir que los cuadernos se abren con `pnpm jupyter` y pasa a decir que se abren con `scripts/jupyter.sh`. El árbol gana el nuevo script y la carpeta de spec `jupyter-script/`.

## Comprobación

- `scripts/jupyter.sh` está en la raíz de `first-app` y contiene el comando de arranque.
- `package.json` no contiene `jupyter`.
- `git ls-files -- db/users.sqlite` no escribe nada.
- Si `db/users.sqlite` ya estaba en el disco, sigue ahí.
