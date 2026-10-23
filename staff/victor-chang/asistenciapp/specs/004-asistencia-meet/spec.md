# Spec 004 · Asistencia automática desde Google Meet

> Estado: **v1.2 pendiente de aprobación** (2026-10-23; la v1.1 estaba aprobada) · Creada: 2026-10-21

---

## 1. Problema

Con el check-in por código (spec 001), cada alumno tiene que **hacer algo** (abrir el enlace, escribir su nombre y el código) y el profesor tiene que **esperar** a que todos terminen. Sin embargo, en una clase de Google Meet **la propia plataforma ya sabe quién está en la llamada**.

Queremos que quien pasa lista, estando en la reunión o al acabar, pueda registrar a **todos los participantes con una sola acción**, sin que los alumnos tengan que hacer nada.

Meet incluye informes de asistencia propios, pero solo en planes de pago de Google Workspace. **Neoland no tiene un plan de pago**, así que esa opción no está disponible.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** (quien arranca la app) | Elegir cómo pasar lista en cada clase y, en modo automático, registrar a todos los presentes de un golpe. |
| **Cuenta que toma la asistencia** (la de Google de quien arranca la app: organiza la reunión **o** participa en ella) | Dar permiso **una vez** para que la app pueda saber quién está o ha estado en sus reuniones. |
| **Alumno** | Nada: en modo automático no tiene que hacer ninguna acción. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero **registrar con una sola acción a todos los que están ahora en la reunión de Meet**, para no esperar a que cada alumno se registre.
- **HU-08** *(v1.2)*: Como profesor, quiero **registrar con una sola acción a todos los que han estado en la reunión en algún momento**, también **después de que termine**, para no perder a quien llegó tarde o se desconectó justo al pasar lista.
- **HU-02**: Como profesor, quiero **repetir la acción más tarde en la misma clase** para añadir a quien llegó tarde, sin que se dupliquen los que ya estaban.
- **HU-03**: Como profesor, quiero que el resultado sea **una clase normal** en mi panel: con su lista, su total, el botón Quitar y la descarga.
- **HU-04**: Como profesor, quiero **dar permiso una sola vez** con mi cuenta de Google y que se recuerde para las siguientes clases.
- **HU-05**: Como profesor, quiero que **mi propio nombre no cuente** como alumno.
- **HU-06** *(cambiada en v1.2)*: Como **participante** de la reunión que no la organiza, quiero poder pasar lista con mi propia cuenta.
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
  - *Límite conocido (v1.1):* los invitados sin nombre no se distinguen entre sí. Si uno sale y entra otro invitado sin nombre distinto, la siguiente toma no lo añade, porque distinguirlos exigiría guardar el identificador que les da la plataforma (constitución P4). El profesor ve en la llamada si falta alguien.
- **CA-09**: **Dado** el profesor (o el coorganizador) que lanza la toma de asistencia, **entonces** **su propio nombre no aparece** en la lista.
- **CA-10**: **Dado** una reunión vacía (solo el profesor), **cuando** se toma asistencia, **entonces** el profesor ve "No hay participantes en la reunión" y la lista queda vacía.

### Permisos (HU-04, HU-06)
- **CA-11**: **Dado** el primer uso, **cuando** el profesor lanza la toma de asistencia, **entonces** se le pide que **inicie sesión con su cuenta de Google y dé permiso**; tras aceptarlo, la toma de asistencia continúa sin repetir nada.
- **CA-12**: **Dado** que el profesor ya dio permiso, **cuando** toma asistencia en otra clase, **entonces** **no** se le vuelve a pedir.
- **CA-13** *(cambiado en v1.2)*: **Dado** una cuenta que **ni organiza ni ha estado** en la reunión, **cuando** intenta tomar asistencia, **entonces** ve el mensaje de CA-14 y no se registra a nadie. *(La plataforma no distingue este caso de una reunión que no existe.)*
- **CA-14** *(cambiado en v1.2)*: **Dado** un enlace de reunión que no existe, una reunión que todavía no ha empezado, una que terminó hace más de 30 días o una que esta cuenta no puede ver, **cuando** se intenta tomar asistencia, **entonces** ve: "No hay ninguna reunión con ese enlace que esta cuenta pueda ver. Revisa el enlace, entra en la reunión con esta cuenta o pide al organizador que tome la asistencia." y no se registra a nadie. *(La plataforma responde lo mismo en los cuatro casos.)*
- **CA-15** *(cambiado en v1.2, HU-06)*: **Dado** un participante de la reunión que no la organiza, con su propia cuenta, **cuando** toma asistencia, **entonces** funciona igual que para el organizador.

