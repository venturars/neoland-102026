# Plan técnico 005 · Documentos y arquitectura del código

> Estado: **Aprobado** · Spec: [spec.md](spec.md) aprobada · Creado: 2026-10-23 · Paso a las tareas: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

No se añade ninguna dependencia. Flask y pytest siguen siendo las únicas. Las pantallas no cambian. Pasar lista da el mismo resultado.

El ejemplo de capas se adapta a tres sitios dentro de `asistencia/`. No se copia su árbol, ni su segunda base de datos, ni su línea de comandos, ni su generador de documentación, ni sus ganchos de commit, ni una clase y una interfaz por cada detalle.

---

## 1. Archivos

| Archivo | Qué se hace | Cubre |
| --- | --- | --- |
| `docs/CONSTITUTION.md` | Se mueve la constitución. El texto de los principios se queda en la versión 2.3 | CA-01 |
| `docs/ARCHITECTURE.md` | Se crea. Dice las tres capas de esta app y lo que no se trae del ejemplo | CA-02, CA-04 |
| `AGENTS.md` | `AGENT.md` cambia de nombre. El manual actualiza enlaces, árbol y lectura, y añade cómo se escribe el código | CA-03, CA-05 |
| `README.md` | La frase de las reglas enlaza `docs/CONSTITUTION.md` y `AGENTS.md` | CA-05 |
| `asistencia/domain/` | Reglas puras: `codes.py` y `names.py` | CA-04 |
| `asistencia/actions/attendance.py` | Acciones de pasar lista. Llaman a las reglas y a la base. No conocen el navegador | CA-04 |
| `asistencia/infra/` | `db.py`, `export.py` y `tunnel.py` | CA-04 |
| `app.py` | Se queda en la raíz. Traduce la petición del navegador a una acción y devuelve la respuesta | CA-04, CA-06 |
| `tests/test_architecture.py` | Comprueba carpetas, documentos y que las reglas no importan el navegador ni la base | CA-01, CA-02, CA-03, CA-04, CA-05 |
| `tests/test_codes.py`, `test_names.py`, `test_export.py`, `test_tunnel.py` | Actualizan el import al sitio nuevo. Los casos se quedan | CA-06 |

No se tocan `static/`, `requirements.txt`, ni las specs `001`, `002`, `003` y `004`. `tasks.md` se escribe en la fase siguiente, no aquí.

---

## 2. Decisiones

### 2.1 Documentos (CA-01, CA-02, CA-03, CA-05, CA-07)

`CONSTITUTION.md` pasa a `docs/CONSTITUTION.md`. No se reescribe ningún principio y no sube la versión.

`docs/ARCHITECTURE.md` explica este árbol y solo este:

```
asistenciapp/
├── docs/
│   ├── CONSTITUTION.md
│   └── ARCHITECTURE.md
├── AGENTS.md
├── app.py                      # navegador: petición y respuesta
└── asistencia/
    ├── domain/                 # reglas
    │   ├── codes.py
    │   └── names.py
    ├── actions/
    │   └── attendance.py       # acciones de pasar lista
    └── infra/
        ├── db.py               # SQLite
        ├── export.py           # CSV
        └── tunnel.py           # túnel
```

El documento dice qué se usa del ejemplo: separar reglas, acciones y la forma de llegar a ellas. Y dice qué no se trae: otra base de datos, línea de comandos, generador de documentación, ganchos de commit, y una clase con su interfaz para cada detalle.

`AGENT.md` pasa a llamarse `AGENTS.md` y se queda en la raíz. La lectura inicial, los enlaces y el árbol de carpetas apuntan a `docs/CONSTITUTION.md` y a `AGENTS.md`. Se añade una sección de escritura. El `README.md` actualiza la misma frase de las reglas.

Las specs ya cerradas no se reescriben.

### 2.2 Capas (CA-04, CA-06)

Las reglas viven en `asistencia/domain/`. `codes.py` y `names.py` se mueven ahí con las mismas funciones. Esos módulos no importan Flask ni `sqlite3`.

