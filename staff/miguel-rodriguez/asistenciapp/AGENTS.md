# AGENTS.md — Manual de trabajo para agentes de IA

Este archivo explica **cómo debe trabajar un agente de IA** (Claude u otro) en AsistenciApp. La [docs/CONSTITUTION.md](docs/CONSTITUTION.md) dice **qué reglas** se cumplen; este archivo dice **cómo se trabaja** día a día.

---

## 1. Antes de hacer nada: lectura obligatoria

Lee en este orden al empezar cualquier tarea:

1. `docs/CONSTITUTION.md`: las reglas no negociables.
2. `docs/ARCHITECTURE.md`: estructura, responsabilidades y dependencias.
3. Este archivo (`AGENTS.md`).
4. La spec activa: `specs/NNN-nombre/spec.md` (ver §7 "Estado actual").
5. Su `plan.md` y su `tasks.md`, si ya existen.

Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

---

## 2. Flujo SDD paso a paso

Cada cambio de código, pruebas, README, instrucciones de uso u otra documentación de la app recorre estas fases **en orden**. Al terminar cada una, el agente **se detiene** y pide la aprobación de Miguel. No se avanza sin un "ok" explícito.

| Fase | Archivo | Pregunta que responde | Puerta de salida |
| --- | --- | --- | --- |
| 1. Especificar | `spec.md` | ¿**Qué** hay que construir y **por qué**? | Sin `[NECESITA ACLARACIÓN]` pendientes + aprobación de Miguel |
| 2. Planificar | `plan.md` | ¿**Cómo** lo construimos? | Pasa la comprobación de la constitución + aprobación de Miguel |
| 3. Desglosar | `tasks.md` | ¿En qué **pasos pequeños** lo hacemos? | Cada tarea apunta a un criterio de aceptación + aprobación de Miguel |
| 4. Implementar | código + tests | Hacerlo, tarea a tarea | `pytest` en verde + criterios verificados |

Si el pedido no tiene una spec aprobada que lo cubra, solo se redacta y se muestra esa spec; se espera el sí explícito de Miguel antes de preparar el plan o las tareas. Una issue, rama o PR no sustituye esa aprobación. Si el pedido no está cubierto por la spec activa, se abre otra spec sin ampliar silenciosamente una terminada. Las contradicciones detienen el trabajo afectado hasta acordar su resolución.

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

El árbol de carpetas y las responsabilidades están en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Las specs se numeran con tres dígitos y nombre en kebab-case: `001-checkin-codigo`, `002-spec-antes-del-cambio`.

---

## 4. Comandos

Ejecutar desde `staff/miguel-rodriguez/asistenciapp/`:

| Acción | Comando |
| --- | --- |
| Preparar el entorno (solo la primera vez) | `python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| Activar el entorno (en cada terminal nueva) | `source .venv/bin/activate` |
| Instalar el túnel (solo la primera vez) | `brew install cloudflared` |
| Arrancar para una clase online | `python app.py --tunel` (imprime el enlace público del panel) |
| Arrancar solo en local (desarrollo) | `python app.py` (abre en `http://localhost:8000`) |
| Ejecutar los tests | `pytest` |

Las dependencias son Flask, pytest y qrcode==8.2 sin extras de imágenes (constitución P3/4.1). qrcode declara colorama en Windows. No se instala Pillow para generar SVG.

---

## 5. Reglas de comportamiento

- **Solo se edita dentro de `staff/miguel-rodriguez/asistenciapp/`.**
- **Pregunta antes de suponer.** Ante una ambigüedad, pregunta o márcala con `[NECESITA ACLARACIÓN]`.
- **Explica lo que haces.** Miguel está aprendiendo SDD: al cerrar cada fase, resume qué se ha hecho, por qué y qué tiene que revisar.
- **Cambios pequeños.** Mejor varias tareas cortas que una enorme.
- **Nada de commits ni pushes** sin que Miguel lo pida.
- **Para todo lo que arranques.** Si levantas el servidor o `cloudflared` para probar, páralos al terminar y comprueba que el puerto queda libre: `lsof -nP -iTCP:8000 -sTCP:LISTEN` no debe mostrar nada. Ojo: en macOS el proceso aparece como `Python` (con mayúscula). (Incidencia del 2026-10-20 en T12.)
- **No toques la constitución** salvo para proponer una enmienda, que solo Miguel aprueba (constitución §8).

---


### Escritura y decisiones de diseño

- Elimina eslóganes, ayudas y etiquetas secundarias redundantes. Si una pantalla depende de ellos para entenderse, corrige su disposición. Conserva las etiquetas accesibles, los estados y los errores que ayudan a actuar.
- Elige la solución que mejore conjuntamente la experiencia de usuario (UX), de desarrollo (DX) y de trabajo de agentes (AX), sin romper el comportamiento existente. Esto no permite saltarse las aprobaciones ni ampliar el alcance.

## 6. Definición de "terminado"

Una funcionalidad está terminada cuando:

- [ ] Todas las tareas de `tasks.md` están en `[x]`.
- [ ] `pytest` pasa.
- [ ] Cada `CA-xx` de la spec tiene su test o su verificación manual hecha.
- [ ] El `README.md` explica cómo usar lo nuevo.
- [ ] Miguel la ha probado y la ha dado por buena.

---

## 7. Estado actual

| Spec | Fase | Notas |
| --- | --- | --- |
| `001-checkin-codigo` | ✅ Terminada v1.2 (2026-10-20): 25 tareas, 77 tests, CA-01 a CA-26 verificados | Check-in con código rotatorio, válido para cualquier plataforma |
| `002-spec-antes-del-cambio` | Implementada y verificada (2026-10-22); pendiente de revisión final de Miguel | Reglas SDD actualizadas; 77 tests pasan; evidencia en tasks.md |
| `003-activar-el-entorno` | Terminada; revisión final aprobada por Miguel el 2026-10-22 | README separado en activación y arranque; 77 tests pasan; evidencia en tasks.md |
| `004-quitar-referencias-personales` | Terminada; revisión final aprobada por Miguel el 2026-10-23 | Referencias heredadas retiradas; hechos conservados; 77 tests pasan; evidencia en tasks.md |
| `005-reorganizar-arquitectura` | Terminada; revisión final aprobada por Miguel el 2026-10-23 | 112 pruebas aprobadas; comparación previa de 22 escenarios y regresión de precedencia corregida; evidencia en tasks.md |
| `006-limitar-intentos-de-registro` | Implementada y verificada; ejecución completa delegada por Miguel el 2026-10-24 | 145 pruebas y comprobación de navegador; revisión de compañeros pendiente; evidencia en tasks.md |
| `007-carrera-de-asistencia` | Implementada, verificada localmente y probada por Miguel el 2026-10-25; publicación pendiente | QR local, quince SVG, lobby, salida, registro, llegada y podio; 226 pruebas de app; evidencia en specs/007-carrera-de-asistencia/evidence.md; recorrido básico y QR móvil probados por Miguel; publicación pendiente |
| `008-proteger-el-registro-de-carrera` | Implementada, verificada y resultado local aprobado por Miguel el 2026-10-25; publicación pendiente | Issue #328; R1/R2 corregidos; 218 pruebas de app y dos reproducciones originales pasan; evidencia y comandos en tasks.md; sin PR 008 publicada ni aprobación de peers atribuida |
| `009-refinar-presentacion-de-carrera` | Implementada y verificada localmente; pendiente de probar por Miguel y publicar | Tema, SVG simplificados y celebración 2+3+8; 226 tests Python y 15 Node; evidencia en specs/009-refinar-presentacion-de-carrera/evidence.md; sin PR ni prueba del resultado nuevo atribuida a Miguel |
| `010-consistencia-y-legibilidad` | Terminada; revisión final aprobada por Miguel el 2026-10-26 | Reglas de estilo y árbol único; nueve criterios y seis casos revisados; 226 pruebas pasan; evidencia en specs/010-consistencia-y-legibilidad/tasks.md; sin refactorización de código |
| `011-funciones-de-carrera-legibles` | Implementada y verificada; preparación completa autorizada por Miguel el 2026-10-26; revisión de compañeros pendiente | Resultados semánticos, permiso local de un uso y compatibilidad con 010; evidencia en specs/011-funciones-de-carrera-legibles/tasks.md |
| `012-alumnos-y-personajes-en-almacenamiento` | Implementada y verificada; resultado aprobado por Miguel el 2026-10-27 | Issue #524, PR #525 en draft con base staging; 304 pruebas Python y 29 JavaScript; recorrido local verificado; evidencia en tasks.md; publicación autorizada, revisión de compañeros pendiente |
| Bot de Discord (sin número asignado) | Idea futura | Fuera del MVP |

> El agente actualiza esta tabla cada vez que una spec cambia de fase.

## 8. Forma de escribir el código

### Funciones y pasos claros

- Cada módulo abre con una frase que explica su responsabilidad. Las funciones nuevas o modificadas tienen tipos, nombres descriptivos y una responsabilidad reconocible.
- Dominio y casos de uso se escriben con funciones que reciben datos explícitos y devuelven resultados. El dominio calcula reglas; los casos de uso coordinan sus efectos y el almacenamiento. No se crean clases propias para entidades, resultados, servicios o permisos internos de ejecución, ni estado global mutable para coordinar operaciones.
- Se permiten clases que únicamente identifican errores de negocio, sin lógica adicional ni códigos HTTP. El adaptador HTTP traduce esos errores. No se reescriben clases de bibliotecas externas para cumplir esta convención.
- Separa los pasos cuando una expresión mezcla obtener datos, transformarlos y construir la respuesta. Usa nombres como `session_id`, `connection` o `checkins` en vez de abreviaturas ambiguas. Conserva las expresiones breves que se entiendan sin explicación.
- Una función no necesita un helper por cada línea ni un límite arbitrario de longitud. No obligues al lector a recorrer varios archivos para entender una operación sencilla.

