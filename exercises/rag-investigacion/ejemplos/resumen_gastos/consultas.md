# Consultas al RAG para `resumen_gastos.py`

Consultas hechas con `uv run python scripts/consultar_rag.py` siguiendo la skill `consultar-docs-python`. Versión del proyecto: Python 3.14 (`.python-version`); el corpus es de 3.15.

| # | Pregunta exacta | Filtros | Fuente del 1.er fragmento | score_reranking | ¿Reformulada? | Decisión en el código |
|---|---|---|---|---|---|---|
| 1 | `How do I read a CSV file into dictionaries with DictReader?` | `--modulo csv` | `library/csv.md` › Module contents (`csv.DictReader`) | 5.28 | No | Usar `csv.DictReader` sin `fieldnames`: la primera fila da los nombres de columna. Una fila con menos campos recibe `None` (`restval`), así que capturo también `TypeError`. Uso `lector.line_num` (fragmento 2, Reader objects) en el aviso. |
| 2 | `Why should a CSV file be opened with newline=''?` | `--modulo csv` | `library/csv.md` › Module contents (`csv.reader`) | 5.48 | No | Abrir el CSV con `newline=""`. La nota [1] explica que sin él se interpretan mal los saltos de línea dentro de campos entre comillas. |
| 3 | `What exception does float() raise when the string is not a valid number?` | ninguno | `library/re.md` › Exceptions (`re.PatternError`) | 4.17 | Sí: el 1.er fragmento no hablaba de `float()` | Nada: se descartó y se reformuló (fila 4). |
| 4 | `float() built-in function: convert a string to a floating-point number, ValueError` | ninguno | `faq/programming.md` › How do I convert a string to a number? | 6.55 | Es la reformulación de la 3 | Convertir con `float()` y capturar `ValueError`. El 3.er fragmento (`builtins/functions.md`, `float`) da la gramática: no admite coma decimal (`"76,80"` falla), pero sí `"nan"` e `"inf"`. Esto último queda como limitación conocida, no se pidió validarlo. |
| 5 | `json.dump indent and ensure_ascii parameters` | `--modulo json` | `library/json.md` › Basic Usage (`json.dumps`) | 6.62 | No (el 2.º fragmento es `json.dump`, el que necesitaba) | `json.dump(resumen, fichero, indent=2, ensure_ascii=False)`: sangría legible y tildes sin escapar. El fichero se escribe en modo texto porque `fp.write()` debe aceptar `str`. |
| 6 | `max() with key argument returns the largest item` | ninguno | `builtins/functions.md` › Built-in functions (`max`) | 9.00 | No | `max(gastos, key=lambda g: g["importe"], default=None)`: `default` evita el `ValueError` con lista vacía. Si hay empate, devuelve el primero. |
| 7 | `dict.get with default value` | ninguno | `library/collections.md` › defaultdict objects | 4.85 | Sí: salió `defaultdict`, no `dict.get` | Nada: se reformuló (fila 8). |
| 8 | `dict.get(key, default)` | `--modulo stdtypes` | `library/collections.md` › defaultdict objects | 4.26 | Es la reformulación de la 7; el 1.er fragmento tampoco era `dict.get` | `por_categoria.get(categoria, 0.0) + importe`, a partir del 2.º fragmento (`tutorial/datastructures.md` › 5.5 Dictionaries, score 3.0). Se descartó `defaultdict` para mantener el código más básico. |
| 9 | `open() encoding parameter default is platform dependent` | ninguno | `library/io.md` › Text encoding › Opt-in EncodingWarning | 3.47 | No | Indicar la codificación siempre. El 3.er fragmento (`io.md` › Text encoding) dice que UTF-8 es el defecto **desde 3.15** (PEP 686); el proyecto usa 3.14, así que en Windows el defecto sería cp1252. |
| 10 | `utf-8-sig codec skips the BOM when decoding` | `--modulo codecs` | `library/codecs.md` › Encodings and Unicode | 9.26 | No | Leer el CSV con `encoding="utf-8-sig"`, que se salta un BOM opcional. Surgió al probar: un CSV con BOM (PowerShell 5.1, Excel) daba `KeyError: 'fecha'`. El JSON se escribe en `utf-8` sin BOM, porque la documentación desaconseja el BOM en UTF-8. |

Notas:

- El campo `filtrado` fue `true` en todas las consultas con `--modulo`. En la 8, `stdtypes` no se aplicó como filtro de módulo: los resultados son los mismos que sin filtro y `filtrado` sale `false`. Probablemente `dict` no tiene ese valor de módulo en los metadatos.
- La salida JSON del script de consulta sale en cp1252 en Windows; hay que leerla con `encoding="cp1252"`, no con UTF-8.

## Valoración de la skill

**Pasos que sirvieron**

- **Paso 1, una pregunta por decisión:** cada consulta se ajustó a una sola API y casi todas acertaron a la primera.
- **Paso 2, `--modulo`:** con `csv`, `json` y `codecs` el primer fragmento era justo la API buscada y tenía score alto (5–9).
- **Paso 3, comprobar el 1.er fragmento y reformular:** fue clave dos veces. La pregunta genérica sobre `float()` devolvió `re.PatternError` con score 4.17, por encima de 3, que la skill da por «suele responder». Sin este paso lo habría aceptado.
- **Paso 6, versión:** el más valioso. El fragmento de `io` dice que UTF-8 es el defecto en 3.15, y el proyecto usa 3.14. Fiarse del corpus sin mirar la versión habría dejado un error en Windows.
- **Paso 8, ejecutar:** encontró el problema del BOM, que ninguna consulta previa anticipaba.
- **Leer el fragmento entero:** las piezas útiles estaban al final (nota [1] de `csv`, `restval=None`, `default` y empates de `max`, `nan`/`inf` en `float`).

**Pasos que no aplicaban**

- **Paso 4, restricciones de sintaxis:** no se usó sintaxis con reglas propias.
- **Paso 5, APIs anidadas:** no hay hilos, executors ni asyncio.

**Qué fue confuso o faltaba**

- El umbral «por encima de 3 suele responder» engaña en preguntas genéricas: el fragmento de `re` (4.17) y el de `defaultdict` (4.85) superaban el umbral sin responder a la pregunta. Convendría decir que el score mide parecido, no acierto, y que el paso 3 manda sobre él.
- No dice qué valor de `--modulo` usar para tipos integrados (`dict`, `float`, `max`), que están en `builtins/stdtypes.md` y `builtins/functions.md`. `--modulo stdtypes` no filtró nada. Faltaría una línea con el valor correcto o el consejo de no filtrar en esos casos.
- No avisa de que en Windows la salida JSON sale en cp1252: al leerla con UTF-8 falla con `UnicodeDecodeError`.
- No menciona `ollama stop nomic-embed-text` para descargar el modelo al terminar.