Las acciones viven en `asistencia/actions/attendance.py`, como funciones, no como clases. Cada acción hace una cosa de las que la app ya hace:

- datos públicos de una clase
- registrar a un alumno
- listar clases
- abrir una clase
- vista del profesor, con el código solo si la clase sigue abierta
- cerrar una clase
- quitar un registro
- preparar el CSV

Reciben la conexión y los datos ya leídos del navegador. Usan `domain` para el código y el nombre, y `infra.db` para guardar. Devuelven diccionarios o un error con el mensaje que hoy ya ve el usuario. No importan Flask. `app.py` elige el estado HTTP y construye el JSON, la página y la dirección del alumno.

La forma de guardar y de salir fuera vive en `asistencia/infra/`. `db.py`, `export.py` y `tunnel.py` se mueven ahí. La base no importa Flask ni las reglas del dominio.

`app.py` sigue siendo el punto de entrada: `create_app`, el puerto, el túnel y `main`. El token del profesor, las rutas y los textos de error HTTP se quedan aquí.

No hay interfaz de repositorio, ni presentador, ni objetos de transporte, ni registrador, ni blueprints. Hay una sola forma de guardar.

### 2.3 Cómo se escribe (CA-03)

En `AGENTS.md`, la sección nueva pide lo que se ve en el módulo de ejemplo:

- un texto breve al principio del módulo
- una función por acción, leída de arriba abajo
- en cada función pública, un texto con qué hace, qué recibe (`:param`) y qué devuelve (`:return`)

Ese estilo se aplica a las funciones públicas de `domain`, `actions`, `infra` y a `create_app`, `port_in_use` y `main` en `app.py`. Las pantallas no se reescriben.

### 2.4 Pruebas (CA-06)

Los tests que ya existen se quedan. Solo cambia el import cuando el módulo cambia de carpeta. `pytest` tiene que seguir en verde. No se añade un caso de comportamiento nuevo: pasar lista no cambia de resultado.

---

## 3. Verificación

| Criterio | Qué se comprueba | Resultado |
| --- | --- | --- |
| CA-01 | `tests/test_architecture.py` busca `docs/CONSTITUTION.md` y la ausencia de `CONSTITUTION.md` en la raíz | El archivo está en `docs`. Los principios siguen en 2.3 |
| CA-02 | El mismo test lee `docs/ARCHITECTURE.md` | Nombra `domain`, `actions` e `infra`, y dice lo que no se trae |
| CA-03 | El mismo test busca `AGENTS.md` y la ausencia de `AGENT.md` | El manual tiene `:param` y `:return` |
| CA-04 | El mismo test lee los imports de `domain` y de `actions` | `domain` no importa Flask ni `sqlite3`. `actions` no importa Flask |
| CA-05 | El mismo test lee el enlace del `README.md` y el de `AGENTS.md` | Abren `docs/CONSTITUTION.md` y `AGENTS.md` |
| CA-06 | `pytest` | La suite que ya existe pasa |
| CA-07 | Lectura del diff | `specs/001-checkin-codigo`, `002-require-approved-spec`, `003-startup-headings` y `004-impersonal-references` no aparecen |

---

## 4. Comprobación de la constitución (v2.3)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade ninguna plataforma. El registro sigue siendo el mismo |
| P2 Simplicidad | Sí | Tres carpetas y funciones. No hay interfaz ni clase por cada detalle, porque solo hay una forma de guardar |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia. Siguen Flask y pytest |
| P4 Privacidad | Sí | Se guardan los mismos datos, en el mismo archivo local |
| P5 Accesible y móvil | Sí | Las pantallas no se tocan |
| P6 Español | Sí | La spec, este plan, la arquitectura y el manual están en español. Los nombres del código siguen en inglés |
| Apartado 5, calidad | Sí | CA-01 a CA-05 tienen test. CA-06 es la suite actual. CA-07 se lee en el diff |
| Apartado 6, seguridad | Sí | El código que caduca, el registro único, la clase cerrada y la validación del nombre siguen en las reglas. El token del profesor sigue en la entrada |