### Documentación de funciones

Una función pública está destinada a usarse desde otro módulo. Describe sus parámetros con `:param`, su resultado con `:return` y `:rtype`, e incluye un ejemplo breve `Usage::`. Ejemplo ilustrativo:

```python
def count_checkins(checkins: list[dict]) -> int:
    """Cuenta las asistencias recibidas.

    :param checkins: registros de asistencia.
    :return: número de registros recibidos.
    :rtype: int

    Usage::

        count_checkins([{"name": "Ada"}])
    """
    return len(checkins)
```

Las funciones internas conservan tipos y una explicación breve del propósito y de las restricciones no evidentes; no necesitan repetir toda la plantilla pública. El prefijo `_` señala uso interno al módulo por convención, no impide acceder a la función.

Los comentarios explican decisiones, efectos o restricciones en español claro. Evita plantillas que no describen el resultado real y comentarios que solo repiten la instrucción.

### Simplicidad y almacenamiento

Usa funciones concretas para la base SQLite de esta app. No crees repositorios genéricos, proveedores intercambiables, fábricas para distintos motores ni capas para usos hipotéticos. Recibir `db_path` para probar con datos temporales no implica soportar otros motores.

Conserva o introduce un helper solo si reduce repetición o errores reales y deja claro quién abre, confirma, revierte y cierra la operación. Un context manager puede servir para ello: no se elimina por su nombre ni se sustituye por más código sin una mejora concreta. Justifica cada abstracción nueva en el plan con la necesidad actual y el recorrido de la operación que resuelve.

Este segundo ejemplo ilustra pasos legibles; no implementa una consulta ni una API nueva:

```python
# query contiene el SQL leído de su archivo; connection ya está abierta.
rows = connection.execute(query, (session_id,)).fetchall()
checkins = [dict(row) for row in rows]
return checkins
```

El reparto entre reglas, datos concretos, consultas y adaptadores se define en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Estas pautas se aplican al alcance aprobado de cada cambio; no autorizan reescribir módulos ajenos a la tarea.

### Seguridad al simplificar

Conserva datos, resultados visibles y las garantías de [la constitución, §6](docs/CONSTITUTION.md#6-seguridad). No devuelvas intentos gastados, reevalúes un mismo envío, confirmes asistencias sin resultado válido, compartas el presupuesto de una carrera entre alumnos ni prolongues accesos caducados. Sustituir una clase o un helper nunca permite quitar la garantía que protegía. Las transacciones, validaciones y controles necesarios permanecen; la reserva y confirmación actuales se explican en [arquitectura](docs/ARCHITECTURE.md#reserva-a-y-resultado-b).

Las dependencias siguen [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Las specs cerradas 001–004 conservan sus rutas históricas: el antiguo AGENT.md corresponde a este AGENTS.md y la constitución que estaba en la raíz está ahora en docs/CONSTITUTION.md. No se reescriben esas evidencias al mover documentos.

## Ejecución local autorizada de 008

Miguel autorizó implementar y probar en una copia separada mientras se integran las predecesoras. T02 sigue pendiente en su parte de publicación: la futura PR será exclusiva de 008 y tendrá base staging. No se cambian bases para encadenar PRs ni se publica el trabajo sobre la rama 300. La enmienda 4.0 aprobada se aplica solo en esta copia. No se han usado bases reales ni cambiado dependencias. La interfaz 007 se implementó después en otra copia local autorizada, sin modificar esta base de referencia de 008.

Verificación del backend: `python -m pytest -q`; ensayo HTTP propio y acotado: `python -m pytest -q tests/test_race_live_http.py`. Las pruebas detienen sus propios servidores. La demostración y revisión de Miguel no se dan por realizadas al pasar pytest. Véase [evidencia 008](specs/008-proteger-el-registro-de-carrera/evidence.md).


## Ejecución local autorizada de 007

Miguel aprobó el resultado local de 008 el 2026-10-25 y ordenó implementar 007 siguiendo sus tareas. Se trabaja en `007-local-implementation/asistenciapp`, copia nueva sobre 008 sin datos reales. La enmienda exacta 4.1 y qrcode==8.2 estaban incluidos en el plan aprobado. T02 y T50 mantienen pendiente el momento Git hasta disponer de un diff exclusivo a staging; no se crean bases encadenadas. No hay PR de 007 publicada.

Miguel confirmó después el recorrido en ordenador y con cámara de móvil por HTTPS; T43 está completa. T49 conserva pendiente la limpieza definitiva del código local tras su publicación. Conservar la copia hasta esa prueba; no dejar servidores propios activos entre ensayos. [Evidencia](specs/007-carrera-de-asistencia/evidence.md), [revisión](specs/007-carrera-de-asistencia/review.md).


Publicación 2026-10-26: PR [356](https://github.com/venturars/neoland-102026/pull/356) de la tarea 009, base staging, creada por instrucción expresa de Miguel aunque haya dependencias pendientes. Los estados anteriores describen la ejecución local y sus fechas; la PR actual es la referencia de publicación.
