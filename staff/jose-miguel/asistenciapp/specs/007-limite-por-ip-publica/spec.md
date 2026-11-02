# Spec 007 · Límite por IP pública

> Estado: **Implementada** (2026-11-02) · Creada: 2026-11-02

Issue: #735.

---

## 1. Problema

Desde una misma conexión de red se pueden enviar muchos intentos de registrarse seguidos, probando códigos hasta acertar. El puzzle del código de cuatro dígitos no debe complicarse; el freno cuenta solo esos intentos.

Como máximo **5** intentos de registrarse en un segundo y **20** en un minuto por dirección de la conexión. Si se supera, quien intenta ve un aviso de bloqueo en español y esa dirección entra en una lista que **no caduca**.

Solo cuenta el acto de registrarse. Ver la clase, abrir la página del alumno o usar el panel del profesor no suma al contador.

La constitución hoy prohíbe guardar direcciones de red. Este cambio necesita enmienda: recordar la dirección **solo** para el contador y la lista de bloqueo. El pasar lista sigue guardando nombre y hora.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Que nadie abuse del registro a base de pruebas y que un bloqueo no se olvide al cerrar la app. |
| **Alumno** | Registrarse con nombre y código como hasta ahora si no abusa del intento. |
| **Quien trabaja en esta carpeta** | Tener topes y mensajes en la spec, no en la constitución, salvo la excepción de privacidad. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero un tope de intentos de registrarse por dirección de conexión, para frenar pruebas masivas de código.
- **HU-02**: Como profesor, quiero que quien se pasa del tope quede bloqueado de forma permanente en la app, para que no baste reiniciar el servidor.
- **HU-03**: Como alumno, quiero registrarme igual si no supero el tope, para que el control no me impida pasar lista.
- **HU-04**: Como alumno, quiero el mismo código de cuatro dígitos que antes, para que el puzzle no cambie.
- **HU-05**: Como profesor, quiero que consultar la lista no cuente como intento de registrarse, para no bloquearme yo solo.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** una dirección no bloqueada, **cuando** intenta registrarse, **entonces** puede hacerlo como máximo 5 veces en un segundo y 20 en un minuto (cada POST de check-in cuenta, aunque falle el código).
- **CA-02**: **Dado** un alumno con código válido bajo el tope, **cuando** se registra, **entonces** queda registrado como hasta ahora.
- **CA-03**: **Dado** uso de la app sin POST de registrarse, **cuando** se abre la página o se lista asistencia, **entonces** no sube el contador.
- **CA-04**: **Dado** un intento que supera el tope, **cuando** se detecta, **entonces** la respuesta lleva el aviso de bloqueo en español y la dirección entra en la lista permanente.
- **CA-05**: **Dado** una dirección ya bloqueada, **cuando** intenta registrarse con código válido, **entonces** no se crea registro y vuelve el aviso de bloqueo.
- **CA-06**: **Dado** una dirección bloqueada, **cuando** se cierra y reabre la app con el mismo archivo de datos, **entonces** sigue bloqueada.
- **CA-07**: **Dado** un cuerpo o cabecera con otra dirección, **cuando** se cuenta o bloquea, **entonces** se usa la dirección de la conexión TCP, no la del JSON ni cabeceras de proxy.
- **CA-08**: **Dado** el código rotatorio de cuatro dígitos, **cuando** existe este control, **entonces** no cambia longitud ni dificultad.
- **CA-09**: **Dado** la constitución 3.3, **cuando** se lee P4, **entonces** permite la excepción acordada; los números 5 y 20 viven solo en esta spec.

---

## 5. Fuera de alcance

- Desbloquear direcciones manualmente.
- Guardar la dirección junto al nombre en el pasar lista.
- Cambiar el código o integrar Discord.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-11-02 | Versión inicial aprobada | Issue #735 |
