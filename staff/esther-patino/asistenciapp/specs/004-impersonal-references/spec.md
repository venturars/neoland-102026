# Spec 004 · Referencias impersonales

> Estado: **Aprobada** · Creada: 2026-10-23 · Aprobada: 2026-10-23 · Issue: #320

---

## 1. Problema

AsistenciApp nombra a una persona concreta y usa una carpeta con ese nombre. Las aprobaciones, los commits, las enmiendas, el visto bueno y las instrucciones de arranque quedan atados a esa persona.

Quien trabaja en el proyecto tiene que poder hacer esos pasos sin ser esa persona. El texto habla de un rol y de esta carpeta, sin un nombre propio. 

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en el proyecto** | Aprobar, enmendar y seguir las instrucciones sin que las reglas nombren a una persona concreta. |
| **Quien arranca AsistenciApp** | Entrar en la carpeta de este proyecto sin una ruta que lleve el nombre de una persona. |


## 3. Historias de usuario

- **HU-01**: Como cualquier persona que trabaja en el proyecto, quiero que la constitución y el manual del agente hablen de quien trabaja en el proyecto, para poder aprobar y seguir el flujo sin ser una persona concreta.
- **HU-02**: Como persona que arranca AsistenciApp, quiero que las instrucciones entren en la carpeta de este proyecto sin un nombre propio en la ruta, para seguirlas en esta copia.
- **HU-03**: Como persona que lee specs, planes y tareas ya escritos, quiero que las fechas y el sentido de lo decidido o probado sigan claros, en lenguaje impersonal.


## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01**: **Dado** la constitución y el manual del agente, **cuando** se leen las reglas de aprobación, de commits, de enmiendas y de visto bueno, **entonces** hablan de quien trabaja en el proyecto y no de un nombre propio. Cualquier persona que trabaja en el proyecto puede dar ese ok.
- **CA-02**: **Dado** la constitución, el manual del agente y el documento de uso, **cuando** se lee dónde vive el proyecto y cómo se entra en su carpeta, **entonces** esa ruta no lleva el nombre de una persona. Los comandos para preparar el entorno y arrancar la app se conservan.
- **CA-03**: **Dado** cualquier spec, plan o lista de tareas de esta app, **cuando** se leen decisiones, historial o verificaciones, **entonces** no nombran a una persona concreta. Las fechas y el significado de lo decidido o verificado se mantienen.
- **CA-04**: **Dado** el árbol de esta app, **cuando** se busca un nombre propio de persona o una ruta de carpeta con nombre de persona, **entonces** no hay coincidencias. El comportamiento de la app no cambia.
- **CA-05**: **Dado** el manual del agente, **cuando** se mira la tabla de estado, **entonces** incluye esta spec y la fase en la que está.

## 5. Fuera de alcance

- Cambiar cómo se pasa lista o cualquier otro comportamiento de la app.
- Quitar la puerta del ok explícito. Sigue haciendo falta. La da quien trabaja en el proyecto, sin un nombre propio.
- Reescribir el sentido de las decisiones ya tomadas. Solo cambia el lenguaje, que pasa a ser impersonal.
- Tocar carpetas fuera de esta app.
- Escribir el plan o las tareas dentro de este documento. Esas son las fases siguientes.


