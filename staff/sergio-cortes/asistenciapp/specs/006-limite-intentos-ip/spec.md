# Spec 006 · Límite de intentos de código por origen de conexión

> Estado: **Aprobada** (2026-10-23) · Creada: 2026-10-23 · Issue: [#318](https://github.com/venturars/neoland-102026/issues/318) · PR: [#319](https://github.com/venturars/neoland-102026/pull/319)

---

## 1. Problema

Hoy un alumno (o un programa automático) puede enviar **tantas veces como quiera** un código incorrecto al registrarse en una clase. Con códigos de pocos dígitos que cambian cada poco tiempo, eso permite **adivinar el código por fuerza bruta** y registrar asistencia sin estar en clase, o saturar el servicio.

Queremos **limitar los intentos fallidos** por origen de conexión, **bloquear** a quien abuse, y dar al **profesor** control sobre la lista de bloqueos, **sin** mezclar esa información con el nombre ni la hora del registro del alumno.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Que nadie pueda probar códigos sin límite; poder ver quién está bloqueado (por dirección de conexión) y quitar bloqueos puntuales o todos. |
| **Alumno legítimo** | Seguir registrándose con nombre y código como hasta ahora; si se pasa de intentos, entender qué pasa y qué puede hacer. |
| **Quien trabaja en esta carpeta** | Cumplir la issue #318 y alinear la constitución con el uso acotado de direcciones de conexión solo para anti-abuso. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero que **solo cuenten como intento** los envíos con **código incorrecto o caducado**, para no castigar errores de nombre o registros correctos.
- **HU-02**: Como profesor, quiero que quien haga **más de 5 intentos inválidos en 1 segundo** o **más de 20 en el último minuto** quede **bloqueado** y no pueda seguir registrándose hasta que yo lo desbloquee.
- **HU-03**: Como alumno bloqueado o al límite, quiero un **mensaje claro** (demasiados intentos / bloqueo) distinto del simple «código inválido», con una pista de qué hacer (esperar, hablar con el profesor).
- **HU-04**: Como profesor, quiero **ver las direcciones de conexión bloqueadas** en mi panel y **quitar una** o **quitar todas**.
- **HU-05**: Como quien trabaja en esta carpeta, quiero que la **constitución** permita guardar direcciones de conexión **solo** para este fin, con retención mínima en el contador de intentos y bloqueos gestionados por el profesor.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Qué cuenta como intento (HU-01)

- **CA-01**: **Dado** una sesión abierta, **cuando** un alumno envía un **código incorrecto o caducado**, **entonces** ese envío **cuenta** hacia los límites de intentos.
- **CA-02**: **Dado** una sesión abierta, **cuando** un alumno se registra con **código válido**, **nombre válido**, o recibe «ya estabas registrado», sesión cerrada o error de nombre, **entonces** **no** cuenta como intento inválido para los límites.

### Límites y bloqueo (HU-02, HU-03)

- **CA-03**: **Dado** una dirección de conexión **no bloqueada**, **cuando** acumula **6** intentos inválidos dentro de **1 segundo**, **entonces** pasa a la lista de bloqueo y los siguientes intentos de registro se rechazan con mensaje de **bloqueo o límite** (no el de código inválido).
- **CA-04**: **Dado** una dirección **no bloqueada**, **cuando** acumula **21** intentos inválidos en los **últimos 60 segundos**, **entonces** igual que CA-03.
- **CA-05**: **Dado** una dirección **bloqueada**, **cuando** intenta registrarse aunque el código sea correcto, **entonces** se rechaza con el mensaje de bloqueo y **no** queda registrado.
- **CA-06**: **Dado** los umbrales de CA-03 y CA-04, **entonces** se permiten hasta **5** intentos inválidos en 1 s y hasta **20** en 60 s antes del bloqueo.

### Datos guardados (privacidad y contador)

- **CA-07**: **Dado** un registro de asistencia guardado (nombre y hora en una clase), **entonces** **no** incluye la dirección de conexión del alumno.
- **CA-08**: **Dado** intentos inválidos registrados para contar el límite del minuto, **cuando** pasan más de **~1 minuto** desde un intento, **entonces** ese intento **ya no cuenta** para el límite y su fila puede **eliminarse** (purga de caducados); la **tabla de intentos sigue existiendo**, no se vacía entera por el paso del tiempo.
- **CA-09**: **Dado** una dirección bloqueada, **entonces** permanece en la lista de bloqueo **hasta** que el profesor la quite (CA-10).

### Panel del profesor (HU-04)

- **CA-10**: **Dado** el profesor en su panel privado, **cuando** consulta los bloqueos, **entonces** ve la lista de direcciones bloqueadas y puede **quitar una**; tras quitarla, esa dirección puede volver a intentar registrarse.
- **CA-11**: **Dado** el profesor en su panel privado, **cuando** elige **quitar todas** las direcciones bloqueadas, **entonces** la lista queda vacía y las direcciones pueden volver a intentar.
- **CA-12**: **Dado** alguien sin el enlace secreto del profesor, **entonces** no puede ver ni modificar la lista de bloqueos.

### Constitución (HU-05)

- **CA-13**: **Dado** el trabajo cerrado de esta spec, **cuando** se lee `docs/CONSTITUTIONS.md`, **entonces** incluye una **enmienda aprobada** que permite guardar direcciones de conexión **únicamente** para anti-abuso (contador con retención mínima y lista de bloqueo), sin vincularlas al registro del alumno.

### Comportamiento previo preservado

- **CA-14**: **Dado** los criterios de la spec `001-checkin-codigo` que no entren en conflicto con esta spec, **cuando** se cierra la implementación, **entonces** `pytest` pasa y el flujo normal de check-in (código válido, cierre, export, etc.) se mantiene.

---

## 5. Fuera de alcance

- Limitar peticiones en el panel del profesor (solo el flujo de registro de alumnos).
- Historial largo o exportación de intentos fallidos o de direcciones bloqueadas.
- Desbloqueo automático por tiempo (el bloqueo dura hasta acción del profesor).
- Cambios fuera de `staff/sergio-cortes/asistenciapp/`.
- Sustituir el límite disuasorio por navegador (spec 001, HU-09).

---

## 6. Preguntas abiertas

Ninguna por ahora. Las decisiones de la issue #318 (umbrales, solo código inválido, purga incremental, panel profesor, enmienda constitucional) quedan reflejadas arriba. Si al planificar aparece duda sobre el texto exacto del mensaje al alumno o sobre aulas con muchos dispositivos tras la misma dirección (NAT), se documenta en el `plan.md`.

---

## 7. Historial de cambios

| Fecha | Cambio |
| --- | --- |
| 2026-10-23 | Borrador inicial para issue #318. |
| 2026-10-23 | Aprobada por quien trabaja en esta carpeta. |
| 2026-10-26 | Plan alineado con arquitectura 005: `domain/attempts.py`, `storage/sqlite.py`, `usecases/attendance.py`. |
| 2026-10-26 | IP en check-in documentada como `request.remote_addr` + `ProxyFix` (sin `client_ip.py`). |
