# Spec 004 · Quitar el nombre de las instrucciones

> Estado: **Aprobada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

Quien sigue el README todavía entra en la carpeta de Victor, `staff/victor-chang/asistenciapp`. Esa ruta tiene que nombrar un usuario genérico, `staff/<usuario>/asistenciapp`, y `<usuario>` se queda escrito así.

Las notas de lo que ya se decidió y de lo que ya se probó también dicen su nombre. Quiero quitar el nombre y conservar la fecha y lo que se comprobó.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien sigue las instrucciones** | Ver un usuario genérico, sin el nombre de una persona. |
| **Quien lee las notas ya escritas** | Seguir viendo la fecha y el resultado de cada prueba. |

---

## 3. Historias de usuario

- **HU-01**: Quiero que las dos líneas que cambian de carpeta digan `staff/<usuario>/asistenciapp`.
- **HU-02**: Quiero que la documentación deje de decir Victor y deje de decir su carpeta, y que ese hueco no se rellene con otro nombre.
- **HU-03**: Quiero que cada nota conserve su fecha y lo que se comprobó.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** el README, **cuando** leo las dos líneas que empiezan por `cd staff/`, **entonces** las dos son `cd staff/<usuario>/asistenciapp`.
- **CA-02**: **Dado** la documentación de esta carpeta, **cuando** busco `victor` en cualquier mayúscula, **entonces** no queda. Tampoco queda cambiado por el nombre de otra persona.
- **CA-03**: **Dado** las notas que hoy dicen ese nombre, **cuando** lo quito, **entonces** cada una conserva su fecha y lo que se decidió o se probó.
- **CA-04**: **Dado** el resto de las instrucciones y el uso de la app, **cuando** quito esas referencias, **entonces** el resto del README y el pasar lista siguen igual. El diff del README son solo las dos líneas `cd`.

---

## 5. Fuera de alcance

- Nombres que vienen dentro de herramientas instaladas en el ordenador.
- Cambiar el resultado de una decisión o de una prueba.
- El comportamiento de la app al pasar lista.

---

## 6. Preguntas abiertas

Ninguna. El 2026-10-22 decidí que la carpeta de las instrucciones es un usuario genérico y que las notas se quedan sin el nombre.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-22 | Aprobada | Las instrucciones seguían entrando en una carpeta personal |
