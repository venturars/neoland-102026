# Ficha de investigación: reranking

> Ficha de la pregunta 3 de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md), con la estructura de [PLANTILLA_FICHA_INVESTIGACION.md](PLANTILLA_FICHA_INVESTIGACION.md). Issue [#13](https://github.com/maria-osi/rag-neoland/issues/13). Parte de la configuración elegida en las fichas [1](FICHA_01_EMBEDDINGS.md), [5](FICHA_05_CHUNK_SIZE.md) y [4](FICHA_04_NUMERO_K.md).

| Campo | Valor |
|---|---|
| Autores | Maria |
| Fecha | 2026-11-17 |
| Versión | v1 |
| Estado | cerrada |
| Pregunta nº | 3 |

## Resumen (máx. 150 palabras)

Si reordenar los resultados con un reranker mejora lo que llega al agente, y a qué coste de latencia, con nomic-embed-text, Qdrant, troceo por estructura 1500/200, k=4 y las 32 preguntas A-D del golden set. Se recuperaron 20 candidatos y se reordenaron con dos cross-encoders locales, `ms-marco-MiniLM-L-6-v2` y `bge-reranker-base`. MiniLM-L6 sube la evidencia entre los 4 primeros de 19 a 22 preguntas, mantiene el acierto por fuente y añade 119 ms por pregunta; cumple el criterio fijado antes de medir. bge-reranker-base llega a 23, pero tarda 502,2 ms frente a un límite de 500 ms: no cumple por 2,2 ms en una sola ejecución. Se adopta MiniLM-L6. Los dos rerankers bajan el acierto en la posición 1, y los dos dan a las preguntas sin respuesta un score por debajo de todas las A-D.

## 1. Introducción

### 1.1 Contexto y motivación

Con k=4, 13 de las 32 preguntas A-D no traen el chunk con la evidencia entre los 4 primeros resultados, y con k=8 aparece en 3 de ellas ([ficha 4](FICHA_04_NUMERO_K.md)). Subir k mete casi el doble de contexto en el prompt. Un reranker puntúa cada par (pregunta, chunk) por separado y puede subir esos chunks a las 4 primeras posiciones sin mandar más texto al LLM. A cambio, añade un modelo que cargar y un paso más en cada consulta.

### 1.2 Pregunta de investigación

¿Reordenar 20 candidatos con un cross-encoder local trae la evidencia entre los 4 primeros en más preguntas que la búsqueda vectorial sola, con una latencia añadida aceptable?

### 1.3 Hipótesis

Un reranker sube el ev_hit@4 en al menos 2 de las 32 preguntas frente a la búsqueda sin reranking, sin bajar el acierto por fuente, y añade menos de 500 ms por pregunta. Se escribió en la issue #13 antes de medir, junto con el criterio de la sección 3.4.

### 1.4 Alcance y exclusiones

- **Entra:** búsqueda sin reranking con k=4 (referencia) y dos cross-encoders locales que reordenan 20 candidatos y se quedan con 4, sobre la colección `pydocs_nomic_est1500_m200_sinruta`, sin volver a indexar. Score del reranker en las 3 preguntas E.
- **No entra:** rerankers de pago o por API (Cohere, OpenAI), otros números de candidatos, otros k, troceos o modelos de embedding, hybrid search (ficha 6) y la calidad de la respuesta final del LLM; solo se mide la recuperación.

## 2. Estado de la cuestión

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md), pregunta 3 | Cómo decidir: medir si el reranking mejora la relevancia frente a la búsqueda sin reranking y a qué coste de latencia. | propia |
| [Ficha 4](FICHA_04_NUMERO_K.md) | Con k=4: hit@4 29 de 32, ev_hit@4 19 de 32. Con k=8 la evidencia llega en 22. Propone el reranking como forma de subir el chunk bueno sin subir k. | propia |
| [Ficha 5](FICHA_05_CHUNK_SIZE.md) | 71 chunks de la colección pasan de 6 000 caracteres (máximo 203 072). | propia |
| Documentación de Sentence Transformers, «Retrieve & Re-Rank» (ref. 1) | Un bi-encoder recupera candidatos; un cross-encoder recibe la pregunta y el texto juntos, puntúa cada par y reordena esos candidatos. Es más preciso y más lento que el bi-encoder, por eso se aplica solo a unos pocos candidatos. | oficial |
| Ficha de `cross-encoder/ms-marco-MiniLM-L-6-v2` (ref. 2) | Cross-encoder entrenado para ordenar pasajes en MS MARCO. Pesa 90,9 MB (descarga del notebook 09). | oficial |
| Ficha de `BAAI/bge-reranker-base` (ref. 3) | Cross-encoder de BAAI para chino e inglés. Pesa 1,11 GB (descarga del notebook 09). | oficial |
| Nogueira y Cho (ref. 4) | Reordenar con un modelo BERT que lee pregunta y pasaje juntos mejora el orden de una primera recuperación. | paper |

