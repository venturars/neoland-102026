# Ficha de investigación: número de resultados (k)

> Ficha de la pregunta 4 de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md), con la estructura de [PLANTILLA_FICHA_INVESTIGACION.md](PLANTILLA_FICHA_INVESTIGACION.md). Issue [#9](https://github.com/maria-osi/rag-neoland/issues/9). Parte de la configuración elegida en las fichas [1](FICHA_01_EMBEDDINGS.md) y [5](FICHA_05_CHUNK_SIZE.md).

| Campo | Valor |
|---|---|
| Autores | Maria |
| Fecha | 2026-11-17 |
| Versión | v1 |
| Estado | cerrada |
| Pregunta nº | 4 |

## Resumen (máx. 150 palabras)

Cuántos resultados tiene que devolver la búsqueda para que el agente reciba la respuesta, con nomic-embed-text, Qdrant, troceo por estructura 1500/200 y las 32 preguntas A-D del golden set. Se compararon k=1, 2, 4 y 8. La hipótesis de partida (k=1 o 2) se refuta: con k=1 el chunk con la evidencia llega en 13 de 32 preguntas y con k=2 en 15, frente a 19 con k=4. El criterio fijado antes de medir pide el k más pequeño que no pierda más de una pregunta respecto a k=4 y que mantenga las categorías A y C; ninguno menor que 4 lo cumple. Se mantiene k=4, con unos 5 900 caracteres de contexto por pregunta. k=8 acierta 3 preguntas más a costa de casi el doble de contexto. El «k mín.» que declara el golden set no se cumple con este índice.

## 1. Introducción

### 1.1 Contexto y motivación

Cada resultado que devuelve la búsqueda entra en el prompt del agente. Un k pequeño da un prompt corto y barato, pero puede dejar fuera el chunk con la respuesta; un k grande la trae más veces y mete más texto que no responde a la pregunta. La [ficha 5](FICHA_05_CHUNK_SIZE.md) midió con k=4, la configuración base de la Fase 0, y en la categoría A (dato concreto) el chunk con la evidencia faltaba a menudo entre los 4 primeros. Con un corpus que crece de forma controlada, k fija cuánto contexto paga cada consulta.

### 1.2 Pregunta de investigación

¿Cuál es el k más pequeño que trae la evidencia de la respuesta casi tantas veces como k=4 sobre el golden set de Python 3.15?

### 1.3 Hipótesis

Hipótesis de partida de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md): bastan 1 o 2 resultados. Para una consulta puntual como «método HTTP GET», el primer chunk ya debería contener la respuesta. El golden set la concreta por categoría con el «k mín.» de su título: A (consulta puntual) 1, C (conceptos y comportamiento) 1-2, D (varias fuentes) 2. B no lo declara.

### 1.4 Alcance y exclusiones

- **Entra:** k=1, 2 y 4 (la base actual) y k=8 como referencia de techo, sobre la colección `pydocs_nomic_est1500_m200_sinruta`, sin volver a indexar.
- **No entra:** reranking (ficha 3), hybrid (ficha 6), otros tamaños de chunk o modelos, y la calidad de la respuesta final del LLM; solo se mide la recuperación.

## 2. Estado de la cuestión

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md), pregunta 4 | Hipótesis de partida: 1 o 2 resultados. Cómo decidir: comprobar si k=2 recupera información que k=1 pierde. | propia |
| [GOLDEN_SET_PYTHON_DOCS.md](GOLDEN_SET_PYTHON_DOCS.md) | «k mín.» por categoría: A 1, C 1-2, D 2. | propia |
| [Ficha 5](FICHA_05_CHUNK_SIZE.md) | Con esta colección y k=4: ev_hit@4 0,594, ev_MRR 0,477. 71 chunks pasan de 6 000 caracteres (máximo 203 072). | propia |
| Liu et al. (ref. 1) | Los LLM usan peor la información situada en medio de un contexto largo que la del principio o el final. Más resultados no garantizan mejor respuesta. | paper |
| Documentación de Qdrant sobre índices (ref. 2) | La búsqueda con índice HNSW es aproximada. Por eso cada k se mide con su propia búsqueda y no recortando la de k=8. | oficial |

## 3. Método

### 3.1 Opciones comparadas

| Opción | k | Papel |
|---|---|---|
| A | 1 | hipótesis de partida |
| B | 2 | hipótesis de partida |
| C (base) | 4 | configuración base de la Fase 0 |
| D | 8 | referencia de techo |

Las cuatro buscan en la misma colección, `pydocs_nomic_est1500_m200_sinruta` (troceo por estructura Markdown, máximo 1500, mínimo 200, sin ruta de títulos; decisión de la ficha 5).

