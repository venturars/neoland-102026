# Script de Jupyter

## 1. Decidir la base

Leer la constitución del proyecto y la especificación del cliente Jupyter.
Confirmar de dónde sale el comando y si `pnpm jupyter` desaparece.
Sin esa decisión, no se crea el shell ni se toca el paquete.

## 2. Crear el script

Crear `scripts/jupyter.sh` en la raíz de `first-app`.
Escribir `#!/bin/sh`, entrar en esa raíz y el comando que estaba en `package.json`.
Dejar el fichero ejecutable.

## 3. Quitar el script del paquete

Abrir `package.json`.
Borrar la clave `jupyter`.
Guardar y comprobar que la palabra `jupyter` ya no está.

## 4. Sacar la base del git

Ejecutar `git ls-files -- db/users.sqlite` desde `first-app`.
Si aparece, quitarla del índice sin borrar el fichero del disco.
Si no aparece, no hacer nada: ya está fuera.

## 5. Ajustar la constitución

Si esta rama ya documenta el cliente Jupyter, cambiar la frase de `pnpm jupyter`.
Decir que los cuadernos se abren con `scripts/jupyter.sh`.
Añadir `docs/specs/jupyter-script/` al árbol de specs.

## 6. Comprobar

Ver que `scripts/jupyter.sh` existe y que `package.json` no tiene `jupyter`.
Ver que `git ls-files -- db/users.sqlite` no escribe nada.
Ver que el fichero de la base sigue en el disco si ya estaba.
