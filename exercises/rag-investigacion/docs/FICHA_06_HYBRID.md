# Ficha de investigación: búsqueda híbrida

> Ficha de la pregunta 6 de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md), con la estructura de [PLANTILLA_FICHA_INVESTIGACION.md](PLANTILLA_FICHA_INVESTIGACION.md). Issue [#15](https://github.com/maria-osi/rag-neoland/issues/15). Parte de las decisiones de las fichas [1](FICHA_01_EMBEDDINGS.md), [5](FICHA_05_CHUNK_SIZE.md), [4](FICHA_04_NUMERO_K.md) y [3](FICHA_03_RERANKING.md).

| Campo | Valor |
|---|---|
| Autores | Maria |
| Fecha | 2026-11-17 |
| Versión | v1 |
| Estado | cerrada |
| Pregunta nº | 6 |

## Resumen (máx. 150 palabras)

Se comprobó si combinar la búsqueda vectorial de nomic con BM25 mejora la recuperación, especialmente en términos exactos y siglas. Sobre 7 955 chunks y 32 preguntas A-D se compararon cuatro configuraciones: vectorial e híbrida con RRF, cada una con y sin reranking MiniLM-L6. Sin reranking, la híbrida sube los aciertos por evidencia de 19 a 21; con reranking, de 22 a 23. La categoría B queda igual con reranking: 8 de 10 en ambas. La híbrida con reranking mantiene 30 aciertos por fuente y su búsqueda es 4,4 ms más rápida en esta ejecución, pero solo mejora una pregunta por evidencia. No alcanza el umbral de dos preguntas fijado antes de medir. Se mantiene la búsqueda vectorial con reranking y no se incorpora BM25 al workflow. La colección híbrida se construyó en 6,9 s y no alteró los 7 955 puntos del índice original.

## 1. Introducción

### 1.1 Contexto y motivación

La categoría B del golden set contiene nombres exactos, siglas y términos técnicos. Una búsqueda dispersa puede favorecer coincidencias léxicas que el embedding denso no sitúa entre los primeros resultados. La configuración vigente ya usa reranking, por lo que la comparación relevante es si BM25 aporta algo adicional sobre esa base.

### 1.2 Pregunta de investigación

¿Combinar el vector denso de nomic con BM25 mediante RRF recupera más evidencia que la búsqueda vectorial, en especial para términos exactos y siglas, sin degradar la fuente ni añadir una latencia excesiva?

### 1.3 Hipótesis

La búsqueda híbrida con reranking mejora el ev_hit@4 en al menos 2 preguntas, en total o en la categoría B, mantiene el hit@4 por fuente y añade menos de 100 ms de búsqueda por pregunta. La hipótesis y el umbral se fijaron en la issue #15 antes de medir.

### 1.4 Alcance y exclusiones

- **Entra:** búsqueda densa nomic; búsqueda híbrida denso + BM25 fusionada con RRF; ambas con k=4, con y sin reranking MiniLM-L6 sobre 20 candidatos; métricas A-D y scores de las tres preguntas E.
- **No entra:** otras fusiones, pesos, modelos dispersos, otros embeddings, tamaños de chunk, valores de k, rerankers, concurrencia o calidad de la respuesta generada por el LLM.

## 2. Estado de la cuestión

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md), pregunta 6 | Propone comprobar términos exactos, nombres, códigos y siglas que la búsqueda semántica pueda perder. | propia |
| [Ficha 3](FICHA_03_RERANKING.md) | Define la referencia vigente: nomic, k=4 y MiniLM-L6 sobre 20 candidatos. | propia |
| Documentación de Qdrant, «Hybrid Queries» (ref. 1) | La Query API permite ejecutar búsquedas densas y dispersas como prefetch y fusionarlas con RRF. | oficial |
| Documentación de Qdrant, «Sparse Vectors» (ref. 2) | Qdrant admite vectores dispersos y el modificador IDF usado por BM25. | oficial |
| FastEmbed, ejemplo de sparse embeddings (ref. 3) | `Qdrant/bm25` genera vectores dispersos distintos para documentos y consultas. | oficial |

## 3. Método

### 3.1 Opciones comparadas

| Configuración | Recuperación | Reranking | Candidatos / resultados |
|---|---|---|---|
| Vectorial | nomic, coseno | ninguno | 4 / 4 |
| Híbrida | nomic + BM25, RRF | ninguno | 4 / 4 |
| Vectorial + reranking | nomic, coseno | MiniLM-L6 | 20 / 4 |
| Híbrida + reranking | nomic + BM25, RRF | MiniLM-L6 | 20 / 4 |