## 3. Método

### 3.1 Opciones comparadas

| Opción | Reranker | Candidatos | Resultados que llegan al agente |
|---|---|---|---|
| Sin reranking (referencia) | ninguno | 4 | los 4 primeros de la búsqueda vectorial |
| MiniLM-L6 | `cross-encoder/ms-marco-MiniLM-L-6-v2` | 20 | los 4 de mayor score del reranker |
| bge-reranker-base | `BAAI/bge-reranker-base` | 20 | los 4 de mayor score del reranker |

Las tres buscan en `pydocs_nomic_est1500_m200_sinruta` (troceo por estructura Markdown, máximo 1500, mínimo 200, sin ruta de títulos; decisión de la ficha 5). La referencia hace una búsqueda propia con `limit=4`; cada reranker, una con `limit=20`. El reranker recibe los pares (query del golden set sin el prefijo `search_query: ` de nomic, campo `texto` del chunk), los puntúa con `CrossEncoder.predict` y `reordenar_por_score` se queda con los 4 de score más alto; en los empates conserva el orden de la búsqueda.

### 3.2 Datos y preguntas de prueba

- Documentos usados: corpus limpio de Python 3.15, `data/python-docs-3.15/python-3.15-docs-md-clean/`, ya indexado en 7 955 chunks. El notebook comprueba que la colección tiene tantos puntos como chunks da el troceo.
- Conjunto de preguntas: las 32 de las categorías A-D de [GOLDEN_SET_PYTHON_DOCS.md](GOLDEN_SET_PYTHON_DOCS.md) (A 10, B 10, C 9, D 3), columna «Query (EN)», para las métricas de acierto. Las 3 de la categoría E, sin respuesta en el corpus, solo para el score del reranker.
- Respuesta esperada: la fuente de cada pregunta en el golden set y la subcadena literal de [golden_set_evidencias.json](golden_set_evidencias.json).

### 3.3 Variables

- Variable que se cambia: el reordenado de los resultados (ninguno, MiniLM-L6 o bge-reranker-base).
- Variables fijas: modelo nomic-embed-text con prefijo `search_query: ` para la búsqueda, Qdrant con distancia coseno, colección `pydocs_nomic_est1500_m200_sinruta`, k=4, 20 candidatos en las dos opciones con reranker, corpus, golden set y evidencias.
- Variables medidas: acierto por fuente y por evidencia, global y por categoría; latencia por pregunta separada en búsqueda (embedding de la query más consulta a Qdrant) y reranking (`predict` sobre los candidatos más el reordenado); tiempo de carga de cada reranker; score del primer resultado reordenado en las preguntas E y A-D.

### 3.4 Métricas y criterio de éxito

