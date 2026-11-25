# Ficha de investigación: filtros por metadatos

> Ficha de la issue [#26](https://github.com/maria-osi/rag-neoland/issues/26), con la estructura de [PLANTILLA_FICHA_INVESTIGACION.md](PLANTILLA_FICHA_INVESTIGACION.md). Parte de la configuración final de [COMPARATIVA_RAG_CONSOLIDADA.md](COMPARATIVA_RAG_CONSOLIDADA.md) y de su validación (`data/resultados/validacion_final.csv`).

| Campo | Valor |
|---|---|
| Autores | Sergio |
| Fecha | 2026-11-17 |
| Versión | v1 |
| Estado | cerrada |
| Pregunta nº | — (ampliación posterior a las seis preguntas de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md)) |

## Resumen (máx. 150 palabras)

Se comprobó si filtrar la búsqueda por `modulo` o por `tipo_pagina`, metadatos calculados del corpus y guardados en el payload de Qdrant, mejora la recuperación de la configuración final. Sobre las 32 preguntas A-D se midieron nueve configuraciones: sin filtro y, por campo, filtro perfecto y equivocado, con y sin repetición sin filtro. El filtro perfecto por `modulo` sube de 30 a 32 fuentes y de 26 a 29 evidencias en el top 4; con repetición, 31 y 28. Un `modulo` equivocado con repetición mantiene 26 evidencias. El filtro perfecto por `tipo_pagina` no cambia los aciertos en el top 4 (30 y 26) y un `tipo_pagina` equivocado con repetición baja a 15 evidencias. Se recomienda al agente pasar `modulo` con el umbral de repetición por defecto y no pasar `tipo_pagina`. El filtro perfecto sale del golden set: el efecto real depende de que el agente acierte el módulo.

## 1. Introducción

### 1.1 Contexto y motivación

Antes de este cambio, cada chunk de `pydocs_nomic_est1500_m200_sinruta` guardaba solo `fuente`, `texto` y `ruta_titulos`, y ninguna búsqueda usaba filtros. Varios fallos del golden set son confusiones entre módulos: en B08 el primer resultado es el logger de `asyncio` y no el raíz de `logging`; A01 y A02 mezclan `http.client` y `urllib`; en B04 la primera fuente es `c-api/dict.md`. El consumidor del RAG es un agente que programa y ya conoce el módulo por sus `import`, así que puede pasar el filtro como parámetro sin reglas ni llamadas extra al LLM.

### 1.2 Pregunta de investigación

¿Filtrar los 20 candidatos por el módulo o por el tipo de página de la fuente esperada recupera más evidencia que la búsqueda sin filtro, y la repetición sin filtro limita el daño de un filtro equivocado?

### 1.3 Hipótesis

El filtro por `modulo` corrige las confusiones entre módulos y sube ev_hit@4 al menos a 27/32 sin bajar hit@4 de 30/32. La repetición sin filtro con umbral 0,0 deja un filtro equivocado en al menos 23/32 evidencias. Los umbrales se fijaron en la issue #26 (RF-10) y en la primera celda del notebook 12 antes de medir.

### 1.4 Alcance y exclusiones

- **Entra:** seis metadatos por chunk (`modulo`, `tipo_pagina`, `simbolos`, `deprecated`, `added_in`, `tiene_codigo`); filtros por `modulo` y `tipo_pagina` en `ConsultorRAG.consultar`; repetición sin filtro; medida de un campo cada vez con el golden set.
- **No entra:** filtros por `simbolos`, `deprecated`, `added_in` o `tiene_codigo`; búsqueda exacta por símbolo; un agente real que elija los filtros; preguntas nuevas al estilo de un agente; cambios de embeddings, troceo o reranker; ajustar el umbral con el golden set.

