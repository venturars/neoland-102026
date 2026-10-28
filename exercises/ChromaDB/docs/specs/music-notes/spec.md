# Spec · CRUD de notas musicales de un usuario

Issue #553.

Un usuario puede crear notas musicales. Una nota pertenece a un único usuario. Las notas viven en el mismo SQLite que los usuarios (`src/db/users.sqlite`). No usan ChromaDB ni Ollama.

Las capas siguen `docs/CONSTITUTION.md`: el notebook solo usa `sdk`, `sdk` adapta la entrada y llama a `core`, `core` valida y llama a `storage`, y el SQL está en `storage/queries/`.

## Qué hay que hacer

En `src/db/schema.sql`, detrás de `users`, crear tres tablas. `connect_db` sigue aplicando ese fichero en cada conexión y activa las claves ajenas (`PRAGMA foreign_keys = ON`).

`music_notes`:

- `id`: INTEGER, clave primaria, autoincrement
- `song_link`: TEXT
- `user_creator_id`: INTEGER NOT NULL, clave ajena a `users(id)`. Es el único dueño de la nota
- `title`: TEXT
- `description`: TEXT

`categories`. Cada fila es una categoría posible. El `name` es único. El `id` es fijo, del 1 al 20, en este orden:

1. Rock
2. Pop
3. Jazz
4. Blues
5. Clásica
6. Electrónica
7. Hip hop
8. Reggae
9. Folk
10. Metal
11. Soul
12. Funk
13. Country
14. Latina
15. R&B
16. Punk
17. Indie
18. Flamenco
19. Ópera
20. Banda sonora

Esas 20 filas se insertan con el esquema (`INSERT OR IGNORE`), para que una base que ya existía también las tenga.

`music_note_categories`. Une una nota con sus categorías:

- `music_note_id`: INTEGER NOT NULL, clave ajena a `music_notes(id)`
- `category_id`: INTEGER NOT NULL, clave ajena a `categories(id)`
- las dos juntas son la clave primaria

Una nota puede tener varias categorías, o ninguna. Cada `category_id` tiene que ser uno de esos 20. No se repite la misma categoría en la misma nota.

En `core` y en `sdk`, estas funciones:

- `create_music_note`
- `list_music_notes`
- `get_music_note`
- `update_music_note`
- `delete_music_note`

En el cliente de Jupyter, un notebook por acción:

- `create_music_note`
- `read_music_notes`
- `update_music_note`
- `delete_music_note`

### Firmas de `core`

```text
create_music_note(user_creator_id: int, song_link: str, title: str, description: str, category_ids: list[int]) -> dict
list_music_notes() -> list[dict]
get_music_note(music_note_id: int) -> dict
update_music_note(music_note_id: int, song_link: str, title: str, description: str, category_ids: list[int]) -> dict
delete_music_note(music_note_id: int) -> dict
```

`update_music_note` no cambia de dueño. `user_creator_id` se queda como estaba al crear.

Cada nota es un `dict` con estas claves: `id`, `song_link`, `user_creator_id`, `title`, `description`, `category_ids`. `category_ids` es una lista de enteros, ordenada de menor a mayor. `list_music_notes` devuelve las notas ordenadas por `id` ascendente.

### Reglas de `core`

El orden es el de la constitución: parámetros, el resto de reglas, la lógica, la salida.

Parámetros:

- `user_creator_id` y `music_note_id` son `int`. `bool` no vale (`type(valor) is not int`).
- `song_link`, `title` y `description` son `str`. La cadena vacía vale.
- `category_ids` es una `list`. Cada elemento es `int` y no `bool`.

Reglas:

- El usuario existe. Si no: `RuntimeError` con el texto `User not found: {id}`.
- Cada categoría existe en `categories`. Si no: `RuntimeError` con el texto `Category not found: {id}`.
- No hay un `category_id` repetido en la lista. Si lo hay: `RuntimeError` con el texto `Category is duplicated: {id}`.
- La nota existe en `get`, `update` y `delete`. Si no: `RuntimeError` con el texto `Music note not found: {id}`.

Si el tipo no encaja, el texto es uno de estos:

- `User id must be a whole number`
- `Music note id must be a whole number`
- `Song link must be text`
- `Title must be text`
- `Description must be text`
- `Categories must be a list`
- `Category id must be a whole number`

`create` escribe la nota y después sus categorías. Valida todas las categorías antes de escribir ninguna fila de `music_note_categories`.

`update` sustituye el enlace, el título, la descripción y la lista de categorías. Borra las categorías anteriores de esa nota y escribe la lista nueva. El `user_creator_id` no cambia.

`delete` devuelve la nota tal como estaba (con sus `category_ids`) y la quita, junto con sus filas de `music_note_categories`.