La colección `pydocs_nomic_est1500_m200_sinruta_hibrida` contiene dos vectores con nombre por punto: `denso`, copiado de la colección original, y `bm25`, calculado sobre el texto del chunk con `Qdrant/bm25`. El vector disperso usa `Modifier.IDF`. Cada consulta híbrida pide 20 resultados densos y 20 dispersos (`PREFETCH = 20`) y Qdrant los fusiona con RRF.

### 3.2 Datos y preguntas de prueba

- Corpus limpio de Python 3.15, indexado en 7 955 chunks por estructura Markdown, máximo 1500 y mínimo 200, sin ruta de títulos.
- Las 32 preguntas A-D de [GOLDEN_SET_PYTHON_DOCS.md](GOLDEN_SET_PYTHON_DOCS.md): A 10, B 10, C 9 y D 3. Las 3 preguntas E se usan solo para observar scores.
- Fuente esperada del golden set y subcadena literal de [golden_set_evidencias.json](golden_set_evidencias.json).

### 3.3 Variables

- Variable que cambia: recuperación vectorial o híbrida.
- Variables fijas: corpus, troceo, modelo denso nomic, Qdrant, k=4, golden set y evidencias; en las dos filas con reranking, MiniLM-L6 y 20 candidatos.
- Variables medidas: hit@1, hit@4 y MRR por fuente y evidencia; desglose A-D; latencia de búsqueda y reranking; tiempo de construcción de la colección; score del primer resultado en E.

### 3.4 Métricas y criterio de éxito

| Métrica | Cómo se calcula | Umbral de adopción |
|---|---|---|
| ev_hit@4 total | Preguntas cuyo chunk contiene la evidencia entre los 4 primeros | Híbrida con reranking: al menos 2 aciertos más |
| ev_hit@4 B | Igual, solo categoría B | O al menos 2 aciertos más en B |
| hit@4 por fuente | Preguntas con un chunk de la fuente correcta | No bajar frente a vectorial + reranking |
| Latencia añadida de búsqueda | Media híbrida menos media vectorial, ambas con reranking | Menor que 100 ms |
| hit@1, MRR y ev_MRR | Posición del primer acierto | Referencia; no deciden |

El criterio lo aplica `evaluar_hibrida` sobre aciertos contados. Las configuraciones sin reranking explican el efecto, pero no deciden.

### 3.5 Entorno y reproducción

- Python 3.14; Qdrant 1.20.2; `qdrant-client` 1.20.0; `fastembed` 0.9.1; versiones restantes fijadas en `uv.lock`.
- Notebook: [notebooks/10_comparar_hybrid.ipynb](../notebooks/10_comparar_hybrid.ipynb).
- Ejecución: `uv run jupyter nbconvert --to notebook --execute --inplace notebooks/10_comparar_hybrid.ipynb --ExecutePreprocessor.timeout=-1`.
- Una ejecución, después de una llamada de calentamiento a BM25 y al reranker. Qdrant y Ollama estaban en local. La colección híbrida se borró y reconstruyó; la original solo se leyó.

## 4. Resultados

**Tabla 1. Métricas globales sobre 32 preguntas A-D.**

| Configuración | hit@1 | hit@4 | MRR | ev_hit@1 | ev_hit@4 | ev_MRR |
|---|---:|---:|---:|---:|---:|---:|
| Vectorial | 0,719 | 0,906 (29) | 0,786 | 0,406 | 0,594 (19) | 0,477 |
| Híbrida | 0,688 | 0,906 (29) | 0,781 | 0,375 | 0,656 (21) | 0,495 |
| Vectorial + reranking | 0,688 | 0,938 (30) | **0,797** | **0,344** | 0,688 (22) | **0,495** |
| Híbrida + reranking | 0,625 | 0,938 (30) | 0,768 | 0,312 | **0,719 (23)** | 0,484 |

**Tabla 2. ev_hit@4 por categoría, aciertos / preguntas.**

| Configuración | A / 10 | B / 10 | C / 9 | D / 3 |
|---|---:|---:|---:|---:|
| Vectorial | 5 | 7 | 7 | 0 |
| Híbrida | 5 | 8 | 8 | 0 |
| Vectorial + reranking | 6 | 8 | 7 | 1 |
| Híbrida + reranking | 7 | 8 | 7 | 1 |

**Tabla 3. Latencia media por pregunta A-D y construcción.**

| Configuración | Búsqueda (ms) | Reranking (ms) | Total (ms) | Construcción (s) |
|---|---:|---:|---:|---:|
| Vectorial | 49,7 | 0 | 49,7 | 0 |
| Híbrida | 20,2 | 0 | 20,2 | 6,9 |
| Vectorial + reranking | 33,5 | 108,9 | 142,4 | 0 |
| Híbrida + reranking | 29,1 | 111,8 | 140,9 | 6,9 |

**Tabla 4. Criterio aplicado.**

