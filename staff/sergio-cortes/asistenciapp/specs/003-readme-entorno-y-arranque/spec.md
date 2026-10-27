# Spec 003 · Instructivo de entorno y arranque en el README de la app

> Estado: **Implementada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

La issue #233 pide un instructivo paso a paso para activar el entorno y arrancar la app en el README del proyecto en `staff/sergio-cortes/asistenciapp`.

El README de la app ya habla de entorno y arranque, pero las rutas apuntaban a la carpeta de otra persona. Además, el bloque de cada terminal nueva mezclaba activar el entorno con «Arrancar la app», y quien lo sigue puede creer que la app ya está en marcha cuando solo ha activado el entorno.

El README personal en `staff/sergio-cortes/README.md` es solo la presentación de quien trabaja en la carpeta; el instructivo de setup vive en el README de la app (misma convención que en `staff/ventura-rodriguez/asistenciapp`).

Sin un spec aprobado no se puede tocar el README de la app (spec 002).

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien abre el README de la app (issue #233)** | Seguir pasos ordenados para preparar el entorno, activarlo y arrancar la app sin adivinar. |
| **Quien trabaja en esta carpeta** | Decidir el qué antes del plan y de la implementación. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que abre el README de la app, quiero un instructivo paso a paso para preparar el entorno, activarlo y arrancar la app, para cumplir la issue #233 y que un compañero pueda probarlo en esta carpeta.
- **HU-02**: Como persona que abre el README de la app, quiero que las rutas nombren esta carpeta del ejercicio y no la de otra persona, para poder seguir los comandos en mi ordenador.
- **HU-03**: Como persona que abre el README de la app, quiero que el bloque que solo activa el entorno no se llame «Arrancar la app», para no dar por hecho que la app ya está en marcha.
- **HU-04**: Como persona que abre el README de la app, quiero que «Arrancar la app» nombre solo las dos formas de ponerla en marcha (clase online y prueba en el propio ordenador), para saber qué hacer después de activar el entorno.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Instructivo completo (HU-01)

- **CA-01**: **Dado** el README de la app, **cuando** alguien lo abre para poner la app en marcha, **entonces** encuentra un instructivo paso a paso que cubre preparar el entorno (solo la primera vez), activar el entorno (cada terminal nueva) y arrancar la app (las dos modalidades de uso).
- **CA-02**: **Dado** ese instructivo, **cuando** se leen los pasos en orden, **entonces** cada bloque tiene un título claro y no mezcla activar el entorno con arrancar la app.

### Rutas (HU-02)

- **CA-03**: **Dado** el README de la app, **cuando** un paso indica en qué carpeta hay que estar, **entonces** nombra la carpeta de esta copia en `staff/sergio-cortes/asistenciapp` y no la de otra persona.

### Títulos activar vs arrancar (HU-03, HU-04)

- **CA-04**: **Dado** el README de la app, **cuando** se lee el bloque que entra en la carpeta del proyecto y activa el entorno en una terminal nueva, **entonces** ese bloque se titula activar el entorno y no «Arrancar la app».
- **CA-05**: **Dado** el README de la app, **cuando** aparece el título «Arrancar la app», **entonces** bajo ese título solo están las dos formas de ponerla en marcha: clase online (alumnos en sus casas) y prueba solo en el propio ordenador.
- **CA-06**: **Dado** el título «Arrancar la app» en el README de la app, **cuando** se lee lo que queda debajo, **entonces** ahí no está el paso de activar el entorno.

### Lo que no cambia (HU-03, HU-04)

- **CA-07**: **Dado** el resto del README de la app, **cuando** se aplican estos cambios, **entonces** pasar lista, cerrar la app, problemas frecuentes, tests y privacidad siguen diciendo lo mismo salvo renumerar secciones si hace falta por los títulos nuevos.

---

## 5. Fuera de alcance

- Editar el README personal en `staff/sergio-cortes/README.md`.
- Mover la constitución, renombrar el manual del agente o actualizar enlaces a esos documentos (no forman parte de la issue #233).
- Cambiar el comportamiento de la app al arrancar, en clase o en local.
- Tocar código o tests de la app (solo documentación del README en esta spec).
- Reorganizar el código por capas o añadir `ARCHITECTURE.md`.
- El bot de Discord.

---

## 6. Preguntas abiertas

Ninguna. La issue #233 y esta spec apuntan al README en `staff/sergio-cortes/asistenciapp/README.md`.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-22 | Borrador inicial | Issue #233; puerta spec 002 sobre rama #228 |
| 1.0 | 2026-10-22 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-22 | Implementada | T01–T04, T06–T07 hechas; pytest en verde |
| 1.3 | 2026-10-23 | Alineada con issue #233 y revisión PR | Instructivo solo en README de la app; README personal fuera de alcance |
