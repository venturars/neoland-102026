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

Cada cambio en esta app recorre estas fases **en orden**. Al terminar cada una, el agente **se detiene** y pide la aprobación de la persona que trabaja en esta carpeta. No se avanza sin un "ok" explícito.

Al empezar el cambio, el único fichero nuevo permitido es el `spec.md`. El agente lo enseña y espera el ok. El plan, las tasks y el cambio vienen después.

| Fase           | Archivo                       | Pregunta que responde                                             | Puerta de salida                                                                              |
| -------------- | ----------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1. Especificar | `spec.md`                     | ¿**Qué** hay que hacer y **por qué**?                             | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de la persona que trabaja en esta carpeta |
| 2. Planificar  | `plan.md`                     | ¿**Cómo** lo hacemos?                                             | Pasa la comprobación de la constitución + esa misma aprobación                                |
| 3. Desglosar   | `tasks.md`                    | ¿En qué **pasos pequeños** lo hacemos?                            | Cada tarea apunta a un criterio de aceptación + esa misma aprobación                          |
| 4. Implementar | el cambio que digan las tasks | Hacerlo, tarea a tarea. Incluye el README cuando una task lo diga | Criterios verificados                                                                         |

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
- Ningún fichero de la app se adelanta al spec. Si la spec activa no cubre el pedido, **para**, escribe el spec y espera aprobación.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación.

---

## 3. Estructura de carpetas

El árbol de carpetas está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-discord-bot`.

---

## 4. Comandos

Ejecutar desde `staff/Diego-Torres/asistenciapp/`:

| Acción                                      | Comando                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| Preparar el entorno (solo la primera vez)   | `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| Activar el entorno (en cada terminal nueva) | `source .venv/bin/activate`                                                             |
| Instalar el túnel (solo la primera vez)     | `brew install cloudflared`                                                              |
| Arrancar para una clase online              | `python app.py --tunel` (imprime el enlace público del panel)                           |
| Arrancar solo en local (desarrollo)         | `python app.py` (abre en `http://localhost:8000`)                                       |
| Ejecutar los tests                          | `pytest`                                                                                |

Las únicas dependencias son Flask y pytest (constitución P3).

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/Diego-Torres/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar la persona que trabaja en esta carpeta.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que esa persona lo pida.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
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