| Métrica | Cómo se calcula | Umbral para aceptar la opción |
|---|---|---|
| hit@1 / hit@4 (fuente) | Proporción de preguntas con un chunk del fichero correcto en la posición 1 / entre los 4 que llegan al agente (`rango_primer_acierto`) | hit@4: no bajar de la referencia, en preguntas acertadas |
| MRR@4 (fuente) | Media de 1/posición del primer acierto (0 si no aparece entre los 4) | Referencia |
| ev_hit@1 / ev_hit@4 | Igual, pero el chunk debe contener la evidencia literal (`rango_primer_acierto_evidencia`) | ev_hit@4: al menos 2 preguntas más que la referencia |
| ev_MRR@4 | MRR con el criterio de evidencia | Referencia |
| Latencia de reranking (ms) | `predict` sobre los candidatos más el reordenado, media por pregunta A-D | Menor que 500 ms |
| Latencia de búsqueda y total (ms) | Embedding más Qdrant; total = búsqueda + reranking, media por pregunta A-D | Referencia; no decide |
| Carga (s) | Construir el `CrossEncoder`, una vez por modelo | Referencia; no decide |
| Score del primer resultado en E | Score más alto del reranker en cada pregunta E, frente a la media y el mínimo del mismo score en A-D | Referencia; no decide |

Criterio de decisión, fijado en la issue #13 antes de medir: un reranker cumple si sus aciertos ev_hit@4 superan a los de la referencia en al menos 2 (`MEJORA_MINIMA`), sus aciertos hit@4 no bajan de los de la referencia y su latencia de reranking media es menor que 500 ms (`LATENCIA_MAXIMA_MS`). Si cumplen los dos, gana el de más aciertos ev_hit@4 y, si empatan, el de menor latencia de reranking. Si ninguno cumple, la decisión es no usar reranking. Lo aplica `elegir_reranker` sobre aciertos contados, no sobre proporciones.

### 3.5 Entorno y reproducción

- Python 3.14 y las librerías de `pyproject.toml` y `uv.lock` (entre ellas `sentence-transformers` 6.2.0, `transformers` 5.21.0 y `torch` 2.14.1). Qdrant en Docker (`docker compose up -d`) y Ollama con `nomic-embed-text`, como en las fichas 4 y 5.
- Dispositivo de los rerankers: `mps:0` (GPU de Apple), el que eligió `CrossEncoder` por defecto.
- Notebook: [notebooks/09_comparar_reranking.ipynb](../notebooks/09_comparar_reranking.ipynb). Para ejecutarlo sin abrir Jupyter: `uv run jupyter nbconvert --to notebook --execute notebooks/09_comparar_reranking.ipynb --ExecutePreprocessor.timeout=-1`. Necesita la colección creada con [notebooks/07_comparar_troceo_estructura.ipynb](../notebooks/07_comparar_troceo_estructura.ipynb); no crea, borra ni modifica colecciones. La primera ejecución descarga los dos rerankers de Hugging Face.
- Repeticiones: una ejecución. Cada reranker hace una llamada de calentamiento a `predict` después de cargarse, fuera de la medición. No se ha comprobado con una segunda ejecución que el orden de los resultados se repita; la latencia sí cambia entre ejecuciones (ver fichas 4 y 5).

## 4. Resultados

**Tabla 1. Métricas por configuración (32 preguntas A-D).** Entre paréntesis, preguntas acertadas; una pregunta vale 0,031.

| Configuración | hit@1 | hit@4 | MRR | ev_hit@1 | ev_hit@4 | ev_MRR |
|---|---|---|---|---|---|---|
| Sin reranking | 0,719 (23) | 0,906 (29) | 0,786 | 0,406 (13) | 0,594 (19) | 0,477 |
| **MiniLM-L6** | **0,688 (22)** | **0,938 (30)** | **0,797** | **0,344 (11)** | **0,688 (22)** | **0,495** |
| bge-reranker-base | 0,625 (20) | 0,906 (29) | 0,747 | 0,344 (11) | 0,719 (23) | 0,503 |