### 3.2 Datos y preguntas de prueba

- Documentos usados: corpus limpio de Python 3.15, `data/python-docs-3.15/python-3.15-docs-md-clean/` (508 ficheros `.md`), ya indexado en 7 955 chunks. El notebook comprueba que la colección tiene tantos puntos como chunks da el troceo.
- Conjunto de preguntas: las 32 de las categorías A-D de [GOLDEN_SET_PYTHON_DOCS.md](GOLDEN_SET_PYTHON_DOCS.md) (A 10, B 10, C 9, D 3), columna «Query (EN)». Las 3 de la categoría E no tienen fuente y no entran.
- Respuesta esperada: la fuente de cada pregunta en el golden set y la subcadena literal de [golden_set_evidencias.json](golden_set_evidencias.json). El «k mín.» de cada categoría se lee de su título con `leer_k_minimo`.

### 3.3 Variables

- Variable que se cambia: k (el `limit` de la búsqueda en Qdrant).
- Variables fijas: modelo nomic-embed-text con prefijo `search_query: `, Qdrant con distancia coseno, colección `pydocs_nomic_est1500_m200_sinruta`, corpus, golden set y evidencias.
- Variables medidas: acierto por fuente y por evidencia, por k y por categoría; caracteres de contexto por pregunta; latencia por pregunta.

### 3.4 Métricas y criterio de éxito

| Métrica | Cómo se calcula | Umbral para aceptar la opción |
|---|---|---|
| hit@1 / hit@k (fuente) | Proporción de preguntas con un chunk del fichero correcto en la posición 1 / entre los k primeros (`rango_primer_acierto`) | Referencia |
| MRR@k (fuente) | Media de 1/posición del primer acierto (0 si no aparece entre los k) | Referencia |
| ev_hit@1 / ev_hit@k | Igual, pero el chunk debe contener la evidencia literal (`rango_primer_acierto_evidencia`) | Criterio principal (abajo) |
| ev_MRR@k | MRR con el criterio de evidencia | Referencia |
| ev_hit@k de A y de C | ev_hit@k solo sobre las preguntas de esa categoría | Igual que con k=4 |
| Contexto medio (caracteres) | Suma de la longitud del campo `texto` de los k chunks devueltos, media por pregunta | Referencia de coste |
| Latencia media (ms) | Embedding de la query más búsqueda, media por pregunta | Referencia; no decide |

Criterio de decisión, fijado en la issue #9 antes de medir: se elige el k más pequeño cuyo ev_hit@k no pierde más de una pregunta respecto a k=4, siempre que las categorías A y C acierten con ese k (ev_hit@k de A y de C) lo mismo que con k=4.

### 3.5 Entorno y reproducción

- Python y librerías: las de `pyproject.toml` y `uv.lock`. Qdrant en Docker (`docker compose up -d`) y Ollama con `nomic-embed-text`, como en la ficha 5.
- Notebook: [notebooks/08_comparar_numero_k.ipynb](../notebooks/08_comparar_numero_k.ipynb). Para ejecutarlo sin abrir Jupyter: `uv run jupyter nbconvert --to notebook --execute notebooks/08_comparar_numero_k.ipynb`. Necesita la colección creada con [notebooks/07_comparar_troceo_estructura.ipynb](../notebooks/07_comparar_troceo_estructura.ipynb); no crea, borra ni modifica colecciones.
- Repeticiones: el CSV recoge una ejecución por k, con una búsqueda propia para cada k. Los embeddings y la búsqueda dan el mismo orden en cada ejecución; la latencia cambia entre ejecuciones.

## 4. Resultados

**Tabla 1. Métricas por k (32 preguntas A-D).** Entre paréntesis, preguntas acertadas; una pregunta vale 0,031.

| k | hit@1 | hit@k | MRR | ev_hit@1 | ev_hit@k | ev_MRR | Contexto medio (caracteres) | Latencia media (ms) |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,719 | 0,719 (23) | 0,719 | 0,406 | 0,406 (13) | 0,406 | 1 586 | 21,2 |
| 2 | 0,719 | 0,781 (25) | 0,750 | 0,406 | 0,469 (15) | 0,438 | 2 965 | 17,3 |
| **4** | **0,719** | **0,906 (29)** | **0,786** | **0,406** | **0,594 (19)** | **0,477** | **5 926** | **18,2** |
| 8 | 0,719 | 0,938 (30) | 0,793 | 0,406 | 0,688 (22) | 0,492 | 10 723 | 18,7 |

La fila k=4 reproduce las métricas de acierto de la opción H de la ficha 5 (misma colección).

