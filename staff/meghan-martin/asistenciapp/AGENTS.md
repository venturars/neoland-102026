# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [docs/CONSTITUTION.md](docs/CONSTITUTION.md) dice **qué reglas** se cumplen. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) dice **cómo se reparte el código**. Este archivo dice **cómo se trabaja** día a día.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. `docs/ARCHITECTURE.md`: cómo se reparte el código.
3. Este archivo (`AGENTS.md`).
4. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual").
5. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Flujo SDD paso a paso

Cualquier cambio de esta app pasa por estas fases, también si no es una función nueva. Al acabar una fase, el agente para y pide el sí a quien trabaja en esta carpeta. Sin ese sí no sigue.

Hasta el sí del spec, el agente no crea el plan, ni las tasks, ni toca el fichero del cambio. Solo escribe el spec y lo enseña.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que cambiar y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + el sí de quien trabaja en esta carpeta |
| 2. Planificar | `plan.md` | ¿**Cómo** lo hacemos? | Pasa la comprobación de la constitución + ese mismo sí |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + ese mismo sí |
| 4. Implementar | el cambio que digan las tasks | Hacerlo, tarea a tarea. El README entra si una task lo dice | Criterios verificados |

### 2.1 Especificar (`spec.md`)
- Habla del usuario y del problema. **Nunca** nombra tecnologías (nada de "SQLite", "endpoint", "fetch").
- Estructura: Problema · Usuarios · Historias de usuario · Criterios de aceptación (Dado / Cuando / Entonces) · Fuera de alcance · Preguntas abiertas.
- Cada criterio de aceptación lleva un identificador (`CA-01`, `CA-02`…) para poder enlazarlo desde tareas y tests.
- Si falta información, escribe `[NECESITA ACLARACIÓN: pregunta concreta]`. **No inventes la respuesta.**
- Si lo que piden no está en el spec abierto, no se mete en uno ya cerrado. Se abre `specs/NNN-nombre/spec.md`.

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
- El fichero del cambio espera al spec. Si el pedido no cabe en el spec abierto, **para**, escribe otro spec y espera el sí.
- Si a mitad del cambio ves que el spec o el plan fallan, **para**, propone el arreglo en el documento y espera el sí. El fichero no se adelanta al documento.

---

## 3. Estructura de carpetas

```
asistenciapp/
├── docs/
│   ├── CONSTITUTION.md    # reglas no negociables
│   └── ARCHITECTURE.md    # cómo se reparte el código
├── AGENTS.md              # este archivo
├── README.md              # cómo arrancar la app (para humanos)
├── specs/
│   └── NNN-nombre/
│       ├── spec.md        # qué y por qué
│       ├── plan.md        # cómo
│       └── tasks.md       # pasos
├── requirements.txt       # dependencias de Python (Flask, pytest)
├── pytest.ini             # configuración de pytest
├── app.py                 # recibe la petición y pide una acción
├── asistencia/
│   ├── domain/            # reglas
│   ├── usecases/          # acciones
│   ├── storage/           # almacén SQLite
│   ├── export.py          # CSV
│   └── tunnel.py          # enlace público
├── static/                # HTML, CSS y JS del navegador
├── tests/                 # tests (test_*.py)
├── .venv/                 # entorno virtual de Python (no se sube a git)
└── data/                  # base de datos SQLite (no se sube a git)
```

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`.

---

## 4. Comandos

Ejecutar desde `staff/meghan-martin/asistenciapp/`:

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

- **Solo se edita dentro de `staff/meghan-martin/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Quien trabaja en esta carpeta está aprendiendo el proceso: al cerrar cada fase, di qué cambiaste, por qué, y qué tiene que leer.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que esa persona lo pida.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda. El sí lo da quien trabaja en esta carpeta (constitución §8).

---

## 6. Definición de "terminado"

Un cambio está terminado cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa, cuando el cambio toca comportamiento de la app.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo, cuando una task lo pide.
- [ ] Quien trabaja en esta carpeta lo ha probado y ha dicho que está bien.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | ✅ Implementada (2026-10-22) | Cualquier fichero espera un spec con el sí |
| `003-activar-el-entorno` | ✅ Implementada (2026-10-22) | Activar el entorno y arrancar la app son dos títulos |
| `004-quitar-referencias-personales` | ✅ Implementada (2026-10-22) | Las instrucciones usan `staff/<usuario>/asistenciapp` |
| `005-reorganizar-arquitectura` | ✅ Implementada (2026-10-23) | Documentos en `docs/`, reglas, acciones y almacén separados |
| Bot de Discord | Idea futura | Sin número de spec |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.

---

## 8. Cómo se escribe una función

Una función pública dice qué recibe, qué devuelve y un ejemplo corto.

```python
def code_for(secret: bytes, t: float) -> str:
    """El código de 4 cifras en ese instante.

    Recibe el secreto de la clase y el instante, en segundos.
    Devuelve cuatro dígitos.

    Ejemplo: code_for(secreto, ahora) -> "4821"
    """
```