## 2. Estado de la cuestión

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| Issue [#26](https://github.com/maria-osi/rag-neoland/issues/26) | Fallos del golden set atribuidos a confusión entre módulos; reglas de cálculo de los metadatos (RF-01); criterio de decisión (RF-10). | propia |
| [COMPARATIVA_RAG_CONSOLIDADA.md](COMPARATIVA_RAG_CONSOLIDADA.md), secciones 4 y 6.4 | Referencia de la configuración final (30/32 fuentes y 26/32 evidencias en el top 4) y la observación de que las mejoras no son aditivas y se miden sobre la configuración vigente. | propia |
| `data/resultados/validacion_final.csv` | Origen del umbral 0,0: las preguntas E y D02 tienen el primer score de reranking negativo y todas las preguntas con la fuente en el puesto 1 lo tienen por encima de 1,39. | propia |
| `qdrant-client` 1.20.0 (`uv.lock`) | `Filter`, `FieldCondition` y `MatchAny` para filtrar la búsqueda por payload; índices de payload de tipo keyword. | código de la librería |

## 3. Método

### 3.1 Opciones comparadas

| Configuración | Campo | Filtro | Umbral |
|---|---|---|---|
| 1 sin filtro | — | ninguno | — |
| 2 perfecto `modulo` sin repetición | `modulo` | `modulo` de las fuentes esperadas | `None` |
| 3 perfecto `modulo` con repetición | `modulo` | igual que 2 | 0,0 |
| 4 equivocado `modulo` sin repetición | `modulo` | filtro perfecto de la siguiente pregunta, en orden circular, con un filtro perfecto distinto | `None` |
| 5 equivocado `modulo` con repetición | `modulo` | igual que 4 | 0,0 |
| 6 perfecto `tipo_pagina` sin repetición | `tipo_pagina` | `tipo_pagina` de las fuentes esperadas | `None` |
| 7 perfecto `tipo_pagina` con repetición | `tipo_pagina` | igual que 6 | 0,0 |
| 8 equivocado `tipo_pagina` sin repetición | `tipo_pagina` | `c-api` si el perfecto incluye `library`; `library` en el resto | `None` |
| 9 equivocado `tipo_pagina` con repetición | `tipo_pagina` | igual que 8 | 0,0 |

Con filtro, Qdrant devuelve los 20 candidatos solo entre los chunks que lo cumplen. Con umbral 0,0, si no hay candidatos o ninguno llega a 0,0 en score de reranking, la consulta repite la búsqueda y el reranking sin filtro con el mismo vector. Con umbral `None` no se repite.

Las 10 preguntas cuyas fuentes no tienen `modulo` (`tutorial/`, `whatsnew/`, `builtins/`) van sin filtro en las configuraciones 2 a 5: el filtro por `modulo` se aplica a 22 de 32 preguntas. El filtro por `tipo_pagina` se aplica a las 32.

Los metadatos los calcula [metadatos.py](../scripts/metadatos.py) sin LLM ni red, con las reglas de RF-01 de la issue. Los dos que se filtran:

- `modulo`: el nombre entre comillas invertidas del primer encabezado `# ` del fichero (`` # `logging.config` — … `` → `logging.config`). Si `library/<base>-<resto>.md` no tiene ese encabezado, toma el de `library/<base>.md` (`library/asyncio-task.md` → `asyncio`). Vacío en el resto.
- `tipo_pagina`: la primera carpeta de `fuente` (`library`, `tutorial`, `whatsnew`, `c-api`…).

[anadir_metadatos.py](../scripts/anadir_metadatos.py) los escribió en el payload de la colección sin recalcular vectores, después de crear un snapshot y de comprobar que cada id tiene el mismo `fuente` y `texto` que el troceo actual, y creó índices keyword para `modulo` y `tipo_pagina`.

### 3.2 Datos y preguntas de prueba

- Corpus limpio de Python 3.15 en la colección `pydocs_nomic_est1500_m200_sinruta`: troceo por estructura 1500/200, sin ruta de títulos.
- Las 32 preguntas A-D de [GOLDEN_SET_PYTHON_DOCS.md](GOLDEN_SET_PYTHON_DOCS.md): A 10, B 10, C 9 y D 3.
- Fuente esperada del golden set y evidencias de [golden_set_evidencias.json](golden_set_evidencias.json), con varias evidencias por fuente, como `validar_rag_final.py`. Los filtros perfectos salen de las fuentes esperadas de cada pregunta.

### 3.3 Variables

- Variable que cambia: el campo filtrado, si el filtro es perfecto o equivocado, y si la consulta se repite sin filtro.
- Variables fijas: corpus, troceo, nomic-embed-text, Qdrant, 20 candidatos, reranker MiniLM-L6, k=4, golden set y evidencias. Un solo campo por configuración, porque las decisiones no son aditivas.
- Variables medidas: hit@1, hit@4 y MRR por fuente y por evidencia; preguntas filtradas; repeticiones; latencia total por pregunta.

### 3.4 Métricas y criterio de éxito

| Condición (RF-10) | Configuración | Umbral |
|---|---|---|
| Recomendar el filtro de un campo | perfecto sin repetición | ev_hit@4 ≥ 27/32 y hit@4 ≥ 30/32 |
| Mantener la repetición con umbral 0,0 | equivocado con repetición | ev_hit@4 ≥ 23/32; si baja, se registra como riesgo y el umbral no se ajusta |
| Avisar de la latencia | perfecto con repetición | latencia total media más de un 10 % por encima de sin filtro |

hit@1, MRR y ev_MRR se registran como referencia y no deciden.

### 3.5 Entorno y reproducción

- Python 3.14; Qdrant 1.20.2; `qdrant-client` 1.20.0; `sentence-transformers` 6.2.0; `ollama` 0.6.3; el resto fijado en `uv.lock`.
- Windows 11, reranker en CPU, Qdrant y Ollama en local.
- Carga de metadatos (una vez, antes del notebook): `uv run python scripts/anadir_metadatos.py`.
- Notebook: [notebooks/12_comparar_filtros_metadatos.ipynb](../notebooks/12_comparar_filtros_metadatos.ipynb). Una ejecución, con una consulta de calentamiento que no se mide; las nueve configuraciones se miden en orden.
- Comprobación previa: la configuración sin filtro reproduce `validacion_final.csv` pregunta a pregunta (rango de fuente y de evidencia) con 0 diferencias, 30/32 fuentes y 26/32 evidencias. Añadir el payload y los índices no cambió el orden de los candidatos sin filtro.

## 4. Resultados

**Tabla 1. Métricas globales sobre 32 preguntas A-D.** Entre paréntesis, preguntas acertadas.

| Configuración | Filtradas | Repeticiones | hit@1 | hit@4 | MRR | ev_hit@1 | ev_hit@4 | ev_MRR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 sin filtro | 0 | 0 | 0,688 (22) | 0,938 (30) | 0,797 | 0,438 (14) | 0,813 (26) | 0,604 |
| 2 perfecto `modulo` sin repetición | 22 | 0 | **0,875 (28)** | **1,000 (32)** | **0,938** | 0,563 (18) | **0,906 (29)** | **0,711** |
| 3 perfecto `modulo` con repetición | 22 | 1 | 0,844 (27) | 0,969 (31) | 0,906 | 0,563 (18) | 0,875 (28) | 0,701 |
| 4 equivocado `modulo` sin repetición | 22 | 0 | 0,188 (6) | 0,313 (10) | 0,250 | 0,094 (3) | 0,313 (10) | 0,198 |
| 5 equivocado `modulo` con repetición | 22 | 20 | 0,656 (21) | 0,906 (29) | 0,766 | 0,438 (14) | 0,813 (26) | 0,604 |
| 6 perfecto `tipo_pagina` sin repetición | 32 | 0 | 0,844 (27) | 0,938 (30) | 0,880 | **0,594 (19)** | 0,813 (26) | 0,688 |
| 7 perfecto `tipo_pagina` con repetición | 32 | 1 | 0,844 (27) | 0,938 (30) | 0,880 | 0,594 (19) | 0,813 (26) | 0,688 |
| 8 equivocado `tipo_pagina` sin repetición | 32 | 0 | 0,000 (0) | 0,000 (0) | 0,000 | 0,000 (0) | 0,000 (0) | 0,000 |
| 9 equivocado `tipo_pagina` con repetición | 32 | 21 | 0,500 (16) | 0,594 (19) | 0,531 | 0,313 (10) | 0,469 (15) | 0,375 |

**Tabla 2. ev_hit@4 por categoría, aciertos / preguntas.**

| Configuración | A / 10 | B / 10 | C / 9 | D / 3 |
|---|---:|---:|---:|---:|
| 1 sin filtro | 9 | 8 | 8 | 1 |
| 2 perfecto `modulo` sin repetición | 10 | 9 | 8 | 2 |
| 3 perfecto `modulo` con repetición | 10 | 9 | 8 | 1 |
| 6 y 7 perfecto `tipo_pagina` | 9 | 8 | 8 | 1 |

**Tabla 3. Preguntas que cambian con el filtro perfecto por `modulo`.** Rango del primer chunk de la fuente correcta / del primer chunk con evidencia; «—» si no aparece en el top 4.

| Pregunta | Filtro | Sin filtro | Perfecto sin repetición | Perfecto con repetición |
|---|---|---|---|---|
| A01 | `http.client` | — / — | 1 / 1 | 1 / 1 |
| A02 | `urllib.request` | 3 / 3 | 1 / 1 | 1 / 1 |
| A03 | `pathlib` | 3 / 3 | 1 / 1 | 1 / 1 |
| B01 | `http` | 1 / — | 1 / 4 | 1 / 4 |
| B08 | `logging` | 3 / — | 1 / — | 1 / — |
| C02 | `threading` | 2 / 2 | 1 / 1 | 1 / 1 |
| D02 | `http.client`, `pathlib` | — / — | 1 / 3 | — / — (repetida sin filtro) |

Las otras 15 preguntas filtradas no cambian de rango. C01 y D03 siguen sin evidencia con el filtro, igual que B08. En la configuración 3, D02 es la única repetición: ningún candidato filtrado llegó a 0,0 en score de reranking, la consulta se repitió sin filtro y perdió la fuente y la evidencia que el filtro había traído.

**Tabla 4. Preguntas que cambian con el filtro perfecto por `tipo_pagina` (configuraciones 6 y 7).**

| Pregunta | Filtro | Sin filtro | Perfecto |
|---|---|---|---|
| A02 | `library` | 3 / 3 | 1 / 1 |
| B04 | `whatsnew` | 2 / 2 | 1 / 1 |
| B05 | `whatsnew` | 2 / 2 | 1 / 1 |
| B06 | `whatsnew` | 1 / 2 | 1 / 3 |
| B10 | `library` | 1 / 1 | 2 / 2 |
| C02 | `library` | 2 / 2 | 1 / 1 |
| C05 | `tutorial` | 2 / 2 | 1 / 1 |
| C07 | `whatsnew` | 1 / 3 | 1 / 2 |
| C08 | `whatsnew` | 2 / 2 | 1 / 1 |

El filtro mejora la posición en siete preguntas y la empeora en dos (B06 y B10), pero ninguna entra ni sale del top 4. En la configuración 7, la única repetición es D02 (`library`), que ya fallaba sin filtro.

**Filtros equivocados.**

- `modulo` sin repetición: ninguna de las 22 preguntas filtradas recupera la fuente; los 10 aciertos son las 10 preguntas que van sin filtro.
- `modulo` con repetición: 20 de las 22 consultas filtradas se repiten sin filtro. Las dos que pasan el umbral son A01 (`urllib.request`), que ya fallaba sin filtro, y C01 (`threading`), que pierde la fuente que tenía en el puesto 1. Resultado: 29 fuentes y 26 evidencias.
- `tipo_pagina` sin repetición: ninguna pregunta recupera la fuente.
- `tipo_pagina` con repetición: 21 de 32 se repiten. Las 11 que pasan el umbral pierden fuente y evidencia: con `library`, A09, B04, B05, C04, C05, C07, C08 y C09 (fuentes en `tutorial/` o `whatsnew/`); con `c-api`, C02, C03 y D01.

**Tabla 5. Latencia total media por pregunta (ms), Windows 11 con reranker en CPU.**

| Configuración | Latencia media (ms) | Frente a sin filtro |
|---|---:|---:|
| 1 sin filtro | 1 018,8 | referencia |
| 2 perfecto `modulo` sin repetición | 892,8 | −12,4 % |
| 3 perfecto `modulo` con repetición | 900,5 | −11,6 % |
| 4 equivocado `modulo` sin repetición | 874,0 | −14,2 % |
| 5 equivocado `modulo` con repetición | 1 459,3 | +43,2 % |
| 6 perfecto `tipo_pagina` sin repetición | 1 004,2 | −1,4 % |
| 7 perfecto `tipo_pagina` con repetición | 1 033,0 | +1,4 % |
| 8 equivocado `tipo_pagina` sin repetición | 957,0 | −6,1 % |
| 9 equivocado `tipo_pagina` con repetición | 1 576,8 | +54,8 % |

Una repetición incluye una segunda búsqueda y un segundo reranking, por eso suben las configuraciones 5 y 9.

**Tabla 6. Criterio de RF-10 aplicado** (celda 11 del notebook).

| Campo | Perfecto sin repetición: ev_hit@4 (mín. 27) | hit@4 (mín. 30) | Recomendar filtro | Equivocado con repetición: ev_hit@4 (mín. 23) | Mantener repetición | Latencia perfecto con repetición | Aviso (> 10 %) |
|---|---:|---:|---|---:|---|---:|---|
| `modulo` | 29 | 32 | sí | 26 | sí | −11,6 % | no |
| `tipo_pagina` | 26 | 30 | no | 15 | no | +1,4 % | no |

## 5. Discusión

- **Qué significan los resultados:** el filtro por `modulo` corrige las confusiones entre módulos que motivaron la issue: A01 y A02 pasan al puesto 1 y B08 sube la fuente de 3 a 1. B08 sigue sin la evidencia: el filtro trae la página de `logging`, pero no el chunk que dice «the root logger is created with level WARNING». El filtro por `tipo_pagina` ordena mejor (hit@1 de 22 a 27 y ev_hit@1 de 14 a 19) pero no añade aciertos en el top 4. En 22 de 32 preguntas el filtro es `library`.
- **Frente a la hipótesis:** se confirma para `modulo` (29 evidencias, 32 fuentes, y 26 evidencias con filtro equivocado y repetición). Se refuta para `tipo_pagina` (26 evidencias con filtro perfecto y 15 con filtro equivocado y repetición).
- **La repetición:** con `modulo`, protege bien frente al filtro equivocado (20 de 22 se repiten) y cuesta una pregunta con el filtro perfecto (D02). Con `tipo_pagina` no protege: 8 de las 11 consultas que no se repiten llevan `library` y su fuente esperada está en `tutorial/` o `whatsnew/`; algún chunk de `library/` llega a 0,0 en score de reranking y la consulta se queda con el resultado filtrado.
- **Latencia:** las consultas filtradas sin repetición fueron más rápidas que sin filtro en esta ejecución; no se interpreta como ventaja estable porque fue una sola ejecución y las configuraciones se midieron en orden. La configuración sin filtro dio 1 018,8 ms frente a 918,3 ms de la validación final, otra ejecución también en Windows con el reranker en CPU.
- **Limitaciones y amenazas a la validez:**
  - El filtro «perfecto» sale de la fuente esperada del golden set. Mide el techo con un agente que siempre acierta el módulo. El efecto real depende de que el agente acierte el módulo por sus `import`, y eso no se ha medido.
  - El filtro equivocado es una regla sintética (el módulo de otra pregunta, o `c-api`/`library`), no los errores que cometería un agente real.
  - El filtro por `modulo` solo se aplica a 22 de 32 preguntas; las 10 restantes no tienen módulo en su fuente.
  - 32 preguntas y una sola ejecución: una pregunta cambia una proporción en 0,031.
  - El umbral 0,0 sale de `validacion_final.csv` y no se ajustó con estos resultados. D02 muestra que puede descartar un resultado filtrado correcto.
  - Las preguntas del golden set están escritas para una persona, no al estilo de un agente.
- **Crecimiento del corpus:** con más páginas por módulo o más módulos con nombres parecidos, el filtro por `modulo` restringe más y su efecto puede crecer; el criterio se repite si cambia el corpus.

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | El agente pasa `filtros={"modulo": [...]}` con los módulos que conoce por sus `import`, con el umbral por defecto (`UMBRAL_REPETICION = 0.0`). No pasa `tipo_pagina`. |
| Motivo principal | Con `modulo` perfecto sin repetición, 29/32 evidencias y 32/32 fuentes (criterio: 27 y 30). Con `modulo` equivocado y repetición, 26/32 evidencias (criterio: 23). |
| Alternativas descartadas | Filtro por `tipo_pagina`: con filtro perfecto se queda en 26/32 evidencias, por debajo de 27. `modulo` sin repetición: un módulo equivocado deja 10/32 fuentes. |
| Coste o riesgo asumido | Con repetición, el filtro perfecto por `modulo` queda en 31/32 fuentes y 28/32 evidencias: la repetición pierde D02. La repetición con `tipo_pagina` no cumple su criterio (15 < 23): si el agente pasa `tipo_pagina` y se equivoca, 11 de 32 preguntas pierden la fuente. |
| Cuándo se revisa | Cuando se evalúe con un agente real que elija los filtros, crezca el golden set con preguntas al estilo de un agente, cambie el corpus, el reranker o el umbral, o se mida un filtro por otro metadato. |

## 7. Impacto en el workflow

- El paso «el agente consulta el RAG» acepta `filtros` y `umbral` ([consultar_rag.py](../scripts/consultar_rag.py)). El agente pasa `modulo` cuando conoce el módulo; si la pregunta no es de un módulo concreto, consulta sin filtros, que hace la misma llamada a Qdrant que antes.
- Cada chunk devuelto lleva los seis metadatos y `filtrado`. `filtrado` falso en una consulta con filtro indica que se repitió sin filtro.
- La colección necesita los metadatos en el payload: `ConsultorRAG.local()` para si faltan y pide ejecutar `uv run python scripts/anadir_metadatos.py`.
- La interfaz completa está en la sección 5 de [COMPARATIVA_RAG_CONSOLIDADA.md](COMPARATIVA_RAG_CONSOLIDADA.md).

## 8. Referencias

1. Issue #26. (2026). _Add chunk metadata and optional filters to the RAG query_. GitHub. https://github.com/maria-osi/rag-neoland/issues/26 (consultado el 2026-11-17).

## Anexos

- Notebook: [notebooks/12_comparar_filtros_metadatos.ipynb](../notebooks/12_comparar_filtros_metadatos.ipynb)
- Datos brutos: `data/resultados/filtros_metadatos.csv` (resumen) y `data/resultados/filtros_metadatos_por_pregunta.csv` (por pregunta)
- Cálculo de metadatos: [scripts/metadatos.py](../scripts/metadatos.py); carga en Qdrant: [scripts/anadir_metadatos.py](../scripts/anadir_metadatos.py)
- Referencia sin filtro: `data/resultados/validacion_final.csv`

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