La fila sin reranking reproduce los aciertos de k=4 de la ficha 4 (hit@4 29, ev_hit@4 19, misma colección).

**Tabla 2. Latencia media por pregunta A-D (ms) y carga (s).**

| Configuración | Búsqueda | Reranking | Total | Carga |
|---|---|---|---|---|
| Sin reranking | 40,6 | 0 | 40,6 | 0 |
| MiniLM-L6 | 26,9 | 119,4 | 146,3 | 8,5 |
| bge-reranker-base | 34,2 | 502,2 | 536,5 | 45,8 |

La carga es la de la primera ejecución e incluye la descarga desde Hugging Face (90,9 MB para MiniLM-L6, 1,11 GB para bge-reranker-base).

**Tabla 3. Acierto por categoría.** Preguntas acertadas de cada categoría entre los 4 que llegan al agente: por evidencia (ev_hit@4) / por fuente (hit@4).

| Categoría (n) | Sin reranking | MiniLM-L6 | bge-reranker-base |
|---|---|---|---|
| A, consulta puntual (10) | 5 / 9 | 6 / 9 | 7 / 9 |
| B, términos exactos y siglas (10) | 7 / 9 | 8 / 10 | 9 / 10 |
| C, conceptos y comportamiento (9) | 7 / 9 | 7 / 9 | 6 / 8 |
| D, varias fuentes (3) | 0 / 2 | 1 / 2 | 1 / 2 |

**Tabla 4. Criterio de decisión aplicado frente a la referencia** (19 aciertos por evidencia, 29 por fuente).

| Reranker | ev_hit@4 | Mejora al menos 2 | hit@4 no baja | Latencia de reranking < 500 ms | Cumple |
|---|---|---|---|---|---|
| **MiniLM-L6** | **22** | **sí (+3)** | **sí (30)** | **sí (119,4)** | **sí** |
| bge-reranker-base | 23 | sí (+4) | sí (29) | no (502,2) | no |

Decisión de `elegir_reranker`: MiniLM-L6.

**Tabla 5. Score del primer resultado reordenado: preguntas E frente a A-D.** Cada modelo puntúa en su propia escala; los scores de un modelo no se comparan con los del otro.

| Reranker | E01 | E02 | E03 | Media A-D | Mínimo A-D |
|---|---|---|---|---|---|
| MiniLM-L6 | −3,540 | −6,717 | −1,124 | 5,001 | −0,389 |
| bge-reranker-base | 0,010 | 0,000 | 0,018 | 0,917 | 0,355 |

Fallos y resultados que no siguen la tendencia:

- **bge-reranker-base queda fuera por 2,2 ms.** Su latencia de reranking media es 502,2 ms y el límite es menor que 500 ms. Es una sola ejecución y la diferencia es del 0,4 % del límite; el límite se fijó antes de medir y se aplica tal cual.
- **El primer resultado empeora con los dos rerankers.** Por evidencia, la posición 1 acierta en 11 preguntas con los dos frente a 13 sin reranking. Por fuente, 22 con MiniLM-L6 y 20 con bge-reranker-base frente a 23.
- **bge-reranker-base baja la categoría C:** de 7 a 6 de 9 por evidencia y de 9 a 8 por fuente. Es la única categoría en la que un reranker pierde aciertos entre los 4 primeros. MiniLM-L6 deja C igual.
- **Categoría D:** pasa de 0 a 1 de 3 por evidencia con los dos rerankers; por fuente se queda en 2 de 3.
- **Latencia de búsqueda de la referencia (40,6 ms):** es la mayor de las tres aunque pide 4 resultados y no 20. La referencia es el primer bloque que ejecuta el notebook, como k=1 en la ficha 4.

## 5. Discusión

