# RAG a tempo: tarea de investigación y decisiones

## Contexto

Nuestro RAG funciona porque el crecimiento es controlado: la información a la que el agente tiene que acceder es limitada. Esa premisa condiciona las decisiones de abajo (no diseñamos para millones de documentos).

## Objetivo final

Incorporar al workflow el paso en el que el agente consulta el RAG.

## Preguntas a contestar y justificar

Cada pregunta se responde con una decisión, su justificación y la evidencia que la sostiene (ver plantilla de investigación al final).

### 1. Modelo de embeddings

¿Hugging Face (open source), OpenAI o Cohere? ver modelos locales de Ollama.

- Decisión: **nomic-embed-text en Ollama**, con queries y corpus en inglés. Ver [FICHA_01_EMBEDDINGS.md](FICHA_01_EMBEDDINGS.md).
- Criterios a comparar: calidad en español, coste, latencia, dependencia de un proveedor externo, dimensión del vector, privacidad de los datos.

### 2. Base de datos vectorial

¿Chroma DB o Qdrant?

- Requisito clave: varios agentes acceden a la BD de forma asíncrona y en paralelo.
- Hipótesis de partida: Qdrant, desplegado en Docker, porque funciona como servidor independiente con acceso concurrente. Hay que justificarlo con evidencia, no darlo por hecho.
- Decisión: **Qdrant como servidor Docker**. Con 8 clientes concurrentes alcanzó mayor throughput que Chroma y ambos tuvieron cero errores. Ver [FICHA_02_BASE_VECTORIAL.md](FICHA_02_BASE_VECTORIAL.md).

### 3. Reranking

¿Necesitamos reranking?

- Decisión: **sí**, con `cross-encoder/ms-marco-MiniLM-L-6-v2`: recupera 20 candidatos y conserva los 4 mejores. Ver [FICHA_03_RERANKING.md](FICHA_03_RERANKING.md).
- Cómo decidirlo: medir si mejora la relevancia de los resultados sobre nuestras preguntas frente a la búsqueda sin reranking, y a qué coste de latencia.

### 4. Número de respuestas

Por ejemplo para la pregunta sobre API - metodo HTTP GET - solo necesitamos 1-2 K
¿Cuántas respuestas necesitamos devolver?

- Hipótesis de partida: 1 o 2 resultados (k=1).
- Decisión: **k=4** resultados finales. Antes del reranking se recuperan 20 candidatos. Ver [FICHA_04_NUMERO_K.md](FICHA_04_NUMERO_K.md).
- Cómo decidirlo: comprobar con preguntas reales si k=1 basta o si k=2 recupera información que k=1 pierde.

### 5. Tamaño de chunk

¿Qué chunk size usamos?

- Decisión: **troceo por estructura Markdown**, máximo 1500, mínimo 200 y sin ruta de títulos en el texto embebido. Ver [FICHA_05_CHUNK_SIZE.md](FICHA_05_CHUNK_SIZE.md).
- Cómo decidirlo: probar la eficacia con varios tamaños sobre el mismo conjunto de preguntas y comparar resultados. Ya hay una prueba previa en el notebook con 300, 500 y 1000 caracteres: con 1000 la misma pregunta devolvió «No encuentro esa información», así que los chunks grandes pueden meter ruido. Falta repetirla de forma sistemática.

### 6. Búsqueda híbrida

¿Necesitamos hybrid search (vectorial + palabras clave)?

- Decisión: **no incorporarla** al workflow actual. BM25 solo añadió un acierto sobre la configuración con reranking y el umbral exigía dos. Ver [FICHA_06_HYBRID.md](FICHA_06_HYBRID.md).
- Cómo decidirlo: comprobar si hay preguntas con términos exactos (nombres, códigos, siglas) que la búsqueda semántica falla.

## Documentación de la investigación

Hay que documentar lo investigado con la plantilla universitaria de investigación. Una ficha por pregunta, con estas secciones:

1. Pregunta de investigación
2. Hipótesis
3. Método (qué se probó y cómo, con qué datos y preguntas)
4. Resultados (datos, tablas)
5. Discusión
6. Conclusión y decisión
7. Referencias y fuentes

## Entregables

- Una ficha de investigación por cada una de las 6 preguntas.
- Tabla resumen con las 6 decisiones y su justificación.
- Paso «consultar el RAG» integrado en el workflow del agente.

Los tres entregables están completados. La explicación conjunta, los resultados y las reflexiones están en [COMPARATIVA_RAG_CONSOLIDADA.md](COMPARATIVA_RAG_CONSOLIDADA.md). El paso ejecutable está en `scripts/consultar_rag.py` y su validación final en `data/resultados/validacion_final.csv`.

