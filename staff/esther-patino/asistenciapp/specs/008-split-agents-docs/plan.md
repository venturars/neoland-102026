# Plan técnico 008 · El manual solo dice cómo se trabaja

> Estado: **Aprobado** · Spec: [spec.md](spec.md) aprobada · Creado: 2026-10-29 · Paso a las tareas: 2026-10-29 · Issue: #563

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

No se añade ninguna dependencia. Flask y pytest siguen siendo las únicas. Las pantallas no cambian. Pasar lista da el mismo resultado. La constitución no se enmienda. En `docs/ARCHITECTURE.md` solo se actualiza la lista de documentos: entran el árbol y el estilo. Las capas del código no se reescriben.

---

## 1. Archivos

| Archivo | Qué se hace | Cubre |
| --- | --- | --- |
| `AGENTS.md` | Pierde la presentación, el árbol, el estilo y los comandos. La parada habla de la documentación. La dependencia cita solo `docs/CONSTITUTION.md`. Las reglas de comportamiento que no están ya en el flujo pasan al punto 1. Los apartados que quedan se renumeran | CA-01, CA-02, CA-03, CA-05, CA-06, CA-07, CA-08 |
| `docs/TREE.md` | Se crea con el árbol que hoy está en el manual, más `TREE.md` y `STYLE.md`, y la forma de numerar las specs | CA-04 |
| `docs/ARCHITECTURE.md` | Su lista de documentos incluye `TREE.md` y `STYLE.md`. Las capas del código no se reescriben | CA-04 |
| `docs/STYLE.md` | Se crea con el texto de cómo se escribe el código, incluido `:param` y `:return` | CA-05 |
| `README.md` | No se copia la tabla de comandos. Tras preparar el entorno se añade la frase de las únicas dependencias, enlazando `docs/CONSTITUTION.md` y sin citar un principio | CA-06 |
| `tests/test_architecture.py` | La comprobación de `:param` y `:return` lee `docs/STYLE.md`. Sigue exigiendo `AGENTS.md` y los enlaces a `docs/CONSTITUTION.md` | CA-09 |
| `tests/test_manual_split.py` | Comprueba el reparto de los documentos | CA-01, CA-02, CA-03, CA-04, CA-05, CA-06, CA-07, CA-08 |

No se tocan `docs/CONSTITUTION.md`, `app.py`, `asistencia/`, `static/`, `requirements.txt`, ni las specs `001` a `007`. `tasks.md` se escribe en la fase siguiente, no aquí.

---

## 2. Decisiones

### 2.1 El manual (CA-01, CA-02, CA-03, CA-07, CA-08)

Se borra el párrafo inicial que explica qué es el archivo y la línea horizontal que lo separa del punto 1. El título se queda.

La lectura obligatoria queda así:

1. `docs/CONSTITUTION.md`
2. `docs/ARCHITECTURE.md`
3. `docs/TREE.md`
4. `docs/STYLE.md`
5. Este archivo (`AGENTS.md`)
6. La spec activa, con la referencia «ver §4 "Estado actual"»
7. Su `plan.md` y su `tasks.md`, si ya existen

La frase de parada pasa a decir que, si algo de lo que piden contradice la documentación, hay que parar y preguntar antes de escribir nada.

En el mismo punto 1 entran, una sola vez, las reglas que hoy están en el apartado 5 y que el flujo no repite:

- editar solo dentro de la carpeta de este proyecto
- preguntar antes de suponer
- explicar al cerrar cada fase
- cambios pequeños
- nada de commits ni pushes sin que lo pida quien trabaja en el proyecto
- parar lo que se arranque, con la comprobación del puerto que ya está escrita
- no tocar la constitución salvo para proponer una enmienda

La puerta de ningún fichero sin spec aprobado se queda solo en el flujo. No se copia al punto 1.

En planificar, la frase de una dependencia externa nombra solo `docs/CONSTITUTION.md`. No cita P3 ni otro apartado. La línea que pide repasar P1–P6 y §5–§6 se queda igual.

Desaparecen del manual el árbol, el estilo y los comandos. «Definición de terminado» pasa a ser el apartado 3. «Estado actual» pasa a ser el apartado 4.

### 2.2 El árbol (CA-04)

`docs/TREE.md` guarda el árbol que hoy está en el manual. Dentro de `docs/` añade `TREE.md` y `STYLE.md`, para que el documento no nazca sin sus propios archivos. El resto del árbol no cambia: specs, `requirements.txt`, `pytest.ini`, `app.py`, `asistencia/`, `static/`, `tests/`, `.venv/` y `data/`. También se lleva la frase de que las specs se numeran con tres dígitos y nombre en kebab-case.

En `docs/ARCHITECTURE.md`, la lista de `docs/` pasa a incluir `TREE.md` y `STYLE.md`, y el texto dice que el árbol completo está en `TREE.md` y que la escritura está en `STYLE.md`. Las capas, los archivos de código y lo que no se trae se quedan.

