# Constitución — ChromaDB

ChromaDB es un RAG con la documentación oficial de Python 3.15. Sirve para que un agente consulte esa documentación cuando genera código.

## Condiciones

- Solo entra la documentación de Python 3.15. Lo de otras versiones se excluye al indexar.
- Todo corre en local: ChromaDB guarda los datos en `chroma_db/` y Ollama calcula los embeddings.
- No se recorta información: ningún fragmento se trunca al calcular su embedding.
- El agente consulta con scripts de terminal, no con un MCP.
- `python-docs/` es solo lectura.
- Los scripts abren `chroma_db/` directamente, sin servidor. El servidor de Chroma solo se arranca para usar ChromaDash, nunca mientras un script escribe, y se para al terminar.
- `python-docs/`, `chroma_db/` y `.venv/` no van a git.
- `chromadash/` es el visor ChromaDash, parcheado para la API v2 de Chroma. Va en el repositorio.
- `python-docs-md/` es la fuente del índice y va en git. Se genera desde `python-docs/` con `scripts/convert_docs.py` y no se edita a mano.
- Cada participante construye su índice en su equipo. El modelo de embeddings no va en git: se define en `scripts/settings.py` y se descarga con Ollama.

## Dependencias

Antes de instalar una dependencia nueva, o de cambiar su versión, se explica a la persona qué problema resuelve y por qué no basta con lo que ya hay. La persona decide. En `requirements.txt` va con la versión fija.

## Estilo

- El código se escribe en inglés. Los comentarios van en español y solo donde algo no es evidente.
- Los mensajes que se ven en la terminal van en inglés.
- Ficheros, funciones y variables en `snake_case`. Las constantes en mayúsculas (`MODEL`).
- Los parámetros y la salida llevan tipos en la firma. No hay comentario de contrato encima de la función.
- No hay clases, salvo que una librería las pida.
- Cada línea hace una sola acción.
- Un fallo se comprueba con `if` y `raise RuntimeError("...")`, en su propia línea.
- Se escribe como lo escribiría un junior a mano: sin envoltorios de resultado, sin clases de error, sin helpers genéricos y sin abstracciones que oculten los pasos.
- Los imports van al principio: primero la biblioteca estándar y después las dependencias.
- PEP 8 con 4 espacios. Sin formateador ni linter.

## Un fichero de código

Un fichero contiene una función. Su nombre es la acción (`split_doc`, `embed_texts`, `search_docs`).

Los ficheros de código van en `scripts/`. La excepción es `scripts/settings.py`: solo guarda las constantes que comparten los scripts y no tiene funciones.

El cuerpo sigue este orden, sin mezclarlo:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas.
3. Aplicar la lógica.
4. Estructurar la salida.