**Tabla 2. Acierto por categoría y k, frente al «k mín.» del golden set.** Preguntas acertadas de cada categoría: por evidencia (ev_hit@k) / por fuente (hit@k).

| Categoría (n) | k mín. | k=1 | k=2 | k=4 | k=8 |
|---|---|---|---|---|---|
| A, consulta puntual (10) | 1 | 3 / 7 | 3 / 7 | 5 / 9 | 6 / 9 |
| B, términos exactos y siglas (10) | sin declarar | 7 / 8 | 7 / 8 | 7 / 9 | 8 / 10 |
| C, conceptos y comportamiento (9) | 1-2 | 3 / 6 | 5 / 8 | 7 / 9 | 8 / 9 |
| D, varias fuentes (3) | 2 | 0 / 2 | 0 / 2 | 0 / 2 | 0 / 2 |

**Tabla 3. Criterio de decisión aplicado frente a k=4.**

| k | ev_hit@k frente a k=4 | Pierde como mucho 1 pregunta | A igual que con k=4 | C igual que con k=4 | Cumple |
|---|---|---|---|---|---|
| 1 | 13 frente a 19 | no (pierde 6) | no (3 frente a 5) | no (3 frente a 7) | no |
| 2 | 15 frente a 19 | no (pierde 4) | no (3 frente a 5) | no (5 frente a 7) | no |
| **4** | **19** | **sí** | **sí** | **sí** | **sí** |

**Tabla 4. Contexto por chunk recuperado.** Contexto medio de la tabla 1 dividido entre k. El tamaño medio de los 7 955 chunks de la colección es 1 203 caracteres (ficha 5).

| k | Caracteres por chunk recuperado |
|---|---|
| 1 | 1 586 |
| 2 | 1 482 |
| 4 | 1 482 |
| 8 | 1 340 |

Fallos y resultados que no siguen la tendencia:

- **El primer resultado es el mismo con todos los k:** hit@1 (0,719) y ev_hit@1 (0,406) no cambian. Lo que sube con k es el acierto en las posiciones 2 a 8.
- **Categoría A (k mín. 1):** con k=1 trae la evidencia en 3 de 10 preguntas; el fichero correcto aparece en 7. Ni con k=8 pasa de 6 de 10.
- **Categoría C (k mín. 1-2):** con k=2 trae la evidencia en 5 de 9; necesita k=4 para llegar a 7.
- **Categoría D (k mín. 2):** no trae la evidencia en ninguna pregunta con ningún k, y por fuente se queda en 2 de 3 con todos los k.
- **Categoría B** es la menos sensible a k: 7 de 10 por evidencia con k=1, 2 y 4.
- **Latencia de k=1 (21,2 ms):** es la mayor, por encima de k=8 (18,7 ms), aunque busca menos resultados. k=1 es el primer bloque que ejecuta el notebook. En otra ejecución del mismo notebook, k=1 dio 39,8 ms con las demás latencias entre 17 y 19 ms.

## 5. Discusión

- **Qué significan los resultados:** el chunk con la respuesta exacta está pocas veces en la posición 1 (13 de 32) y muchas en las posiciones 2 a 4 (6 preguntas más). Pasar de 4 a 8 trae 3 preguntas más, una en A, una en B y una en C. El acierto por fuente sube menos (de 23 con k=1 a 29 con k=4): el fichero correcto suele estar arriba, pero no el chunk que contiene el dato.
- **Frente a la hipótesis:** se refuta. k=1 pierde 6 preguntas por evidencia respecto a k=4 y k=2 pierde 4; las dos fallan además en A y en C. El «k mín.» del golden set (A 1, C 1-2, D 2) no se cumple con este índice: es lo que bastaría si el primer resultado fuera el bueno, y con nomic-embed-text y este troceo no lo es.
- **Explicaciones alternativas:** las evidencias son subcadenas literales; más resultados dan más papeletas de contenerlas aunque el chunk no sea el más relevante. Parte de la subida de k=4 a k=8 puede venir de ahí. Un reranker (ficha 3) podría subir el chunk bueno a las primeras posiciones y bajar el k necesario; esta ficha no lo mide.
- **Coste en contexto:** el contexto crece casi en proporción a k: 1 586 caracteres con k=1, 5 926 con k=4 y 10 723 con k=8. Cada chunk recuperado mide de media entre 1 340 y 1 586 caracteres, más que la media de la colección (1 203). Con k=1 la media por chunk (1 586) pasa del máximo del troceo (1 500), así que entre los recuperados hay chunks de los que el troceo no corta; la ficha 5 cuenta 71 de más de 6 000 caracteres, el mayor de 203 072. Esos chunks inflan la media de contexto. El CSV solo guarda la media, así que no se puede separar cuánto pesan.
- **Limitaciones y amenazas a la validez:**
  - En la categoría D, `rango_primer_acierto` y `rango_primer_acierto_evidencia` cuentan como acierto un chunk de cualquiera de las dos fuentes, mientras que «k mín. 2» supone traer las dos. Las cifras de D miden si llega una de las fuentes, no las dos: el acierto por fuente (2 de 3) puede sobrestimar lo que pide la categoría, y el 0 de 3 por evidencia ya dice que ni una de las dos evidencias llega. No se añade una métrica que lo separe.
  - Son 32 preguntas: una pregunta vale 0,031. La diferencia de k=4 a k=8 es de 3 preguntas; las de k=1 y k=2 frente a k=4 son de 6 y 4. Las categorías son pequeñas (D tiene 3 preguntas).
  - Hay una sola ejecución por k. La latencia mayor de k=1 coincide con que es el primer bloque del notebook, lo que apunta a calentamiento de Ollama o de Qdrant; con una ejecución no se puede confirmar. No se decide por latencia: entre k=2, 4 y 8 la diferencia es de 1,5 ms.
  - El contexto se mide en caracteres, no en tokens del LLM, y no se mide si el LLM responde mejor con más contexto.