- **Qué significan los resultados:** los dos rerankers traen la evidencia entre los 4 primeros en más preguntas (22 y 23 frente a 19), con la misma cantidad de contexto, porque reordenan 20 candidatos y no amplían k. La mejora llega a las posiciones 2 a 4: en la posición 1 los dos aciertan menos que la búsqueda sola. MiniLM-L6 mejora o mantiene todas las categorías; bge-reranker-base mejora más A y B y baja C.
- **Frente a la hipótesis:** se confirma con MiniLM-L6 (+3 por evidencia, +1 por fuente, 119,4 ms). Con bge-reranker-base se confirma la parte de acierto (+4, por fuente igual) y no la de latencia, por 2,2 ms.
- **bge-reranker-base frente a MiniLM-L6:** acierta una pregunta más por evidencia, a cambio de 4,2 veces la latencia de reranking (502,2 frente a 119,4 ms), una pregunta menos por fuente (29 frente a 30), un MRR por fuente menor que la referencia (0,747 frente a 0,786), el peor hit@1 de las tres (20) y una pregunta menos en C. Con este golden set, la ventaja de una pregunta no compensa esas pérdidas; si el límite de latencia se hubiera cumplido, el criterio habría elegido bge-reranker-base, porque acierta más por evidencia, pese a esas pérdidas.
- **Preguntas sin respuesta:** con los dos rerankers, el score del primer resultado en las 3 preguntas E queda por debajo del mínimo de las 32 A-D (MiniLM-L6: −1,124 como máximo en E frente a −0,389; bge-reranker-base: 0,018 frente a 0,355). Eso abre la puerta a un umbral para que el agente responda «no hay respuesta» en vez de pasar 4 chunks irrelevantes. Esta ficha no lo fija: son 3 preguntas E, el margen con MiniLM-L6 es de 0,735 puntos y el mínimo de A-D incluye preguntas en las que el primer resultado puede no ser el correcto.
- **Explicaciones alternativas:**
  - Las evidencias son subcadenas literales. Un reranker que prefiere chunks largos tendría más papeletas de contenerlas aunque no sean los más relevantes; el CSV no guarda la longitud de los chunks reordenados, así que no se puede descartar.
  - MiniLM-L6 se entrenó con MS MARCO, que son pasajes web en inglés (ref. 2). Las queries del golden set y la documentación de Python están en inglés, lo que le favorece aquí; con preguntas en español podría ir peor.
- **Limitaciones y amenazas a la validez:**
  - Son 32 preguntas: una pregunta vale 0,031. La diferencia entre los dos rerankers es de una pregunta por evidencia y una por fuente.
  - Una sola ejecución. La latencia cambia entre ejecuciones, y la decisión entre los dos rerankers depende de 2,2 ms en la latencia de bge-reranker-base.
  - Los rerankers corrieron en `mps:0` (GPU de Apple). En CPU, o en otra máquina, la latencia será otra; no se midió.
  - La carga medida incluye la descarga desde Hugging Face. Una carga desde la caché local será más corta; no se midió aparte.
  - Los dos cross-encoders cortan la entrada a 512 tokens por par (`model_max_length` en su `tokenizer_config.json`), pregunta incluida. Un chunk de 1500 caracteres son unos 375 tokens con la estimación de 4 caracteres por token de la ficha 5 y cabe; los 71 chunks de más de 6 000 caracteres se puntúan solo por su comienzo. No se registra cuántos de ellos llegaron entre los 20 candidatos.
  - La query llega al reranker sin el prefijo `search_query: `, que es propio de nomic y solo lo usa el embedding de la búsqueda.
  - En la categoría D, un acierto cuenta si llega una de las dos fuentes, no las dos (como en la ficha 4).
  - La latencia añadida que decide es la del reranking. La búsqueda de 20 candidatos frente a 4 también podría costar más, pero en esta ejecución la búsqueda de la referencia, la primera del notebook, fue la más lenta (tabla 2), así que esa diferencia no se puede medir con estos datos.