### 2.3 El estilo (CA-05)

`docs/STYLE.md` recibe el texto de hoy, sin añadir normas nuevas:

- cada módulo abre con un texto breve
- cada función hace una acción y se lee de arriba abajo
- cada función pública dice qué hace, qué recibe (`:param`) y qué devuelve (`:return`), con el ejemplo que ya está en el manual

Ese texto sale de `AGENTS.md`.

### 2.4 El documento de uso (CA-06)

Los comandos de preparar el entorno, activar, instalar el túnel, arrancar y ejecutar las pruebas siguen en las secciones 1, 2 y 6 del `README.md`. No se añade otra tabla.

Después del bloque de preparar el entorno se añade una frase: las únicas dependencias son Flask y pytest, como dice `docs/CONSTITUTION.md`. La frase no cita un principio. La sección de comandos del manual se borra.

### 2.5 Pruebas (CA-09)

`tests/test_architecture.py` deja de buscar `:param` y `:return` en `AGENTS.md` y los busca en `docs/STYLE.md`. Sigue comprobando que el manual se llama `AGENTS.md`, que no existe `AGENT.md`, y que `README.md` y `AGENTS.md` contienen `docs/CONSTITUTION.md` y `AGENTS.md`.

`tests/test_manual_split.py` lee los documentos y comprueba CA-01 a CA-08: que el párrafo inicial no está, que la parada habla de la documentación, que la dependencia no cita un apartado, que `TREE.md` tiene el árbol y los dos nombres nuevos, que el estilo ya no está en el manual, que el `README.md` no gana una segunda tabla de comandos y sí la frase de dependencias, que las reglas de comportamiento están en el punto 1 sin repetir la puerta del spec, y que los apartados 3 y 4 son los que dice la spec.

Que las specs `001` a `007` no entren en el diff, se lee en el diff. `pytest` tiene que seguir en verde. `tests/test_architecture.py` también exige que `docs/ARCHITECTURE.md` nombre `TREE.md` y `STYLE.md`.

---

## 3. Verificación

| Criterio | Qué se comprueba | Resultado |
| --- | --- | --- |
| CA-01 | `tests/test_manual_split.py` lee el inicio de `AGENTS.md` | No está el párrafo que explica qué es el archivo. El título sigue |
| CA-02 | El mismo test lee la frase de parada | Dice que hay que parar y preguntar si el pedido contradice la documentación |
| CA-03 | El mismo test lee la frase de la dependencia externa | Nombra `docs/CONSTITUTION.md` y no cita un principio. La línea de P1–P6 sigue |
| CA-04 | El mismo test lee `docs/TREE.md`. `tests/test_architecture.py` lee `docs/ARCHITECTURE.md` | El árbol tiene el kebab-case y los nombres `TREE.md` y `STYLE.md`. La arquitectura también los nombra, y sigue nombrando `domain`, `actions` e `infra` |
| CA-05 | El mismo test lee `docs/STYLE.md` y `AGENTS.md` | `:param` y `:return` están en el estilo y ya no están en el manual |
| CA-06 | El mismo test lee `README.md` y `AGENTS.md` | Los comandos siguen en el documento de uso, no hay una segunda tabla, la frase de Flask y pytest enlaza `docs/CONSTITUTION.md` sin un principio, y el manual no tiene la sección de comandos |
| CA-07 | El mismo test lee el punto 1 y cuenta la puerta del spec | Las siete reglas están en el punto 1. La puerta del spec aprobado aparece solo en el flujo |
| CA-08 | El mismo test lee la lectura obligatoria y los títulos | Señala `docs/TREE.md` y `docs/STYLE.md`. El apartado 3 es «Definición de terminado» y el 4 es «Estado actual». La referencia dice §4 |
| CA-09 | `tests/test_architecture.py` y `pytest` | La comprobación de escritura lee `docs/STYLE.md`. La suite pasa. El diff no incluye las specs `001` a `007` |

---

## 4. Comprobación de la constitución (v3.0)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade ninguna plataforma. El registro sigue siendo el mismo |
| P2 Simplicidad | Sí | El manual se queda con el flujo. El árbol y el estilo van a un documento cada uno, sin normas nuevas |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia. Siguen Flask y pytest, y el documento de uso lo dice citando la constitución |
| P4 Privacidad | Sí | No se guardan datos nuevos. Las pantallas y la base no se tocan |
| P5 Accesible y móvil | Sí | Las pantallas no se tocan |
| P6 Español | Sí | La spec, este plan, el árbol, el estilo y el manual están en español. El ejemplo de código sigue con nombres en inglés |
| Apartado 5, calidad | Sí | CA-01 a CA-08 tienen test. CA-09 es esa comprobación más la suite actual. Que las specs antiguas no cambien se lee en el diff |
| Apartado 6, seguridad | Sí | El código que caduca, la blacklist, el registro único, la clase cerrada y la validación de la entrada no se tocan |
