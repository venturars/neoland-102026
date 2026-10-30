# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [constitución](docs/CONSTITUTION.md) dice **qué reglas** se cumplen. La [arquitectura](docs/ARCHITECTURE.md) dice **cómo se organiza** el código. Este archivo dice **cómo se trabaja** día a día y **cómo se escribe** cada función.

El trabajo de git sigue `agents/git-workflow-agent.md` de esta carpeta.

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

## 2. Los únicos momentos del humano

La persona que trabaja en esta carpeta interviene solo en estos momentos, **en este orden**. El agente hace **solo el momento pedido**, **se para** al terminarlo y espera el siguiente pedido explícito. **No** encadena un momento con el siguiente y **no** pide ok de más.

1. **Crear la issue** — Si la tarea no se puede escribir todavía, la entrevista es aquí (una pregunta cada vez). Se crea la issue. **No** se abre la rama. **Para.**
2. **Crear el draft** — Es el «Empezar» de la plantilla, de una vez: adelantar `staging`, crear la rama desde `staging`, commit vacío `chore: open #N`, push, pull request en draft contra `staging` con el autor y el enlace `Closes #N`. **No** se escriben specs. **Para.**
3. **Crear las specs** — De una vez y en este orden: `spec.md`, `plan.md`, `tasks.md`. La spec abre con el número de issue. Si falta un dato, el agente pregunta; no inventa. **No** se toca código. **Para.**
4. **Implementar la spec** — Se ejecutan las tasks una detrás de otra, con sus tests o comprobaciones. **No** se hace commit ni push. **Para.**
5. **La pull request** — Solo lo que se pide en ese momento: subir los cambios (commit de ficheros nombrados y push), pedir revisión (asignar revisores y sacar de draft), u otra petición sobre esa PR. **No** se fusiona en `staging`. **Para.**

Una issue, una rama o una pull request **no autorizan** el cambio de código. El código solo espera al momento 4, y solo si el momento 3 ya dejó los tres ficheros.

Commit y push solo en el momento 2 (commit vacío) y en el momento 5, cuando lo piden.

### 2.1 Forma de las specs

- `spec.md` habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch"). Estructura: Problema · Usuarios · Historias · Criterios (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas. Cada criterio lleva `CA-xx`.
- `plan.md` describe el cómo e incluye **"Comprobación de la constitución"** (P1–P6 y §5–§6). Toda dependencia externa se justifica (P3).
- `tasks.md` lista casillas `- [ ] T01 …`; cada tarea apunta a un `CA-xx`. Primero el test, luego el código, siempre que sea posible.
- Al implementar: una tarea cada vez; márcala `[x]` al acabarla. Si la spec o el plan están mal, **para** y propón el cambio en el documento.

---

## 3. Estructura de carpetas

El árbol de carpetas está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-discord-bot`.

---

## 4. Comandos

Ejecutar desde `staff/<usuario>/asistenciapp/`:

| Acción | Comando |
| --- | --- |
| Preparar el entorno (solo la primera vez) | `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| Activar el entorno (en cada terminal nueva) | `source .venv/bin/activate` |
| Instalar el túnel (solo la primera vez) | `brew install cloudflared` |
| Arrancar para una clase online | `python app.py --tunel` (imprime el enlace público del panel) |
| Arrancar solo en local (desarrollo) | `python app.py` (abre en `http://localhost:8000`) |
| Ejecutar los tests | `pytest` |

En Windows, activar el entorno con `.\.venv\Scripts\Activate.ps1` (o `Activate.bat`) en lugar de `source .venv/bin/activate`.

Las únicas dependencias son Flask y pytest (constitución P3).

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/<usuario>/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar la persona que trabaja en esta carpeta.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Commit y push** solo en el momento 2 (commit vacío) y en el momento 5, cuando lo piden (§2).
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto 8000 queda libre. En Windows: `netstat -ano | findstr :8000` no debe mostrar una línea `LISTENING`. En macOS/Linux: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada (el proceso puede aparecer como `Python` con mayúscula).
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

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | ✅ Implementada (2026-10-23) | Ningún fichero de la app se toca sin un spec aprobado; issue/rama/PR no sustituyen al spec |
| `003-activar-el-entorno` | ✅ Implementada (2026-10-26): T01–T04 | El README separa activar el entorno y arrancar la app |
| `004-quitar-referencias-personales` | ✅ Implementada (2026-10-26): T01–T10 | Documentación con usuario genérico; sin carpeta personal |
| `005-reorganizar-arquitectura` | ✅ Implementada (2026-10-26): T01–T12, 87 tests | Documentos en `docs/`; código en reglas, acciones y borde |
| `006-limite-por-ip-publica` | ✅ Implementada (2026-10-26): T01–T11, 102 tests | Límite de intentos de registro por IP y lista de bloqueo |
| `007-checkin-discord` | ✅ Implementada (2026-10-27): T01–T11 | Check-in con Discord; issue #498 |
| `008-add-student-manually` | ✅ Implementada (2026-10-27): T01–T06 | Añadir alumno a mano; issue #529 |
| `009-adapt-git-workflow` | ✅ Implementada (2026-10-30): T01–T11 | Flujo de git + cinco momentos; issue #618 |

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
