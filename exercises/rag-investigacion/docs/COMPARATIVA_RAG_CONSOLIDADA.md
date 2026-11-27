# Comparativa consolidada y decisiones del RAG

> Documento final de la investigación definida en [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md). Reúne las seis fichas, la ficha 7 sobre filtros por metadatos, la ficha 8 sobre modelos de embeddings con la configuración final, la validación con la configuración completa y las decisiones que debe aplicar el workflow.

| Campo | Valor |
|---|---|
| Autora | Maria |
| Fecha de cierre | 2026-11-18 |
| Corpus | Documentación limpia de Python 3.15 |
| Golden set | 35 preguntas: 32 evaluables A-D y 3 sin respuesta E |
| Estado | Cerrado |

## 1. Decisión ejecutiva

El RAG final usa **Qdrant**, embeddings **nomic-embed-text**, troceo de Markdown por estructura con máximo 1500 y mínimo 200, recuperación de **20 candidatos**, reranking local con **MiniLM-L6** y entrega de los **4 mejores chunks**. No se incorpora búsqueda híbrida BM25 porque, una vez aplicado el reranker, solo mejora una pregunta por evidencia y el umbral exigía dos.

En la validación final, esta configuración recupera una fuente correcta entre los cuatro primeros en **30 de 32 preguntas (hit@4 0,938)** y un chunk con alguna de las evidencias literales de la pregunta en **26 de 32 (ev_hit@4 0,813)**. La latencia total media fue **918,3 ms**, en Windows con el reranker en CPU; la validación anterior, con el reranker en MPS, dio 153,7 ms (ver la sección 7).

Cada chunk guarda en el payload seis metadatos calculados del corpus, y la consulta acepta filtros por `modulo` y `tipo_pagina`. El agente pasa **`modulo`** cuando lo conoce por sus `import`, con la repetición sin filtro por defecto; no pasa `tipo_pagina`. Con el filtro perfecto por `modulo` sacado del golden set y repetición, la recuperación sube a **31 de 32 fuentes y 28 de 32 evidencias** en el top 4 (sección 3.7).

## 2. Configuración final

| Componente | Decisión |
|---|---|
| Idioma de recuperación | Corpus y query en inglés; el agente traduce la pregunta antes y la respuesta después si la conversación está en español. |
| Modelo de embeddings | `nomic-embed-text` en Ollama |
| Prefijo del documento | `search_document: ` |
| Prefijo de la query | `search_query: ` |
| Base vectorial | Qdrant 1.20.2 como servidor Docker |
| Colección | `pydocs_nomic_est1500_m200_sinruta` |
| Troceo | Markdown por estructura; máximo 1500, mínimo 200; sin ruta de títulos en el texto embebido |
| Distancia | Coseno |
| Primera recuperación | 20 candidatos |
| Reranker | `cross-encoder/ms-marco-MiniLM-L-6-v2` |
| Resultado final | 4 chunks |
| Búsqueda híbrida | No; solo búsqueda densa |
| Metadatos en el payload | `modulo`, `tipo_pagina`, `simbolos`, `deprecated`, `added_in`, `tiene_codigo`; índices keyword en `modulo` y `tipo_pagina` |
| Filtros | `modulo` cuando el agente lo conoce; `tipo_pagina` no se recomienda |
| Repetición sin filtro | Umbral 0,0 en score de reranking (`UMBRAL_REPETICION`) |
| Paso reutilizable | `scripts/consultar_rag.py` |

## 3. Comparativa total de decisiones

### 3.1 Embeddings

Se compararon MiniLM, BGE y nomic sobre Qdrant y Chroma con chunks fijos de 500 caracteres.

| Modelo | hit@1 | hit@4 | MRR | Lectura |
|---|---:|---:|---:|---|
| all-MiniLM-L6-v2 | 0,656 | 0,844 | 0,734 | Rápido y pequeño, pero pierde más fuentes. |
| BAAI/bge-base-en-v1.5 | 0,562 | 0,875 | 0,706 | Mejora hit@4 frente a MiniLM, peor primera posición. |
| **nomic-embed-text** | **0,656** | **0,906** | **0,755** | Mejor recuperación global; local, privado y sin coste por token. |

