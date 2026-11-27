# Plan 003 · Separar «activar el entorno» de «arrancar la app»

> Estado: **Aprobado** (2026-11-01) · Spec: [spec.md](spec.md) v1.0

---

## 1. Resumen

Solo cambia [README.md](../../README.md). No hay código, tests nuevos ni dependencias.

---

## 2. Cambios en el README

**Sección 2.** El título pasa de «Arrancar la app» a **«Activar el entorno»**. Debajo se quedan la frase «En cada terminal nueva, primero activa el entorno» y el bloque `cd` + `source .venv/bin/activate`, sin tocar la ruta. (CA-01)

**Sección 3 nueva.** Justo después, separada con `---`, empieza **«3. Arrancar la app»** con la tabla de comandos (`python app.py --tunel` y `python app.py`), el ejemplo de salida y las notas que ya había. (CA-02, CA-03)

**Numeración.** Las secciones posteriores suben un número:

| Antes | Después |
| --- | --- |
| 3. Pasar lista, paso a paso | 4 |
| 4. Cerrar la app | 5 |
| 5. Problemas frecuentes | 6 |
| 6. Tests | 7 |
| 7. Privacidad | 8 |

En «Problemas frecuentes», la fila del puerto ocupado remite a «sección 4» para cerrar la app. Pasa a «sección 5». (CA-04)

---

## 3. Verificación

Revisión manual del README (constitución §5) y `pytest` al final para confirmar que el código sigue igual.

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-01 | El bloque con `source .venv/bin/activate` está bajo «2. Activar el entorno» |
| CA-02, CA-03 | Bajo «3. Arrancar la app» están los dos comandos y no aparece `source .venv/bin/activate` |
| CA-04 | El diff del README solo tiene títulos, el separador nuevo y la remisión a la sección 5 |

---

## 4. Comprobación de la constitución

| Regla | Cumple | Motivo |
| --- | --- | --- |
| P1–P6 | Sí | Solo cambian títulos de documentación en español; la app no cambia |
| §4 SDD | Sí | El README se toca con esta spec aprobada, después del plan y las tasks |
| §5 Calidad | Sí | Cada criterio tiene su comprobación manual |
| §7 Alcance | Sí | Solo `staff/sergio-moras/asistenciapp/` |
