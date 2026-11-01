# Plan 003 · Separar los dos títulos del README

> Estado: **Aprobado** (2026-10-22) · Spec: [spec.md](spec.md) · Creado: 2026-10-22

Se toca un solo fichero: `README.md`. No hay código nuevo ni test nuevo. Lo compruebo leyendo, y lanzo `pytest` una vez para ver que el código sigue igual.

---

## 1. Qué cambia en el README

El bloque que hoy está bajo «2. Arrancar la app» mezcla dos cosas. Las separo.

- La sección 2 pasa a llamarse **Activar el entorno**. Debajo se quedan la frase «En cada terminal nueva, primero activa el entorno» y el bloque con `cd` y `source .venv/bin/activate`. La ruta no se toca.
- Justo después, la sección 3 se llama **Arrancar la app**. Debajo van la tabla con `python app.py --tunel` y `python app.py`, y el texto de lo que se ve al arrancar. Activar el entorno no queda ahí.

Al meter un título, los siguientes suben un número. El cuerpo no cambia.

| Antes | Después |
| --- | --- |
| 3. Pasar lista, paso a paso | 4. Pasar lista, paso a paso |
| 4. Cerrar la app | 5. Cerrar la app |
| 5. Problemas frecuentes | 6. Problemas frecuentes |
| 6. Tests | 7. Tests |
| 7. Privacidad | 8. Privacidad |

En problemas frecuentes, «ciérrala (sección 4)» apuntaba a «Cerrar la app». Esa sección pasa a ser la 5, así que la frase pasa a «sección 5». Es el único cambio de palabras fuera de los títulos.

---

## 2. Cómo lo compruebo

| Criterio | Qué miro |
| --- | --- |
| CA-01 | `cd` y `source .venv/bin/activate` están bajo «Activar el entorno» |
| CA-02 | Bajo «Arrancar la app» están los dos comandos y el texto de lo que se ve |
| CA-03 | Bajo «Arrancar la app» no aparece `source .venv/bin/activate` |
| CA-04 | Fuera de los títulos y de «sección 4» → «sección 5», las frases siguen igual. La ruta también |

---

## 3. Comprobación de la constitución

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 | Sí | No cambio cómo se pasa lista |
| P2 | Sí | Parto un título en dos. No añado nada |
| P3 | Sí | No añado dependencias |
| P4 | Sí | No guardo datos |
| P5 | Sí | No toco pantallas |
| P6 | Sí | Los títulos siguen en español |
| §5 | Sí | Lo compruebo leyendo. `pytest` confirma que el código no cambió |
| §6 | Sí | No toco códigos ni sesiones |
