# Spec 003 · Activar el entorno y arrancar la aplicación

> Estado: **Implementada y comprobada; entrega autorizada** · Versión: 1.1 · Creada: 2026-10-23 · Aprobada: 2026-10-23 · Implementada: 2026-10-23
>
> Tarea: [#255](https://github.com/venturars/neoland-102026/issues/255)

---

## 1. Problema

El README agrupa bajo «Arrancar la app» tanto la activación del entorno en una terminal nueva como las dos formas de poner en marcha la aplicación.

Quien sigue esas instrucciones puede pensar que activar el entorno ya ha arrancado la aplicación. Los títulos deben distinguir la preparación de la terminal del inicio del programa.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Persona que sigue el README** | Saber qué paso activa el entorno y qué paso pone en marcha la aplicación, tanto para una clase online como para una prueba en su ordenador. |

## 3. Historias de usuario

- **HU-01**: Como persona que sigue el README, quiero que el bloque que prepara la terminal se titule «Activar el entorno», para no creer que la aplicación ya está en marcha al terminarlo.
- **HU-02**: Como persona que sigue el README, quiero que «Arrancar la app» agrupe las dos modalidades de inicio existentes, para identificar qué debo hacer después de activar el entorno.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01**: **Dado** el README, **cuando** se lee el bloque que entra en la carpeta de la aplicación y activa el entorno en una terminal nueva, **entonces** ese bloque se titula «Activar el entorno».
- **CA-02**: **Dado** el README, **cuando** se lee «Arrancar la app», **entonces** ese apartado presenta las dos modalidades existentes para ponerla en marcha: clase online con alumnos en sus casas y prueba en el propio ordenador.
- **CA-03**: **Dado** el apartado «Arrancar la app», **cuando** se siguen sus instrucciones, **entonces** el paso de activar el entorno queda en su apartado anterior y no forma parte del arranque.
- **CA-04**: **Dado** el resto del README, **cuando** se reorganizan los apartados de activación y arranque, **entonces** la preparación inicial, el uso para pasar lista, el cierre, los problemas frecuentes, las pruebas y la privacidad conservan su contenido, con la numeración y las referencias internas coherentes.

## 5. Fuera de alcance

- Cambiar los comandos existentes o añadir instrucciones para otros sistemas operativos.
- Sustituir las rutas personales heredadas por ejemplos genéricos.
- Cambiar el comportamiento de arranque, la conexión de una clase online o el registro de asistencia.
- Reorganizar el código, cambiar las reglas de aprobación o modificar las especificaciones anteriores.
- Incorporar las pull requests a `staging`.

## 6. Preguntas abiertas

Ninguna. La persona que trabaja en esta carpeta ha aprobado la spec y autorizado anticipadamente las fases restantes y la entrega de la PR para revisión. El merge queda pendiente.

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Borrador inicial | Distinguir en el README la activación del entorno y el arranque de la aplicación |
| 1.0 | 2026-10-23 | Spec aprobada y fases restantes autorizadas | Autorización expresa para redactar plan y tareas, implementar, comprobar, guardar y presentar la PR a revisión; merge pendiente |
| 1.1 | 2026-10-23 | Implementada y comprobada por el agente | Activación y arranque separados, contenido conservado, CA-01 a CA-04 revisados y 77 tests superados; entrega autorizada y merge pendiente |
