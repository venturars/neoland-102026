# Cliente Jupyter

## Recorrido

Los cuadernos son otro cliente. Llaman a las funciones de `logic/` que ya usan los `.txt` de `clients/terminal/`. No hay SQL nuevo ni reglas nuevas.

La excepción de preparación es `createUsersTable` en `queries/users.js`. El cuaderno de la tabla llama a esa función, igual que `clients/terminal/create-users-table.txt`. No copia el SQL.

```text
clients/jupyter/*.ipynb
        ↓
clients/jupyter/run_logic.py
        ↓
node, mismas funciones que clients/terminal/
        ↓
logic/  (o queries/users.js solo al preparar la tabla)
        ↓
db/users.sqlite
```

## Elección de kernel

Notebook se ejecuta con el Python del `.venv` que ya está en `first-app`. El kernel del cuaderno es `ipykernel`, registrado como `first-app`.

Ese kernel tiene `clients/jupyter` en `PYTHONPATH`. La celda importa `run_logic` en una línea. No muestra el código que busca la carpeta.

La lógica sigue en Node. `run_logic.py` es un puente mínimo: lanza `node --input-type=module` con el mismo estilo de import que el cliente de terminal y devuelve lo que imprime la función. No reescribe validaciones ni consultas. No define `FIRST_APP_DATABASE_FILE`, así que Node abre `db/users.sqlite`.

Un kernel de JavaScript dentro de Notebook no hace falta. Añadiría otro arranque y no reutiliza el `.venv`.

Dependencias, solo en ese `.venv`, con pip: `notebook` e `ipykernel`. No entran en `package.json`. No se usa npm ni npx. `.venv/` ya está ignorado en la raíz del repositorio.

## Base

Los cuadernos usan la base de la aplicación, `db/users.sqlite`. No hay carpeta `demo/` ni un archivo sqlite por cuaderno. No insertan a Ada, Grace ni Alan al abrirse.

`db/connection.js` sigue pudiendo abrir otra ruta si el proceso trae `FIRST_APP_DATABASE_FILE`. El cliente Jupyter no la define. Los clientes de terminal tampoco.

Al cargar `queries/users.js`, `createUsersTable()` ya hace `CREATE TABLE IF NOT EXISTS`.

## Cuadernos

Carpeta: `clients/jupyter/`.

| Archivo | Qué llama |
| --- | --- |
| `bienvenida.ipynb` | Nada. Índice, escenario corto e instrucciones de uso. |
| `crear-usuario.ipynb` | `createUser(name, email)` |
| `buscar-usuario-por-email.ipynb` | `findUserByEmail(email)` |
| `buscar-usuario-por-id.ipynb` | `findUserById(id)` |
| `actualizar-usuario.ipynb` | `updateUser(id, changes)` |
| `borrar-usuario.ipynb` | `deleteUser(id)` y después `listUsers()` |
| `listar-usuarios.ipynb` | `listUsers()` |
| `contar-usuarios-por-genero.ipynb` | `countUsersByGender()` |
| `preparar-tabla-usuarios.ipynb` | `createUsersTable()` y después `listUsers()` |

`preparar-tabla-usuarios.ipynb` se presenta como preparación técnica, no como acción del CEO. La bienvenida no lo ofrece como un caso de negocio.

Cada cuaderno de operación, y también el de la tabla, lleva en español y en este orden: título, escenario, instrucciones, una celda. Nada más. Los comentarios que queden en la celda van en inglés.

La celda deja los valores en blanco o en un id `0`, para que ejecutarla sin cambiarlos no escriba en la lista. El escenario dice qué pondría el CEO. Las instrucciones nombran la frase en español que sale si el dato no vale.

`countUsersByGender` es asíncrona. El puente usa `await`. Hace falta Ollama en local con el modelo `gemma4`. Si no está en marcha, el cuaderno muestra la frase de «No se han podido clasificar los nombres».

Borrar no devuelve la ficha. La misma celda, si el borrado termina, muestra la lista. Si el borrado lanza, esa lista no se pide.

## Errores en el cuaderno

`logic/` sigue lanzando sus mensajes en inglés. El puente los convierte en la frase de `spec.md`. No se cambia `logic/`, ni SQL, ni la base.

`LogicError` sigue siendo la excepción de un mensaje ya lanzado por la aplicación. `report_error(error)` elige la frase y la muestra con `display` como un párrafo, el mismo recurso que las tablas. No relanza la excepción y no pinta un traceback.

La celda separa los dos caminos:

```python
try:
    show(create_user(name, email))
except Exception as error:
    report_error(error)
```

`Exception` cubre `LogicError` y un fallo inesperado. No se toca el manejador global de Jupyter.

Si el mensaje interno está en la tabla de `spec.md`, se muestra su frase y no se escribe el inglés en la celda. Si no está, o la excepción no es `LogicError`, la frase es «No se ha podido completar la operación». El proyecto no tiene un registro propio. El puente usa `logging` de la biblioteca estándar y escribe el detalle en `clients/jupyter/jupyter-client.log`. Ese archivo no se versiona. La celda no lo imprime.

En borrar y en preparar la tabla, la lista va dentro del `try`, después de la operación. Un fallo sale por el `except` y no llega a `show(list_users())`.

## Arranque

Desde `staff/maria-osipuk/first-app`:

```text
pnpm jupyter
```

El script de `package.json` ejecuta `.venv/bin/jupyter notebook clients/jupyter --ip=127.0.0.1 --port=8888`. El navegador abre la lista de cuadernos. El primero es `bienvenida.ipynb`. El kernel es `first-app`. Si el puerto 8888 está ocupado, Notebook elige otro y lo escribe en la terminal: se abre esa dirección. Se detiene con Ctrl+C en esa terminal y confirmando el apagado.

## Comprobación

- Cada cuaderno muestra el escenario y las instrucciones, luego una celda, y después no hay markdown.
- La celda de alta, sin rellenar, no inserta a nadie.
- Con un nombre y un email nuevos, el alta aparece en `db/users.sqlite`.
- La constitución describe el cliente Jupyter sobre `db/users.sqlite`, sin carpeta `demo/`.
- En una copia temporal, con datos ficticios, un id `0`, un nombre vacío, un email inválido, un email duplicado y un usuario inexistente muestran solo su frase en español.
- Un fallo operativo simulado muestra solo «No se ha podido completar la operación» y deja el detalle en el log, no en la salida del cuaderno.
- `db/users.sqlite` de la aplicación no cambia en esa comprobación.
