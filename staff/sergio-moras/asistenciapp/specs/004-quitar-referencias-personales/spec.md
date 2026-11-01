# Spec 004 · Documentación sin referencias personales

> Estado: **Implementada** (2026-11-01) · Creada: 2026-11-01 · Aprobada: 2026-11-01 · Issue: #724

---

## 1. Problema

La documentación de esta copia sigue llevando la huella de la persona que escribió la app original:

- Los dos comandos del README que entran en la carpeta usan su carpeta personal. Quien los copia acaba en una ruta que no es la suya.
- Las notas de la spec 001 dicen quién aprobó cada decisión y quién hizo cada prueba manual, con su nombre.

Las notas siguen siendo útiles: cuentan cuándo se decidió o se probó algo y con qué resultado. Eso tiene que quedarse.

---

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| **Quien copia los comandos del README** | Una ruta genérica que adapte a su propio usuario. |
| **Quien lee la documentación** | Que no aparezca el nombre de otra persona ni su carpeta. |
| **Quien consulta las notas de la spec 001** | Seguir viendo fecha y resultado de cada decisión y prueba. |

---

## 3. Historias de usuario

- **HU-01**: Como quien copia los comandos del README, quiero que la ruta use un usuario genérico, para cambiarlo por el mío.
- **HU-02**: Como quien lee la documentación, quiero que no haya nombres ni carpetas de personas concretas, para que el proyecto no dependa de nadie.
- **HU-03**: Como quien consulta las notas, quiero que conserven fecha y resultado, para no perder lo que ya se comprobó.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** el README, **cuando** se leen los dos comandos que entran en la carpeta, **entonces** usan `staff/<usuario>/asistenciapp`, con `<usuario>` escrito tal cual.
- **CA-02**: **Dado** cualquier documento de la app, **cuando** se busca el nombre anterior o su carpeta, **entonces** no aparecen, ni sustituidos por el nombre de otra persona.
- **CA-03**: **Dado** cada nota de la spec 001 que nombraba a esa persona, **cuando** se quita el nombre, **entonces** mantiene su fecha y su resultado.
- **CA-04**: **Dado** el resto del README y la app, **cuando** se aplica el cambio, **entonces** siguen igual.

---

## 5. Fuera de alcance

- Cambiar el resultado de una decisión o de una prueba.
- Nombres de terceros que vienen dentro de herramientas instaladas.
- El funcionamiento de la app.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Aprobada e implementada |
