# Spec 007 · Check-in con Discord

> Estado: **Implementada** · Creada: 2026-10-27 · Aprobada: 2026-10-27 · Issue: #498

---

## 1. Problema

En el check-in con código, el alumno escribe el nombre a mano. Eso permite **nombres inventados o ajenos** y obliga al profesor a limpiar la lista.

En muchas clases online el grupo ya está en **Discord**. Hace falta una forma **adicional** de apuntarse usando la cuenta de Discord del alumno, para que el nombre en la lista sea el **nombre visible** de esa cuenta y cueste más hacerse pasar por otra persona. El check-in con código **sigue existiendo**; Discord no lo sustituye.

Al registrarse por Discord el alumno **también envía el código de 4 cifras** vigente (o el inmediatamente anterior, como en el check-in web). El profesor **activa** esa vía con un **botón en el panel**.

La constitución (P4) solo permite guardar el nombre y la hora. Este cambio **necesita una enmienda** que deje claro: el registro por Discord guarda el **nombre visible de la cuenta** como nombre de asistencia y la hora; **no** se guarda un identificador de Discord ni el email.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Activar Discord desde el panel y ver en la lista a quien se registra desde Discord. |
| **Alumno** | Apuntarse desde Discord con su cuenta y el código de la clase. |
| **Quien trabaja en esta carpeta** | Que la constitución permita solo el nombre visible de Discord como nombre de la lista. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero un **botón en el panel** para activar el registro por Discord en la sesión abierta, para que los alumnos puedan apuntarse desde Discord.
- **HU-02**: Como alumno, quiero **registrarme con mi cuenta de Discord y el código de 4 cifras**, para quedar en la lista con el nombre visible de mi cuenta.
- **HU-03**: Como profesor, quiero **ver en la lista** a quien se registró por Discord igual que al resto (nombre y hora).
- **HU-04**: Como profesor, quiero que **una misma cuenta de Discord no se registre dos veces** en la misma sesión.
- **HU-05**: Como profesor, quiero poder **quitar** un registro hecho por Discord igual que uno hecho con código.
- **HU-06**: Como alumno, quiero seguir pudiendo **registrarme con nombre y código** en el enlace web si no uso Discord.
- **HU-07**: Como persona que trabaja en esta carpeta, quiero una **enmienda de privacidad** que permita usar el nombre visible de Discord como nombre de asistencia, sin guardar id ni email de Discord.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Activar Discord en la sesión (HU-01)

- **CA-01**: **Dado** una sesión de asistencia abierta en el panel del profesor, **cuando** pulsa el botón para activar el registro por Discord, **entonces** esa sesión acepta registros desde Discord.
- **CA-02**: **Dado** que Discord no está activado para la sesión (o no hay sesión abierta / está cerrada), **cuando** un alumno intenta registrarse por Discord, **entonces** recibe un aviso en español de que no puede registrarse así ahora y **no** queda registrado.

### Registrarse (HU-02, HU-04, HU-06)

- **CA-03**: **Dado** una sesión abierta con Discord activado desde el panel, **cuando** un alumno se registra con su cuenta de Discord y el **código vigente** (o el inmediatamente anterior, como en el web), **entonces** queda en la lista con el **nombre visible de su cuenta** y la hora del registro.
- **CA-04**: **Dado** un código incorrecto o demasiado viejo, **cuando** el alumno lo envía por Discord, **entonces** ve un aviso en español de que el código no es válido o ha caducado y **no** queda registrado.
- **CA-05**: **Dado** un alumno ya registrado en esa sesión por Discord, **cuando** vuelve a intentarlo con la misma cuenta, **entonces** ve un aviso de que ya estaba registrado y **no** se duplica.
- **CA-06**: **Dado** que existe el registro por Discord, **cuando** otro alumno usa el enlace web con nombre y código como hasta ahora, **entonces** puede registrarse igual que antes.

### Lista del profesor (HU-03, HU-05)

- **CA-07**: **Dado** el profesor viendo la sesión, **cuando** alguien se registra por Discord, **entonces** aparece en la lista en vivo (como máximo en 5 s), con nombre y hora, y suma al total.
- **CA-08**: **Dado** un registro hecho por Discord, **cuando** el profesor lo quita y confirma, **entonces** sale de la lista, del total y de la descarga, igual que un registro con código.
- **CA-09**: **Dado** la descarga de la lista, **cuando** hay registros por Discord y por código, **entonces** el archivo incluye a todos con *Nombre* y *Hora*, sin columnas nuevas obligatorias.

### Privacidad (HU-07)

- **CA-10**: **Dado** la constitución enmendada, **cuando** se lee la privacidad, **entonces** el registro de asistencia por Discord guarda el **nombre visible** de la cuenta (como nombre) y la **hora**. No se guarda identificador de Discord ni email. La enmienda queda en el historial de la constitución.

### Generales

- **CA-11**: **Dado** un móvil de ~400 px de ancho, **cuando** el profesor usa el botón nuevo del panel, **entonces** sigue siendo usable (P5). Los mensajes al alumno en Discord van en español (P6).

---

## 5. Fuera de alcance

- Sustituir el check-in con código.
- Guardar identificador de Discord, email u otros datos de la cuenta.
- Integración con Google Meet u otras plataformas.
- Cuentas de profesor, contraseñas o inicio de sesión con Google.
- Lista previa de alumnos del servidor de Discord para marcar ausentes.
- Varios profesores con permisos distintos.
- Alojamiento permanente fuera del ordenador del profesor.
- Activar Discord solo con un comando en el servidor (el botón del panel es la vía de esta spec).
- Las features de añadir alumno a mano, modo proyección o aviso sonoro/visual al registrarse (otras issues).

---

## 6. Preguntas abiertas

Ninguna. Decisiones del 2026-10-27:

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | ¿Código de 4 cifras también por Discord? | **Sí.** |
| P2 | ¿Qué se guarda de Discord? | Solo el **nombre visible** (más la hora). |
| P3 | ¿Cómo activa el profesor Discord? | **Botón** en el panel. |
