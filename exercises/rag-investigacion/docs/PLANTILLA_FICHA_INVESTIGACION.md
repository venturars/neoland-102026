# Ficha de investigación: [título de la pregunta]

> Plantilla basada en la estructura IMRaD (Introducción, Métodos, Resultados y Discusión), que es la habitual en artículos y trabajos universitarios. Se rellena una ficha por pregunta de [TAREA_RAG_A_TEMPO.md](TAREA_RAG_A_TEMPO.md). Borra las instrucciones en cursiva al rellenar.

| Campo | Valor |
|---|---|
| Autores | _nombres_ |
| Fecha | _AAAA-MM-DD_ |
| Versión | _v1_ |
| Estado | _borrador / en revisión / cerrada_ |
| Pregunta nº | _1–6_ |

## Resumen (máx. 150 palabras)

_Se escribe al final. Cuatro frases: qué se preguntó, cómo se probó, qué se encontró, qué se decide. Quien solo lea esto debe entender la decisión._

## 1. Introducción

### 1.1 Contexto y motivación

_Por qué importa esta pregunta para nuestro RAG. Recuerda la premisa: crecimiento controlado, información limitada._

### 1.2 Pregunta de investigación

_Una sola frase, formulada como pregunta y comprobable. Ejemplo: «¿Qué tamaño de chunk maximiza la proporción de preguntas respondidas correctamente?»_

### 1.3 Hipótesis

_Qué esperas encontrar y por qué. Debe poder refutarse con los datos. Escríbela antes de hacer las pruebas._

### 1.4 Alcance y exclusiones

_Qué entra y qué no entra en esta ficha._

## 2. Estado de la cuestión

_Qué dicen la documentación oficial, artículos y otras fuentes sobre el tema. Cita cada afirmación que no sea tuya (ver sección 8). Distingue lo que viene de una fuente de lo que es opinión del equipo._

| Fuente | Qué aporta | Fiabilidad (oficial / blog / paper) |
|---|---|---|
| | | |

## 3. Método

_Debe ser tan claro que otra persona pueda repetir la prueba y obtener lo mismo (reproducibilidad)._

### 3.1 Opciones comparadas

| Opción | Descripción | Versión / configuración |
|---|---|---|
| A | | |
| B | | |

### 3.2 Datos y preguntas de prueba

- Documentos usados: _cuáles, cuántos, tamaño_
- Conjunto de preguntas: _cuántas, de qué tipo, cómo se eligieron_
- Respuesta esperada de cada pregunta: _quién la definió y cómo_

### 3.3 Variables

- Variable que se cambia: _p. ej. tamaño de chunk_
- Variables que se mantienen fijas (control): _modelo de embeddings, k, prompt, documentos, semilla_
- Variable que se mide: _p. ej. acierto, latencia_

### 3.4 Métricas y criterio de éxito

| Métrica | Cómo se calcula | Umbral para aceptar la opción |
|---|---|---|
| | | |

_Define el umbral antes de ver los resultados, para no ajustarlo a lo que salga._

### 3.5 Entorno y reproducción

- Versión de Python y librerías: _salen de `pyproject.toml` y `uv.lock`_
- Comando o notebook para repetir la prueba: _ruta_
- Repeticiones y manejo de aleatoriedad: _cuántas veces, qué semilla_

## 4. Resultados

_Solo hechos y números, sin interpretar. Cada tabla o gráfico lleva título y unidades._

| Opción | Métrica 1 | Métrica 2 | Latencia (ms) |
|---|---|---|---|
| A | | | |
| B | | | |

_Incluye también los resultados que no confirman la hipótesis. Anota fallos concretos (pregunta, respuesta obtenida, motivo probable)._

## 5. Discusión

- **Qué significan los resultados:** _interpretación_
- **Frente a la hipótesis:** _se confirma / se refuta / parcialmente_
- **Explicaciones alternativas:** _qué más podría explicar lo observado_
- **Limitaciones y amenazas a la validez:** _tamaño de la muestra, sesgo en las preguntas, un solo dominio de documentos, una sola ejecución_
- **Qué cambiaría si el volumen de datos creciera:** _relación con la premisa de crecimiento controlado_

## 6. Conclusión y decisión

| Campo | Contenido |
|---|---|
| Decisión | _opción elegida_ |
| Motivo principal | _una frase con el dato que la sostiene_ |
| Alternativas descartadas | _y por qué_ |
| Coste o riesgo asumido | |
| Cuándo se revisa | _condición que obligaría a reconsiderar_ |

## 7. Impacto en el workflow

_Qué cambia en el paso «el agente consulta el RAG» por esta decisión: configuración, parámetros, dependencias._

## 8. Referencias

_Formato APA 7. Una línea por fuente, con enlace y fecha de consulta._

1. Autor/organización. (Año). _Título_. Sitio. URL (consultado el AAAA-MM-DD).

## Anexos

- Código o notebook: _ruta_
- Datos brutos: _ruta_
- Capturas o logs: _ruta_

---

## Lista de comprobación antes de exponer

- [ ] La pregunta está formulada en una frase y se puede responder con datos.
- [ ] La hipótesis y el umbral de éxito se escribieron antes de probar.
- [ ] Solo cambia una variable a la vez; el resto está fijo.
- [ ] Otra persona puede repetir la prueba con la sección 3.
- [ ] Los resultados incluyen lo que no salió como se esperaba.
- [ ] La conclusión no afirma más de lo que muestran los datos.
- [ ] Las limitaciones están dichas con claridad.
- [ ] Toda afirmación externa tiene su referencia.
- [ ] El resumen se entiende sin leer el resto.

## Guion para la exposición (10 minutos)

| Minuto | Contenido | Ficha |
|---|---|---|
| 0–1 | Contexto, premisa de crecimiento controlado, objetivo | Intro |
| 1–2 | Pregunta e hipótesis | 1.2–1.3 |
| 2–4 | Cómo se probó: opciones, datos, métrica | 3 |
| 4–7 | Resultados clave, un gráfico o tabla por idea | 4 |
| 7–9 | Decisión, limitaciones, impacto en el workflow | 5–7 |
| 9–10 | Preguntas | |
