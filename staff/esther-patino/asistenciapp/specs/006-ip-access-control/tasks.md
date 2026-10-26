# Tareas 006 · Control de acceso por IP

> Estado: **Hechas** · Plan: [plan.md](plan.md) aprobado el 2026-10-24 · Creado: 2026-10-24 · Reescrito: 2026-10-24 · Aplicadas: 2026-10-24

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero el test, luego el código, siempre que se pueda.

La blacklist se guarda siempre. Nadie puede quitar una IP ni cambiarla.

---

## Fase A · La regla del límite

- [x] **T01** · Crear `tests/test_access.py`.
  - Sin base y sin navegador.
  - 5 llamadas en el mismo segundo no son ataque. La sexta sí.
  - 20 llamadas en el mismo minuto, separadas para no juntar 6 en un segundo, no son ataque. La 21 sí.
  - Una llamada con más de un minuto no cuenta.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* el archivo existe y, al lanzarlo solo, falla porque `asistencia.domain.access` todavía no está.

- [x] **T02** · Crear `asistencia/domain/access.py`.
  - Una función pública: horas de las llamadas de una IP y el instante actual. Hay ataque si en el último segundo hay más de 5, o en el último minuto hay más de 20.
  - No importa Flask ni `sqlite3`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04.
  - *Hecha cuando:* `pytest tests/test_access.py` pasa.

## Fase B · La blacklist en la base

- [x] **T03** · Añadir en `tests/test_api.py` los casos de la tabla `blacklist`, antes de cambiar `db.py`.
  - Guardar una IP y mirar si está.
  - No hay función para quitarla ni para cambiarla.
  - La tabla `checkins` sigue sin columna de IP.
  - *Cubre:* CA-05, CA-08, CA-09, CA-10.
  - *Hecha cuando:* esos casos fallan porque las funciones de la blacklist todavía no están.

- [x] **T04** · En `asistencia/infra/db.py`, crear la tabla `blacklist` del plan y las funciones de guardarla y de mirar si está.
  - `CREATE TABLE IF NOT EXISTS`, también en una base que ya existía.
  - Sin función de borrar ni de cambiar la IP.
  - *Cubre:* CA-05, CA-08, CA-09, CA-10.
  - *Hecha cuando:* los casos nuevos de T03 pasan y los tests que ya había siguen en verde.

## Fase C · Pasar lista

- [x] **T05** · Añadir en `tests/test_api.py` los casos de pasar lista, antes de cambiar la acción.
  - Bajo el límite, el código vigente sigue en `201`.
  - Un código que no vale sigue con su aviso, y esa llamada cuenta.
  - La sexta en un segundo y la 21 en un minuto responden `403` con «No puedes pasar lista: tu acceso está bloqueado.», sin alta, y la IP de la conexión queda en la blacklist.
  - Una IP ya bloqueada, con el código vigente, recibe el mismo `403`.
  - El cuerpo y las cabeceras traen otra IP: se guarda `REMOTE_ADDR`.
  - Pasa el tiempo, se cierra la clase y otra app abre la misma base: la IP sigue bloqueada.
  - Pedir quitar o cambiar esa IP, con o sin el token del panel, no existe. La IP sigue igual.
  - La vista del profesor y el CSV siguen con nombre y hora, sin IP.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-08, CA-09, CA-10.
  - *Hecha cuando:* esos casos fallan y los de pasar lista que ya existían siguen igual.

- [x] **T06** · En `asistencia/actions/attendance.py` y en `app.py`, aplicar el orden del plan.
  - La IP es `request.remote_addr`. No se lee del cuerpo ni de una cabecera. `ProxyFix` no gana `x_for`.
  - La cuenta vive en memoria en la app. No se escribe en la base.
  - Si ya está bloqueada, `403` y no se registra.
  - Si esta llamada pasa el límite, entra en la blacklist, `403` y no se registra.
  - Si no, sigue el registro de ahora.
  - No se añade ninguna ruta para tocar la blacklist.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-08, CA-09, CA-10.
  - *Hecha cuando:* los casos de T05 pasan.

- [x] **T07** · En `static/alumno.js`, si la respuesta es `403`, mostrar el aviso y no tratarlo como un código mal escrito.
  - *Cubre:* CA-03, CA-04, CA-05.
  - *Hecha cuando:* el `403` enseña `data.error` y no selecciona el campo del código.

## Fase D · Documentos y cierre

- [x] **T08** · En `docs/ARCHITECTURE.md`, el árbol nombra `domain/access.py`.
  - En `README.md`, una frase con el límite de 5 por segundo y 20 por minuto, el aviso de ban y que nadie puede quitar ni cambiar una IP de la blacklist.
  - El panel no se toca.
  - *Cubre:* CA-03, CA-10.
  - *Hecha cuando:* los dos textos dicen eso y no cambian cómo se arranca la app.

- [x] **T09** · Cierre.
  - `asistencia/domain/codes.py` no se ha modificado.
  - `pytest` pasa, incluidos `tests/test_codes.py` y los casos de CA-01 a CA-10.
  - *Cubre:* CA-07 y el resto.
  - *Hecha cuando:* `pytest` está en verde y `codes.py` no aparece en el diff de esta spec.
