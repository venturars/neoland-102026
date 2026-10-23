# Spec 004 · Quitar las referencias personales a Victor

> Estado: **Implementada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

Quien lee AsistenciApp todavía encuentra al usuario Victor.

Las instrucciones para entrar en el proyecto usan su carpeta personal, `staff/victor-chang/asistenciapp`, en los dos pasos que cambian de carpeta. Esa carpeta tiene que nombrar un usuario genérico, sin el nombre de una persona.

Las notas de decisiones y de pruebas ya hechas le nombran. También le nombran los documentos que dejaron esa carpeta personal fuera de un cambio anterior.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien sigue las instrucciones para entrar en el proyecto** | Ver un usuario genérico, sin el nombre de una persona. |
| **Quien lee la documentación** | No encontrar el nombre de Victor ni su carpeta personal. |
| **Quien lee las notas ya escritas** | Seguir viendo la fecha y el resultado de cada decisión y de cada prueba. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que sigue las instrucciones, quiero que la carpeta nombre un usuario genérico, para no depender del nombre de una persona.
- **HU-02**: Como persona que lee la documentación, quiero que no aparezcan el nombre de Victor ni su carpeta personal, para que el proyecto no guarde referencias personales a ese usuario.
- **HU-03**: Como persona que lee las notas ya escritas, quiero conservar la fecha y el resultado de cada decisión y de cada prueba, para no perder lo que ya se comprobó.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### La carpeta de las instrucciones (HU-01)

- **CA-01**: **Dado** el README, **cuando** se leen los dos pasos que cambian de carpeta, **entonces** la carpeta es `staff/<usuario>/asistenciapp`. `<usuario>` es un usuario genérico y no el nombre de una persona.

### Sin referencias personales (HU-02)

- **CA-02**: **Dado** la documentación del proyecto, **cuando** se busca el nombre Victor o la carpeta personal `victor-chang`, **entonces** no queda ninguna de las dos, ni queda sustituida por el nombre de otra persona.

### Lo que las notas conservan (HU-03)

- **CA-03**: **Dado** las notas que hoy nombran a Victor, **cuando** se quita esa referencia, **entonces** cada nota conserva su fecha y lo que se comprobó o se decidió.

### Lo que no cambia (HU-01, HU-02)

- **CA-04**: **Dado** el resto de la documentación y el uso de la app, **cuando** se quitan esas referencias, **entonces** el resto de las instrucciones y el pasar lista siguen igual.

---

## 5. Fuera de alcance

- Nombres de otras personas que vienen dentro de herramientas instaladas en el ordenador, y que no son este usuario.
- Cambiar el resultado de una decisión o de una prueba.
- El comportamiento de la app al pasar lista.

---

## 6. Preguntas abiertas

Ninguna. La issue 193 pide quitar todas las referencias personales al usuario de Victor. En su lugar, las instrucciones nombran un usuario genérico.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-22 | Borrador inicial | La issue 193 pide quitar esas referencias; las specs 002 y 003 las dejaron fuera |
| 0.2 | 2026-10-22 | La carpeta de las instrucciones pasa a un usuario genérico | Quien trabaja en esta carpeta no quiere que las instrucciones nombren su usuario |
| 1.0 | 2026-10-22 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-22 | Implementada | T01–T12 hechas; el test nuevo pasa con el resto de la suite |
