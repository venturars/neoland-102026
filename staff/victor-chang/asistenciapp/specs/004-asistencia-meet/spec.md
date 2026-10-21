# Spec 004 · Asistencia automática desde Google Meet

> Estado: **Aprobada** (2026-10-21) · Creada: 2026-10-21

---

## 1. Problema

Con el check-in por código (spec 001), cada alumno tiene que **hacer algo** (abrir el enlace, escribir su nombre y el código) y el profesor tiene que **esperar** a que todos terminen. Sin embargo, en una clase de Google Meet **la propia plataforma ya sabe quién está en la llamada**.

Queremos que el profesor, estando en la reunión, pueda pasar lista de **todos los participantes con una sola acción**, sin que los alumnos tengan que hacer nada.

Meet incluye informes de asistencia propios, pero solo en planes de pago de Google Workspace. **Neoland no tiene un plan de pago**, así que esa opción no está disponible.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** (quien arranca la app) | Elegir cómo pasar lista en cada clase y, en modo automático, registrar a todos los presentes de un golpe. |
| **Organizador de la reunión** (la cuenta de Google del profesor) | Dar permiso **una vez** para que la app pueda saber quién está en sus reuniones. |
| **Alumno** | Nada: en modo automático no tiene que hacer ninguna acción. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero **registrar con una sola acción a todos los que están ahora en la reunión de Meet**, para no esperar a que cada alumno se registre.
- **HU-02**: Como profesor, quiero **repetir la acción más tarde en la misma clase** para añadir a quien llegó tarde, sin que se dupliquen los que ya estaban.
- **HU-03**: Como profesor, quiero que el resultado sea **una clase normal** en mi panel: con su lista, su total, el botón Quitar y la descarga.
- **HU-04**: Como profesor, quiero **dar permiso una sola vez** con mi cuenta de Google y que se recuerde para las siguientes clases.
- **HU-05**: Como profesor, quiero que **mi propio nombre no cuente** como alumno.
- **HU-06** *(opcional)*: Como **coorganizador** de la reunión, quiero poder pasar lista con mi propia cuenta.
- **HU-07**: Como quien arranca la app, quiero **elegir para cada clase el modo de pasar lista**: por *código* (spec 001) o *automático* (Meet), nunca los dos a la vez.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Elegir el modo (HU-07)
- **CA-01**: **Dado** el profesor que abre una clase, **cuando** elige el modo, **entonces** puede escoger entre *código* y *automático*.
- **CA-02**: **Dado** una clase en modo *automático*, **entonces** **no** se muestra código ni enlace para alumnos, y nadie puede registrarse por código en ella.
- **CA-03**: **Dado** una clase en modo *código*, **entonces** funciona exactamente como en la spec 001 y no se consulta Meet.
- **CA-04**: **Dado** el panel con varias clases, **entonces** cada clase indica qué modo usó.

### Pasar lista automáticamente (HU-01, HU-02, HU-05)
- **CA-05**: **Dado** una clase en modo automático vinculada a una reunión de Meet en curso, **cuando** el profesor lanza la toma de asistencia, **entonces** **cada persona que está en la llamada en ese momento** queda registrada con su **nombre tal como aparece en Meet** y la hora, en **menos de 1 minuto**.
- **CA-06**: **Dado** una clase en la que ya se tomó asistencia, **cuando** el profesor la lanza otra vez, **entonces** se añaden solo las personas nuevas; los que ya estaban **no se duplican** (misma regla que CA-07 de la spec 001: sin distinguir mayúsculas, tildes ni espacios extra).
- **CA-07**: **Dado** un alumno registrado que **sale de la llamada** después, **cuando** el profesor vuelve a lanzar la toma de asistencia, **entonces** el alumno **sigue en la lista**: salir no borra a nadie.
- **CA-08**: **Dado** un participante sin nombre visible (p. ej. un invitado anónimo), **cuando** se toma asistencia, **entonces** aparece como **"Invitado sin nombre"**, y el profesor puede quitarlo.
- **CA-09**: **Dado** el profesor (o el coorganizador) que lanza la toma de asistencia, **entonces** **su propio nombre no aparece** en la lista.
- **CA-10**: **Dado** una reunión vacía (solo el profesor), **cuando** se toma asistencia, **entonces** el profesor ve "No hay participantes en la reunión" y la lista queda vacía.

