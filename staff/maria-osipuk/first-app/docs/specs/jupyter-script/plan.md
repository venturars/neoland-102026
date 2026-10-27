# Script de Jupyter

## Recorrido

No hay capa nueva, ni SQL, ni cambio en `logic/`. El pedido mueve un comando de arranque y deja la base de usuarios fuera del repositorio.

Esta rama sale de `staging`. Aquí `package.json` no tiene un script `jupyter`. La constitución de `staging` dice que la aplicación no tiene Jupyter Notebook.

El comando sí está en la rama `375-feat-add-jupyter-notebook-client`, dentro de `package.json`:

```text
.venv/bin/jupyter notebook clients/jupyter --ip=127.0.0.1 --port=8888
```

En esa rama, la constitución dice que los cuadernos se abren con `pnpm jupyter`. Quitar la clave `jupyter` del paquete choca con esa frase. Traer el comando a esta rama, que sale de `staging`, choca con la frase que niega Jupyter.

`db/users.sqlite` no está en el git en `staging` ni en esa rama. `.gitignore` ya ignora `db/*.sqlite`. El fichero puede estar en el disco.

No se toca `package.json` ni se crea `scripts/jupyter.sh` hasta decidir de qué sitio sale el comando y si `pnpm jupyter` sigue existiendo.

## Qué se escribe

Cuando esa decisión esté tomada:

- `scripts/jupyter.sh`, en la raíz de `first-app`. Empieza por `#!/bin/sh`, entra en esa raíz y ejecuta el mismo comando que hoy está en el script `jupyter`. Las rutas son relativas a la app, así que el directorio de trabajo tiene que ser la raíz.
- En `package.json` se borra la clave `jupyter`. No se deja una llamada al shell en su lugar: el pedido pide que el script ya no esté en el paquete.
- Si `git ls-files` lista `db/users.sqlite`, se quita del índice y el fichero se queda en el disco. Si no la lista, no hay nada que quitar.
- Si la rama ya tiene cliente Jupyter, la constitución deja de decir que los cuadernos se abren con `pnpm jupyter` y pasa a decir que se abren con `scripts/jupyter.sh`. El árbol de specs gana la carpeta `jupyter-script/`.

## Comprobación

- `scripts/jupyter.sh` está en la raíz de `first-app` y contiene el comando de arranque.
- `package.json` no contiene `jupyter`.
- `git ls-files -- db/users.sqlite` no escribe nada.
- Si `db/users.sqlite` ya estaba en el disco, sigue ahí.
