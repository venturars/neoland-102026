# Spec 003 · Distinguir activar el entorno de arrancar la aplicación

Estado: aprobada por Miguel el 2026-10-22.

Tarea: [issue #223](https://github.com/venturars/neoland-102026/issues/223). Revisión: [PR #224](https://github.com/venturars/neoland-102026/pull/224). Reglas vigentes: [constitución](../../CONSTITUTION.md) y [manual del agente](../../AGENT.md).

## Problema

El README presenta la activación del entorno de trabajo bajo el título «Arrancar la app». Una persona puede completar ese paso y creer que la aplicación ya está funcionando, aunque todavía tiene que elegir cómo ponerla en marcha.

## Usuarios

Personas que siguen el README para usar AsistenciApp, tanto en una clase online como para probarla en su ordenador.

## Historias de usuario

- **HU-01:** Como persona que prepara la aplicación, quiero distinguir la activación del entorno de su puesta en marcha para saber qué he completado y qué falta.
- **HU-02:** Como persona que consulta las instrucciones, quiero que los títulos y referencias sigan el orden de los pasos sin cambiar las indicaciones existentes.

## Criterios de aceptación

- **CA-01:** Dado el bloque de instrucciones para cada terminal nueva, cuando se consulta el README, entonces aparece bajo «Activar el entorno», separado de «Arrancar la app» y antes de esa sección.
- **CA-02:** Dada la sección «Arrancar la app», cuando se lee, entonces contiene las dos opciones existentes de puesta en marcha —clase online y prueba en el propio ordenador— y sus explicaciones de lo que aparece al arrancar; no incluye el paso previo de activar el entorno.
- **CA-03:** Dada la separación de las dos secciones, cuando se recorren las siguientes, entonces su numeración es consecutiva y la referencia a «Cerrar la app» en problemas frecuentes señala la sección 5.
- **CA-04:** Dadas las instrucciones anteriores, cuando se comparan con las corregidas, entonces los comandos, rutas y demás explicaciones permanecen iguales; solo cambian la separación y los títulos de esos pasos, la numeración posterior y la referencia indicada.

## Fuera de alcance

Cambiar el funcionamiento de la aplicación, sus datos o pruebas; modificar comandos o rutas; limpiar referencias personales; reorganizar archivos; añadir dependencias, herramientas o funcionalidades. Los pasos 004 y 005 se abordan por separado.

## Preguntas abiertas

Ninguna. Esta tarea aclara la organización de las instrucciones existentes.

Implementación verificada el 2026-10-22; resultados en [tasks.md](tasks.md). Revisión final aprobada por Miguel el 2026-10-22.