### Firmas de `sdk`

`sdk` limpia la entrada y llama a `core`. Acepta el id como texto, igual que el CRUD de usuarios.

```text
create_music_note(user_creator_id: int | str, song_link: str, title: str, description: str, category_ids: list[int | str]) -> dict
list_music_notes() -> list[dict]
get_music_note(music_note_id: int | str) -> dict
update_music_note(music_note_id: int | str, song_link: str, title: str, description: str, category_ids: list[int | str]) -> dict
delete_music_note(music_note_id: int | str) -> dict
```

- Quita espacios de los textos y de cada id.
- Un id tiene que ser un entero en texto (`isdecimal`). Si no: `RuntimeError` con `User id must be a whole number: {valor}`, `Music note id must be a whole number: {valor}` o `Category id must be a whole number: {valor}`.
- `category_ids` tiene que ser una `list`. Si no, el mismo texto que en `core`: `Categories must be a list`.

`sdk/__init__.py` exporta las cinco funciones. El cliente hace `import sdk` y llama a `sdk.create_music_note(...)`.

### Notebooks

Misma forma que los de usuarios: título en inglés, pasos en español, celda «1. Prepara el notebook» que deja `src/` en el path, importa `sdk` y escribe `Ready`. Los mensajes que se ven al ejecutar van en inglés. Los datos de ejemplo se cambian en la celda de la acción.

- `create_music_note.ipynb` llama a `sdk.create_music_note`.
- `read_music_notes.ipynb` llama a `sdk.list_music_notes` y a `sdk.get_music_note`.
- `update_music_note.ipynb` llama a `sdk.update_music_note`.
- `delete_music_note.ipynb` llama a `sdk.delete_music_note`.

El `README.md`, en la sección del CRUD con Jupyter, nombra estos cuatro notebooks.

## Comprobaciones

Las comprobaciones importan con `exercises/ChromaDB/src` en `sys.path`. Crean un usuario propio, con un email que no exista, y al final borran las notas de esa comprobación y después ese usuario.

1. `connect_db()` deja `PRAGMA foreign_keys` en 1. `music_notes` tiene `id` INTEGER clave primaria, `song_link` TEXT, `user_creator_id` INTEGER NOT NULL, `title` TEXT y `description` TEXT. `PRAGMA foreign_key_list` liga `user_creator_id` a `users(id)`.
2. `categories` tiene `id` INTEGER clave primaria y `name` TEXT único. `SELECT id, name FROM categories ORDER BY id` devuelve exactamente las 20 filas de arriba, con esos `id` y esos nombres.
3. `music_note_categories` tiene `music_note_id` y `category_id`, los dos INTEGER y los dos en la clave primaria. Hay clave ajena de `music_note_id` a `music_notes(id)` y de `category_id` a `categories(id)`.
4. `core` tiene las cinco funciones con las firmas de arriba. Crear una nota para el usuario de la comprobación con `category_ids` `[10, 1]` devuelve `user_creator_id` de ese usuario y `category_ids` `[1, 10]`. Un usuario que no existe lanza `User not found`. Un `category_id` `21` lanza `Category not found`. La lista `[1, 1]` lanza `Category is duplicated`. `True` como id de usuario lanza `User id must be a whole number`.
5. `list_music_notes` incluye esa nota. `get_music_note` la devuelve. Un id que no existe lanza `Music note not found`. `update_music_note` cambia `song_link`, `title`, `description` y deja `category_ids` en `[5]`, y el `user_creator_id` sigue siendo el mismo. `delete_music_note` devuelve esa nota y, después, `get_music_note` lanza `Music note not found` y ya no quedan filas suyas en `music_note_categories`.
6. `sdk` tiene las cinco funciones con las firmas de arriba, y `sdk/__init__.py` las exporta. `sdk.create_music_note("1", "  https://example.com/a ", "  Tema ", "  Texto ", ["1", "3"])` crea la nota del usuario 1 solo si ese usuario existe; si el id de usuario de la comprobación no es 1, se usa el id real en texto. El `dict` vuelve con los textos sin espacios alrededor y `category_ids` `[1, 3]`. Un id `"no"` lanza `Music note id must be a whole number: no`.
7. Existen los cuatro notebooks y cada uno llama a la función de `sdk` que dice esta spec. `read_music_notes.ipynb` llama a `list_music_notes` y a `get_music_note`. El `README.md` nombra `create_music_note`, `read_music_notes`, `update_music_note` y `delete_music_note`.

## Fuera de alcance

- Cambiar el CRUD de usuarios, el RAG, los scripts de la documentación o las dependencias.
- Una suite de tests.
- Mover una nota a otro usuario.
- Categorías distintas de esas 20.
