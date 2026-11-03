# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [constitución](docs/CONSTITUTION.md) dice **qué reglas** se cumplen y [ARCHITECTURE.md](docs/ARCHITECTURE.md) **cómo se organiza** el código. Este archivo dice **cómo se trabaja** día a día y **cómo se escribe** el código (§8).

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. `docs/ARCHITECTURE.md`: qué pieza del código hace qué y quién puede importar a quién.
3. Este archivo (`AGENTS.md`).
4. `agents/git-workflow-agent.md`: el orquestador del flujo de git (§2).
5. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual").
6. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Flujo de trabajo: cinco momentos

Todo cambio en la app (código, tests, README o documentación de uso) pasa por estos cinco momentos, **en este orden**. Quien trabaja en esta carpeta pide un momento; el agente lo hace entero y **para**. No encadena el siguiente ni pide otro ok en medio.

Los pasos de git los hace el orquestador [`agents/git-workflow-agent.md`](agents/git-workflow-agent.md), que llama al subagente o a la skill que toca.

| Momento | Qué hace el agente | Subagentes y skills |
| --- | --- | --- |
| **1. Crear la issue** | Deja escrito qué hay que hacer y cómo se comprueba, con la plantilla del tipo en `templates/issues/`. Si la tarea aún no está clara, primero pregunta, una cosa cada vez. No abre rama | `help-me-to-think` (si hace falta) → `create-issue` |
| **2. Crear el draft** | Adelanta `staging`, crea la rama `N-tipo-descripcion` desde `staging`, hace el commit vacío `chore: open #N`, la sube, abre la PR en borrador contra `staging` con autor y la enlaza con `Closes #N`. No escribe specs | `pull-changes` → `create-branch` (`create-branch-from-staging`) → `create-commit` (`create-empty-commit`) → `launch-push` → `create-pr` (`create-pr-base-staging`, `assign-author`, `create-draft`) → `link-pr-to-issue` |
| **3. Crear las specs** | Escribe `spec.md`, `plan.md` y `tasks.md` en la misma pasada (§2.1–§2.3). Si falta un dato, lo pregunta ahora; no lo inventa. No toca la app | — |
| **4. Implementar** | Hace las tasks en orden y las marca (§2.4). Pedir este momento es dar por buenas la spec, el plan y las tasks | — |
| **5. La pull request** | Solo lo que se pida: subir los ficheros (commit de trabajo y push), pedir revisión (la PR sale de draft) u otra cosa sobre esa PR. **Nunca** hace merge a `staging` | `create-commit` (`commit-changes`) → `launch-push`; `assign-reviewers` |

Una issue, una rama o una pull request no autorizan a tocar la app: el código espera al momento 4, con la spec, el plan y las tasks ya escritos.

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**
- Si lo pedido no encaja en ninguna spec abierta, crea una nueva con el siguiente número. Las specs terminadas no se reabren para meter otros cambios.

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
- En este momento no hay commit ni push: eso es el momento 5, si se pide.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación.
- Ningún fichero se adelanta a su spec. Una issue, una rama o una pull request no cuentan como spec.

---

## 3. Estructura de carpetas

El árbol y qué va en cada carpeta están en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Si un cambio añade o mueve ficheros, se actualiza allí.

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-discord-bot`.

---

## 4. Comandos

Ejecutar desde `staff/sergio-moras/asistenciapp/`:

| Acción | Comando |
| --- | --- |
| Preparar el entorno (solo la primera vez) | `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| Activar el entorno (en cada terminal nueva) | `source .venv/bin/activate` |
| Instalar el túnel (solo la primera vez) | `brew install cloudflared` |
| Arrancar para una clase online | `python app.py --tunel` (imprime el enlace público del panel) |
| Arrancar solo en local (desarrollo) | `python app.py` (abre en `http://localhost:8000`) |
| Ejecutar los tests | `pytest` |

Las únicas dependencias son Flask y pytest (constitución P3).

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/sergio-moras/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Al cerrar cada momento, resume qué se ha hecho, por qué y qué conviene revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Commit y push solo en dos momentos:** el commit vacío del momento 2 y los del momento 5, cuando se piden. Nunca merge a `staging`.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** (`docs/CONSTITUTION.md`) salvo para proponer una enmienda, que solo aprueba quien trabaja en esta carpeta (constitución §8).

---

## 6. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] Quien trabaja en esta carpeta la ha probado y la da por buena.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | ✅ Implementada (2026-11-01) | Cualquier cambio de la app necesita spec aprobada |
| `003-activar-el-entorno` | ✅ Implementada (2026-11-01) | El README separa activar el entorno de arrancar la app |
| `004-quitar-referencias-personales` | ✅ Implementada (2026-11-01) | Documentación sin nombres personales; rutas con `staff/<usuario>/asistenciapp` |
| `005-reorganizar-arquitectura` | ✅ Implementada (2026-11-01) | Documentos en `docs/`; código en `domain/`, `use_cases/`, `infra/` y `app.py` |
| `006-limite-intentos-por-ip` | ✅ Implementada (2026-11-01) | 5 intentos/s y 20/min por IP, bloqueo permanente; constitución 3.0 |
| `007-flujo-de-git` | ✅ Implementada (2026-11-02) | Flujo de git del curso con orquestador y subagentes; trabajo en cinco momentos; constitución 3.1 |
| Integración con Discord | Idea, sin número asignado | Fuera del MVP |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.

---

## 8. Cómo se escribe el código

Se sigue la forma de [requests/api.py](https://github.com/psf/requests/blob/main/src/requests/api.py): quien abre un fichero entiende cada función sin leer su cuerpo.

- **Cada módulo** empieza con un docstring de una frase que dice para qué sirve.
- **Cada función pública** lleva tipos en la firma y un docstring con:
  - una frase de qué hace;
  - `:param nombre:` por cada parámetro;
  - `:return:` qué devuelve y `:rtype:` de qué tipo;
  - `:raises Error:` si lanza un error que quien la llama debe tratar;
  - `Usage::` con un ejemplo corto, si se llama desde otro módulo.
- **Las funciones privadas** (`_nombre`) pueden ir sin docstring si el nombre basta.
- **Una función, una tarea.** Si hace falta la palabra «y» para describirla, probablemente son dos.
- **Cada fichero en su pieza** (ver `docs/ARCHITECTURE.md` §2). Si un import rompe esa tabla, `tests/test_architecture.py` falla.
- Los mensajes que ve el usuario van en español; los nombres del código pueden ir en inglés (constitución P6).

Ejemplo:

```python
def is_valid_code(secret: bytes, code: str, t: float) -> bool:
    """Dice si el código escrito por el alumno vale en el instante ``t``.

    Se acepta el de la ventana actual y el de la anterior.

    :param secret: secreto de la sesión.
    :param code: código que escribió el alumno.
    :param t: instante en segundos Unix.
    :return: ``True`` si el código vale.
    :rtype: bool

    Usage::

      >>> is_valid_code(secret, "0427", time.time())
      True
    """
```