**Decisión:** nomic. La ventaja inicial era pequeña y la métrica por evidencia estaba limitada por el chunking; por eso se confirmó después con la configuración estructurada.

Ficha: [FICHA_01_EMBEDDINGS.md](FICHA_01_EMBEDDINGS.md).

Con la configuración final (troceo por estructura 1500/200 sin ruta, 20 candidatos, MiniLM-L6, top 4 y varias evidencias por fuente) se compararon cinco modelos más frente a nomic, cada uno en su colección y con los prefijos de su ficha oficial. La tabla da la configuración que decide: con reranker y filtro perfecto por `modulo` con repetición. Latencias con el reranker en `cuda`, no comparables con las de las otras secciones.

| Modelo | Proveedor | `num_ctx` | Truncados | hit@4 | ev_hit@4 | Latencia media | Indexación |
|---|---|---:|---:|---:|---:|---:|---:|
| **nomic-embed-text** | Ollama | 2048 | 42 | 31/32 | **28/32** | 105,7 ms | 228,2 s\* |
| qwen3-embedding:0.6b | Ollama | 8192 | 2 | 31/32 | 27/32 | 109,8 ms | 261,4 s |
| qwen3-embedding:8b | Ollama (`cuda+cpu`) | 8192 | 2 | 32/32 | **28/32** | 256,1 ms | 1 573,4 s |
| bge-m3 (denso) | Ollama | 8192 | 3 | 32/32 | **28/32** | 117,3 ms | 276,3 s |
| embeddinggemma | Ollama | 2048 | 47 | 32/32 | 27/32 | 151,2 ms | 247,4 s |
| jina-code-embeddings-1.5b | `sentence-transformers` | 8192 | 2 | 31/32 | 25/32 | 106,0 ms | 1 814,9 s |

\* La indexación de nomic no se repitió: es la de `troceo_estructura.csv`, medida en un MacBook M2 Pro ([ficha 5](FICHA_05_CHUNK_SIZE.md)), y no se compara con los otros tiempos de la tabla.

**Decisión:** se mantiene nomic. El criterio fijado antes de medir exigía ev_hit@4 ≥ 30/32 sin bajar hit@4 de 31/32, y ningún modelo pasa de 28/32 evidencias. Sin reranker, embeddinggemma logra 28/32 evidencias con y sin filtro, pero el criterio no evalúa esa configuración.

Ficha: [FICHA_08_MODELOS_EMBEDDING.md](FICHA_08_MODELOS_EMBEDDING.md).

### 3.2 Base vectorial

Qdrant y Chroma recibieron exactamente los mismos 7 955 vectores. Se midieron como servidores HTTP, con clientes asíncronos independientes, 640 búsquedas por ronda y tres rondas.

| Clientes | Qdrant, consultas/s | Chroma, consultas/s | Qdrant p95 | Chroma p95 |
|---:|---:|---:|---:|---:|
| 1 | 354,8 | **408,8** | 4,02 ms | **3,12 ms** |
| 4 | **587,0** | 539,6 | **8,61 ms** | 9,75 ms |
| 8 | **728,8** | 607,6 | 15,52 ms | **14,80 ms** |

No hubo errores. El top 1 coincidió en todas las queries y el solape top 20 fue 99,2 %. Con ocho clientes, Qdrant ofrece un 19,9 % más throughput; la diferencia de p95 es inferior al 10 % y se considera equivalente.

**Decisión:** Qdrant, porque el requisito es la consulta concurrente de varios agentes y escala mejor en esa carga. Chroma es válido para prototipos y fue más rápido con un cliente.

Ficha: [FICHA_02_BASE_VECTORIAL.md](FICHA_02_BASE_VECTORIAL.md).

### 3.3 Troceo

Se midieron 18 configuraciones en tres pruebas: tamaños fijos con y sin solape, troceo por estructura Markdown y troceo por estructura con límite duro. Todas usan nomic-embed-text, Qdrant y k=4. Entre paréntesis, preguntas acertadas de 32.

Tamaño fijo y estructura, sin reranker y con una sola evidencia por fuente:

