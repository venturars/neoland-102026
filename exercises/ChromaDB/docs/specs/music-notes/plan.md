# Plan · CRUD de notas musicales de un usuario

Spec: [spec.md](spec.md). Issue #553.

Este plan dice cómo se cumple la spec. No hay dependencia nueva ni suite de tests. Las comprobaciones son las de la spec: esquema, `core`, `sdk` y los notebooks.

## Ficheros

Rutas desde `exercises/ChromaDB/`.

| Fichero | Cambio |
| --- | --- |
| `src/db/schema.sql` | Añade `music_notes`, `categories`, las 20 filas y `music_note_categories`. |
| `src/db/connect_db.py` | `PRAGMA foreign_keys = ON` en cada conexión, antes de aplicar el esquema. |
| `src/storage/queries/insert_music_note.sql` | Inserta la nota y deja el `id` al motor. |
| `src/storage/queries/select_music_note.sql` | Una nota por `id`, sin categorías. |
| `src/storage/queries/select_music_notes.sql` | Todas las notas, por `id` ascendente, sin categorías. |
| `src/storage/queries/update_music_note.sql` | Cambia `song_link`, `title` y `description`. No toca `user_creator_id`. |
| `src/storage/queries/delete_music_note.sql` | Borra la nota por `id`. |
| `src/storage/queries/insert_music_note_category.sql` | Une una nota con una categoría. |
| `src/storage/queries/delete_music_note_categories.sql` | Borra todas las categorías de una nota. |
| `src/storage/queries/select_music_note_category_ids.sql` | Los `category_id` de una nota, de menor a mayor. |
| `src/storage/queries/select_category.sql` | Una categoría por `id`. |
| `src/storage/insert_music_note.py` | Escribe la nota y devuelve el `id`. |
| `src/storage/select_music_note.py` | Devuelve el `dict` de la fila, o `None`. |
| `src/storage/select_music_notes.py` | Devuelve la lista de filas. |
| `src/storage/update_music_note.py` | Actualiza los tres textos. |
| `src/storage/delete_music_note.py` | Borra la nota. |
| `src/storage/insert_music_note_category.py` | Escribe un enlace. |
| `src/storage/delete_music_note_categories.py` | Borra los enlaces de una nota. |
| `src/storage/select_music_note_category_ids.py` | Devuelve `list[int]`. |
| `src/storage/select_category.py` | Devuelve la fila, o `None`. |
| `src/core/validate_music_note.py` | Comprueba los tipos de los parámetros. |
| `src/core/create_music_note.py` | Crea la nota y sus categorías. |
| `src/core/list_music_notes.py` | Lista las notas con sus `category_ids`. |
| `src/core/get_music_note.py` | Una nota, o `Music note not found`. |
| `src/core/update_music_note.py` | Sustituye textos y categorías. El dueño no cambia. |
| `src/core/delete_music_note.py` | Devuelve la nota y la borra con sus categorías. |
| `src/sdk/create_music_note.py` | Limpia la entrada y llama a `core`. |
| `src/sdk/list_music_notes.py` | Llama a `core`. |
| `src/sdk/get_music_note.py` | Limpia el id y llama a `core`. |
| `src/sdk/update_music_note.py` | Limpia la entrada y llama a `core`. |
| `src/sdk/delete_music_note.py` | Limpia el id y llama a `core`. |
| `src/sdk/__init__.py` | Exporta también las cinco funciones de notas. |
| `src/clients/jupyter/create_music_note.ipynb` | Notebook de alta. |
| `src/clients/jupyter/read_music_notes.ipynb` | Notebook de lectura. |
| `src/clients/jupyter/update_music_note.ipynb` | Notebook de cambio. |
| `src/clients/jupyter/delete_music_note.ipynb` | Notebook de baja. |
| `README.md` | Nombra esos cuatro notebooks en la sección del CRUD con Jupyter. |

El dueño se comprueba con `storage/select_user.py`, que ya existe. No se añade un fichero nuevo para eso.

## Decisiones

La base sigue siendo `src/db/users.sqlite`. Una nota sin usuario no cabe: `user_creator_id` es NOT NULL y clave ajena. Hace falta un solo campo, no una tabla de unión con usuarios.

Las 20 categorías salen del esquema, con `id` fijo. `core` no se guarda otra lista: mira `categories` con `select_category`. Así un `21` no entra, y un nombre no puede duplicarse.

Cada función de `storage` abre y cierra su conexión, como el CRUD de usuarios. `core` valida todas las categorías antes de insertar enlaces. Al borrar o al sustituir, primero quita las filas de `music_note_categories` y después escribe o borra la nota.

`PRAGMA foreign_keys = ON` también afecta a `users`. Borrar un usuario que todavía tiene notas lo rechaza la base. El CRUD de usuarios no se reescribe: la comprobación borra antes las notas.

El cliente de lectura se llama `read_music_notes`, como `read_users`. Por debajo usa `sdk.list_music_notes` y `sdk.get_music_note`.

No hay clases, ni dependencia nueva, ni suite de tests. Un fichero, una función. El SQL, un fichero por consulta.

## Comprobación de la constitución

| Condición | Cómo |
| --- | --- |
| El CRUD de usuarios vive en SQLite y no usa Chroma ni Ollama | Las notas usan `connect_db` y `users.sqlite`. |
| Cada capa solo llama a la de debajo | Notebook → `sdk` → `core` → `storage` → `db`. |
| Un fichero, una función. El SQL en `storage/queries/` | La tabla de ficheros de arriba. |
| Un fallo es un `if` y un `raise RuntimeError` | Los textos están en la spec. |
| Sin dependencia nueva | `requirements.txt` no se toca. |

## Qué mirar

| Comprobación de la spec | Dónde |
| --- | --- |
| 1 | `connect_db`, `PRAGMA table_info(music_notes)`, `PRAGMA foreign_key_list(music_notes)` |
| 2 | `PRAGMA table_info(categories)`, `PRAGMA index_list`, `SELECT` de las 20 filas |
| 3 | `PRAGMA table_info(music_note_categories)`, `PRAGMA foreign_key_list` |
| 4 | `core.create_music_note` y los cuatro fallos de la spec |
| 5 | `list`, `get`, `update` y `delete` de `core` |
| 6 | Firmas de `sdk`, `sdk/__init__.py` y un alta con textos e ids en cadena |
| 7 | Los cuatro `.ipynb` y la sección de Jupyter del `README.md` |
