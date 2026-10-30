# Cliente Jupyter

Cuadernos para probar la aplicación desde el navegador, uno por funcionalidad del cliente de terminal. Están pensados para alguien que no programa.

## Cómo funciona

- Cada cuaderno tiene 2 celdas: un texto que explica la función (incluidos los errores posibles y cómo corregirlos) y una celda de código.
- La celda de código es de Python: lanza Node con `subprocess` desde `first-app`, llama a la función de `logic/` y dibuja el resultado en una tabla con `cli-table3`. No hay archivos auxiliares: las reglas y el SQL siguen en `logic/` y `queries/`.
- **Los cuadernos usan la base de datos real (`src/db/users.sqlite`).** Crear, actualizar y eliminar cambian usuarios de verdad y no se pueden deshacer. Los cuadernos de actualizar y eliminar empiezan con `id = 0`, que no existe: ejecutarlos sin cambiar nada no modifica a nadie.

## Requisitos

- Node 23 (con `node:sqlite`) y Python 3, ya instalados en el Mac.
- Las dependencias de la app instaladas (`pnpm install`), porque las tablas usan `cli-table3`.
- Para el cuaderno de género: Ollama en marcha con `ollama pull llama3.2`.

## Arrancar

Desde la carpeta del proyecto:

```bash
cd staff/ella-deyavorsky/first-app
scripts/jupyter.sh
```

La primera vez crea el entorno `.venv` e instala `notebook` 7.6.3. Las siguientes solo arranca. Si el script no funciona en tu máquina, los comandos equivalentes son:

```bash
cd staff/ella-deyavorsky/first-app
test -d .venv || python3 -m venv .venv
.venv/bin/pip install notebook==7.6.3
.venv/bin/jupyter notebook --ip=127.0.0.1 --port=8888 src/clients/jupyter
```

## Abrir los cuadernos

1. En la terminal aparece una dirección como `http://127.0.0.1:8888/tree?token=...`. Ábrela en el navegador (o espera a que se abra sola).
2. Abre **`00-welcome-and-index.ipynb`**: es el índice, con enlaces a cada caso de uso.
3. Si el kernel no está elegido, usa **Kernel → Change Kernel…** y escoge **Python 3 (ipykernel)**.
4. Ejecuta las celdas con **▶ Run** o `Shift + Enter`.

## Puerto ocupado

Si el 8888 está en uso, Jupyter elige el siguiente libre (8889, 8890…) y lo escribe en la terminal. Usa la dirección que muestre.

## Detener

En la terminal donde se ejecuta: `Ctrl + C`, y confirma con `y` si lo pide.

## Cuadernos

| Cuaderno | Función de `logic/` |
|---|---|
| `00-welcome-and-index.ipynb` | Bienvenida e índice |
| `prepare-database.ipynb` | `createUsersTable()` (paso técnico, en `queries/`) |
| `create-user.ipynb` | `createUser` |
| `list-users.ipynb` | `listUsers` |
| `find-user-by-id.ipynb` | `findUserById` |
| `find-user-by-email.ipynb` | `findUserByEmail` |
| `update-user.ipynb` | `updateUser` |
| `delete-user.ipynb` | `deleteUser` |
| `count-users-by-gender.ipynb` | `countUsersByGender` (necesita Ollama) |
