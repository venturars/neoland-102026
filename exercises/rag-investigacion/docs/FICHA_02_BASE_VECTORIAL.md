# Ficha de investigación: base de datos vectorial

> Ficha de la pregunta 2 de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md). Compara Qdrant y Chroma como servidores con la configuración ganadora del proyecto. Issue [#18](https://github.com/maria-osi/rag-neoland/issues/18).

| Campo | Valor |
|---|---|
| Autores | Maria |
| Fecha | 2026-11-17 |
| Versión | v1 |
| Estado | cerrada |
| Pregunta nº | 2 |

## Resumen

Se compararon Qdrant 1.20.2 y Chroma 1.5.9 como servidores HTTP para decidir qué base soporta mejor varios agentes concurrentes. Ambas recibieron los mismos 7 955 vectores nomic y ejecutaron 640 búsquedas calientes por ronda, tres rondas, con 1, 4 y 8 clientes asíncronos independientes. No hubo errores y el primer resultado coincidió en el 100 % de las 32 queries; el solape medio del top 20 fue 99,2 %. Con un cliente Chroma fue más rápido, pero con ocho Qdrant alcanzó una mediana de 728,8 consultas/s frente a 607,6 (+19,9 %) y una p50 de 10,1 ms frente a 12,9. La p95 fue equivalente: 15,5 ms en Qdrant y 14,8 en Chroma. Se elige Qdrant porque el requisito decisivo es el acceso concurrente, escala mejor en este benchmark y ya funciona como servicio Docker independiente en el proyecto. Chroma sigue siendo una alternativa válida para desarrollo local.

## 1. Introducción

### 1.1 Contexto y motivación

Varios agentes consultarán el índice de forma asíncrona y en paralelo. La base debe responder a clientes independientes sin que cada agente abra directamente el fichero de almacenamiento. El corpus crece de forma controlada, por lo que importa más la estabilidad y el comportamiento concurrente que el escalado a millones de documentos.

### 1.2 Pregunta de investigación

¿Qdrant o Chroma ofrece el mejor comportamiento para múltiples agentes que consultan simultáneamente el mismo índice RAG?

### 1.3 Hipótesis

Qdrant soportará mejor ocho clientes concurrentes por su arquitectura cliente-servidor. Chroma será competitivo con pocos clientes. Cualquier error concurrente pesa más que una diferencia pequeña de velocidad; diferencias inferiores al 10 % no se consideran decisivas.

### 1.4 Alcance y exclusiones

- **Entra:** lectura asíncrona sobre Qdrant y Chroma como servidores locales, 1/4/8 clientes, latencia, throughput, errores y equivalencia de resultados.
- **No entra:** escritura concurrente, replicación, alta disponibilidad, despliegue en red, autenticación, costes cloud, backups ni volúmenes superiores a 7 955 puntos.

## 2. Estado de la cuestión

| Fuente | Qué aporta | Fiabilidad |
|---|---|---|
| Qdrant, Async API (ref. 1) | Recomienda `AsyncQdrantClient` para servicios con usuarios simultáneos y expone la misma API que el cliente síncrono. | oficial |
| Qdrant, Architecture Overview (ref. 2) | Qdrant usa arquitectura cliente-servidor y expone HTTP y gRPC. | oficial |
| Chroma, Python Client (ref. 3) | `PersistentClient` se orienta a desarrollo local; `AsyncHttpClient` conecta varios clientes a un servidor y es la configuración recomendada para producción. | oficial |
| Chroma, Architecture Overview (ref. 4) | Distingue despliegue embebido, servidor de un nodo y distribuido. | oficial |

## 3. Método

### 3.1 Opciones comparadas

| Opción | Servidor | Cliente | Puerto |
|---|---|---|---|
| Qdrant | `qdrant/qdrant:v1.20.2`, Docker | `AsyncQdrantClient` 1.20.0 | 6333 |
| Chroma | `chroma run`, versión 1.5.9 | `AsyncHttpClient` | 8000 |

### 3.2 Datos y carga

- Misma colección lógica: `pydocs_nomic_est1500_m200_sinruta`.
- 7 955 chunks y los mismos vectores nomic de 768 dimensiones. Los vectores se copiaron de Qdrant a Chroma sin volver a calcularlos.
- 32 queries A-D del golden set. Sus embeddings se calcularon antes del cronómetro.
- Cada query se repitió 20 veces: 640 lecturas por ronda.
- Tres rondas por base y nivel de concurrencia, con orden alternado y carga barajada con semilla 42.
- Cada worker usó un cliente independiente. Hubo una consulta de calentamiento por cliente.
- `k=20`, igual que el paso real previo al reranking.

### 3.3 Métricas y criterio

| Métrica | Uso en la decisión |
|---|---|
| Errores y tasa de error | Un error repetido descarta la opción. |
| Throughput | Primaria con 8 workers; consultas correctas por segundo. |
| p50, p95 y p99 | Latencia por petición; diferencias menores al 10 % no se interpretan como victoria. |
| Top 1 igual y solape top 20 | Comprueba que se comparan resultados equivalentes. |

### 3.4 Reproducción

```bash
uv run python scripts/comparar_bases_vectoriales.py preparar
uv run chroma run --path notebooks/chroma_db --host 127.0.0.1 --port 8000
uv run python scripts/comparar_bases_vectoriales.py medir
```

Los datos brutos están en `data/resultados/bases_vectoriales.csv`.

## 4. Resultados

**Mediana de tres rondas. Cada ronda contiene 640 búsquedas.**

| Workers | Base | Errores | Throughput (consultas/s) | p50 (ms) | p95 (ms) |
|---:|---|---:|---:|---:|---:|
| 1 | Qdrant | 0 | 354,8 | 2,60 | 4,02 |
| 1 | Chroma | 0 | **408,8** | **2,36** | **3,12** |
| 4 | Qdrant | 0 | **587,0** | **6,35** | **8,61** |
| 4 | Chroma | 0 | 539,6 | 7,05 | 9,75 |
| 8 | Qdrant | 0 | **728,8** | **10,06** | 15,52 |
| 8 | Chroma | 0 | 607,6 | 12,87 | **14,80** |

- Qdrant aumenta su throughput un 105 % entre 1 y 8 workers; Chroma, un 49 %.
- Con 8 workers, Qdrant procesa un 19,9 % más consultas por segundo.
- La p95 con 8 workers difiere un 4,9 %, por debajo del umbral del 10 %: se considera equivalente.
- El top 1 coincide en las 32 queries. El solape medio de los 20 resultados es 0,992.
- No hubo errores en 11 520 consultas medidas en total: 640 × 3 rondas × 3 niveles de concurrencia × 2 bases.

## 5. Discusión

- **Hipótesis:** se confirma parcialmente. Qdrant escala mejor con 4 y 8 clientes, pero Chroma también fue estable y fue más rápido con uno.
- **Requisito decisivo:** el proyecto necesita varios agentes. La ventaja de throughput de Qdrant aparece precisamente en 8 clientes; no se elige por la latencia p95, que fue equivalente.
- **Calidad:** las pequeñas diferencias de orden se deben a implementaciones o parámetros del índice; top 1 fue idéntico y el solape top 20, 99,2 %. Las fichas de calidad no dependen de elegir una u otra.
- **Operación:** Qdrant ya está desplegado en Docker, separado del proceso del agente, y ofrece HTTP/gRPC. Chroma también se probó como servidor, no como `PersistentClient`, por lo que la comparación de concurrencia no favorece artificialmente a un acceso embebido.
- **Limitaciones:** una máquina, lectura en caliente, sin escrituras, fallos, red externa ni réplicas. Qdrant puede usar escaneo completo por el tamaño reducido de la colección, mientras Chroma usa HNSW; no se atribuye la diferencia a un único componente. Tres rondas no bastan para generalizar a producción.

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | **Qdrant**, desplegado como servidor Docker. |
| Motivo principal | Con 8 agentes alcanzó 728,8 consultas/s frente a 607,6 de Chroma (+19,9 %), sin errores y con p95 equivalente. |
| Alternativa descartada | Chroma servidor: estable y más rápido con un cliente, pero escala menos en esta carga concurrente. Sigue siendo válido para prototipos. |
| Coste asumido | Mantener un servicio Docker separado; más operación que un cliente embebido. |
| Cuándo revisar | Si el despliegue deja de usar Docker, aparecen escrituras concurrentes, el corpus crece mucho o Chroma ofrece una ventaja operativa relevante. |

## 7. Impacto en el workflow

- Los agentes consultan Qdrant por HTTP con clientes independientes.
- La colección de producción es `pydocs_nomic_est1500_m200_sinruta`.
- Para código asíncrono se usa `AsyncQdrantClient`; el módulo síncrono `consultar_rag.py` sirve como paso reutilizable y CLI local.
- Chroma queda como herramienta de comparación y desarrollo, no como base del workflow.

## 8. Referencias

1. Qdrant. (s. f.). _Async API_. https://qdrant.tech/documentation/tutorials-develop/async-api/ (consultado el 2026-11-17).
2. Qdrant. (s. f.). _Overview_. https://qdrant.tech/documentation/overview/ (consultado el 2026-11-17).
3. Chroma. (s. f.). _Python Client_. https://docs.trychroma.com/reference/python (consultado el 2026-11-17).
4. Chroma. (s. f.). _Architecture Overview_. https://docs.trychroma.com/docs/overview/architecture (consultado el 2026-11-17).

## Anexos

- Script: [scripts/comparar_bases_vectoriales.py](../scripts/comparar_bases_vectoriales.py)
- Datos: `data/resultados/bases_vectoriales.csv`
- Índice Chroma local: `notebooks/chroma_db/` (ignorado por Git).
