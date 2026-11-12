# Plan técnico 007 · Informe al descargar la lista de asistencia

> Estado: **Aprobado** (2026-10-28) · Spec: [spec.md](spec.md) · Creado: 2026-10-28 · Issue: [#324](https://github.com/venturars/neoland-102026/issues/324)

Este documento explica **cómo** cumplimos la spec 007 sustituyendo la exportación CSV mínima por un **informe `.xlsx`**, siguiendo [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

---

## 1. Visión general

### 1.1 Flujo actual → objetivo

```
GET /api/sessions/<id>/export
  → attendance.export_csv(path, id) → to_csv(rows) → text/csv
  → Content-Disposition: asistencia-{day}-{session_id}.csv
```

```
GET /api/sessions/<id>/export   (misma ruta; mismo botón «Descargar lista»)
  → attendance.export_report(path, id) → to_xlsx(session, rows, tz)
  → bytes .xlsx + nombre derivado del título y fecha de apertura
  → Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  → Content-Disposition: attachment; filename="Asistencia … - 2026-10-24.xlsx"
```

El panel (`static/profesor.js`) ya descarga vía `blob` + `Content-Disposition`; **no hace falta** cambiar la URL. Solo actualizar el fallback local del nombre si falla la cabecera (`.xlsx` en lugar de `.csv`).

### 1.2 Capas tocadas

| Pieza | Capa | Ubicación |
| --- | --- | --- |
| Texto del encabezado, nombre de archivo seguro, generación `.xlsx` | Utilidad | `asistencia/export.py` (reemplaza `to_csv`; módulo sigue llamándose `export.py`) |
| Orquestación (cargar sesión + check-ins) | Casos de uso | `usecases/attendance.py` (`export_report`; retirar o alias interno de `export_csv`) |
| Respuesta HTTP binaria | Borde | `app.py` (`export_route`) |
| Tests unitarios del informe | Tests | `tests/test_export.py` |
| Tests de API | Tests | `tests/test_api.py` (mimetype, `Content-Disposition`, contenido mínimo) |
| Uso y formato | Docs | `README.md`, `docs/ARCHITECTURE.md` (§2–§3: export = informe xlsx) |

**Sin cambios** en `domain/`, `storage/`, esquema SQLite ni pantallas HTML (salvo comentario en JS si se renombra la función `downloadCsv` por claridad).

---

## 2. Contenido del informe (layout)

Una hoja (`Sheet1` o nombre corto `Asistencia`):

| Fila | Contenido | Notas |
| --- | --- | --- |
| 1 | `Asistencia {title} - {opened_date}` | `opened_date` = primeros 10 caracteres de `opened_at` (`AAAA-MM-DD`). CA-01, CA-04, CA-15 |
| 2 | `Total de asistentes: {n}` | `n = len(rows)`; CA-05, CA-08 |
| 3 | *(vacía)* | Separación visual |
| 4 | Cabeceras: `#`, `Nombre`, `Fecha`, `Hora` | CA-06 |
| 5+ | Una fila por check-in, orden `checked_at` (igual que hoy) | `#` = 1..n |

**Fecha y hora por fila:** partir el instante `checked_at` (ISO UTC) en zona horaria local del servidor (misma regla que `_local_time` actual):

- Columna **Fecha:** `AAAA-MM-DD`
- Columna **Hora:** `HH:MM:SS` (24 h)

Así el título usa fecha de **apertura** de sesión; cada fila usa fecha/hora de **registro** (CA-06).

**Estilo mínimo (P2):** negrita en fila 1 y en cabeceras de tabla; sin colores ni logos (fuera de alcance spec).

---

## 3. Nombre del archivo (CA-02, CA-03, CA-15)

Función pura `report_heading(title: str, opened_date: str) -> str`:

- Devuelve exactamente: `Asistencia {title} - {opened_date}` (sin id de sesión).

Función `safe_filename(heading: str) -> str`:

- Sustituir caracteres no permitidos en Windows/macOS (`\ / : * ? " < > |`) por `-` (o eliminar).
- Recortar espacios extremos; evitar nombres vacíos (fallback: `Asistencia - {opened_date}`).
- Añadir sufijo `.xlsx`.
- **No** añadir hora de apertura ni id de sesión (CA-15).

El encabezado **dentro** del xlsx usa el texto completo con el título tal como está en BD (CA-03); solo el nombre de archivo se sanitiza.

**Content-Disposition:** `attachment; filename="{safe}"`. Si el título tiene comillas o caracteres no ASCII, valorar `filename*=UTF-8''…` en una tarea si pruebas manuales fallan en algún navegador; empezar con `filename` entre comillas dobles escapando `\"` internas.

---

## 4. Seguridad de nombres de alumno (CA-11)

Misma intención que spec 001 / `export.py` actual:

- Si el nombre empieza por `=`, `+`, `-` o `@`, guardarlo como **texto** en Excel (prefijo `'` visible o `number_format='@'` + valor sin ejecutar fórmula). Preferir celda formato texto + valor literal; comprobar en test que openpyxl no deja fórmula activa.

---

## 5. Dependencia: `openpyxl` (P3)

| Pregunta | Respuesta |
| --- | --- |
| ¿Qué problema resuelve? | Generar `.xlsx` con filas de título, total y tabla; se abre como hoja de cálculo en Excel, Google Sheets y Numbers sin el import CSV «recuadro flotante». |
| ¿Por qué no basta stdlib? | El módulo `csv` no produce libro Excel; escribir OOXML a mano es frágil y no cumple P2. |
| ¿Alternativas descartadas? | **Solo CSV enriquecido:** no cumple CA-12 (informe estructurado al abrir). **HTML `.xls`:** hack obsoleto. **xlsxwriter:** válido; elegimos **openpyxl** por uso extendido en tests (leer el libro generado con la misma lib). |

Añadir a `requirements.txt`: `openpyxl>=3.1.5,<4` (versión revisada con Socket en §5.1).

---

## 5.1 Validación Socket

Comprobación con MCP **socket-mcp** ([MCP.md del bootcamp](../../../../MCP.md)) **antes** de dar el plan por aceptado. Ecosistema **pypi** (Python), no npm. Árbol revisado: capa 0 `openpyxl@3.1.5`, capa 1 `et-xmlfile@2.0.0` (única dependencia runtime publicada de openpyxl 3.1.5).

| Capa | paquete@versión | campaña | alertas abiertas | license | maintenance | quality | supplyChain | vulnerability | stats bajo 50 |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 0 | openpyxl@3.1.5 | n/d (threat feed no incluido en plan free) | no | 100 | 100 | 100 | 100 | 100 | ninguna |
| 1 | et-xmlfile@2.0.0 | n/d | no | 100 | 100 | 100 | 100 | 100 | ninguna |

Informes: [openpyxl](https://socket.dev/pypi/package/openpyxl) · [et-xmlfile](https://socket.dev/pypi/package/et-xmlfile).

**Incidencias:** ninguna alerta abierta en org `sergio-cortes` para `openpyxl` (pypi). No hubo coincidencias en threat feed (endpoint no disponible en plan free).

**Nota:** En `first-app` la validación Socket está detallada en `AGENTS.MD` para paquetes **npm**. AsistenciApp no repite ese apartado en su `AGENTS.md`, pero al **añadir un paquete PyPI** aplica el mismo criterio del bootcamp: consultar Socket y documentarlo aquí antes de aprobar el plan.

---

## 6. API HTTP

| Aspecto | Valor |
| --- | --- |
| Ruta | `GET /api/sessions/<session_id>/export` (sin cambio) |
| Auth | Igual que hoy (`run(action)` + token profesor) |
| 404 | Sesión inexistente (igual) |
| Cuerpo | bytes del `.xlsx` |
| `Content-Type` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| Errores | Sin JSON nuevo |

---

## 7. Caso de uso `export_report`

En `usecases/attendance.py`:

```python
def export_report(path, session_id: str) -> tuple[bytes, str]:
    """Devuelve (contenido xlsx, nombre de archivo con extensión)."""
```

- `require_session(get_session(...))`
- `rows = list_checkins(...)`
- `opened_date = loaded["opened_at"][:10]`
- `heading = report_heading(loaded["title"], opened_date)`
- `filename = safe_filename(heading)`
- `content = to_xlsx(heading, rows, tz=None)`  # tz opcional para tests en UTC

Retirar `export_csv` / `to_csv` del camino público una vez migrados tests (no mantener dos formatos salvo que una task pida transición; spec pide sustituir).

---

## 8. Tests (trazabilidad CA)

| CA | Verificación |
| --- | --- |
| CA-01, CA-02 | `test_export.py`: heading y `safe_filename` / primera celda del libro |
| CA-03 | Título con `/` en hoja vs nombre sanitizado |
| CA-04 | Título por defecto en heading |
| CA-05, CA-08 | Fila 2 total; sesión vacía filas de datos |
| CA-06 | Columnas y orden por `checked_at` |
| CA-07 | `test_api.py` o test de usecase con remove_checkin |
| CA-09–CA-10 | `test_api.py` existente (401, export ok) |
| CA-11 | Parametrize nombres `=`, `+`, …; leer celda sin fórmula |
| CA-12 | Assert estructura filas 1–4+ (smoke openpyxl) |
| CA-13–CA-14 | API export + `pytest` completo |

Patrón: generar bytes en memoria → `load_workbook(BytesIO(...))` → leer celdas.

Actualizar comentarios `CA-14` en tests/API a «informe xlsx» donde digan CSV.

---

## 9. README

- Sustituir «CSV» por «informe Excel (`.xlsx`)» en el paso **Descargar lista**.
- Una línea: abrir en Excel, Google Sheets o Numbers; nombre `Asistencia {título} - AAAA-MM-DD`.

---

## 10. Comprobación de la constitución

| Principio | Cómo lo cumple |
| --- | --- |
| **P1** Plataforma | Sin cambio en check-in |
| **P2** Simplicidad | Un módulo `export.py`, una ruta, layout fijo de 4+ filas; sin plantillas ni macros |
| **P3** Dependencias | **+openpyxl** justificada en §5; validada en §5.1 (Socket); Flask y pytest sin cambio |
| **P4** Privacidad | Mismos datos que hoy (nombre + hora); nada de IP en el informe |
| **P5** Móvil | Descarga desde el mismo botón |
| **P6** Español | Textos del informe en español (`Total de asistentes`, cabeceras) |
| **§4 SDD** | Spec 007 aprobada → este plan → tasks → código |
| **§3 stack** | SQLite sin cambio; generación en servidor |

---

## 11. Riesgos documentados

- **Zona horaria:** fecha/hora de filas siguen la del servidor (como el CSV actual); documentar en README si hace falta.
- **Nombres de archivo largos:** truncar a ~200 caracteres antes de `.xlsx` si el título es muy largo (max 100 en UI + prefijo).
- **Colisión de nombres:** dos descargas mismo título mismo día → mismo nombre (aceptado CA-15); el SO puede añadir «(1)» al guardar.
- **Numbers:** `.xlsx` suele abrir como hoja completa; prueba manual en Mac (checklist issue #324).

---

## 12. Fuera de este plan

- Export CSV legacy en paralelo (no requerido por spec).
- Desglose de implementación: [tasks.md](tasks.md).

---

## 13. Historial

| Fecha | Cambio |
| --- | --- |
| 2026-10-28 | Borrador inicial tras aprobación de spec 007. |
| 2026-10-28 | §5.1 Validación Socket (pypi openpyxl@3.1.5 + et-xmlfile@2.0.0). |
| 2026-10-28 | Aprobado por quien trabaja en esta carpeta. |