### Quién cuenta y de qué reunión (añadido en v1.2: HU-01, HU-08)
- **CA-18**: **Dado** una clase en modo automático, **cuando** el profesor toma asistencia, **entonces** elige cada vez entre **"Quién está ahora"** (los que están en la llamada en ese momento, CA-05) y **"Todos los que han estado"** (los que han entrado en algún momento, aunque ya se hayan ido).
- **CA-19**: **Dado** "Todos los que han estado", **entonces** cada persona cuenta **una sola vez**, aunque haya entrado y salido varias veces, con la regla anti-duplicados de CA-06.
- **CA-20**: **Dado** un enlace que se usa en varias reuniones (p. ej. la misma sala cada día), **cuando** se toma asistencia, **entonces** se usa la reunión **en curso**; si no hay ninguna, la **última que terminó**. El panel muestra de qué reunión (fecha y hora de inicio) es la toma.
- **CA-21**: **Dado** una reunión que **ya terminó** (como mucho hace 30 días), **cuando** se elige "Quién está ahora", **entonces** se avisa de que la reunión ya terminó y de que se puede usar "Todos los que han estado"; no se registra a nadie.

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
- Reuniones que terminaron hace **más de 30 días**: la plataforma ya no las guarda (CA-14).
- Elegir a mano una reunión antigua de una lista: se usa la en curso o la última (CA-20).

---

## 7. Preguntas abiertas

P1 a P6 resueltas el 2026-10-21 con Victor; P1 y P2 revisadas el 2026-10-23 con lo aprendido en el spike (tarea T03). P7, pendiente.

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | Las reuniones las organiza Neoland, no Victor. ¿Quién da permiso para ver los participantes? | *(v1.2)* La cuenta de Google de **quien arranca la app**, si **organiza la reunión o participa en ella**. El spike comprobó que una cuenta participante ve la lista de las clases del bootcamp (HU-06, CA-15). *(Antes: solo la del organizador, y un coorganizador como opción.)* |
| P2 | ¿Cuenta solo quien está en la llamada en ese momento, o cualquiera que estuvo en algún momento? | *(v1.2)* **Las dos opciones, elegidas en cada toma**: "Quién está ahora" o "Todos los que han estado" (CA-18). Si alguien sale, **no se le quita**. *(Antes: solo quien está en ese momento.)* |
| P3 | ¿Se puede usar también el código en una clase automática? | **No a la vez.** Existen los dos modos, pero quien arranca la app **elige uno por clase** (HU-07). |
| P4 | ¿Qué pasa con los invitados sin nombre? | Se registran como **"Invitado sin nombre"** y el profesor puede quitarlos. |
| P5 | El nombre ya no lo escribe el alumno: ¿choca con la privacidad? | Sí con la redacción anterior: **constitución enmendada a v3.0 (P4)**. Solo nombre (y apellidos) y hora; prohibido guardar emails. |
| P6 | ¿Merece la pena, si Meet ya trae informes de asistencia? | **Sí**: esos informes solo existen en planes de pago y Neoland no tiene ninguno. |
| P7 | Mientras la app de Google esté en modo de prueba, el permiso **caduca cada 7 días**; publicarla exige una página principal y una política de privacidad accesibles por internet. ¿Qué pasa con CA-12? | `[NECESITA ACLARACIÓN: (A) aceptar que se pida el permiso una vez por semana, cambiando CA-12; o (B) publicar dos páginas sencillas (p. ej. el README y una política de privacidad sacada de su §7) y pasar la app a producción. Hay que decidirlo antes de la tarea T09.]` |

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-21 | Borrador inicial con P1–P6 resueltas | Victor quiere pasar lista en Meet sin intervención de los alumnos |
| 1.0 | 2026-10-21 | Aprobada por Victor | — |
| 1.1 | 2026-10-23 | CA-08: se anota el límite de los invitados sin nombre | Decidido por Victor al reescribir el plan (plan §8.7) |
| 1.2 | 2026-10-23 | Cualquier participante puede tomar asistencia (HU-06, CA-13, CA-15, P1); dos opciones de toma, "ahora" o "todos los que han estado", también al terminar (HU-08, CA-18, CA-19, CA-21, P2); qué reunión se usa si el enlace se repite (CA-20); un único mensaje para "no hay reunión que ver" (CA-14); límite de 30 días; P7 pendiente | Hallazgos del spike (tarea T03) |