- **Qué cambiaría si el volumen de datos creciera:** con más documentos hay más chunks que compiten por las primeras posiciones, y el chunk bueno puede bajar. k=4 deja margen respecto a k=1 y k=2; la latencia apenas depende de k en este rango.

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | k=4 (sin cambio respecto a la configuración base). |
| Motivo principal | Ningún k menor cumple el criterio fijado antes de medir: k=1 y k=2 pierden 6 y 4 preguntas por evidencia respecto a k=4 (13 y 15 frente a 19) y aciertan menos en A y en C. |
| Alternativas descartadas | k=1 y k=2: hipótesis de partida, refutada por la tabla 3. k=8: acierta 3 preguntas más por evidencia (22 frente a 19) con 1,8 veces el contexto (10 723 frente a 5 926 caracteres); el criterio busca el k más pequeño y no lo considera. |
| Coste o riesgo asumido | Unos 5 900 caracteres de contexto por pregunta de media, más si se recupera uno de los chunks largos de la ficha 5. 13 de 32 preguntas siguen sin traer la evidencia entre los 4 primeros, y la categoría D no la trae en ninguna. |
| Cuándo se revisa | Al cerrar la ficha 3: si el reranking sube el chunk bueno a las primeras posiciones, k podría bajar. Si el LLM responde mejor con más contexto, o si las categorías A y D necesitan subir, k=8 es la siguiente opción a medir con la respuesta final. Si se limita el tamaño de los chunks largos de la ficha 5, cambia el coste en contexto. |

## 7. Impacto en el workflow

- El paso «el agente consulta el RAG» busca en `pydocs_nomic_est1500_m200_sinruta` con `limit=4`.
- El prompt del agente recibe de media unos 5 900 caracteres de contexto por pregunta. La ficha 5 estimaba unos 4 800 multiplicando k por el tamaño medio de chunk; los chunks que se recuperan son más largos que la media de la colección. Un solo resultado puede pasar de 6 000 caracteres.
- El «k mín.» del golden set no sirve como k de configuración con este índice.

## 8. Referencias

1. Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F. y Liang, P. (2023). _Lost in the middle: How language models use long contexts_. arXiv. https://arxiv.org/abs/2307.03172 (consultado el 2026-11-17).
2. Qdrant. (s. f.). _Indexing_. Qdrant Documentation. https://qdrant.tech/documentation/concepts/indexing/ (consultado el 2026-11-17).

## Anexos

- Notebook: [notebooks/08_comparar_numero_k.ipynb](../notebooks/08_comparar_numero_k.ipynb)
- Datos brutos: `data/resultados/numero_k.csv`
- Lectura del «k mín.»: `leer_k_minimo` en [scripts/comparar_embeddings.py](../scripts/comparar_embeddings.py)

---

## Lista de comprobación antes de exponer

- [x] La pregunta está formulada en una frase y se puede responder con datos.
- [x] La hipótesis y el umbral de éxito se escribieron antes de probar.
- [x] Solo cambia una variable a la vez; el resto está fijo.
- [x] Otra persona puede repetir la prueba con la sección 3.
- [x] Los resultados incluyen lo que no salió como se esperaba.
- [x] La conclusión no afirma más de lo que muestran los datos.
- [x] Las limitaciones están dichas con claridad.
- [ ] Toda afirmación externa tiene su referencia. _Faltan las fechas de consulta._
- [x] El resumen se entiende sin leer el resto.
