# Ficha de investigación: modelo de embeddings

> Ficha de la pregunta 1 de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md), con la estructura de [PLANTILLA_FICHA_INVESTIGACION.md](PLANTILLA_FICHA_INVESTIGACION.md). Issue [#5](https://github.com/maria-osi/rag-neoland/issues/5).

| Campo | Valor |
|---|---|
| Autores | Maria (persona A: indexación) |
| Fecha | 2026-11-17 |
| Versión | v1 |
| Estado | cerrada |
| Pregunta nº | 1 |

## Resumen (máx. 150 palabras)

Se preguntó qué modelo de embeddings local recupera mejor la documentación de Python 3.15 para nuestro RAG. Se compararon all-MiniLM-L6-v2, bge-base-en-v1.5 y nomic-embed-text sobre el mismo corpus troceado en chunks de 500 caracteres, indexado en Qdrant y en Chroma, con las 35 preguntas del golden set y k=4. Por fuente, nomic-embed-text acierta más (hit@4 0,906 y MRR 0,755), pero la ventaja es de 1-2 preguntas. Por evidencia, los tres empatan en 0,375: el chunk exacto con la respuesta falta a menudo entre los 4 primeros. Qdrant y Chroma dan métricas idénticas. Se elige nomic-embed-text y la validación final confirma la decisión con la configuración completa.

## 1. Introducción

### 1.1 Contexto y motivación

El modelo de embeddings decide qué chunks llegan al LLM. El corpus es limitado (508 ficheros, 9,6 MB) y crece de forma controlada, así que un modelo local es viable: no hay coste por token, los datos no salen de la máquina y no dependemos de un proveedor. Esta decisión condiciona las fichas de chunk size, k, reranking e hybrid, que se miden sobre el índice que salga de aquí.

### 1.2 Pregunta de investigación

¿Qué modelo de embeddings local maximiza el acierto de recuperación (hit@4 y MRR) sobre el golden set de la documentación de Python 3.15?

### 1.3 Hipótesis

Los modelos de 768 dimensiones (bge-base-en-v1.5 y nomic-embed-text) superan a all-MiniLM-L6-v2 (384 dimensiones) en hit@4, a cambio de más tiempo de indexación.

### 1.4 Alcance y exclusiones

- **Entra:** tres modelos locales en inglés, dos bases vectoriales (Qdrant y Chroma), chunk de 500 caracteres y k=4.
- **No entra:** modelos de pago (OpenAI, Cohere), otros tamaños de chunk (ficha 5), reranking (ficha 3), hybrid search (ficha 6) y concurrencia entre bases (ficha 2).
- **Decisión previa:** la recuperación trabaja solo en inglés (query y corpus) y el agente traduce la respuesta al español. Por eso el criterio «calidad en español» de la tarea no aplica al embedding y valen modelos en inglés.

## 2. Estado de la cuestión

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| Ficha del modelo all-MiniLM-L6-v2 (ref. 1) y Wang et al. (ref. 2) | Modelo pequeño (22M parámetros) y rápido. Corta la entrada a 256 tokens. | oficial / paper |
| Ficha del modelo bge-base-en-v1.5 (ref. 3) y Xiao et al. (ref. 4) | Modelo especializado en retrieval. Recomienda una instrucción en la query. | oficial / paper |
| Nussbaum et al. (ref. 5) y ficha de nomic-embed-text en Ollama (ref. 6) | Contexto de 8192 tokens. Exige prefijos `search_query:` y `search_document:`. | paper / oficial |
| MTEB (ref. 7) | Benchmark de referencia para comparar embeddings. Sus resultados son de otros dominios, no del nuestro. | paper |

Opinión del equipo: los benchmarks generales no garantizan el resultado en un corpus técnico con mucho código, así que hay que medir sobre el nuestro.

## 3. Método

### 3.1 Opciones comparadas

| Opción | Descripción | Versión / configuración |
|---|---|---|
| A | all-MiniLM-L6-v2 (Hugging Face) | `sentence-transformers` 6.2.0; sin prefijos; 384 dim. |
| B | BAAI/bge-base-en-v1.5 (Hugging Face) | `sentence-transformers` 6.2.0; prefijo «Represent this sentence for searching relevant passages: » solo en la query; 768 dim. |
| C | nomic-embed-text (Ollama) | `nomic-embed-text:latest` (0a109f422b47); prefijos `search_query: ` / `search_document: `; 768 dim. |

Cada modelo se indexó en las dos bases: Qdrant 1.20 (Docker, `qdrant-client` 1.20.0) y Chroma (`chromadb` 1.5.9, local). Distancia coseno en todas.

### 3.2 Datos y preguntas de prueba

- **Documentos:** `data/python-docs-3.15/python-3.15-docs-md-clean/` (508 ficheros Markdown, 9,6 MB), troceado en 19 393 chunks.
- **Preguntas:** las 35 del [golden set](GOLDEN_SET_PYTHON_DOCS.md), en inglés: A consulta puntual (10), B términos exactos (10), C conceptos (9), D varias fuentes (3) y E sin respuesta (3). Las métricas de acierto usan las 32 preguntas A-D.
- **Respuesta esperada:** la fuente de cada pregunta está en el golden set, y la subcadena literal de la evidencia en [golden_set_evidencias.json](golden_set_evidencias.json). Ambas se comprobaron contra el texto del corpus.

### 3.3 Variables

- **Variable que se cambia:** el modelo de embeddings y, de forma secundaria, la base vectorial.
- **Variables fijas:** los chunks (500 caracteres, sin solape, un solo jsonl para todas las colecciones), k=4, la distancia coseno y las preguntas.
- **Variables que se miden:** acierto, latencia y tiempo de indexación.

### 3.4 Métricas y criterio de éxito

| Métrica | Cómo se calcula | Umbral |
|---|---|---|
| hit@1 / hit@4 (por fuente) | Proporción de preguntas con un chunk de la fuente correcta en la posición 1 o entre las 4 primeras. | Criterio principal: mayor hit@4. |
| MRR@4 (por fuente) | Media de 1/posición del primer acierto (0 si no hay). | Desempate. |
| ev_hit@1 / ev_hit@4 / ev_MRR (por evidencia) | Igual, pero el chunk también tiene que contener la evidencia literal. | Informativo. |
| Score del mejor resultado en E | Similitud coseno del primer resultado en preguntas sin respuesta. | Informativo. |
| Latencia | Media en ms del embedding de la query más la búsqueda. | Informativo. |
| Tiempo de indexación | Embeddings de todos los chunks más la inserción en la base, en s. | Informativo. |

No se fijó un umbral numérico antes de la prueba. El criterio de decisión (mayor hit@4, desempate por MRR) se definió antes de ver los resultados.

### 3.5 Entorno y reproducción

- **Entorno:** Python 3.14.4 y las librerías de `pyproject.toml` y `uv.lock`, en un Mac con Apple M2 Pro y 16 GB de memoria.
- **Notebook:** [notebooks/05_comparar_embeddings_bases.ipynb](../notebooks/05_comparar_embeddings_bases.ipynb). Necesita Qdrant (`docker compose up -d`) y Ollama con `ollama pull nomic-embed-text`. Tarda unos 11 minutos.
- **Lógica y tests:** [scripts/comparar_embeddings.py](../scripts/comparar_embeddings.py) y `uv run pytest` (14 tests).
- **Repeticiones:** el notebook se ejecutó tres veces completo con las mismas métricas. La búsqueda y los embeddings son deterministas, así que no hay semilla.

## 4. Resultados

**Tabla 1. Métricas globales, preguntas A-D (n = 32), k=4.** Qdrant y Chroma dan los mismos valores de acierto, así que se muestran una vez por modelo.

| Modelo | hit@1 | hit@4 | MRR | ev_hit@1 | ev_hit@4 | ev_MRR | Dim. |
|---|---|---|---|---|---|---|---|
| all-MiniLM-L6-v2 | **0,656** | 0,844 | 0,734 | 0,219 | 0,375 | 0,281 | 384 |
| bge-base-en-v1.5 | 0,562 | 0,875 | 0,706 | 0,219 | 0,375 | **0,289** | 768 |
| nomic-embed-text | **0,656** | **0,906** | **0,755** | 0,219 | 0,375 | 0,271 | 768 |

Con n = 32, cada pregunta vale 0,031 puntos de hit.

**Tabla 2. Tiempos.**

| Modelo | Embeddings (s) | Indexación total Qdrant / Chroma (s) | Latencia Qdrant / Chroma (ms) |
|---|---|---|---|
| all-MiniLM-L6-v2 | 37 | 43 / 54 | 130* / 15 |
| bge-base-en-v1.5 | 190 | 200 / 210 | 34 / 18 |
| nomic-embed-text | 295 | 301 / 313 | 33 / 14 |

\* Primera colección evaluada. Lo más probable es que incluya el arranque en frío.

**Tabla 3. hit@4 por categoría (por fuente / por evidencia).**

| Categoría | MiniLM | bge | nomic |
|---|---|---|---|
| A. Consulta puntual (10) | 0,90 / 0,20 | 0,90 / 0,30 | **1,00** / 0,20 |
| B. Términos exactos (10) | 0,90 / 0,50 | 0,80 / 0,50 | 0,90 / **0,70** |
| C. Conceptos (9) | 0,89 / **0,56** | **1,00** / 0,33 | 0,89 / 0,33 |
| D. Varias fuentes (3) | 0,33 / 0,00 | **0,67** / **0,33** | **0,67** / 0,00 |

**Tabla 4. Score del mejor resultado en preguntas sin respuesta (E).**

| Pregunta | MiniLM | bge | nomic |
|---|---|---|---|
| E01 (FastAPI) | 0,402 | 0,635 | 0,650-0,670 |
| E02 (PyTorch) | 0,375 | 0,568 | 0,653 |
| E03 (Kubernetes) | 0,366 | 0,566 | 0,660 |

Fallos destacados:

- **Por evidencia, ningún modelo pasa de 0,375 en hit@4.** La página correcta aparece, pero el chunk exacto con la respuesta no.
- **En D (varias fuentes), MiniLM solo acierta 1 de 3** y ningún modelo recupera las dos fuentes.
- **La hipótesis no se cumple en hit@1:** bge (0,562) queda por debajo de MiniLM (0,656).

## 5. Discusión

- **Qué significan los resultados.** Los tres modelos encuentran la página correcta casi siempre (hit@4 entre 0,84 y 0,91). La diferencia entre ellos es pequeña: nomic supera a MiniLM en 2 preguntas y a bge en 1. Lo que realmente limita la calidad es que el chunk de 500 caracteres con la evidencia no llega al top 4 en el 62 % de las preguntas, y eso pasa por igual con los tres modelos.
- **Frente a la hipótesis.** Se confirma parcialmente. En hit@4 los modelos de 768 dimensiones ganan y cuestan entre 5 y 7 veces más en indexar. En hit@1 no ganan, y bge queda el último.
- **Explicaciones alternativas.**
  - El empate por evidencia apunta a que el troceo pesa más que el modelo: un chunk de 500 caracteres sin solape puede separar la pregunta de su ejemplo.
  - nomic acierta más en B (términos exactos) por evidencia, quizá porque su contexto largo no le hace falta aquí pero su entrenamiento favorece términos literales. Es una conjetura y no está probada.
- **Ficha 2 (bases vectoriales).** Qdrant y Chroma devuelven los mismos resultados. Chroma tiene menos latencia porque corre dentro del proceso y Qdrant responde por HTTP. La elección entre las dos tiene que salir de la concurrencia, no de la calidad.
- **Umbral para preguntas sin respuesta.** Los scores de las E dependen del modelo (MiniLM 0,37-0,40, nomic 0,65-0,67). Cualquier umbral de «No encuentro esa información» habrá que calibrarlo por modelo y compararlo con los scores de las preguntas que sí aciertan, que no se midieron aquí.
- **Limitaciones.**
  - La muestra es pequeña: 32 preguntas con respuesta, de las que 3 son de la categoría D.
  - Hay un solo dominio, un solo tamaño de chunk y una sola máquina.
  - Las preguntas las redactó una sola persona.
  - El acierto por fuente es laxo: una página larga cuenta como acierto aunque el chunk no sirva.
- **Si el volumen creciera.** El tiempo de indexación escala con el corpus: nomic tarda 5 minutos en 9,6 MB. Con la premisa de crecimiento controlado y reindexado ocasional es aceptable. Si se reindexara a menudo, MiniLM sería 7 veces más rápido a cambio de 2 preguntas.

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | **nomic-embed-text** (Ollama). |
| Motivo principal | Tiene el mejor hit@4 (0,906) y MRR (0,755) por fuente, y el mejor acierto por evidencia en términos exactos (B, 0,70). |
| Alternativas descartadas | all-MiniLM-L6-v2 queda como alternativa si el tiempo de indexación importa: es 7 veces más rápido y solo pierde 2 preguntas. bge-base-en-v1.5 tiene el peor hit@1 y no mejora a nomic en nada relevante. |
| Coste o riesgo asumido | 5 minutos de indexación, Ollama como servicio local más y vectores de 768 dimensiones. La ventaja sobre MiniLM es de 1-2 preguntas, dentro del margen de una muestra pequeña. |
| Cuándo se revisa | Tras la ficha 5 (tamaño de chunk): si con otro tamaño cambia el orden de los modelos o sube mucho el acierto por evidencia, hay que repetir esta comparación. También si el golden set crece. |

## 7. Impacto en el workflow

- El paso «el agente consulta el RAG» calcula el embedding de la query con `nomic-embed-text` en Ollama, con el prefijo `search_query: `. Los chunks se indexan con `search_document: `.
- La query llega al RAG en inglés. Si la persona pregunta en español, el agente la traduce antes de buscar y traduce la respuesta al final.
- Dependencias: Ollama en marcha con `nomic-embed-text` y el cliente `ollama` de Python, que ya está en `pyproject.toml`.
- Las fichas 3 y 6 y la elección de base de la ficha 2 se miden sobre este modelo.

## 8. Referencias

1. Sentence Transformers. (2021). _all-MiniLM-L6-v2_ [Ficha del modelo]. Hugging Face. https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
2. Wang, W., Wei, F., Dong, L., Bao, H., Yang, N. y Zhou, M. (2020). _MiniLM: Deep self-attention distillation for task-agnostic compression of pre-trained transformers_. arXiv. https://arxiv.org/abs/2002.10957
3. BAAI. (2023). _bge-base-en-v1.5_ [Ficha del modelo]. Hugging Face. https://huggingface.co/BAAI/bge-base-en-v1.5
4. Xiao, S., Liu, Z., Zhang, P. y Muennighoff, N. (2023). _C-Pack: Packaged resources to advance general Chinese embedding_. arXiv. https://arxiv.org/abs/2309.07597
5. Nussbaum, Z., Morris, J. X., Duderstadt, B. y Mulyar, A. (2024). _Nomic Embed: Training a reproducible long context text embedder_. arXiv. https://arxiv.org/abs/2402.01613
6. Ollama. (s. f.). _nomic-embed-text_ [Ficha del modelo]. https://ollama.com/library/nomic-embed-text
7. Muennighoff, N., Tazi, N., Magne, L. y Reimers, N. (2023). _MTEB: Massive text embedding benchmark_. arXiv. https://arxiv.org/abs/2210.07316

## Anexos

- **Código y notebook:** [notebooks/05_comparar_embeddings_bases.ipynb](../notebooks/05_comparar_embeddings_bases.ipynb), [scripts/comparar_embeddings.py](../scripts/comparar_embeddings.py) y [tests/test_comparar_embeddings.py](../tests/test_comparar_embeddings.py).
- **Datos brutos:** `data/chunks/python-3.15-chunks-500.jsonl` (se regenera con el notebook y no se sube a git), [GOLDEN_SET_PYTHON_DOCS.md](GOLDEN_SET_PYTHON_DOCS.md) y [golden_set_evidencias.json](golden_set_evidencias.json).
- **Logs:** los comentarios de cada ronda en la issue [#5](https://github.com/maria-osi/rag-neoland/issues/5).

---

## Lista de comprobación antes de exponer

- [x] La pregunta está formulada en una frase y se puede responder con datos.
- [ ] La hipótesis y el umbral de éxito se escribieron antes de probar. _(La hipótesis y el criterio sí; no hubo umbral numérico.)_
- [x] Solo cambia una variable a la vez; el resto está fijo.
- [x] Otra persona puede repetir la prueba con la sección 3.
- [x] Los resultados incluyen lo que no salió como se esperaba.
- [x] La conclusión no afirma más de lo que muestran los datos.
- [x] Las limitaciones están dichas con claridad.
- [ ] Toda afirmación externa tiene su referencia. _(Faltan las fechas de consulta de la sección 8.)_
- [x] El resumen se entiende sin leer el resto.
