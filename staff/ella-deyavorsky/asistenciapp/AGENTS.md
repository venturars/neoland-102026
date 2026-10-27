# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [constitución](docs/CONSTITUTION.md) dice **qué reglas** se cumplen; [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) dice **dónde va cada pieza de código**; este archivo dice **cómo se trabaja** día a día.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. Este archivo (`AGENTS.md`).
3. `docs/ARCHITECTURE.md`: las partes del código y qué puede importar cada una.
4. La spec activa: `specs/NNN-nombre/spec.md` (ver §8 "Estado actual").
5. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Flujo SDD paso a paso

Cada cambio en esta app recorre estas fases **en orden**. Al terminar cada una, el agente **se detiene** y pide la aprobación de la persona que trabaja en esta carpeta. No se avanza sin un "ok" explícito.

Al empezar el cambio, el único fichero nuevo permitido es el `spec.md`. El agente lo enseña y espera el ok. El plan, las tasks y el cambio vienen después.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que construir y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de la persona que trabaja en esta carpeta |
| 2. Planificar | `plan.md` | ¿**Cómo** lo construimos? | Pasa la comprobación de la constitución + aprobación de la persona que trabaja en esta carpeta |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + aprobación de la persona que trabaja en esta carpeta |
| 4. Implementar | el cambio que digan las tasks | Hacerlo, tarea a tarea. Incluye el README cuando una task lo diga | `pytest` en verde + criterios verificados |

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
- Ningún fichero de la app se adelanta al spec. Si la spec activa no cubre el pedido, **para**, escribe el spec y espera aprobación.
- Si durante la implementación descubres que la spec o el plan están mal o incompletos, **para**, propón el cambio en el documento y espera aprobación.

---

## 3. Estructura de carpetas

```
asistenciapp/
├── AGENTS.md              # este archivo
├── README.md              # cómo arrancar la app (para humanos)
├── docs/
│   ├── CONSTITUTION.md    # reglas no negociables
│   └── ARCHITECTURE.md    # partes del código y dependencias permitidas
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias de Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # borde HTTP (Flask) y punto de entrada
├── asistencia/            # lógica del servidor (paquete de Python)
│   ├── domain/            # reglas: códigos, nombres, decisiones de sesión
│   ├── usecases/          # acciones de la app
│   ├── storage/           # SQLite
│   ├── export.py          # CSV
│   └── tunnel.py          # túnel cloudflared
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests (test_*.py)
├── .venv/                 # entorno virtual de Python (no se sube a git)
└── data/                  # base de datos SQLite (no se sube a git)
```

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`.

---

## 4. Comandos

Ejecutar desde `staff/ella-deyavorsky/asistenciapp/`:

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

- **Solo se edita dentro de `staff/ella-deyavorsky/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar la persona que trabaja en esta carpeta.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que lo pida la persona que trabaja en esta carpeta.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda, que solo aprueba la persona que trabaja en esta carpeta (constitución §8).

---

## 6. Normas de escritura del código

Al estilo de la API pública de `requests`. Las partes y lo que puede importar cada una están en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md); `tests/test_architecture.py` lo vigila.

- **Módulo:** empieza con una docstring de una frase que dice para qué sirve.
- **Función pública:** docstring con `:param nombre:` por cada parámetro, `:return:` y `:rtype:`; si lanza errores, `:raises Error:`.
- **Ejemplo:** un bloque `Usage::` con un uso corto.
- **Tipos** en los parámetros y en el resultado de toda función pública.
- Funciones pequeñas con una sola tarea; sin lógica de negocio en las rutas.
- Los errores de negocio son excepciones del dominio con un mensaje claro en español (constitución §5).
- Nombres en inglés; mensajes y docstrings en español.
- Comentarios solo para el porqué; referencia al `CA-xx` cuando una función implementa un criterio.
- Sin código muerto ni abstracciones «por si acaso» (constitución P2).

Ejemplo:

```python
def ensure_open(session: dict) -> None:
    """Comprueba que la sesión admite registros (CA-09).

    :param session: la sesión, con su campo ``closed_at``.
    :return: nada si está abierta.
    :rtype: None
    :raises SessionClosed: si la sesión ya está cerrada.

    Usage::

        >>> ensure_open({"closed_at": None})
    """
    if session["closed_at"] is not None:
        raise SessionClosed(CLOSED)
```

---

## 7. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] La persona que trabaja en esta carpeta la ha probado y la ha dado por buena.

---

## 8. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | ✅ Implementada (2026-10-23) | Ningún fichero de la app se toca sin un spec aprobado |
| `003-activar-el-entorno` | ✅ Implementada (2026-10-24): T01–T04, 77 tests | El README separa activar el entorno y arrancar la app |
| `004-quitar-referencias-personales` | ✅ Implementada (2026-10-26) | Ninguna referencia personal a otro usuario en la documentación; la ruta del README es la de esta carpeta |
| `005-arquitectura-por-capas` | ✅ Implementada v1.3 (2026-10-26) | Documentación en `docs/`, `AGENTS.md` con normas de escritura y código en `domain`, `usecases` y `storage` |
| `006-limite-por-ip` | 🚧 En implementación (2026-10-26) | Límite de 5 intentos por segundo y 20 por minuto por IP; bloqueo permanente en la base; constitución 3.0 |
| `007-lista-de-alumnos` | 🚧 En implementación (2026-10-27): spec v1.1, plan v1.1, tasks v1.0 | Listas de grupo: el alumno elige su nombre, ausentes y nuevos en la descarga; propone la enmienda 4.0 de P4 (issue #539) |
| Bot de Discord | Idea futura, sin número | Fuera del MVP |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.
