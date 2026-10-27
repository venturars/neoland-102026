# Spec 005 · Reorganizar documentos y arquitectura

> Estado: **Implementada** (2026-10-26) · Creada: 2026-10-26 · Aprobada: 2026-10-26

---

## 1. Problema

En esta copia, las reglas, el manual del agente y el código están juntos en la raíz. No hay un documento que diga cómo se organiza el código, ni uno que diga cómo se escribe.

El código mezcla tres cosas que cambian por motivos distintos: las reglas de la asistencia, el lugar donde se guardan los datos y la forma en que el profesor y el alumno usan la app. Un cambio en una de ellas obliga a tocar las otras.

La constitución también nombra archivos y carpetas. Si el código se organiza de otra forma y ella sigue describiendo la antigua, las reglas contradicen el proyecto.

Hay que separar los documentos, dejar escrita esa organización (solo lo que esta app necesita, sin herramientas ni piezas de más) y dejar escrito cómo se escribe el código. Donde la constitución hable de archivos y carpetas, se enmienda para que coincida. El pasar lista tiene que seguir igual.

Esta spec es de esta copia (`staff/<usuario>/asistenciapp/`). La aprueba el usuario de aquí. Las specs `001` a `004` ya están cerradas y no se reescriben.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Encontrar las reglas y la organización del código en su sitio, y que el código siga esa organización. |
| **Agente** | Saber dónde están las reglas, cómo se organiza el código y cómo se escribe. |
| **Profesor y alumno** | Seguir pasando lista como hasta ahora. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero las reglas en una carpeta de documentos, para no tenerlas sueltas en la raíz.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero un documento de arquitectura con solo lo que esta app necesita, para cambiar una parte del código sin reescribir las demás y sin añadir herramientas de más.
- **HU-03**: Como agente, quiero que el manual diga cómo se escribe el código, para que cada función explique qué recibe, qué devuelve y un ejemplo corto.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que el código de la app siga ese documento, para que la organización no se quede solo escrita.
- **HU-05**: Como profesor o alumno, quiero pasar lista igual que ahora, para que este cambio no me quite lo que ya funciona.
- **HU-06**: Como persona que trabaja en esta carpeta, quiero que la constitución describa los archivos y las carpetas como quedan, para que las reglas no hablen de una organización que ya no existe.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Los documentos (HU-01, HU-02, HU-03)

- **CA-01**: **Dado** el proyecto, **cuando** se busca la constitución, **entonces** está en la carpeta de documentos y ya no está en la raíz.
- **CA-02**: **Dado** la carpeta de documentos, **cuando** se lee el documento de arquitectura, **entonces** separa las reglas de la asistencia, el lugar donde se guardan los datos y la forma en que el profesor y el alumno usan la app. No pide herramientas nuevas ni piezas que esta app no usa.
- **CA-03**: **Dado** la raíz del proyecto, **cuando** se busca el manual del agente, **entonces** el nombre antiguo ya no está y sí está el nombre nuevo del manual. Sigue diciendo cómo se trabaja día a día y añade cómo se escribe el código: cada función dice qué recibe, qué devuelve y un ejemplo corto.

### El código (HU-04)

- **CA-04**: **Dado** el código de la app, **cuando** se lee la parte que decide si un registro de asistencia vale, **entonces** esa parte no dibuja pantallas ni abre el archivo donde se guardan los datos.
- **CA-05**: **Dado** el código de la app, **cuando** se lee la parte que guarda la asistencia, **entonces** esa parte no decide las reglas de la asistencia ni dibuja pantallas.
- **CA-06**: **Dado** el código de la app, **cuando** se lee la parte que muestra la app al profesor y al alumno, **entonces** esa parte no abre el archivo donde se guardan los datos. Pide a las otras dos partes que apliquen las reglas y que guarden.

### Lo que no cambia (HU-05)

- **CA-07**: **Dado** una clase en marcha, **cuando** el profesor abre la sesión y el alumno se registra con el código, **entonces** el pasar lista da el mismo resultado que antes de este cambio.

### Los enlaces (HU-01, HU-03)

- **CA-08**: **Dado** el README y el manual del agente, **cuando** se sigue el enlace a la constitución o al manual, **entonces** el enlace abre el documento en su sitio nuevo.

### La constitución (HU-06)

- **CA-09**: **Dado** la constitución en su sitio nuevo, **cuando** se leen los apartados que nombran archivos o carpetas, **entonces** coinciden con la organización nueva. El propósito de la app, la privacidad y las reglas de pasar lista siguen. La enmienda sube la versión y queda anotada en su historial.

---

## 5. Fuera de alcance

- Funcionalidades nuevas de pasar lista.
- Herramientas que la app no usa hoy.
- Cambiar el propósito de la app, la privacidad o las reglas de pasar lista. Sí entra enmendar la constitución donde nombra archivos y carpetas.
- Reescribir las specs ya cerradas (`001` a `004`). Ahí se queda el nombre que tenían los documentos cuando se escribieron.
- Discord. Sigue como idea futura, sin número de spec.

---

## 6. Preguntas abiertas

Ninguna. El alcance es: carpeta de documentos con la constitución dentro, documento de arquitectura con la organización adaptada a esta app, manual del agente con el nombre nuevo y la forma de escribir el código, y el código siguiendo esa organización. La constitución se enmienda donde nombra archivos y carpetas. El pasar lista no cambia de resultado. Los nombres concretos de carpetas y archivos salen en el plan, no aquí.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | Reorganizar documentos y arquitectura en esta copia, tomando de referencia la idea de la misma necesidad sin copiar otra implementación |
| 1.0 | 2026-10-26 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-26 | Implementada | T01–T12 hechas; pytest en verde |
