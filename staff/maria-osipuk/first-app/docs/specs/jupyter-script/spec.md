# Script de Jupyter

## Qué se pide

El arranque de Jupyter no se guarda como script del paquete. Se guarda en un script de shell en la raíz del proyecto.

El archivo de la base de usuarios no forma parte del repositorio. Puede seguir existiendo en el disco.

## A quién obliga

A quien trabaje en esta app y vaya a arrancar Jupyter, o a guardar la base de usuarios.

## La regla

- El comando que abre Jupyter está en el script de shell de la raíz.
- Ese comando no está escrito en los scripts del paquete.
- La base de usuarios no se sube al repositorio.

## Ejemplo correcto

Jupyter se arranca con el script de shell de la raíz. El paquete no tiene un script llamado `jupyter`. La base de usuarios no aparece entre los archivos del repositorio.

## Ejemplo que no se sigue

El comando de Jupyter sigue escrito dentro de los scripts del paquete. O la base de usuarios está en el repositorio.

## Cómo se comprueba

- El script de Jupyter está en `scripts/jupyter.sh` y ya no está en el `package.json`.
- `db/users.sqlite` no está en el git.
