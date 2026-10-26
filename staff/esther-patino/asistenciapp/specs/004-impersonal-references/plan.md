# Plan técnico 004 · Referencias impersonales

> Estado: **Aprobado** · Spec: [spec.md](spec.md) aprobada · Creado: 2026-10-23 · Paso a las tareas: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

No hay arquitectura nueva, ni modelo de datos, ni rutas de la aplicación. No se añade ninguna dependencia. El cambio es texto en documentos que ya existen.

---

## 1. Archivos

| Archivo | Qué se hace | Cubre |
| --- | --- | --- |
| `CONSTITUTION.md` | El apartado 4, el apartado 7 y el apartado 8 dejan de nombrar a una persona. La versión sube a 2.3 | CA-01, CA-02 |
| `AGENT.md` | Las mismas reglas, la carpeta y la tabla de estado hablan de quien trabaja en el proyecto y de esta carpeta | CA-01, CA-02, CA-05 |
| `README.md` | Los dos bloques de comandos se ejecutan dentro de la carpeta de este proyecto, sin una ruta con nombre de persona | CA-02 |
| `specs/001-checkin-codigo/` | Decisiones, historial y verificaciones quedan en impersonal. Fechas y sentido se quedan | CA-03 |
| `specs/002-require-approved-spec/` | Las frases que atan la aprobación o la carpeta a un nombre propio pasan al rol y a esta carpeta | CA-03 |
| `specs/003-startup-headings/` | La nota que cita la ruta con nombre de persona pasa a hablar de la carpeta, sin ese nombre | CA-03 |

No se crean código ni tests. No se toca la aplicación. `tasks.md` se escribe en la fase siguiente, no aquí.

La spec, este plan y las tareas de esta carpeta `004-impersonal-references` se redactan ya sin nombre propio, para que la búsqueda de CA-04 también los cubra.

---

## 2. Decisiones

El nombre propio de persona se sustituye por «quien trabaja en el proyecto». La ruta de carpeta con nombre de persona se sustituye por «la carpeta de este proyecto». No se escribe otro nombre propio en su lugar.

### 2.1 Constitución (CA-01, CA-02)

- Apartado 4, punto 1: quien aprueba antes del plan y antes de modificar los ficheros es quien trabaja en el proyecto.
- Apartado 7: el proyecto vive entero en la carpeta de este proyecto. No se tocan archivos fuera de esta carpeta.
- Apartado 8: cualquiera puede proponer un cambio, y lo aprueba quien trabaja en el proyecto. Desaparece el «solo» atado a un nombre propio.

La versión sube de 2.2 a **2.3** (cambio de redacción, sin tocar P1–P6). En el historial, fecha 2026-10-23: los apartados 4, 7 y 8 dejan de nombrar a una persona para que quien trabaja en el proyecto pueda aprobar y seguir las reglas. Motivo: spec 004.

### 2.2 Manual del agente (CA-01, CA-02, CA-05)

En el flujo, en las reglas de comportamiento y en la definición de terminado, el ok, los commits, las enmiendas y el visto bueno los da quien trabaja en el proyecto.

Los comandos se ejecutan desde la carpeta de este proyecto. Solo se edita dentro de esa carpeta.

La frase de cerrar cada fase explica el resumen a quien trabaja en el proyecto, que está aprendiendo este modo de trabajo.

La tabla de estado deja esta spec en la fase que tenga al implementar.

### 2.3 Documento de uso (CA-02)

En los dos bloques de comandos se quita la línea que entra en una carpeta con nombre de persona. El párrafo de cada bloque dice que esos comandos se ejecutan dentro de la carpeta de este proyecto. El resto de comandos, para preparar el entorno y para arrancar la app, se queda igual.

### 2.4 Specs, planes y tareas ya escritos (CA-03)

Donde una frase nombra a una persona concreta, pasa a «quien trabaja en el proyecto» o se deja solo la fecha y el hecho comprobado. Donde cita una ruta con nombre de persona, pasa a «la carpeta de este proyecto».

Se conservan las fechas, los identificadores (`CA-xx`, `HU-xx`) y el sentido de lo decidido o verificado. En la spec 002, la puerta del spec aprobado se queda; lo que cambia es que ya no va atada a un nombre. En la spec 003, sigue siendo cierto que aquella spec no pedía cambiar la ruta; la frase deja de escribir esa ruta con un nombre.

---

## 3. Verificación manual

No hay test nuevo. La app no cambia de comportamiento. La comprobación es leer los documentos y buscar en esta carpeta.

| Criterio | Qué se lee | Resultado |
| --- | --- | --- |
| CA-01 | Constitución, apartados 4 y 8, y el manual del agente | Hablan de quien trabaja en el proyecto. No hay un nombre propio. Cualquier persona que trabaja en el proyecto puede dar el ok |
| CA-02 | Constitución, apartado 7; manual, comandos y carpeta de edición; documento de uso, los dos bloques | No hay una ruta con nombre de persona. Los comandos de preparar el entorno y de arrancar la app siguen |
| CA-03 | Specs, planes y tareas de `001`, `002` y `003` | No nombran a una persona concreta. Fechas y sentido siguen |
| CA-04 | Búsqueda en esta app de un nombre propio de persona y de una ruta de carpeta con nombre de persona | No hay coincidencias. El código y los tests no se han modificado |
| CA-05 | Tabla de estado del manual | Incluye `004-impersonal-references` y su fase |

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade ninguna plataforma ni se toca el registro de asistencia |
| P2 Simplicidad | Sí | Es sustituir un nombre y una ruta por un rol y por esta carpeta. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guarda ningún dato nuevo. Deja de escribirse un nombre propio en las reglas |
| P5 Accesible y móvil | Sí | No hay pantallas nuevas |
| P6 Español | Sí | La spec, este plan y los textos que se van a cambiar están en español |
| Apartado 5, calidad | Sí | CA-01 a CA-05 se comprueban leyendo, en la tabla de arriba. No hay test automático porque la app no cambia |
| Apartado 6, seguridad | Sí | Los códigos, el registro único y la sesión cerrada no se tocan |