- **Qué cambiaría si el volumen de datos creciera:** con más documentos hay más chunks que compiten por las 20 primeras posiciones de la búsqueda, y el reranker solo puede reordenar lo que entra en ellas. La latencia de reranking depende del número de candidatos, no del tamaño del corpus.

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | Reranking con `cross-encoder/ms-marco-MiniLM-L-6-v2` sobre 20 candidatos, quedándose con 4. |
| Motivo principal | Cumple el criterio fijado antes de medir: trae la evidencia entre los 4 primeros en 22 de 32 preguntas frente a 19 sin reranking, acierta la fuente en 30 frente a 29 y añade 119,4 ms de reranking por pregunta. |
| Alternativas descartadas | Sin reranking: 3 preguntas menos por evidencia. `BAAI/bge-reranker-base`: 23 por evidencia, pero 502,2 ms de reranking frente a un límite de 500 ms; no cumple por 2,2 ms en una sola ejecución. Además baja la categoría C y el hit@1. |
| Coste o riesgo asumido | Unos 120 ms más por pregunta en `mps:0` y un modelo de 90,9 MB que se descarga de Hugging Face la primera vez y se carga al arrancar. El primer resultado acierta menos (11 frente a 13 por evidencia). 10 de 32 preguntas siguen sin traer la evidencia entre los 4 primeros. |
| Cuándo se revisa | Si otra ejecución, o la misma máquina con la caché caliente, da a `bge-reranker-base` una latencia de reranking por debajo de 500 ms, cumple el criterio y, con 23 aciertos frente a 22, el criterio lo elegiría; habría que valorar antes que baja C y el hit@1. Si el agente corre en CPU, porque la latencia cambia. Si se amplía el golden set o entran preguntas en español. Si se quiere un umbral de «no hay respuesta» con el score del reranker (tabla 5). Si se limita el tamaño de los chunks largos de la ficha 5. |

## 7. Impacto en el workflow

- El paso «el agente consulta el RAG» busca en `pydocs_nomic_est1500_m200_sinruta` con `limit=20`, puntúa los 20 pares (query sin prefijo, `texto` del chunk) con `CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2").predict` y pasa al prompt los 4 de mayor score (`reordenar_por_score`).
- El agente carga el reranker una vez al arrancar, no en cada consulta. La primera vez necesita red para descargarlo de Hugging Face.
- No hay dependencias nuevas: `sentence-transformers` ya está en el entorno.
- El contexto que recibe el prompt sigue siendo de 4 chunks, como en la ficha 4.
- Bajar k con reranking no está respaldado por estos datos: el acierto en la posición 1 baja con los dos rerankers, y no se midieron otros k.

## 8. Referencias

1. Sentence Transformers. (s. f.). _Retrieve & Re-Rank_. Sentence Transformers Documentation. https://www.sbert.net/examples/applications/retrieve_rerank/README.html (consultado el 2026-11-17).
2. Sentence Transformers. (s. f.). _cross-encoder/ms-marco-MiniLM-L-6-v2_ [Ficha del modelo]. Hugging Face. https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2 (consultado el 2026-11-17).
3. BAAI. (2023). _bge-reranker-base_ [Ficha del modelo]. Hugging Face. https://huggingface.co/BAAI/bge-reranker-base (consultado el 2026-11-17).
4. Nogueira, R. y Cho, K. (2019). _Passage re-ranking with BERT_. arXiv. https://arxiv.org/abs/1901.04085 (consultado el 2026-11-17).

## Anexos

- Notebook: [notebooks/09_comparar_reranking.ipynb](../notebooks/09_comparar_reranking.ipynb)
- Datos brutos: `data/resultados/reranking.csv`
- Reordenado y criterio: `reordenar_por_score` y `elegir_reranker` en [scripts/comparar_embeddings.py](../scripts/comparar_embeddings.py)
- Los scores de las preguntas E (tabla 5) no van al CSV; salen de la sección 10 del notebook.

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
