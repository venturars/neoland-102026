# Tareas 007 · Informe al descargar la lista de asistencia

> Estado: **Terminada** (2026-10-28) · Plan: [plan.md](plan.md) · Aprobado: 2026-10-28 · Issue: [#324](https://github.com/venturars/neoland-102026/issues/324)

---

## Fase A · Dependencia

- [x] **T01** · Añadir `openpyxl>=3.1.5,<4` a `requirements.txt` e instalar en `.venv` (`pip install -r requirements.txt`).
  - *Solo tras plan aprobado (hecho). Validación Socket ya en plan §5.1.*
  - *Cubre:* P3 del plan.

## Fase B · Exportación (tests primero)

- [x] **T02** 🧪 · Reescribir `tests/test_export.py`: `report_heading`, `safe_filename` (título con `/`, CA-15 sin sufijos), `to_xlsx` vacío y con filas (celdas A1, A2, fila 4 cabeceras, orden, fecha/hora separadas, nombres tipo fórmula).
  - *Cubre:* CA-01–CA-06, CA-08, CA-11, CA-12.

- [x] **T03** · Implementar en `asistencia/export.py`: `report_heading`, `safe_filename`, `to_xlsx` (layout plan §2–§4); retirar `to_csv` y helpers CSV-only no usados.
  - *Cubre:* CA-01–CA-06, CA-08, CA-11, CA-12.

## Fase C · Caso de uso y HTTP

- [x] **T04** · `usecases/attendance.py`: `export_report(path, session_id) -> tuple[bytes, str]`; eliminar `export_csv` del flujo público.
  - *Cubre:* CA-01, CA-04, CA-05.

- [x] **T05** 🧪 · Actualizar `tests/test_api.py` (export): mimetype xlsx, `Content-Disposition` con patrón `Asistencia … - AAAA-MM-DD.xlsx` sin id de sesión, contenido binario no vacío; quitar alumno y re-exportar (CA-07).
  - *Cubre:* CA-02, CA-07, CA-09, CA-10, CA-13.

- [x] **T06** · `app.py`: `export_route` devuelve bytes, Content-Type hoja de cálculo, filename desde `export_report`.
  - *Cubre:* CA-02, CA-09.

## Fase D · Cliente y documentación

- [x] **T07** · `static/profesor.js`: fallback de nombre de descarga `.xlsx` (opcional renombrar comentario `downloadCsv`).
  - *Cubre:* CA-02.

- [x] **T08** · `README.md` y `docs/ARCHITECTURE.md` (export = informe `.xlsx`); `AGENTS.md` §7 tabla spec 007.
  - *Cubre:* CA-12, CA-13.

## Fase E · Cierre

- [x] **T09** · `pytest` completo en verde; marcar tareas `[x]`.
  - *Cubre:* CA-14. *(2026-10-28: 95 passed.)*

- [x] **T10** · Verificación manual (issue #324): sesión con título, descarga en Excel o Google Sheets; sesión vacía; Mac/Windows si puedes.
  - *Cubre:* CA-12, CA-13 (manual). *(2026-10-28: layout fusionado A–D aprobado por quien trabaja en esta carpeta.)*
