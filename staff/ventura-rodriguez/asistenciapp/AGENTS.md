# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [constitución](docs/CONSTITUTION.md) dice **qué reglas** se cumplen. [ARCHITECTURE.md](docs/ARCHITECTURE.md) dice **cómo se organiza** el código. Este archivo dice **cómo se trabaja** día a día y **cómo se escribe** cada función.

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta. Quien trabaja aquí interviene solo en los cinco momentos del apartado 2. El agente elige un momento y no lo encadena con el siguiente.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. `docs/ARCHITECTURE.md`: cómo se organiza el código.
3. Este archivo (`AGENTS.md`).
4. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual").
5. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Cinco momentos

Quien trabaja en esta carpeta interviene solo en este orden. El agente se para al terminar cada momento y no empieza el siguiente. El orquestador de git (`agents/git-workflow-agent.md`) encadena los pasos **de un mismo momento** sin pedir un sí, pero tampoco pasa al siguiente.

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
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**
- Si la spec activa no describe lo pedido, no se reutiliza: se abre `specs/NNN-nombre/spec.md`.

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
- Ningún fichero de la app se adelanta a las tres specs. «Fichero de la app» es todo lo de esta carpeta, también `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` (constitución §4.1). Si la spec activa no cubre el pedido, ese pedido recorre los cinco momentos: primero la issue.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, dilo y no inventes el cambio.

---

## 3. Estructura de carpetas

El árbol de carpetas está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-discord-bot`.

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

Las únicas dependencias de Python son Flask y pytest. Las herramientas externas (`cloudflared`, `git`, `gh`, el MCP de GitHub) están en la constitución P3. Los scripts de `tools/` son de bash: en Windows, se lanzan desde Git Bash.

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
- [ ] La persona que trabaja en esta carpeta la ha probado y la ha dado por buena.

---

## 7. Estado actual

| Spec                                | Fase                                                                           | Notas                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `001-checkin-codigo`                | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio`         | ✅ Implementada (2026-10-22)                                                   | Ningún fichero de la app se toca sin un spec aprobado           |
| Bot de Discord                      | Idea futura, sin número                                                        | Fuera del MVP                                                   |
| `003-activar-el-entorno`            | ✅ Implementada (2026-10-22): T01–T04, 77 tests                                | El README separa activar el entorno y arrancar la app           |
| `004-quitar-referencias-personales` | ✅ Implementada (2026-10-22): T01–T12, 80 tests                                | El README entra con un usuario genérico                         |
| `005-reorganizar-arquitectura`      | ✅ Implementada (2026-10-22): T01–T12, 87 tests                                | Documentos en `docs/` y código en reglas, acciones y borde      |
| `006-limite-por-ip-publica`         | ✅ Implementada (2026-10-23): T01–T11, 102 tests                               | Límite de intentos de registro por IP y lista de bloqueo        |
| `007-flujo-de-git`                  | ✅ Implementada (2026-10-30): T01–T06                                          | Flujo de git del curso y cinco momentos del humano. Issue #616  |
| `008-bloqueo-justo-y-reglas-claras` | ✅ Implementada (2026-10-30): T01–T10, 114 tests                               | Solo cuentan los códigos fallados, el bloqueo caduca, IP real con túnel, constitución 4.0 y comandos por sistema. Issue #653 |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.

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