| Pregunta | Decisión final | Evidencia principal |
|---|---|---|
| 1. Embeddings | nomic-embed-text | Mejor hit@4 por fuente: 0,906 en la comparación inicial. |
| 2. Base vectorial | Qdrant servidor | Con 8 clientes: 728,8 consultas/s frente a 607,6 en Chroma; cero errores. |
| 3. Reranking | MiniLM-L6, 20 → 4 | ev_hit@4: 22 frente a 19 sin reranking. |
| 4. Número de respuestas | k=4 | k=2 pierde cuatro preguntas por evidencia frente a k=4. |
| 5. Chunking | Estructura 1500/200, sin ruta | Mejora ev_hit@4 y ev_MRR manteniendo hit@4 por fuente. |
| 6. Búsqueda híbrida | No incorporar BM25 | Con reranking mejora solo +1 total y +0 en B; umbral +2. |

## Reparto del trabajo entre 3 personas

Las 6 preguntas no son independientes: chunk size, k, reranking e hybrid se miden sobre el mismo índice, y ese índice depende del modelo de embeddings y de la BD. Por eso hay una fase común corta y después un reparto por afinidad.

### Fase 0: juntos (1 sesión corta)

Sin esta fase, cada persona mide con reglas distintas y los resultados no se pueden comparar.

- **Conjunto de preguntas de evaluación (golden set).** Unas 20-30 preguntas reales con la página o el chunk que debe aparecer. Incluye preguntas con términos exactos (siglas, códigos) para la pregunta 6 y casos tipo «método HTTP GET» para la 4.
- **Métricas comunes.** Hit rate@k, MRR y latencia.
- **Configuración base fija.** Por ejemplo, un embedding por defecto, chunk 500 y k=4. Todos parten de ella y cambian una sola variable.
- **Plantilla de ficha.** Se rellena una vez para la estructura común (`PLANTILLA_FICHA_INVESTIGACION.md`).

### Reparto

| Persona | Preguntas | Qué hace |
|---|---|---|
| **A: Indexación** | 1 Embeddings + 5 Chunk size | Define cómo se genera el índice. Compara modelos (HF, OpenAI, Cohere, Ollama local) en español, coste, latencia, dimensión y privacidad. Después barre los tamaños de chunk. |
| **B: Infraestructura** | 2 Vector DB + 6 Hybrid | Despliega Qdrant en Docker y prueba la concurrencia con varios agentes en paralelo, frente a Chroma. Hybrid va con B porque depende de lo que soporte la BD (Qdrant lo trae nativo). |
| **C: Calidad de recuperación** | 3 Reranking + 4 Nº de respuestas | Mide la relevancia con y sin reranker y el coste en latencia. Compara k=1, 2 y 4. Es dueña del golden set y de las métricas. |

Entregables comunes:

- **Tabla resumen de las 6 decisiones:** C, que reúne todos los resultados de calidad.
- **Paso «consultar el RAG» en el workflow:** B, porque conoce el servidor y su API.

### Dependencias

1. **A condiciona a B y C.** Si A cambia de embedding o de chunk, las medidas de B y C quedan obsoletas. Hasta que A cierre, todos trabajan con la configuración base.
2. **A y B deciden pronto.** Fijan la base del resto, así que sus decisiones deberían salir en la primera mitad del trabajo.
3. **Fase final, juntos.** Se repite el golden set con la configuración ganadora, se confirman las decisiones de B y C sobre ella y se cierran la tabla resumen y la integración.

### Encaje con el flujo de entrega

Una issue por ficha, con rama `número-tipo-descripcion` y PR en draft por cada una. Además, dos issues comunes: la Fase 0 y la integración en el workflow.

## Criterios de limpieza del corpus

Guía para preparar la documentación de cualquier librería o lenguaje antes de indexarla. Se aplicó por primera vez a la documentación oficial de Python 3.15 (ver `GOLDEN_SET_PYTHON_DOCS.md`). El objetivo del RAG es que un agente escriba código para **una sola versión objetivo**, así que el corpus solo debe contener lo que cambia el código que escribe.

### Principio

Un fragmento sobra si quitarlo no cambia el código que escribiría el agente para la versión objetivo. Un fragmento se queda si evita que el agente use algo que ya no existe o que desaparecerá pronto.

### Proceso

1. **Descargar el formato original** (HTML) y descomprimirlo en `data/<nombre>/`. Solo se versiona la copia limpia; el HTML y el Markdown sin limpiar son reproducibles con los scripts y no se suben.
2. **Convertir a Markdown** una copia fiel de todo el contenido, sin limpiar nada. Es el punto de partida y no se modifica después.
3. **Limpiar sobre una copia** (`…-md-clean/`), nunca sobre el original. Así se puede deshacer cualquier decisión.
4. **Medir antes y después** (ficheros, tamaño, cuántas notas y enlaces se tocan por categoría) y guardar el informe.
5. **Comprobar contra el golden set** que la evidencia de cada pregunta sigue en el texto limpio.