| Configuración | Chunks | hit@4 | ev_hit@4 | ev_MRR |
|---|---:|---:|---:|---:|
| Fijo 300, sin solape | 32 156 | 0,844 (27) | 0,438 (14) | 0,341 |
| Fijo 500, sin solape | 19 393 | 0,906 (29) | 0,375 (12) | 0,271 |
| Fijo 1000, sin solape | 9 816 | 0,906 (29) | 0,500 (16) | 0,378 |
| Fijo 1500, sin solape | 6 639 | 0,906 (29) | 0,563 (18) | 0,422 |
| Fijo 500, solape 100 | 24 049 | 0,844 (27) | 0,469 (15) | 0,326 |
| Fijo 1000, solape 200 | 12 103 | 0,875 (28) | 0,500 (16) | 0,315 |
| Estructura 1500/200, con ruta | 7 955 | 0,875 (28) | 0,594 (19) | 0,477 |
| **Estructura 1500/200, sin ruta** | **7 955** | **0,906 (29)** | **0,594 (19)** | **0,477** |
| Estructura 1000/200, con ruta | 10 554 | 0,844 (27) | 0,625 (20) | 0,495 |
| Estructura 1000/200, sin ruta | 10 554 | 0,844 (27) | 0,563 (18) | 0,487 |

Estructura 1500/200 (actual) frente a estructura con límite duro 1500/200 (limitado), con la métrica de varias evidencias por fuente de la issue #21, así que sus cifras por evidencia no son comparables con las de la tabla anterior:

| Troceo | Ruta | Reranker | Chunks | hit@4 | ev_hit@4 | ev_MRR |
|---|---|---|---:|---:|---:|---:|
| actual | no | no | 7 955 | 0,906 (29) | 0,656 (21) | 0,529 |
| **actual** | **no** | **sí** | **7 955** | **0,938 (30)** | **0,813 (26)** | **0,604** |
| actual | sí | no | 7 955 | 0,875 (28) | 0,656 (21) | 0,555 |
| actual | sí | sí | 7 955 | 0,938 (30) | 0,781 (25) | 0,599 |
| limitado | no | no | 9 143 | 0,906 (29) | 0,719 (23) | 0,492 |
| limitado | no | sí | 9 143 | 0,906 (29) | 0,781 (25) | 0,526 |
| limitado | sí | no | 9 143 | 0,938 (30) | 0,719 (23) | 0,560 |
| limitado | sí | sí | 9 143 | 0,906 (29) | 0,781 (25) | 0,531 |

**Decisión:** estructura 1500/200 sin ruta. Frente a fijo 1500 mantiene las fuentes y sube evidencia y orden; incluir la ruta de títulos en el embedding no compensó. El límite duro deja 69 chunks por encima de 1 500 caracteres, todos bloques de código, frente a 773 del troceo actual, y hace que B01 y B08 traigan la evidencia. Con reranker pierde una evidencia (25 frente a 26) y una fuente (29 frente a 30), así que no cumple el criterio fijado antes de medir y no se adopta.

Ficha: [FICHA_05_CHUNK_SIZE.md](FICHA_05_CHUNK_SIZE.md).

### 3.4 Número de resultados

| k | Aciertos por evidencia | Diferencia frente a k=4 |
|---:|---:|---:|
| 1 | 13/32 | −6 |
| 2 | 15/32 | −4 |
| **4** | **19/32** | referencia |
| 8 | 22/32 | +3, pero duplica contexto |

**Decisión:** k=4 como contexto final. k=1 y k=2 pierden demasiada evidencia; k=8 aumenta el contexto. Los 20 candidatos del paso anterior al reranking no llegan al LLM.

Ficha: [FICHA_04_NUMERO_K.md](FICHA_04_NUMERO_K.md).

### 3.5 Reranking

| Configuración | hit@4 | ev_hit@4 | Reranking medio | Decisión |
|---|---:|---:|---:|---|
| Sin reranking | 29/32 | 19/32 | 0 ms | Referencia |
| **MiniLM-L6** | **30/32** | **22/32** | **119,4 ms** | Cumple |
| bge-reranker-base | 29/32 | 23/32 | 502,2 ms | Supera el límite de 500 ms |

