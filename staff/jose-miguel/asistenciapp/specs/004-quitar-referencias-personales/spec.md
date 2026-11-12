# Spec 004 · Quitar las referencias personales

> Estado: **Implementada** (2026-10-25) · Creada: 2026-10-24 · Aprobada: 2026-10-25

---

## 1. Problema

La documentación y las instrucciones de AsistenciApp todavía contienen referencias personales (nombre y carpeta personal) del usuario. 

Las instrucciones en el README para entrar en el proyecto y activar el entorno usan la ruta `staff/jose-miguel/asistenciapp`. Esta ruta debe ser genérica para que cualquier usuario pueda seguir las instrucciones sin ver el nombre de otra persona.

Además, documentos como `AGENT.md`, `CONSTITUTION.md` y las specs anteriores contienen menciones a "Jose Miguel" como la persona que aprueba los cambios o toma decisiones, lo cual debe ser anonimizado o generalizado.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Cualquier desarrollador o profesor** | Leer instrucciones genéricas que no dependan del nombre de una persona concreta. |
| **Quien consulta la documentación** | Entender los procesos y reglas sin que estén ligados a la identidad de un usuario específico. |
| **Quien consulta el historial** | Conservar la fecha y el resultado de las decisiones sin depender del nombre de quien las tomó. |

---

## 3. Historias de usuario

- **HU-01**: Como usuario del proyecto, quiero que las instrucciones de la terminal usen una ruta genérica, para que los comandos sean aplicables independientemente de mi nombre de usuario.
- **HU-02**: Como lector de la documentación, quiero que las reglas y procesos no mencionen nombres propios, para mantener la profesionalidad y generalidad del proyecto.
- **HU-03**: Como consultor del historial de cambios, quiero que se conserven las fechas y los hitos alcanzados, aunque se elimine el nombre de la persona que los aprobó.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Rutas genéricas en el README (HU-01)

- **CA-01**: **Dado** el README, **cuando** se consultan los pasos de preparación y arranque, **entonces** los comandos `cd` muestran la ruta `staff/<usuario>/asistenciapp` en lugar de una carpeta personal.

### Anonimización de la documentación (HU-02)

- **CA-02**: **Dado** archivos como `AGENT.md` y `CONSTITUTION.md`, **cuando** se mencionan aprobaciones o responsabilidades, **entonces** se utiliza "el usuario" o se redacta de forma impersonal (ej: "las reglas de esta copia"), eliminando "Jose Miguel".

### Conservación del historial (HU-03)

- **CA-03**: **Dado** el historial de cambios y las notas de decisiones en las specs anteriores, **cuando** se elimina el nombre personal, **entonces** se mantiene la fecha del cambio y la descripción de lo ocurrido.

### Lo que no cambia (HU-01, HU-02)

- **CA-04**: **Dado** el resto de la documentación y el código, **cuando** se quitan estas referencias, **entonces** el funcionamiento de la app y el resto de instrucciones permanecen igual.

---

## 5. Fuera de alcance

- El nombre de la carpeta física en el sistema de archivos.
- Nombres de terceros en logs, herramientas externas o dependencias.
- Cambios en la funcionalidad de la aplicación.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-24 | Borrador inicial | Eliminar referencias personales del usuario Jose Miguel |
| 1.0 | 2026-10-25 | Aprobada e implementada | El usuario pidió cerrar la implementación |