Scripts (en `scripts/`; el uso está en la cabecera de cada uno):

- `html_a_md.py`: paso 2, conversión de HTML de Sphinx a Markdown.
- `limpiar_corpus_md.py`: paso 3, limpieza con la versión objetivo como parámetro. Las listas de ficheros a quitar son de la documentación de Python y hay que adaptarlas a otro corpus.

### Qué se quita

| Criterio | Qué se quita | Por qué |
|---|---|---|
| Historia de otras versiones | Páginas de novedades y changelogs de versiones distintas de la objetivo | No aportan nada para la versión objetivo. El changelog es el fichero más grande y es lista de commits. |
| Notas «añadido en versión X» | Las de versión anterior a la objetivo | Todo lo anterior existe en la versión objetivo. Se dejan las de la versión objetivo, que marcan lo nuevo. |
| Notas «cambiado en versión X» | Las de versión anterior a la objetivo, salvo si contienen `deprecat`, `remov`, `no longer`, `must` o `raises` | La descripción actual ya refleja el comportamiento actual. Las excepciones avisan de algo que el agente debe evitar. |
| Documentación de instalación y entorno | Instalación por sistema operativo, compilación, editores | No cambia el código. |
| Páginas administrativas | Licencia, copyright, acerca de, informe de errores | No contienen información técnica. |
| Notas de plataformas que no interesan | Avisos de WebAssembly/WASI | No afectan al destino del código. |
| Guías de portado desde versiones antiguas | Python 2 a 3, `pyporting` | La versión objetivo no las necesita. |
| Herramientas de depuración y perfilado del propio intérprete | `gdb`, DTrace, perf | No son código que escriba el agente. |
| Enlaces | Se dejan solo con su texto, salvo los que apuntan a la documentación oficial | Destinos y tooltips ocupaban el 23 % de los bytes y llenaban los chunks de rutas repetidas. |
| Líneas de navegación | «Source code: enlace a GitHub» al inicio de cada módulo | Ruido repetido en cientos de páginas. |

### Qué se conserva siempre

- **Avisos de deprecación y eliminación** (`Deprecated since…`, `removed in…`) y las páginas de «pendiente de eliminación» de versiones posteriores a la objetivo. Son lo más útil para que el agente evite APIs que ya no existen o que pronto desaparecen.
- **Páginas de módulos eliminados** (suelen ocupar unos 600 bytes): dicen qué usar en su lugar y evitan que el agente invente un import.
- **Notas de implementación y de plataforma** (`Availability`, «detalle de implementación de CPython»): describen comportamiento actual.
- **Ejemplos y bloques de código**, intactos.
- **Menciones a versiones antiguas dentro de una descripción**, por ejemplo la compatibilidad con Python 2 de `pickle`. Quitarlas obliga a editar frases sueltas y deja el texto incoherente.

### Decisiones que dependen del caso

Antes de limpiar otro corpus, hay que decidir y anotar:

- **Sistema operativo de destino.** Si es uno solo, se pueden quitar las páginas y notas de los demás. En Python 3.15 se dejó todo.
- **¿El agente escribe extensiones en código nativo (C)?** Si no, se puede quitar la API de C y los tutoriales de extensiones, que además aportan vocabulario que confunde la recuperación («object», «list», «string»). En Python 3.15 se dejó.
- **Qué enlaces conservar.** En Python 3.15, solo los que apuntan a la documentación oficial.

### Reglas técnicas para no romper el texto

- No tocar nada dentro de bloques de código. Cuidado con los que abre una lista de definiciones (`:   ` seguido de las tres comillas), que se reconocen como bloque de código igual que los demás.
- Tratar las notas como **párrafos completos** (hasta la siguiente línea en blanco), no como una sola línea.
- Una nota con una palabra clave de la lista de excepciones se conserva entera.
- Después de limpiar, comprobar que no quedan bloques de código con número impar de marcas y que no quedan enlaces sin convertir.

### Resultado en Python 3.15

| | Antes | Después |
|---|---|---|
| Ficheros Markdown | 551 | 508 |
| Tamaño | 19,4 MB | 9,6 MB |
| Enlaces convertidos a texto | 46 063 | — |
| Enlaces conservados (documentación oficial) | — | 25 |
| Notas «Added in» anteriores a 3.15 quitadas | 2 444 | — |
| Notas «Changed in» anteriores a 3.15 quitadas / conservadas | 2 240 / 337 | — |

Las 32 comprobaciones de evidencia del golden set que se pueden automatizar (preguntas A a D) siguen cumpliéndose sobre el texto limpio. Las de la categoría E son negativas y no dependen del texto limpio.