**Decisión:** MiniLM-L6. Recupera tres evidencias adicionales, mantiene o mejora la fuente y queda lejos del límite de latencia. BGE acierta una evidencia más, pero es 4,2 veces más lento, baja la categoría C y quedó fuera por el criterio fijado antes de medir.

Ficha: [FICHA_03_RERANKING.md](FICHA_03_RERANKING.md).

### 3.6 Búsqueda híbrida

| Configuración | hit@4 | ev_hit@4 | ev_hit@4 en B |
|---|---:|---:|---:|
| Vectorial | 29/32 | 19/32 | 7/10 |
| Híbrida | 29/32 | 21/32 | 8/10 |
| Vectorial + reranking | 30/32 | 22/32 | 8/10 |
| Híbrida + reranking | 30/32 | 23/32 | 8/10 |

**Decisión:** mantener la búsqueda vectorial. BM25 aporta dos evidencias sin reranking, pero el reranker ya captura casi toda la mejora. Con la configuración final solo suma +1 total y +0 en términos exactos; el umbral exigía +2 total o en B.

Ficha: [FICHA_06_HYBRID.md](FICHA_06_HYBRID.md).

### 3.7 Filtros por metadatos

Se midió la configuración final sin filtro y con filtro por `modulo` o por `tipo_pagina`, uno cada vez. El filtro perfecto sale de las fuentes esperadas del golden set; el equivocado, de una regla fija (el módulo de otra pregunta, o `c-api`/`library`). «Con repetición» usa el umbral por defecto 0,0. El filtro por `modulo` se aplica a 22 de 32 preguntas; las otras 10 no tienen módulo en su fuente y van sin filtro. Las métricas por evidencia usan varias evidencias por fuente, como la sección 4.

| Configuración | hit@4 | ev_hit@4 | Repeticiones | Latencia media |
|---|---:|---:|---:|---:|
| Sin filtro | 30/32 | 26/32 | — | 1 018,8 ms |
| **`modulo` perfecto, sin repetición** | **32/32** | **29/32** | 0 | 892,8 ms |
| `modulo` perfecto, con repetición | 31/32 | 28/32 | 1 | 900,5 ms |
| `modulo` equivocado, con repetición | 29/32 | 26/32 | 20 de 22 | 1 459,3 ms |
| `tipo_pagina` perfecto, sin repetición | 30/32 | 26/32 | 0 | 1 004,2 ms |
| `tipo_pagina` equivocado, con repetición | 19/32 | 15/32 | 21 de 32 | 1 576,8 ms |

**Decisión:** el agente pasa `modulo` con la repetición por defecto; no pasa `tipo_pagina`. `modulo` cumple el criterio fijado antes de medir (ev_hit@4 ≥ 27 y hit@4 ≥ 30 con filtro perfecto; ev_hit@4 ≥ 23 con filtro equivocado y repetición). `tipo_pagina` no mejora el top 4 con filtro perfecto (26 < 27) y la repetición no lo protege de un filtro equivocado (15 < 23). La repetición cuesta D02 con el filtro perfecto por `modulo`. El efecto real depende de que el agente acierte el módulo; no se ha medido con un agente.

Ficha: [FICHA_07_FILTROS_METADATOS.md](FICHA_07_FILTROS_METADATOS.md).

## 4. Validación de la configuración completa

El script [validar_rag_final.py](../scripts/validar_rag_final.py) ejecutó las 35 preguntas a través del mismo módulo que usará el agente.

| Métrica, preguntas A-D | Resultado |
|---|---:|
| hit@1 por fuente | 0,688 (22/32) |
| hit@4 por fuente | **0,938 (30/32)** |
| MRR por fuente | 0,797 |
| ev_hit@1 | 0,438 (14/32) |
| ev_hit@4 | **0,813 (26/32)** |
| ev_MRR | 0,604 |
| Latencia total media, Windows con reranker en CPU | 918,3 ms |
| Latencia total media de la validación anterior, reranker en MPS | 153,7 ms |

Las métricas por evidencia usan [golden_set_evidencias.json](golden_set_evidencias.json) con varias evidencias por fuente: A04, A06, A10 y C03 aceptan una segunda redacción de la respuesta. Por eso no son comparables con las de la sección 3 ni con las fichas, medidas con una sola evidencia por fuente, salvo la segunda tabla de la sección 3.3 y la sección «Troceo con límite duro» de la ficha 5, que usan la misma métrica. Las métricas por fuente reproducen la fila vectorial con reranking del notebook híbrido, lo que confirma que el módulo integrado no cambió la lógica investigada.