### Permisos (HU-04, HU-06)
- **CA-11**: **Dado** el primer uso, **cuando** el profesor lanza la toma de asistencia, **entonces** se le pide que **inicie sesión con su cuenta de Google y dé permiso**; tras aceptarlo, la toma de asistencia continúa sin repetir nada.
- **CA-12**: **Dado** que el profesor ya dio permiso, **cuando** toma asistencia en otra clase, **entonces** **no** se le vuelve a pedir.
- **CA-13**: **Dado** una cuenta que **no organiza** la reunión ni tiene acceso a ella, **cuando** intenta tomar asistencia, **entonces** ve un mensaje claro: "Esta cuenta no tiene acceso a la reunión. Pide al organizador de la reunión que tome la asistencia o que te haga coorganizador." y no se registra a nadie.
- **CA-14**: **Dado** un enlace o código de reunión que no existe o una reunión que no está en curso, **cuando** se intenta tomar asistencia, **entonces** se explica el problema en español y qué hacer.
- **CA-15** *(opcional, HU-06)*: **Dado** un coorganizador de la reunión con su propia cuenta, **cuando** toma asistencia, **entonces** funciona igual que para el organizador.

### Integración con lo existente (HU-03)
- **CA-16**: **Dado** una clase en modo automático, **entonces** aparece en el panel con su total, y **Quitar** y **Descargar lista** funcionan igual que en la spec 001.
- **CA-17**: **Dado** cualquier participante, **entonces** de él solo se guarda **nombre (y apellidos)** y **hora**; **nunca su email**, aunque la plataforma lo facilite (constitución P4).

---

## 5. Requisitos no funcionales

- Desde que el profesor lanza la acción hasta ver la lista completa: **menos de 1 minuto**.
- Debe funcionar con reuniones de **hasta 100 participantes** (el máximo de una cuenta gratuita de Google).
- La preparación de la primera vez (permisos de Google) queda **documentada paso a paso** en el README.
- Funciona con una **cuenta de Google gratuita**, sin plan de pago de Workspace.

---

## 6. Fuera de alcance (en esta spec)

- Discord (→ spec `002`), Zoom, Microsoft Teams u otras plataformas.
- Registrar **cuánto tiempo** estuvo cada persona en la llamada, o sus entradas y salidas.
- Saber si alguien está **atento** (cámara, micrófono, participación): estar conectado no es lo mismo que estar presente.
- Leer el chat de la reunión.
- Tomar asistencia **sin ninguna acción humana** (p. ej. de forma programada o continua).
- Mezclar los dos modos en la misma clase (HU-07).

---

## 7. Preguntas abiertas

Todas resueltas el 2026-10-21 con Victor.

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | Las reuniones las organiza Neoland, no Victor. ¿Quién da permiso para ver los participantes? | Una **cuenta de Google concreta, la del profesor**, que organiza la reunión. **Opcionalmente**, un coorganizador también puede usar la app (HU-06). |
| P2 | ¿Cuenta solo quien está en la llamada en ese momento, o cualquiera que estuvo en algún momento? | **Quien está en ese momento.** Si después sale, **no se le quita**. |
| P3 | ¿Se puede usar también el código en una clase automática? | **No a la vez.** Existen los dos modos, pero quien arranca la app **elige uno por clase** (HU-07). |
| P4 | ¿Qué pasa con los invitados sin nombre? | Se registran como **"Invitado sin nombre"** y el profesor puede quitarlos. |
| P5 | El nombre ya no lo escribe el alumno: ¿choca con la privacidad? | Sí con la redacción anterior: **constitución enmendada a v2.2 (P4)**. Solo nombre (y apellidos) y hora; prohibido guardar emails. |
| P6 | ¿Merece la pena, si Meet ya trae informes de asistencia? | **Sí**: esos informes solo existen en planes de pago y Neoland no tiene ninguno. |

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-21 | Borrador inicial con P1–P6 resueltas | Victor quiere pasar lista en Meet sin intervención de los alumnos |
| 1.0 | 2026-10-21 | Aprobada por Victor | — |
