# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [constitución](docs/CONSTITUTION.md) dice **qué reglas** se cumplen. [ARCHITECTURE.md](docs/ARCHITECTURE.md) dice **cómo se organiza** el código. Este archivo dice **cómo se trabaja** día a día y **cómo se escribe** cada función.

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta. Quien trabaja aquí interviene solo en los cinco momentos del apartado 2. El agente elige un momento y no lo encadena con el siguiente.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. `docs/ARCHITECTURE.md`: cómo se organiza el código.
3. Este archivo (`AGENTS.md`).
4. El historial: `specs/000-historial/specs.md`. Dice cuál es la spec activa. De las specs ya resumidas basta con su resumen, en `specs/000-historial/resumenes/`.
5. La spec activa: `specs/<issue>-nombre/spec.md`, y su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Cinco momentos

Quien trabaja en esta carpeta interviene solo en este orden. El agente se para al terminar cada momento y no empieza el siguiente.

1. **Crear la issue.** Si la tarea aún no se puede dejar escrita, la entrevista va aquí, una pregunta cada vez. Luego se crea la issue, con qué hay que hacer y cómo probarlo. No se abre la rama. Ahí se para.
2. **Crear el draft.** De un tirón: adelantar `staging`, rama desde `staging`, commit vacío `chore: open #N`, push, pull request en draft contra `staging`, autor, y `Closes #N`. No se escriben specs. Ahí se para.
3. **Crear las specs.** En la misma pasada, sin parar entre ellas: `spec.md`, `plan.md` y `tasks.md`. La spec abre con el número de la issue. Si falta un dato, se pregunta aquí y no se inventa. No se toca el código. Ahí se para.
4. **Implementar la spec.** Se ejecutan las tasks. No hay commit ni push. Ahí se para.
5. **La pull request.** Solo lo que se pida entonces: subir los ficheros nombrados, pedir revisión, u otra cosa sobre esa pull request. No se fusiona a `staging`. Ahí se para.

Una issue, una rama o una pull request no autorizan el código. El código espera al momento 4, con las tres specs ya escritas.

| Momento         | Qué queda escrito                          | Qué no se hace        |
| --------------- | ------------------------------------------ | --------------------- |
| 1. Issue        | Qué hay que hacer y cómo probarlo          | Rama, specs, código   |
| 2. Draft        | Rama, commit vacío y pull request en draft | Specs y código        |
| 3. Specs        | `spec.md`, `plan.md`, `tasks.md`           | Código, commit y push |
| 4. Implementar  | El cambio de las tasks                     | Commit y push         |
| 5. Pull request | Lo que se pida sobre esa pull request      | Merge a `staging`     |

### 2.1 Especificar (`spec.md`)

- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Tipo · Para qué sirve (solo funcionalidad) · Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- **Tipo**: `funcionalidad` si cambia lo que ven o hacen el profesor o el alumno; si no, `proceso`.
- **Para qué sirve**: una spec de funcionalidad dice a cuál de los dos objetivos de la constitución §1 sirve: ahorrar tiempo al profesor o dejar constancia de quién asistió. Si no sirve a ninguno, escribe `[NECESITA ACLARACIÓN]`, para y no escribas ni plan ni tareas. Quien trabaja en esta carpeta decide: **descartarla** (se anota en `specs/000-historial/specs.md`), **reformularla** o **enmendar el propósito** (constitución §8, versión mayor).
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**
- Si la spec activa no describe lo pedido, no se reutiliza: se abre `specs/<issue>-nombre/spec.md`.

### 2.2 Planificar (`plan.md`)

- Arquitectura, modelo de datos, rutas/API, archivos que se crearán.
- Sección obligatoria **"Comprobación de la constitución"**: repasa P1–P6 y §5–§6 y di cómo los cumple el plan.
- Si propones una dependencia externa, justifícala aquí (constitución P3).

### 2.3 Desglosar (`tasks.md`)

- Lista de casillas `- [ ] T01 …` en orden de ejecución.
- Cada tarea es pequeña (un archivo o una función), tiene un resultado comprobable e indica qué `CA-xx` cubre.
- Primero el test, luego el código, siempre que sea posible.

### 2.4 Implementar

- Haz **una tarea cada vez**. Al acabarla, márcala `[x]` en `tasks.md`.
- Ningún fichero de la app se adelanta a las tres specs. «Fichero de la app» es todo lo de esta carpeta, también `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` (constitución §4). Si la spec activa no cubre el pedido, ese pedido recorre los cinco momentos: primero la issue.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, dilo y no inventes el cambio.