| Condición | Resultado | Cumple |
|---|---|---|
| Mejora total de evidencia ≥ 2 | 23 − 22 = **+1** | no |
| O mejora de evidencia en B ≥ 2 | 8 − 8 = **0** | no |
| Fuente no baja | 30 = 30 | sí |
| Latencia añadida de búsqueda < 100 ms | 29,1 − 33,5 = **−4,4 ms** | sí |

Resultado de `evaluar_hibrida`: `cumple = False`. Decisión: mantener búsqueda vectorial.

En las preguntas E, los scores de la configuración híbrida sin reranking no separan todas las preguntas sin respuesta: E03 obtiene RRF 1,000, por encima de la media A-D 0,790. Con reranking, las tres E quedan por debajo del mínimo A-D tanto en vectorial como en híbrida.

## 5. Discusión

- **Qué significan los resultados:** BM25 aporta dos aciertos por evidencia sin reranking, pero el reranker ya recupera parte de esa mejora. Al añadir BM25 sobre la configuración vigente solo queda un acierto adicional, en A, y ninguno en la categoría B que motivó el experimento.
- **Frente a la hipótesis:** se refuta el umbral de calidad. Se cumplen las condiciones de fuente y latencia, pero no la mejora mínima total ni en B.
- **Posiciones:** la híbrida con reranking mejora ev_hit@4, pero empeora ev_hit@1, MRR por fuente y ev_MRR. La ganancia aparece en posiciones 2 a 4 y no mejora el primer resultado.
- **Latencia:** la híbrida fue 4,4 ms más rápida en búsqueda en esta ejecución. No se interpreta como ventaja estable: fue una sola ejecución y las configuraciones se midieron en orden.
- **Coste adicional:** la colección híbrida duplica el índice lógico y añade construcción, almacenamiento, `fastembed` y BM25, aunque se construyó en 6,9 s con este corpus controlado.
- **Limitaciones:** 32 preguntas, una sola ejecución, un solo corpus en inglés, un modelo BM25 y RRF sin pesos. La categoría B solo tiene 10 preguntas. Los resultados no miden la respuesta final del LLM ni el tamaño en disco de la colección nueva.
- **Crecimiento del corpus:** con más documentos, BM25 podría ser más útil para términos raros, pero también aumentan el almacenamiento y mantenimiento de los vectores dispersos. El criterio debe repetirse si cambia el corpus o el tipo de consultas.

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | Mantener la búsqueda vectorial con reranking MiniLM-L6; no incorporar BM25 al workflow actual. |
| Motivo principal | La híbrida con reranking solo mejora de 22 a 23 preguntas por evidencia (+1) y no mejora B (8 en ambas); el umbral exigía +2 total o en B. |
| Alternativas descartadas | Híbrida con RRF y BM25: mantiene la fuente y la latencia, pero su ganancia no compensa la colección y dependencia adicionales. |
| Coste o riesgo asumido | Se renuncia a un acierto adicional en A y a los dos aciertos que la híbrida aporta cuando no hay reranking. |
| Cuándo se revisa | Si crecen el corpus o la categoría B, aparecen más códigos/siglas, cambia el reranker, se quita el reranking o se prueban pesos/fusiones distintas. |

## 7. Impacto en el workflow

- El paso «el agente consulta el RAG» no cambia: consulta `pydocs_nomic_est1500_m200_sinruta`, recupera 20 candidatos densos con nomic, los reordena con MiniLM-L6 y entrega 4.
- `fastembed` y la colección híbrida se conservan como infraestructura experimental reproducible, no como dependencia del camino de producción.
- La colección original quedó en 7 955 puntos antes y después del experimento; la híbrida tiene también 7 955.

## 8. Referencias

1. Qdrant. (s. f.). _Hybrid Queries_. Qdrant Documentation. https://qdrant.tech/documentation/concepts/hybrid-queries/ (consultado el 2026-11-17).
2. Qdrant. (s. f.). _Sparse Vectors_. Qdrant Documentation. https://qdrant.tech/documentation/concepts/vectors/#sparse-vectors (consultado el 2026-11-17).
3. Qdrant. (s. f.). _Sparse Text Embeddings_. FastEmbed Documentation. https://qdrant.github.io/fastembed/examples/Sparse_Embedding/ (consultado el 2026-11-17).

## Anexos

- Notebook: [notebooks/10_comparar_hybrid.ipynb](../notebooks/10_comparar_hybrid.ipynb)
- Datos brutos: `data/resultados/hybrid.csv`
- Criterio: `evaluar_hibrida` en [scripts/comparar_embeddings.py](../scripts/comparar_embeddings.py)
- Los scores de las preguntas E aparecen en la sección 11 del notebook y no se guardan en el CSV.

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