Datos: `data/resultados/validacion_final.csv`.

## 5. Paso «consultar el RAG»

El módulo [consultar_rag.py](../scripts/consultar_rag.py) carga una vez el cliente de Qdrant, Ollama y el reranker, este en el dispositivo de `dispositivo()`: `cuda` en Windows con GPU NVIDIA, `mps` en macOS y `cpu` en otro caso. Por consulta:

1. Recibe una pregunta en inglés y, opcionalmente, `filtros`.
2. Añade el prefijo `search_query: ` y obtiene el embedding con nomic.
3. Consulta Qdrant y recupera 20 candidatos. Con filtros, solo entre los chunks que los cumplen.
4. Puntúa los pares `(pregunta, texto)` con MiniLM-L6.
5. Ordena por score de reranking.
6. Con filtros, si no hay candidatos o ninguno llega a `umbral` en score de reranking, repite los pasos 3 a 5 sin filtro con el mismo vector.
7. Devuelve los 4 mejores chunks.

`filtros` es un diccionario con las claves `modulo` y `tipo_pagina`. Cada valor es un texto o una lista de textos: una lista acepta cualquiera de sus valores y las dos claves se combinan con Y. Una clave distinta, un valor vacío o un elemento que no es texto lanzan `ValueError` antes de calcular el embedding. `{}` y `None` equivalen a consultar sin filtros, que hace la misma llamada a Qdrant que antes de añadir los filtros.

`umbral` vale por defecto `UMBRAL_REPETICION = 0.0`. Con `umbral=None` la consulta filtrada no se repite y puede devolver una lista vacía.

Cada chunk devuelto lleva:

| Campo | Contenido |
|---|---|
| `id`, `fuente`, `texto`, `ruta_titulos` | Payload del chunk |
| `score_vectorial`, `score_reranking` | Scores de Qdrant y de MiniLM-L6 |
| `modulo` | Módulo de Python de la página (`logging.config`, `asyncio`); vacío si la página no documenta un módulo |
| `tipo_pagina` | Primera carpeta de `fuente` (`library`, `tutorial`, `whatsnew`…); vacío si no tiene carpeta |
| `simbolos` | Nombres de las entradas de definición del chunk, cualificados con su padre (`asyncio.TaskGroup.create_task`) |
| `deprecated` | Verdadero si el chunk tiene una línea `Deprecated since version` |
| `added_in` | Versiones de las líneas `Added in version X.Y` |
| `tiene_codigo` | Verdadero si el chunk tiene un bloque de código |
| `filtrado` | Verdadero si el chunk salió de la búsqueda con filtro; falso sin filtros o tras repetir sin filtro |

Los seis metadatos los calcula [metadatos.py](../scripts/metadatos.py) a partir del corpus y los escribe en el payload de la colección [anadir_metadatos.py](../scripts/anadir_metadatos.py), sin recalcular vectores. Si la colección no los tiene, `ConsultorRAG.local()` para y pide ejecutar:

```bash
uv run python scripts/anadir_metadatos.py
```

Uso directo:

```bash
uv run python scripts/consultar_rag.py "How does asyncio.TaskGroup work?"
uv run python scripts/consultar_rag.py "How does asyncio.TaskGroup work?" --modulo asyncio
uv run python scripts/consultar_rag.py "How do I create a virtual environment?" --tipo-pagina tutorial --tipo-pagina library
```

`--modulo` y `--tipo-pagina` se pueden repetir y se pasan como `filtros` con el umbral por defecto.

Para medir otros modelos, `ConsultorRAG.local(coleccion, modelo)` acepta otra colección y otra clave de `MODELOS` (por defecto `COLECCION` y `MODELO`, los de la configuración final), y `consultar(..., reordenar=False)` devuelve los 4 primeros de la búsqueda sin reranker, con `score_reranking` a `None`; con filtros y sin reranker, la búsqueda solo se repite sin filtro si la filtrada no trae candidatos. El agente usa los valores por defecto.

