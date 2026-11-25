# Ficha de investigación: modelos de embeddings con la configuración final

> Ficha de la issue [#28](https://github.com/maria-osi/rag-neoland/issues/28), con la estructura de [PLANTILLA_FICHA_INVESTIGACION.md](PLANTILLA_FICHA_INVESTIGACION.md). Repite la pregunta de [FICHA_01_EMBEDDINGS.md](FICHA_01_EMBEDDINGS.md) sobre la configuración final de [COMPARATIVA_RAG_CONSOLIDADA.md](COMPARATIVA_RAG_CONSOLIDADA.md).

| Campo | Valor |
|---|---|
| Autores | Sergio |
| Fecha | 2026-11-18 |
| Versión | v1 |
| Estado | cerrada |
| Pregunta nº | 1 (repetida con la configuración final; ampliación posterior a [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md)) |

## Resumen (máx. 150 palabras)

Se comprobó si otro modelo de embeddings recupera más evidencia que nomic-embed-text con la configuración final: troceo por estructura 1500/200 sin ruta, 20 candidatos, reranker MiniLM-L6, top 4 y filtro por `modulo`. Se indexaron cinco modelos nuevos (Qwen3-Embedding 0.6B y 8B, BGE-M3, EmbeddingGemma y jina-code-embeddings-1.5b) y se midieron seis modelos en cuatro configuraciones sobre las 32 preguntas A-D. Con reranker y filtro perfecto por `modulo` con repetición, nomic logra 31/32 fuentes y 28/32 evidencias en el top 4; el mejor modelo nuevo empata en 28 evidencias (Qwen3 8B y BGE-M3, con 32 fuentes). Ninguno llega a las 30 evidencias que exige el criterio fijado antes de medir. Se mantiene nomic y la configuración del RAG no cambia.

## 1. Introducción

### 1.1 Contexto y motivación

La ficha 1 eligió nomic frente a MiniLM y BGE-base con chunks fijos de 500 caracteres, sin reranker, sin la métrica de varias evidencias por fuente (issue #21) y sin filtro por módulo (issue #26). La configuración cambió después. Hay modelos recientes con más contexto que podrían leer enteros chunks largos como el de B08, que tiene la evidencia en el carácter 3 683 de un chunk de 14 608.

### 1.2 Pregunta de investigación

¿Algún modelo de embeddings recupera, con reranker y filtro por `modulo` con repetición, al menos dos evidencias más que nomic-embed-text sin perder fuentes?

### 1.3 Hipótesis

Un modelo con más contexto o más parámetros que nomic sube ev_hit@4 al menos a 30/32 con reranker y filtro perfecto por `modulo` con repetición, sin bajar hit@4 de 31/32. El criterio se fijó en la issue #28 y en la primera celda del notebook 13 antes de medir.

### 1.4 Alcance y exclusiones

- **Entra:** cinco modelos nuevos y nomic como referencia; cuatro configuraciones por modelo (sin y con reranker, sin filtro y con filtro perfecto por `modulo` con repetición); latencia de consulta, tiempo de indexación, chunks truncados y dispositivo de cada modelo; `torch` con CUDA en Windows para jina-code y el reranker.
- **No entra:** la parte dispersa de BGE-M3 (búsqueda híbrida, descartada en la ficha 6); cambios de troceo, reranker, k, golden set o filtros; ajustar prefijos o instrucciones con el golden set.

## 2. Estado de la cuestión

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| Issue [#28](https://github.com/maria-osi/rag-neoland/issues/28) | Modelos, condiciones fijas, criterio de decisión y prefijos de cada modelo (RF-01, RF-02). | propia |
| Fichas de los modelos en Hugging Face (sección 8) | Prefijos o instrucciones de consulta y documento; `max_length` 8192 en los ejemplos de Qwen3 y jina-code; argumentos de carga de jina-code. | oficial |
| [FICHA_07_FILTROS_METADATOS.md](FICHA_07_FILTROS_METADATOS.md) y `data/resultados/filtros_metadatos_por_pregunta.csv` | Referencia de nomic: 30/32 fuentes y 26/32 evidencias sin filtro; 31/32 y 28/32 con filtro perfecto por `modulo` con repetición. Regla del filtro perfecto. | propia |
| Comprobaciones contra Ollama 0.40.16 (issue #28) | Con `truncate=False`, un texto que no cabe da error 400 «the input length exceeds the context length». El GGUF de jina-code da 501 «This server does not support embeddings». En un modelo BERT (bge-m3), Ollama procesa cada texto en un solo bloque de `num_batch` tokens, 2048 por defecto. | propia |

## 3. Método

### 3.1 Opciones comparadas

| Clave | Modelo | Proveedor | Prefijo de consulta | Prefijo de documento | `num_ctx` | Dimensión |
|---|---|---|---|---|---:|---:|
| `nomic` | `nomic-embed-text` | Ollama | `search_query: ` | `search_document: ` | — (2048 en `ollama show`) | 768 |
| `qwen3_06b` | `qwen3-embedding:0.6b` | Ollama | `Instruct: Given a web search query, retrieve relevant passages that answer the query\nQuery:` | (vacío) | 8192 | 1024 |
| `qwen3_8b` | `qwen3-embedding:8b` | Ollama | el mismo que `qwen3_06b` | (vacío) | 8192 | 4096 |
| `bge_m3` | `bge-m3` (solo vector denso) | Ollama | (vacío) | (vacío) | 8192 | 1024 |
| `embeddinggemma` | `embeddinggemma` | Ollama | `task: search result \| query: ` | `title: none \| text: ` | 2048 | 768 |
| `jina_code` | `jinaai/jina-code-embeddings-1.5b` | `sentence-transformers` | `Find the most relevant answer given the following question:\n` | `Candidate answer:\n` | 8192 | 1536 |

`\n` es un salto de línea real. Los prefijos copian la ficha oficial de cada modelo; Qwen3 usa la descripción de tarea del ejemplo de su ficha y jina-code los prompts `qa_query` y `qa_document`, porque el golden set son preguntas en lenguaje natural sobre documentación. El registro está en `MODELOS` de [comparar_embeddings.py](../scripts/comparar_embeddings.py).

`num_ctx` es el contexto que se usó: el menor entre el contexto máximo del modelo y 8192, el `max_length` de los ejemplos de Qwen3 y jina-code. jina-code admite hasta 32 768 tokens según su ficha; aquí se usó 8192 como `max_seq_length` de `sentence-transformers`. Con Ollama, un modelo con `num_ctx` recibe `options={"num_ctx": n, "num_batch": n}`; nomic no define `num_ctx` y se embebe como en el resto del proyecto. jina-code va por `sentence-transformers` porque Ollama no da embeddings con su GGUF; se carga con `torch_dtype` `bfloat16` en `cuda` (`float32` en `mps` y `cpu`) y `tokenizer_kwargs={"padding_side": "left"}` ([embeddings_modelos.py](../scripts/embeddings_modelos.py), `cargar_codificador`).

Cada modelo se mide en cuatro configuraciones:

| Configuración | Reranker | Filtro |
|---|---|---|
| sin reranker, sin filtro | no: los 4 primeros de la búsqueda | ninguno |
| sin reranker, filtro modulo con repetición | no | `modulo` perfecto; se repite sin filtro solo si la búsqueda filtrada no trae candidatos |
| con reranker, sin filtro | MiniLM-L6 sobre 20 candidatos | ninguno |
| con reranker, filtro modulo con repetición | MiniLM-L6 sobre 20 candidatos | `modulo` perfecto; se repite sin filtro si ningún candidato llega a 0,0 en score de reranking |

El filtro perfecto sigue la regla del notebook 12: los módulos de las fuentes esperadas. Se aplica a 22 de 32 preguntas; las otras 10 no tienen módulo en su fuente y van sin filtro.

### 3.2 Datos y preguntas de prueba

- Corpus limpio de Python 3.15, troceado con `trocear_por_estructura` 1500/200 sin ruta: 7 955 chunks, los mismos en las seis colecciones. Cada modelo tiene su colección `pydocs_<clave>_est1500_m200_sinruta`, con distancia coseno y los seis metadatos de la issue #26 en el payload. `pydocs_nomic_est1500_m200_sinruta` no se tocó.
- Las 32 preguntas A-D de [GOLDEN_SET_PYTHON_DOCS.md](GOLDEN_SET_PYTHON_DOCS.md): A 10, B 10, C 9 y D 3.
- Fuente esperada del golden set y varias evidencias por fuente de [golden_set_evidencias.json](golden_set_evidencias.json), como `validar_rag_final.py`.

### 3.3 Variables

- Variable que cambia: el modelo de embeddings, con su colección y sus prefijos.
- Variables fijas: corpus, troceo, Qdrant, 20 candidatos, reranker `cross-encoder/ms-marco-MiniLM-L-6-v2`, k=4, golden set, evidencias y umbral de repetición 0,0.
- Variables medidas: hit@1, hit@4 y MRR por fuente y por evidencia; latencia total media por pregunta; tiempo de indexación; chunks truncados; dispositivo de los embeddings y del reranker.

### 3.4 Métricas y criterio de éxito

| Condición | Configuración | Umbral |
|---|---|---|
| Sustituir a nomic | con reranker, filtro modulo con repetición | ev_hit@4 ≥ nomic + 2 (≥ 30/32) y hit@4 ≥ nomic (≥ 31/32) |
| Desempate entre varios | la misma | más ev_hit@4; si empatan, menor latencia media de consulta |

El criterio lo aplica `elegir_modelo` en [embeddings_modelos.py](../scripts/embeddings_modelos.py). El resto de métricas y configuraciones se registran como referencia y no deciden. La latencia y el tiempo de indexación se documentan.

### 3.5 Entorno y reproducción

- Python 3.14; `torch` 2.14.1+cu130 en Windows (2.14.1 de PyPI en macOS); `sentence-transformers` 6.2.0; `transformers` 5.21.0; `ollama` 0.6.3; Ollama 0.40.16; `qdrant-client` 1.20.0; el resto fijado en `uv.lock`.
- Windows 11, 32 GB de RAM, GPU RTX 4070 Laptop con 8 GB de VRAM. Reranker en `cuda` en todas las filas con reranker; Qdrant y Ollama en local.
- Indexación, un modelo cada vez, con [indexar_embeddings.py](../scripts/indexar_embeddings.py):

  ```bash
  uv run python scripts/indexar_embeddings.py --referencia
  uv run python scripts/indexar_embeddings.py qwen3_06b bge_m3 embeddinggemma qwen3_8b
  uv run python scripts/indexar_embeddings.py jina_code --lote 8
  ```

  `--referencia` crea la entrada de nomic en el registro sin escribir en Qdrant. Antes de cargar jina-code, el script descarga de la VRAM los modelos de Ollama (`liberar_vram_ollama`). El registro queda en `data/resultados/indexacion_embeddings.json`.
- Notebook: [notebooks/13_comparar_modelos_embedding.ipynb](../notebooks/13_comparar_modelos_embedding.ipynb). Una ejecución; el reranker se carga una vez; por modelo, una consulta de calentamiento que no se mide y las cuatro configuraciones; jina-code se mide el último, después de liberar la VRAM de Ollama.
- Comprobación previa: nomic reproduce pregunta a pregunta los rangos de fuente y evidencia de `filtros_metadatos_por_pregunta.csv` («1 sin filtro» y «3 perfecto modulo con repeticion»), sin diferencias.

## 4. Resultados

**Tabla 1. Indexación** (`data/resultados/indexacion_embeddings.json`). Truncados: chunks que no caben en `num_ctx` y se embebieron truncados.

| Clave | Dimensión | `num_ctx` | Truncados / 7 955 | Tiempo de indexación (s) | Dispositivo |
|---|---:|---:|---:|---:|---|
| `nomic` | 768 | 2048 | 42 | 228,2 (otra máquina) | — |
| `qwen3_06b` | 1024 | 8192 | 2 | 261,4 | `cuda` |
| `qwen3_8b` | 4096 | 8192 | 2 | 1 573,4 | `cuda+cpu` |
| `bge_m3` | 1024 | 8192 | 3 | 276,3 | `cuda` |
| `embeddinggemma` | 768 | 2048 | 47 | 247,4 | `cuda` |
| `jina_code` | 1536 | 8192 | 2 | 1 814,9 | `cuda` |

- El tiempo de nomic no se midió en esta ejecución: es el de la fila `sinruta` 1500/200 de `troceo_estructura.csv`, medido en un MacBook M2 Pro ([ficha 5](FICHA_05_CHUNK_SIZE.md), sección 3.5 y «Troceo con límite duro»), y no se compara con los demás tiempos de la tabla. Su dispositivo queda en «—»: el `cuda` que guarda el registro es el del sondeo de `--referencia`, que contó sus 42 truncados sin escribir en Qdrant, no el de esos 228,2 s.
- `qwen3_8b` ocupa 7,1 GB y no cabe entero en los 8 GB de VRAM: Ollama lo reparte 88 % en GPU y 12 % en CPU, y el registro lo anota como `cuda+cpu`.
- `bge_m3` registró primero 52 truncados con `num_ctx` 8192: Ollama procesaba cada texto en un bloque de `num_batch` tokens (2048 por defecto) y rechazaba, por ejemplo, un chunk de 2 328 tokens (`c-api/init_config.md`). Con `num_batch` igual a `num_ctx` se reindexó y quedaron 3.
- `jina_code` se indexó con `--lote 8`: con el lote por defecto de 32 la VRAM se llenó en el lote 7 (uno de sus chunks tiene 12 979 caracteres) y Windows pasó a memoria compartida.

**Tabla 2. Métricas globales sobre 32 preguntas A-D** (`data/resultados/modelos_embedding.csv`). Entre paréntesis, preguntas acertadas. Latencia: media por pregunta en ms de la llamada a `ConsultorRAG.consultar` (embedding de la consulta, búsqueda y, si lo hay, reranking).

| Modelo | Configuración | hit@1 | hit@4 | MRR | ev_hit@1 | ev_hit@4 | ev_MRR | Latencia (ms) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| `nomic` | sin reranker, sin filtro | 0,719 (23) | 0,906 (29) | 0,786 | 0,438 (14) | 0,656 (21) | 0,529 | 96,3 |
| `nomic` | sin reranker, filtro | 0,906 (29) | 0,969 (31) | 0,938 | 0,531 (17) | 0,719 (23) | 0,615 | 61,9 |
| `nomic` | con reranker, sin filtro | 0,688 (22) | 0,938 (30) | 0,797 | 0,438 (14) | 0,813 (26) | 0,604 | 110,0 |
| `nomic` | **con reranker, filtro** | 0,844 (27) | 0,969 (31) | 0,906 | 0,563 (18) | **0,875 (28)** | 0,701 | 105,7 |
| `qwen3_06b` | sin reranker, sin filtro | 0,656 (21) | 0,969 (31) | 0,792 | 0,438 (14) | 0,719 (23) | 0,557 | 61,7 |
| `qwen3_06b` | sin reranker, filtro | 0,875 (28) | 0,969 (31) | 0,922 | 0,500 (16) | 0,875 (28) | 0,656 | 58,4 |
| `qwen3_06b` | con reranker, sin filtro | 0,656 (21) | 0,938 (30) | 0,779 | 0,469 (15) | 0,781 (25) | 0,607 | 115,5 |
| `qwen3_06b` | **con reranker, filtro** | 0,844 (27) | 0,969 (31) | 0,901 | 0,594 (19) | 0,844 (27) | 0,701 | 109,8 |
| `qwen3_8b` | sin reranker, sin filtro | 0,813 (26) | 0,969 (31) | 0,872 | 0,531 (17) | 0,750 (24) | 0,622 | 205,1 |
| `qwen3_8b` | sin reranker, filtro | 0,906 (29) | 1,000 (32) | 0,940 | 0,563 (18) | 0,875 (28) | 0,690 | 197,8 |
| `qwen3_8b` | con reranker, sin filtro | 0,656 (21) | 0,969 (31) | 0,789 | 0,438 (14) | 0,813 (26) | 0,594 | 259,7 |
| `qwen3_8b` | **con reranker, filtro** | 0,813 (26) | 1,000 (32) | 0,896 | 0,563 (18) | **0,875 (28)** | 0,693 | 256,1 |
| `bge_m3` | sin reranker, sin filtro | 0,594 (19) | 0,906 (29) | 0,740 | 0,344 (11) | 0,719 (23) | 0,497 | 54,7 |
| `bge_m3` | sin reranker, filtro | 0,844 (27) | 1,000 (32) | 0,922 | 0,406 (13) | 0,781 (25) | 0,570 | 60,3 |
| `bge_m3` | con reranker, sin filtro | 0,656 (21) | 0,969 (31) | 0,794 | 0,438 (14) | 0,813 (26) | 0,594 | 124,1 |
| `bge_m3` | **con reranker, filtro** | 0,813 (26) | 1,000 (32) | 0,906 | 0,563 (18) | **0,875 (28)** | 0,693 | 117,3 |
| `embeddinggemma` | sin reranker, sin filtro | 0,813 (26) | 0,969 (31) | 0,870 | 0,563 (18) | 0,875 (28) | 0,680 | 61,6 |
| `embeddinggemma` | sin reranker, filtro | 0,938 (30) | 1,000 (32) | 0,956 | 0,625 (20) | 0,875 (28) | 0,732 | 63,0 |
| `embeddinggemma` | con reranker, sin filtro | 0,656 (21) | 0,969 (31) | 0,797 | 0,406 (13) | 0,781 (25) | 0,565 | 118,5 |
| `embeddinggemma` | **con reranker, filtro** | 0,844 (27) | 1,000 (32) | 0,917 | 0,563 (18) | 0,844 (27) | 0,677 | 151,2 |
| `jina_code` | sin reranker, sin filtro | 0,500 (16) | 0,813 (26) | 0,638 | 0,188 (6) | 0,594 (19) | 0,359 | 51,0 |
| `jina_code` | sin reranker, filtro | 0,750 (24) | 0,969 (31) | 0,859 | 0,281 (9) | 0,750 (24) | 0,474 | 52,8 |
| `jina_code` | con reranker, sin filtro | 0,656 (21) | 0,906 (29) | 0,771 | 0,438 (14) | 0,688 (22) | 0,547 | 107,0 |
| `jina_code` | **con reranker, filtro** | 0,844 (27) | 0,969 (31) | 0,906 | 0,563 (18) | 0,781 (25) | 0,659 | 106,0 |

«Filtro» es «filtro modulo con repetición». En negrita, la configuración que decide y los ev_hit@4 más altos en ella. Los embeddings corrieron en `cuda` en todos los modelos salvo `qwen3_8b` (`cuda+cpu`).

**Tabla 3. ev_hit@4 por categoría, con reranker y filtro modulo con repetición.**

| Modelo | A / 10 | B / 10 | C / 9 | D / 3 |
|---|---:|---:|---:|---:|
| `nomic` | 10 | 9 | 8 | 1 |
| `qwen3_06b` | 10 | 8 | 8 | 1 |
| `qwen3_8b` | 10 | 8 | 8 | 2 |
| `bge_m3` | 10 | 9 | 8 | 1 |
| `embeddinggemma` | 10 | 8 | 8 | 1 |
| `jina_code` | 9 | 8 | 8 | 0 |

**Tabla 4. Preguntas que cambian entre modelos, con reranker y filtro modulo con repetición** (`data/resultados/modelos_embedding_por_pregunta.csv`). Rango del primer chunk de la fuente correcta / del primer chunk con evidencia; «—» si no aparece en el top 4.

| Pregunta | `nomic` | `qwen3_06b` | `qwen3_8b` | `bge_m3` | `embeddinggemma` | `jina_code` |
|---|---|---|---|---|---|---|
| A08 | 1 / 3 | 1 / 3 | 1 / 3 | 1 / 3 | 1 / 3 | 1 / — |
| B05 | 2 / 2 | 3 / — | 3 / — | 2 / 2 | 3 / — | 2 / — |
| D01 | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 | 1 / 1 | 1 / — |
| D02 | — / — | — / — | 3 / 3 | 2 / — | 1 / — | — / — |

Las otras 28 preguntas dan el mismo acierto en los seis modelos. B08, C01 y D03 fallan por evidencia en los seis: B08 sigue sin traer el chunk con la evidencia con ningún modelo, tampoco con los de `num_ctx` 8192. D02 es la única pregunta que se repite sin filtro, en los seis modelos: su resultado sale de la búsqueda sin filtro.

**Tabla 5. Criterio aplicado** (con reranker y filtro modulo con repetición; nomic: 31 fuentes y 28 evidencias).

| Modelo | ev_hit@4 (mín. 30) | hit@4 (mín. 31) | Cumple |
|---|---:|---:|---|
| `qwen3_06b` | 27 | 31 | no |
| `qwen3_8b` | 28 | 32 | no |
| `bge_m3` | 28 | 32 | no |
| `embeddinggemma` | 27 | 32 | no |
| `jina_code` | 25 | 31 | no |

`elegir_modelo` devuelve `nomic`.

## 5. Discusión

- **Qué significan los resultados:** con reranker y filtro, tres modelos llegan a 28 evidencias (nomic, Qwen3 8B y BGE-M3) y ninguno pasa de ahí. Qwen3 8B, BGE-M3 y EmbeddingGemma suben a 32 fuentes por D02, que se repite sin filtro en todos los modelos y depende de la búsqueda sin filtro de cada uno; Qwen3 8B es el único que trae además su evidencia. El reranker iguala a los modelos: con reranker y sin filtro, cinco de seis quedan entre 25 y 26 evidencias.
- **Observación sin reranker:** EmbeddingGemma sin reranker logra 31 fuentes y 28 evidencias sin filtro, y 32 y 28 con filtro, con 61,6 y 63,0 ms de latencia media. Con reranker baja a 25 evidencias sin filtro y 27 con filtro. En nomic el reranker hace lo contrario: sube de 21 a 26 sin filtro y de 23 a 28 con filtro. El criterio solo evalúa la configuración con reranker y filtro, así que esta observación no cambia la decisión ni la configuración.
- **Frente a la hipótesis:** se refuta. Ningún modelo llega a 30 evidencias con reranker y filtro; el mejor empata con nomic en 28. Más contexto no trajo la evidencia de B08.
- **Latencia:** con reranker y filtro, nomic, Qwen3 0.6B, BGE-M3 y jina-code quedan entre 105,7 y 117,3 ms. Qwen3 8B corre repartido entre GPU y CPU (`cuda+cpu`), así que sus 256,1 ms no son comparables con los demás. EmbeddingGemma da 151,2 ms con filtro frente a 118,5 ms sin filtro; con una sola ejecución no se interpreta como coste del filtro. Indexar Qwen3 8B y jina-code costó 1 573,4 y 1 814,9 s; el resto de modelos nuevos, entre 247,4 y 276,3 s.
- **Explicaciones alternativas:** los prefijos de cada modelo copian su ficha sin ajustarlos al golden set; otra instrucción de tarea en Qwen3 o jina-code podría dar otras cifras. El reranker MiniLM-L6 reordena los mismos 20 candidatos con independencia del modelo, y eso reduce las diferencias entre modelos que sí se ven sin reranker.
- **Limitaciones y amenazas a la validez:**
  - 32 preguntas y una sola ejecución: una pregunta cambia una proporción en 0,031. La diferencia de 28 a 30 evidencias son dos preguntas.
  - El filtro «perfecto» sale de la fuente esperada del golden set, igual que en la ficha 7.
  - Las latencias se midieron con el reranker en `cuda` y no se comparan con las de las fichas y la validación medidas con el reranker en CPU (fichas 5 y 7, `validacion_final.csv`) o en MPS.
  - Los truncados son chunks del troceo 1500/200 que no caben en el contexto del modelo. Ese troceo deja 773 chunks por encima de 1 500 caracteres y el mayor, de 203 072 caracteres, es de `library/tkinter.md` ([ficha 5](FICHA_05_CHUNK_SIZE.md), «Troceo con límite duro»). Con `num_ctx` 2048, nomic y EmbeddingGemma truncan 42 y 47; con 8192, el resto trunca 2 o 3.
  - jina-code se cargó con `tokenizer_kwargs`, el argumento del ejemplo de su ficha, y la carga da un aviso de deprecación que propone `processor_kwargs`. Se comprobó que `padding_side` sigue en `left`, que el pooling es `lasttoken` y que el embedding de un texto en lote coincide con el embedding individual (coseno ≈ 1,00), así que sus cifras son válidas.
- **Qué cambiaría si el volumen de datos creciera:** el tiempo de indexación crece con el número de chunks; Qwen3 8B y jina-code ya tardan más de 25 minutos con 7 955. Un modelo mejor en otro golden set o en otro corpus habría que medirlo con este mismo criterio.

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | Se mantiene `nomic-embed-text` y la colección `pydocs_nomic_est1500_m200_sinruta`. `COLECCION`, `MODELO` y `validacion_final.csv` no cambian. |
| Motivo principal | Con reranker y filtro por `modulo` con repetición, ningún modelo llega a 30/32 evidencias: el máximo es 28/32, el mismo que nomic. |
| Alternativas descartadas | Qwen3 8B y BGE-M3 (28 evidencias, 32 fuentes): no suman las dos evidencias que exige el criterio; Qwen3 8B, además, no cabe entero en la VRAM. Qwen3 0.6B y EmbeddingGemma (27) y jina-code (25) quedan por debajo de nomic. |
| Coste o riesgo asumido | nomic trunca 42 chunks con contexto 2048 frente a 2 o 3 de los modelos con 8192. B08, C01 y D03 siguen sin evidencia con todos los modelos. |
| Cuándo se revisa | Si cambian el reranker, el troceo, el corpus o el golden set; si se mide la configuración sin reranker como alternativa; o si aparece otro modelo de embeddings candidato. |

## 7. Impacto en el workflow

- El paso «el agente consulta el RAG» sigue con nomic y su colección: el agente no cambia nada.
- En Windows, `torch` se instala con CUDA desde el índice de PyTorch (`pyproject.toml`, `[tool.uv.sources]`) y `ConsultorRAG.local()` crea el reranker en `dispositivo()`: `cuda` en Windows con GPU NVIDIA, `mps` en macOS y `cpu` en otro caso. En macOS `torch` sigue saliendo de PyPI.
- `ConsultorRAG` acepta `coleccion`, `modelo` y `reordenar` para medir otros modelos; los valores por defecto son los de la configuración final (sección 5 de [COMPARATIVA_RAG_CONSOLIDADA.md](COMPARATIVA_RAG_CONSOLIDADA.md)).

## 8. Referencias

1. Issue #28. (2026). _Compare more embedding models under the final RAG configuration_. GitHub. https://github.com/maria-osi/rag-neoland/issues/28 (consultado el 2026-11-18).
2. Qwen. (2025). _Qwen3-Embedding-0.6B_. Hugging Face. https://huggingface.co/Qwen/Qwen3-Embedding-0.6B (consultado el 2026-11-18).
3. Qwen. (2025). _Qwen3-Embedding-8B_. Hugging Face. https://huggingface.co/Qwen/Qwen3-Embedding-8B (consultado el 2026-11-18).
4. BAAI. (2024). _bge-m3_. Hugging Face. https://huggingface.co/BAAI/bge-m3 (consultado el 2026-11-18).
5. Google. (2025). _embeddinggemma-300m_. Hugging Face. https://huggingface.co/google/embeddinggemma-300m (consultado el 2026-11-18).
6. Jina AI. (2025). _jina-code-embeddings-1.5b_. Hugging Face. https://huggingface.co/jinaai/jina-code-embeddings-1.5b (consultado el 2026-11-18).

## Anexos

- Notebook: [notebooks/13_comparar_modelos_embedding.ipynb](../notebooks/13_comparar_modelos_embedding.ipynb)
- Datos brutos: `data/resultados/modelos_embedding.csv` (resumen) y `data/resultados/modelos_embedding_por_pregunta.csv` (por pregunta)
- Registro de indexación: `data/resultados/indexacion_embeddings.json`
- Registro de modelos: `MODELOS` en [scripts/comparar_embeddings.py](../scripts/comparar_embeddings.py); embeddings, dispositivo y criterio: [scripts/embeddings_modelos.py](../scripts/embeddings_modelos.py); indexación: [scripts/indexar_embeddings.py](../scripts/indexar_embeddings.py)
- Referencia de nomic: `data/resultados/filtros_metadatos_por_pregunta.csv`

---

## Lista de comprobación antes de exponer

- [x] La pregunta está formulada en una frase y se puede responder con datos.
- [x] La hipótesis y el umbral de éxito se escribieron antes de probar.
- [x] Solo cambia una variable a la vez; el resto está fijo.
- [x] Otra persona puede repetir la prueba con la sección 3.
- [x] Los resultados incluyen lo que no salió como se esperaba.
- [x] La conclusión no afirma más de lo que muestran los datos.
- [x] Las limitaciones están dichas con claridad.
- [x] Toda afirmación externa tiene su referencia.
- [x] El resumen se entiende sin leer el resto.
