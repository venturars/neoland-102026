# Tareas 003 · Activar el entorno no es arrancar la app

> Estado: **Terminado (2026-10-24)** · Plan: [plan.md](plan.md) · Creado: 2026-10-24 · Aprobado: 2026-10-24

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- El único fichero de la app que se toca es `README.md`. No hay test nuevo: la comprobación es leer ese fichero, como dice el plan.
- En esta rama (#306) el README ya trae este cambio (issue #301), así que T01–T03 se **verifican**; se editan solo si falta algo.

---

## Fase A · Separar los dos títulos

- [x] **T01** · En `README.md`, el título «2. Arrancar la app» es «2. Activar el entorno».
  - Debajo se quedan la frase «En cada terminal nueva, primero activa el entorno» y el bloque con `cd` y `source .venv/bin/activate`.
  - La ruta para entrar en la carpeta no se modifica.
  - *Cubre:* CA-01.
  - *Hecha cuando:* ese bloque se titula «Activar el entorno».

- [x] **T02** · Hay una sección «3. Arrancar la app» justo antes de la tabla de comandos.
  - Bajo ese título quedan la tabla (`python app.py --tunel` y `python app.py`) y el texto de lo que se ve al arrancar.
  - El paso de activar el entorno no queda bajo ese título.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* bajo «Arrancar la app» no aparece `source .venv/bin/activate`, y sí aparecen los dos comandos que ponen la app en marcha.

## Fase B · Renumerar sin cambiar el resto

- [x] **T03** · Los títulos que van después suben un número, y la remisión está corregida.
  - «Pasar lista» es 4, «Cerrar la app» 5, «Problemas frecuentes» 6, «Tests» 7 y «Privacidad» 8.
  - En problemas frecuentes, «ciérrala (sección 4)» es «ciérrala (sección 5)».
  - El cuerpo de esas secciones no cambia.
  - *Cubre:* CA-04.
  - *Hecha cuando:* los cinco títulos tienen el número nuevo y la única frase cambiada fuera de los títulos es esa remisión.

## Fase C · Comprobar

- [x] **T04** · Leer el README con la tabla del plan §3 y lanzar `pytest` una vez desde `staff/ella-deyavorsky/asistenciapp/`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* las cuatro filas de esa tabla cuadran y `pytest` termina en verde.
