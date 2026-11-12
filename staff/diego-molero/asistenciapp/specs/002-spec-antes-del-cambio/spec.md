# Spec 002 · Especificación antes de cambiar la aplicación

> Estado: **Implementada y comprobada, con conformidad final** · Versión: 1.2 · Creada: 2026-10-23 · Aprobada: 2026-10-23 · Implementada: 2026-10-23 · Conformidad final: 2026-10-23
>
> Tarea: [#253](https://github.com/venturars/neoland-102026/issues/253)

---

## 1. Problema

Las reglas actuales exigen una especificación aprobada para una funcionalidad nueva, pero no expresan con la misma claridad esa obligación para los cambios en las pruebas, las instrucciones de uso o el resto de la documentación.

Esto permite que el agente interprete que puede modificar esos documentos antes de que la persona responsable haya decidido el objetivo y aprobado el alcance del cambio.

Además, las reglas de trabajo conservan referencias a una carpeta y a una persona distintas de quien mantiene esta copia. Hay que dejar claro dónde se trabaja y quién aprueba cada fase.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Persona que trabaja en esta carpeta** | Decidir qué se va a cambiar y aprobar cada fase antes de que el agente avance. |
| **Agente de IA** | Saber qué puede escribir al comenzar un cambio y cuándo debe esperar aprobación. |

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que todo cambio en la aplicación tenga una especificación aprobada, para decidir su alcance antes de modificarla.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero revisar la especificación antes del plan, el plan antes de las tareas y las tareas antes de la implementación, para dirigir el trabajo por fases.
- **HU-03**: Como agente, quiero abrir una especificación nueva cuando un pedido no esté cubierto por la activa, para no mezclar cambios distintos ni reutilizar una especificación terminada.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que una issue, una rama o una pull request no sustituyan mi aprobación de la especificación, para conservar el control del cambio.
- **HU-05**: Como persona que trabaja en esta carpeta, quiero que las reglas identifiquen esta copia y mi responsabilidad de aprobar, conservando el historial ya registrado.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Antes de modificar la aplicación (HU-01, HU-02)

- **CA-01**: **Dado** un pedido de cambiar el código, las pruebas, las instrucciones de uso u otra documentación de la aplicación, **cuando** todavía no existe una especificación aprobada que lo cubra, **entonces** el agente no modifica esos archivos y comienza por escribir la especificación.
- **CA-02**: **Dado** el comienzo de ese pedido, **cuando** se escribe la especificación, **entonces** ese es el único archivo que se crea o modifica; al terminar, el agente lo presenta y espera aprobación antes de escribir el plan, las tareas o la implementación.

### Orden y alcance de las fases (HU-02, HU-03)

- **CA-03**: **Dado** una especificación aprobada, **cuando** se continúa el trabajo, **entonces** se sigue el orden especificación, plan, tareas e implementación; la persona que trabaja en esta carpeta aprueba cada una de las tres primeras fases antes de comenzar la siguiente.
- **CA-04**: **Dado** un pedido que la especificación activa no contempla, **cuando** se comienza a definirlo, **entonces** se abre una especificación nueva y no se reutiliza la especificación terminada 001 para autorizarlo.

### Relación con el trabajo en Git (HU-04)

- **CA-05**: **Dado** una issue, una rama o una pull request que describen el pedido, **cuando** aún no hay una especificación aprobada, **entonces** esos elementos no autorizan a modificar la aplicación ni a saltarse las fases.

### Carpeta, aprobación e historial (HU-05)

- **CA-06**: **Dado** las reglas generales de la aplicación y el manual del agente, **cuando** se consulta dónde se trabaja y quién aprueba, **entonces** identifican `staff/diego-molero/asistenciapp/` y establecen que aprueba la persona que trabaja en esta carpeta.
- **CA-07**: **Dado** la especificación 001 y sus documentos asociados, **cuando** se aplica este cambio de reglas, **entonces** su contenido histórico permanece igual, incluidos los nombres, las fechas, las decisiones y las verificaciones que ya constan.
- **CA-08**: **Dado** las reglas actualizadas, **cuando** se consulta su historial, **entonces** la enmienda figura en la versión 2.2 de la constitución con su fecha real y el motivo del cambio.

## 5. Fuera de alcance

- Corregir los títulos del README sobre activar el entorno y arrancar la aplicación.
- Quitar de toda la documentación las referencias personales heredadas o sustituir las rutas del README por ejemplos genéricos.
- Cambiar la organización del código, mover documentos o renombrar el manual del agente.
- Añadir funcionalidades o modificar el comportamiento de pasar lista.
- Cambiar las decisiones, los resultados o las aprobaciones históricas de la especificación 001.
- Incorporar las pull requests a `staging` o considerar aprobada una fase por la aprobación de otra persona en GitHub.
- Integraciones automáticas con plataformas de clase; siguen como idea futura sin reservar el número 002.

## 6. Preguntas abiertas

Ninguna. La persona que trabaja en esta carpeta aprobó esta especificación el 2026-10-23.

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Borrador inicial | Precisar la aprobación previa para los cambios en la aplicación y adaptar las reglas a esta copia |
| 1.0 | 2026-10-23 | Especificación aprobada | Aprobación expresa para preparar el plan técnico |
| 1.1 | 2026-10-23 | Implementada y comprobada; pendiente de conformidad final | Constitución 2.2 y manual actualizados; CA-01 a CA-08 revisados y 77 tests en verde por el agente |
| 1.2 | 2026-10-23 | Conformidad final recibida | La persona responsable da por bueno el resultado y autoriza commit, push y actualización de la PR; revisión de compañeros e incorporación a `staging` pendientes |