El agente pasa `modulo` cuando conoce el módulo por sus `import` y deja el umbral por defecto. No pasa `tipo_pagina`: el filtro existe, pero no mejora la recuperación y un valor equivocado no siempre se repite sin filtro (sección 3.7).

En un workflow asíncrono con varios agentes debe usarse `AsyncQdrantClient` o ejecutar el adaptador síncrono fuera del event loop. El benchmark de la ficha 2 ya valida el cliente asíncrono con ocho conexiones.

## 6. Reflexiones

### 6.1 La fuente correcta no basta

El hit por fuente sobreestima la calidad. En la configuración final, 30 preguntas encuentran el fichero correcto, pero solo 26 encuentran un chunk que contiene alguna de sus evidencias. Siguen fallando por evidencia B01, B08, C01 y D03, y A01 y D02 no aciertan ni la fuente. La revisión manual de esos fallos está en la issue #22. Con una sola evidencia por fuente eran 22: A04, A06, A10 y C03 tenían la respuesta en el top 4 con otra redacción.

### 6.2 El chunking tuvo más impacto estructural que cambiar de modelo

Los embeddings variaron una o dos preguntas por fuente en la primera prueba. Cambiar de chunks fijos a secciones Markdown mejoró evidencia y MRR sin perder fuentes. En documentación técnica, respetar la estructura del documento resultó más valioso que perseguir un modelo algo mayor.

### 6.3 Más resultados no sustituyen al reranking

k=8 encuentra tres evidencias más que k=4, pero duplica texto enviado al LLM. Recuperar 20 y rerankear permite aprovechar un conjunto amplio sin aumentar el contexto final. La contrapartida es unos 120 ms y un modelo adicional cargado en memoria.

### 6.4 Las optimizaciones se solapan

La búsqueda híbrida parecía útil antes del reranking: +2 evidencias. Después del reranking aporta solo +1. Las decisiones no son aditivas; cada mejora debe medirse sobre la configuración realmente vigente, no sobre una referencia antigua.

### 6.5 Los umbrales previos evitaron elegir por intuición

BGE quedó 2,2 ms fuera del límite y BM25 añadió una pregunta cuando se exigían dos. Aplicar el criterio escrito antes del resultado evitó mover el objetivo para justificar la opción técnicamente más llamativa.

### 6.6 Qdrant no ganó todas las métricas

Chroma fue mejor con un solo cliente y tuvo una p95 ligeramente menor con ocho. Qdrant se eligió porque el requisito era concurrencia y su throughput escaló mejor, no porque sea universalmente superior. Para una aplicación local de un único proceso, Chroma seguiría siendo una elección razonable.

### 6.7 Las preguntas sin respuesta necesitan una decisión propia

El reranker separó las tres preguntas E de las A-D en este golden set, pero tres casos no bastan para fijar un umbral de confianza. El workflow todavía debe ser conservador: si la evidencia recuperada no sostiene una respuesta, el LLM debe decir que no la encuentra.

## 7. Limitaciones

- Un solo corpus, de Python 3.15 y en inglés.
- 32 preguntas evaluables; una pregunta cambia una proporción en 0,031.
- La mayoría de experimentos se ejecutó una vez; las latencias dependen de caché, orden y hardware.
- La ficha 3 midió el reranker en MPS de Apple; las fichas 5 y 7 y la validación final, en Windows con el reranker en CPU. La validación final dio 918,3 ms de latencia total media frente a 153,7 ms de la validación anterior en MPS. No se midió el mismo equipo con los dos dispositivos, así que el peso del dispositivo en esa diferencia es una hipótesis. Un servidor dará otra cifra.
- Desde la issue #28, en Windows `torch` se instala con CUDA (2.14.1+cu130) y `ConsultorRAG.local()` crea el reranker en `dispositivo()`: `cuda` en Windows con GPU NVIDIA, `mps` en macOS y `cpu` en otro caso. La validación final no se repitió: sus 918,3 ms siguen siendo una medida con el reranker en CPU. Las latencias de la ficha 8 se midieron con el reranker en `cuda` y no se comparan con las de la validación ni con las de las fichas anteriores.
- La evidencia literal solo acepta las subcadenas listadas en el json: un chunk correcto con una redacción que no está en la lista cuenta como fallo.
- No se evaluó la respuesta generada por el LLM, solo la recuperación.
- La comparación de bases fue local, caliente y solo de lectura; no cubre escrituras, red, réplicas ni fallos.
- La configuración final tiene 773 de 7 955 chunks por encima de 1 500 caracteres; 709 no son un bloque de código y el mayor tiene 203 072. El troceo con límite duro los reduce a 69 bloques de código, pero no se adoptó (sección 3.3).
- La traducción español → inglés y la respuesta final en español se delegan al agente y no se midieron aquí.
- El filtro «perfecto» por `modulo` sale de la fuente esperada del golden set. Mide el techo con un agente que siempre acierta el módulo; cuánto acierta un agente real no se ha medido. El umbral de repetición 0,0 sale de `validacion_final.csv` y no se ajustó con el golden set.