---

## 3. Estructura de carpetas

El árbol de carpetas está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Las specs nuevas se llaman `<issue>-nombre-en-kebab-case`, con el número de la issue que las abre: `679-formato-de-specs-e-historial`. Una issue, una spec. Las specs `001` a `008` conservan su nombre. El orden es `001` a `008` y después por número de issue.

`specs/000-historial/` no es una spec: guarda el historial de specs (`specs.md`), el de enmiendas de la constitución (`enmienda.md`) y los resúmenes (`resumenes/`).

**Resúmenes.** Cuando hay **8 specs sin resumir**, las **4 más antiguas** se resumen en `specs/000-historial/resumenes/<primera>-<última>.md`. No cuentan `000-historial`, los resúmenes ni las specs descartadas. Por cada spec, el resumen dice qué resolvió, qué decisiones siguen vigentes y qué cambió después, con un enlace a la original. Las specs resumidas **no se editan ni se borran**. El resumen lo escribe el agente en el momento 4 de la spec que hace llegar a 8 las specs sin resumir, en la misma pull request.

---

## 4. Comandos

Ejecutar desde `staff/ventura-rodriguez/asistenciapp/`:

| Acción                                      | macOS y Linux                             | Windows (PowerShell)                         |
| ------------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| Crear el entorno (solo la primera vez)      | `python3 -m venv .venv`                   | `py -m venv .venv`                           |
| Activar el entorno (en cada terminal nueva) | `source .venv/bin/activate`               | `.venv\Scripts\Activate.ps1`                 |
| Instalar las dependencias (primera vez)     | `pip install -r requirements.txt`         | `pip install -r requirements.txt`            |
| Instalar el túnel (solo la primera vez)     | macOS: `brew install cloudflared`. Linux: [descargas de cloudflared](https://github.com/cloudflare/cloudflared/releases) | `winget install --id Cloudflare.cloudflared` |
| Arrancar para una clase online              | `python app.py --tunel`                   | `python app.py --tunel`                      |
| Arrancar solo en local (desarrollo)         | `python app.py` (`http://localhost:8000`) | `python app.py` (`http://localhost:8000`)    |
| Arrancar en otro puerto                     | `PORT=8001 python app.py`                 | `$env:PORT=8001; python app.py`              |
| Ejecutar los tests                          | `pytest`                                  | `pytest`                                     |

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/ventura-rodriguez/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Al cerrar cada momento, resume qué se ha hecho y por qué.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Commit y push** solo en el momento 2 (el commit vacío) y en el momento 5, cuando se piden. Fuera de eso no hay commits ni pushes.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre. En macOS y Linux, `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada (en macOS el proceso aparece como `Python`, con mayúscula). En Windows, `Get-NetTCPConnection -LocalPort 8000 -State Listen` no debe encontrar ninguna conexión. (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** (`docs/CONSTITUTION.md`) salvo para proponer una enmienda, que solo aprueba la persona que trabaja en esta carpeta (constitución §8).

---

## 6. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] La fila de la spec en `specs/000-historial/specs.md` está al día.
- [ ] La persona que trabaja en esta carpeta la ha probado y la ha dado por buena.

---

## 7. Estado actual

El estado de cada spec y la spec activa están en [`specs/000-historial/specs.md`](specs/000-historial/specs.md). El agente actualiza esa tabla cada vez que una spec cambia de fase.

---

## 8. Cómo se escribe el código

La forma es la de una función que se lee sola: se ve qué recibe, qué devuelve y un ejemplo corto. El módulo abre con una frase de qué hace.

```python
"""Calcula el código de asistencia vigente.

Usage::

  >>> from asistencia.domain.codes import code_for
  >>> code_for(secret, now)
"""
```

Cada función pública lleva tipos y dice sus parámetros así:

```python
def code_for(secret: bytes, t: float) -> str:
    """Devuelve el código vigente en ese instante.

    :param secret: secreto de la sesión, en bytes.
    :param t: instante Unix, en segundos.
    :return: cuatro dígitos.
    :rtype: str

    Usage::

      code = code_for(secret, now)
    """
```

- `:param` dice qué es cada argumento.
- `:return` dice qué sale.
- `:rtype` dice el tipo de lo que sale.
- `Usage::` va en la función pública a la que se llama desde otro módulo.
- Una función hace una cosa.
- Los textos que ve el usuario van en español. Los nombres del código pueden ir en inglés.
