# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [docs/CONSTITUTION.md](docs/CONSTITUTION.md) dice **qué reglas** se cumplen; este archivo dice **cómo se trabaja** día a día.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. Este archivo (`AGENTS.md`): reconocer el momento autorizado antes de actuar. Los momentos Issue y Rama y PR draft no escriben specs; el tercero prepara los tres documentos para revisión conjunta.
3. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual").
4. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Cinco momentos de AsistenciApp

El flujo de Git se lee en [agents/git-workflow-agent.md](agents/git-workflow-agent.md). Las rutas de agents y skills de esa copia se resuelven dentro de AsistenciApp. La [guía local](docs/GIT-AUTOMATION.md) explica cómo ejecutarlo.

El SDD local de AsistenciApp prevalece sobre cualquier indicación del template de continuar automáticamente. Al terminar cada momento, el agente se detiene. No se pide otro ok entre spec y plan ni entre plan y tasks.

1. Issue: crear o reutilizar la issue; sin abrir rama.
2. Draft: adelantar staging, preparar rama, commit vacío, push, PR draft contra staging, autor y enlace de issue; sin specs.
3. Specs: escribir spec, plan y tasks en la misma pasada y en ese orden; revisión conjunta antes de implementar.
4. Implementar: ejecutar las tareas aprobadas y presentar resultados; sin commit ni push.
5. Pull request: realizar solo lo solicitado; sin merge.

Todo cambio de código, tests, README u otra documentación de uso requiere una spec aprobada que lo cubra.

Si la spec activa no cubre el pedido, se abre una spec nueva.

Una issue, una rama o una pull request no sustituyen la spec aprobada.

No se encadena un momento con el siguiente sin autorización expresa.

Las dudas se resuelven antes de implementar; no se inventan requisitos.

El código espera a spec, plan y tasks revisados y a la petición de implementar. Registrar la aprobación en la spec forma parte del SDD.

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

```
asistenciapp/
├── docs/CONSTITUTION.md
├── docs/ARCHITECTURE.md
├── AGENTS.md
├── README.md
├── specs/
├── asistencia/domain/     # reglas
├── asistencia/usecases/   # acciones
├── asistencia/storage/    # SQLite
├── asistencia/export.py
├── asistencia/tunnel.py
├── app.py                # HTTP y arranque
├── static/
├── tests/
├── requirements.txt
├── pytest.ini
├── .venv/                # local, no versionado
└── data/                 # local, no versionado
```

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`.

---

## 4. Comandos

Ejecutar desde `staff/jimena-duran/asistenciapp/`:

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

- **Solo se edita dentro de `staff/jimena-duran/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Jimena Durán está aprendiendo SDD: al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que Jimena Durán lo pida.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula).
- **No toques la constitución** salvo para proponer una enmienda, que solo Jimena Durán aprueba (constitución §8).

---

## 6. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] Jimena Durán la ha probado y la ha dado por buena.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| Bot de Discord | Idea futura | Fuera del MVP |

| `002-spec-antes-del-cambio` | Implementada y verificada localmente (2026-10-22) | 93 tests pasan; spec 001 intacta |

| `003-activar-el-entorno` | Implementada y verificada localmente (2026-10-22) | 97 tests pasan; aprobación humana final pendiente |

| `004-quitar-referencias-personales` | Implementada localmente | 100 tests pasan; sin commit de implementación |

| `005-reorganizar-arquitectura` | Implementada y verificada localmente | 108 tests pasan; aprobación humana final pendiente |

| `006-limite-por-ip-publica` | Implementación aprobada el 2026-10-23; validación en curso | Límites por dirección de conexión y bloqueo persistente; sin commit, push ni PR |

| `008-flujo-git-cinco-momentos` | Corrección del flujo original implementada y comprobada localmente; pendiente revisión | SDD propio y enmienda 3.1; evidencia nueva separada; publicación selectiva de la corrección autorizada en la PR existente |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.

## 8. Forma de escribir el código

Cada módulo abre con una frase de su responsabilidad. Cada función pública
lleva tipos, dice qué recibe y devuelve con :param, :return y :rtype, y muestra
un ejemplo Usage:: cuando se llama desde otro módulo. Una función hace una cosa.
El detalle de capas está en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
