# Spec 008 · Añadir alumno a mano

> Estado: **Implementada** · Creada: 2026-10-27 · Aprobada: 2026-10-27 · Issue: #529

---

## 1. Problema

Hoy el profesor puede **quitar** un registro falso, pero **no puede añadir** a quien sí estuvo y no se registró (sin código a la vista, fallo de red, móvil, etc.). Tiene que pedir que se registre otra vez o resignarse a una lista incompleta.

Hace falta que, desde el panel de la sesión, el profesor **añada un nombre a mano** y ese nombre cuente igual que un registro normal: lista, total y descarga.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Corregir la lista añadiendo a quien faltó sin que pase por el enlace o por Discord. |
| **Alumno** | No cambia su flujo: sigue pudiendo registrarse solo si puede. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero **escribir un nombre y añadirlo** a la sesión desde el panel, para que conste en la asistencia.
- **HU-02**: Como profesor, quiero que ese registro **aparezca en la lista en vivo, en el total y en la descarga**, igual que los demás.
- **HU-03**: Como profesor, quiero **las mismas reglas de nombre** que al registrarse el alumno (vacío, demasiado largo, duplicado), para no ensuciar la lista.
- **HU-04**: Como profesor, quiero poder **quitar** después un registro que yo añadí, igual que cualquier otro.
- **HU-05**: Como profesor, quiero que **solo yo** (con el enlace secreto del panel) pueda añadir a mano, no quien tenga solo el enlace de alumno.
- **HU-06**: Como profesor, quiero poder añadir a mano **aunque la sesión ya esté cerrada**, para corregir la lista después de clase.

---

## 4. Criterios de aceptación

Formato: **Dado** · **Cuando** · **Entonces**.

### Añadir (HU-01, HU-02, HU-03)

- **CA-01**: **Dado** el profesor en la vista de una sesión, **cuando** escribe un nombre válido y confirma añadir, **entonces** ese nombre aparece en la lista con una hora de registro y el total sube en uno.
- **CA-02**: **Dado** un nombre vacío o de más de 60 caracteres, **cuando** el profesor intenta añadirlo, **entonces** ve un error en español que lo explica y **no** se crea el registro.
- **CA-03**: **Dado** un nombre que ya está en la sesión (sin distinguir mayúsculas, tildes ni espacios de más), **cuando** el profesor intenta añadirlo otra vez, **entonces** ve un aviso de que ya estaba registrado y **no** se duplica.
- **CA-04**: **Dado** un registro añadido a mano, **cuando** el profesor descarga la lista, **entonces** ese nombre sale en el CSV con *Nombre* y *Hora*, junto al resto.
- **CA-05**: **Dado** una sesión **cerrada**, **cuando** el profesor escribe un nombre válido y confirma añadir, **entonces** el registro se crea igual que con la sesión abierta (lista, total y descarga).

### Quitar y acceso (HU-04, HU-05)

- **CA-06**: **Dado** un registro añadido a mano, **cuando** el profesor lo quita y confirma, **entonces** sale de la lista, del total y de la descarga.
- **CA-07**: **Dado** alguien sin el enlace secreto del profesor, **entonces** no puede añadir registros a mano.

### Generales

- **CA-08**: **Dado** un móvil de ~400 px de ancho, **cuando** el profesor usa el control de añadir, **entonces** es usable sin zoom ni desplazamiento horizontal raro (P5).
- **CA-09**: **Dado** el alta a mano, **cuando** tiene éxito o falla, **entonces** los mensajes van en español (P6).

---

## 5. Fuera de alcance

- Editar el nombre de un registro ya existente.
- Añadir varios nombres de golpe (pegando una lista).
- Marcar de dónde vino el registro (web, Discord, a mano) en la descarga.
- Cambiar el check-in web, Discord, el código rotatorio o el límite por IP.
- Modo proyección o aviso sonoro al registrarse (otras issues).

---

## 6. Preguntas abiertas

Ninguna. P1 resuelta: se puede añadir a mano con la sesión **abierta o cerrada**.
