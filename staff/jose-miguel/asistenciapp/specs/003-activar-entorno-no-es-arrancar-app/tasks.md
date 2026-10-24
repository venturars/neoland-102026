# Tareas 003 · Activar el entorno no es arrancar la app

> Estado: **Borrador** (2026-10-22) · Plan: [plan.md](plan.md) · Creado: 2026-10-22

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- El único fichero de la app que se toca es `README.md`. No hay test nuevo: la comprobación es leer ese fichero, como dice el plan.

---

## Fase A · Separar los dos títulos

- [ ] **T01** · En `README.md`, cambiar el título «2. Arrancar la app» por «2. Activar el entorno».
  - Debajo se quedan la frase «En cada terminal nueva, primero activa el entorno» y el bloque con `cd` y `source .venv/bin/activate`.
  - La ruta para entrar en la carpeta no se modifica.
  - *Cubre:* CA-01.
  - *Hecha cuando:* ese bloque se titula «Activar el entorno».

- [ ] **T02** · Abrir una sección «3. Arrancar la app» justo antes de la tabla de comandos.
  - Bajo ese título quedan la tabla (`python app.py --tunel` y `python app.py`) y el texto de lo que se ve al arrancar.
  - El paso de activar el entorno no queda bajo ese título.
  - *Cubre:* CA-02, CA-03.
  - *Hecha cuando:* bajo «Arrancar la app» no aparece `source .venv/bin/activate`, y sí aparecen los dos comandos que ponen la app en marcha.

## Fase B · Renumerar sin cambiar el resto

- [ ] **T03** · Subir un número los títulos que van después, y corregir la remisión.
  - «Pasar lista» pasa a 4, «Cerrar la app» a 5, «Problemas frecuentes» a 6, «Tests» a 7 y «Privacidad» a 8.
  - En problemas frecuentes, «ciérrala (sección 4)» pasa a «ciérrala (sección 5)».
  - El cuerpo de esas secciones no cambia.
  - *Cubre:* CA-04.
  - *Hecha cuando:* los cinco títulos tienen el número nuevo y la única frase cambiada fuera de los títulos es esa remisión.

## Fase C · Comprobar

- [ ] **T04** · Leer el README con la tabla del plan §3 y lanzar `pytest` una vez desde `staff/<usuario>/asistenciapp/`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* las cuatro filas de esa tabla cuadran y `pytest` termina en verde.
