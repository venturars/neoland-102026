# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [constitución](docs/CONSTITUTION.md) dice **qué reglas** se cumplen. [ARCHITECTURE.md](docs/ARCHITECTURE.md) dice **cómo se organiza** el código. Este archivo dice **cómo se trabaja** día a día y **cómo se escribe** cada función.

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

## 2. Flujo SDD paso a paso

Nada se escribe en esta copia sin una spec aprobada por el usuario. Eso incluye las instrucciones de uso, las comprobaciones, el resto de documentación de uso y el código de una funcionalidad nueva. La issue, la rama y la pull request del bootcamp no sustituyen a esa spec. Si falta, el agente para y no escribe.

Cada funcionalidad recorre estas fases **en orden**. Al terminar cada una, el agente **se detiene** y pide la aprobación del usuario. No se avanza sin un "ok" explícito.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que construir y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación del usuario |
| 2. Planificar | `plan.md` | ¿**Cómo** lo construimos? | Pasa la comprobación de la constitución + aprobación del usuario |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + aprobación del usuario |
| 4. Implementar | código + tests | Hacerlo, tarea a tarea | `pytest` en verde + criterios verificados |

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**

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
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación. El código nunca se adelanta a los documentos.

---

## 3. Estructura de carpetas

El árbol de carpetas está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`, `003-activar-entorno-no-es-arrancar-app`, `004-quitar-referencias-personales`, `005-reorganizar-arquitectura`.

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

Las únicas dependencias son Flask y pytest (constitución P3).

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/<usuario>/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** El usuario está aprendiendo SDD: al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que el usuario lo pida.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** (`docs/CONSTITUTION.md`) salvo para proponer una enmienda, que solo el usuario aprueba (constitución §8).

---

## 6. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] El usuario la ha probado y la ha dado por buena.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | Implementada (2026-10-22) | La spec aprobada frena cualquier cambio. El ok es del usuario, en esta carpeta |
| `003-activar-entorno-no-es-arrancar-app` | Implementada (2026-10-25) | Activar el entorno y arrancar la app son dos pasos distintos en el README |
| `004-quitar-referencias-personales` | Implementada (2026-10-25) | Las reglas y el README no nombran a una persona ni su carpeta |
| `005-reorganizar-arquitectura` | Implementada (2026-10-26): T01–T12 | Documentos en `docs/` y código en reglas, acciones y borde |
| Discord | Idea futura | Fuera del MVP, sin número de spec |

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