## 8. Cuándo revisar las decisiones

Repetir la evaluación si ocurre cualquiera de estas condiciones:

- cambia el corpus, la versión de Python o el idioma;
- el golden set crece de forma material;
- el agente empieza a consultar desde CPU o desde otra máquina;
- aumenta la proporción de códigos, siglas o nombres exactos;
- el corpus supera claramente el tamaño controlado actual;
- se requiere escritura concurrente, alta disponibilidad o despliegue distribuido;
- se adopta otro reranker o se reduce el presupuesto de latencia;
- se quiere fijar un umbral de «no hay respuesta»;
- se evalúa con un agente real que elige los filtros o se quiere filtrar por otro metadato.

## 9. Artefactos finales

| Artefacto | Ruta |
|---|---|
| Plan maestro | [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md) |
| Ficha 1 | [FICHA_01_EMBEDDINGS.md](FICHA_01_EMBEDDINGS.md) |
| Ficha 2 | [FICHA_02_BASE_VECTORIAL.md](FICHA_02_BASE_VECTORIAL.md) |
| Ficha 3 | [FICHA_03_RERANKING.md](FICHA_03_RERANKING.md) |
| Ficha 4 | [FICHA_04_NUMERO_K.md](FICHA_04_NUMERO_K.md) |
| Ficha 5 | [FICHA_05_CHUNK_SIZE.md](FICHA_05_CHUNK_SIZE.md) |
| Ficha 6 | [FICHA_06_HYBRID.md](FICHA_06_HYBRID.md) |
| Ficha 7 | [FICHA_07_FILTROS_METADATOS.md](FICHA_07_FILTROS_METADATOS.md) |
| Ficha 8 | [FICHA_08_MODELOS_EMBEDDING.md](FICHA_08_MODELOS_EMBEDDING.md) |
| Benchmark de bases | `scripts/comparar_bases_vectoriales.py` y `data/resultados/bases_vectoriales.csv` |
| Metadatos del payload | `scripts/metadatos.py` (cálculo) y `scripts/anadir_metadatos.py` (carga en Qdrant) |
| Comparación de filtros | `notebooks/12_comparar_filtros_metadatos.ipynb`, `data/resultados/filtros_metadatos.csv` y `data/resultados/filtros_metadatos_por_pregunta.csv` |
| Comparación de modelos de embeddings | `scripts/embeddings_modelos.py`, `scripts/indexar_embeddings.py`, `data/resultados/indexacion_embeddings.json`, `notebooks/13_comparar_modelos_embedding.ipynb`, `data/resultados/modelos_embedding.csv` y `data/resultados/modelos_embedding_por_pregunta.csv` |
| Consulta integrada | `scripts/consultar_rag.py` |
| Validación final | `scripts/validar_rag_final.py` y `data/resultados/validacion_final.csv` |

## 10. Conclusión

El RAG deja de ser una colección de pruebas aisladas y queda convertido en una configuración trazable y ejecutable. La decisión final equilibra calidad, contexto y latencia: nomic + Qdrant + estructura 1500/200 + 20 candidatos + MiniLM-L6 + top 4, con filtro opcional por `modulo`. El siguiente trabajo ya no es elegir componentes, sino observar su comportamiento dentro del agente real y ampliar el golden set con fallos encontrados en uso.
