# Tareas 008 · El manual solo dice cómo se trabaja

> Estado: **Hechas** · Plan: [plan.md](plan.md) aprobado · Creado: 2026-10-29 · Aplicadas: 2026-10-29

Cómo leer esta lista:

- Se hacen **en orden**, una cada vez. Al terminar una se marca `[x]`.
- Cada tarea indica qué **criterios de aceptación** (`CA-xx`) cubre y cómo se sabe que está **hecha**.
- Primero los tests. Los documentos llegan después, para que esos tests pasen.

---

## Fase A · Tests

- [x] **T01** · Crear `tests/test_manual_split.py` con lo que pide el plan, apartado 3.
  - Lee el inicio de `AGENTS.md`: no está el párrafo que explica qué es el archivo, y el título sigue.
  - Lee la frase de parada: hay que parar y preguntar si el pedido contradice la documentación.
  - Lee la frase de la dependencia externa: nombra `docs/CONSTITUTION.md` y no cita un principio. La línea de P1–P6 sigue.
  - Lee `docs/TREE.md`: están el árbol, el kebab-case y los nombres `TREE.md` y `STYLE.md`.
  - Lee `docs/STYLE.md` y `AGENTS.md`: `:param` y `:return` están en el estilo y ya no están en el manual.
  - Lee `README.md` y `AGENTS.md`: los comandos de preparar, activar, instalar el túnel, arrancar y las pruebas siguen en el documento de uso, no hay una segunda tabla, la frase de Flask y pytest enlaza `docs/CONSTITUTION.md` sin un principio, y el manual no tiene la sección de comandos.
  - Lee el punto 1 y cuenta la puerta del spec: las siete reglas están en el punto 1 y la puerta del spec aprobado aparece solo en el flujo.
  - Lee la lectura obligatoria y los títulos: señala `docs/TREE.md` y `docs/STYLE.md`. El apartado 3 es «Definición de terminado» y el 4 es «Estado actual». La referencia dice §4.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08.
  - *Hecha cuando:* el archivo existe y, al lanzarlo solo, falla porque el manual y los documentos todavía no están repartidos.
- [x] **T02** · En `tests/test_architecture.py`, la comprobación de `:param` y `:return` lee `docs/STYLE.md`.
  - Sigue exigiendo que el manual se llame `AGENTS.md`, que no exista `AGENT.md`, y que `README.md` y `AGENTS.md` contengan `docs/CONSTITUTION.md` y `AGENTS.md`.
  - *Cubre:* CA-09.
  - *Hecha cuando:* esa comprobación ya no lee el estilo en `AGENTS.md` y, al lanzarla sola, falla porque `docs/STYLE.md` todavía no existe.

## Fase B · Documentos

- [x] **T03** · Crear `docs/TREE.md` con el árbol del plan, apartado 2.2.
  - Dentro de `docs/` están `CONSTITUTION.md`, `ARCHITECTURE.md`, `TREE.md` y `STYLE.md`.
  - El resto del árbol es el que hoy está en el manual: specs, `requirements.txt`, `pytest.ini`, `app.py`, `asistencia/`, `static/`, `tests/`, `.venv/` y `data/`.
  - Se lleva la frase de tres dígitos y nombre en kebab-case.
  - *Cubre:* CA-04.
  - *Hecha cuando:* el archivo existe y nombra `TREE.md`, `STYLE.md` y `005-docs-and-architecture`.
- [x] **T04** · Crear `docs/STYLE.md` con el texto del plan, apartado 2.3.
  - Texto breve al principio del módulo, una función por acción leída de arriba abajo, y en cada función pública qué hace, qué recibe (`:param`) y qué devuelve (`:return`), con el ejemplo que hoy está en el manual.
  - No se añaden normas nuevas.
  - *Cubre:* CA-05.
  - *Hecha cuando:* el archivo tiene `:param` y `:return`.
- [x] **T05** · En `README.md`, después del bloque de preparar el entorno, añadir la frase de las únicas dependencias.
  - Dice que son Flask y pytest, como dice `docs/CONSTITUTION.md`. No cita un principio.
  - No se añade otra tabla de comandos. El resto del documento no se reescribe.
  - *Cubre:* CA-06.
  - *Hecha cuando:* esa frase está tras preparar el entorno y las secciones 1, 2 y 6 siguen con sus comandos.
- [x] **T06** · Reescribir `AGENTS.md` como dice el plan, apartado 2.1.
  - Se borra el párrafo inicial y la línea horizontal. El título se queda.
  - La lectura obligatoria señala, en este orden, la constitución, la arquitectura, `docs/TREE.md`, `docs/STYLE.md`, este archivo, la spec activa con «ver §4 "Estado actual"», y su plan y sus tareas si ya existen.
  - Si un pedido contradice la documentación, hay que parar y preguntar antes de escribir nada.
  - En el punto 1 entran, una sola vez, las siete reglas del apartado 5 que el flujo no repite. La puerta de ningún fichero sin spec aprobado se queda solo en el flujo.
  - La dependencia externa nombra solo `docs/CONSTITUTION.md`, sin un principio ni un apartado. La línea de P1–P6 se queda.
  - Desaparecen el árbol, el estilo y los comandos. «Definición de terminado» es el apartado 3 y «Estado actual» es el apartado 4.
  - *Cubre:* CA-01, CA-02, CA-03, CA-05, CA-06, CA-07, CA-08.
  - *Hecha cuando:* el manual ya no tiene `:param`, ni la sección de comandos, ni el párrafo inicial, y el punto 1 tiene las siete reglas.

- [x] **T07** · En `docs/ARCHITECTURE.md`, la lista de `docs/` incluye `TREE.md` y `STYLE.md`.
  - El texto dice que el árbol completo está en `TREE.md` y que la escritura está en `STYLE.md`.
  - Las capas, los archivos de código y lo que no se trae no se reescriben.
  - *Cubre:* CA-04.
  - *Hecha cuando:* el documento nombra `TREE.md` y `STYLE.md`, y sigue nombrando `domain`, `actions` e `infra`.

## Fase C · Comprobación

- [x] **T08** · Lanzar `pytest`.
  - *Cubre:* CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09.
  - *Hecha cuando:* `tests/test_manual_split.py`, `tests/test_architecture.py` y la suite que ya existía terminan en verde.
- [x] **T09** · Leer el diff y comprobar que no cambian las specs `001` a `007`.
  - Tampoco cambian `docs/CONSTITUTION.md`, `app.py`, `asistencia/`, `static/` ni `requirements.txt`.
  - Actualizar la tabla de `AGENTS.md`: esta spec pasa a implementada, en el apartado 4.
  - *Cubre:* CA-04, CA-09.
  - *Hecha cuando:* esos archivos no están en el diff y la tabla nombra esta spec como implementada.
