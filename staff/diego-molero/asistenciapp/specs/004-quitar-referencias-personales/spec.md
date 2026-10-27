# Spec 004 · Documentación sin referencias personales heredadas

> Estado: **Implementada y comprobada; entrega autorizada** · Versión: 1.1 · Creada, autorizada e implementada: 2026-10-23
>
> Tarea: [#274](https://github.com/venturars/neoland-102026/issues/274)

## 1. Problema

La documentación conserva un nombre personal y una carpeta heredados. Las instrucciones generales dependen de esa carpeta y varias notas atribuyen decisiones y pruebas a una persona concreta. Queremos una guía reutilizable que conserve las fechas y lo que se decidió o comprobó.

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| Persona que sigue la guía | Entrar en su propia copia utilizando un ejemplo genérico. |
| Persona que consulta el historial | Conservar las decisiones y comprobaciones con sus fechas, sin referencias personales heredadas. |

## 3. Historias de usuario

- **HU-01**: Quiero instrucciones con un usuario genérico para poder aplicarlas a mi carpeta.
- **HU-02**: Quiero notas sin referencias personales heredadas que conserven sus fechas, decisiones y resultados.

## 4. Criterios de aceptación

- **CA-01**: Dado el README, cuando se consultan los dos pasos de entrada al proyecto, entonces ambos utilizan `staff/<usuario>/asistenciapp` como ejemplo literal.
- **CA-02**: Dada la documentación, cuando se buscan el nombre y la carpeta heredados, entonces no aparecen fuera de los documentos que explican esta limpieza ni se sustituyen por otra persona.
- **CA-03**: Dadas las notas históricas, cuando se elimina la atribución personal, entonces se conservan la fecha, la decisión y el resultado de cada comprobación.
- **CA-04**: Dado el resto de las instrucciones y el programa, cuando se aplica la limpieza, entonces conservan su contenido y funcionamiento.

## 5. Fuera de alcance

- Cambiar las decisiones o resultados históricos, el comportamiento de asistencia o las herramientas instaladas.
- Cambiar la carpeta real de esta copia o sus límites de edición.
- Modificar las cuentas asignadas a las revisiones de GitHub o incorporar las PR a `staging`.

## 6. Preguntas abiertas

Ninguna. La persona responsable autorizó las fases restantes y la entrega para revisión. La autorización se registra como anticipada; las comprobaciones constarán con su ejecutor real.

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-23 | Especificación redactada bajo autorización anticipada para la definición, implementación y entrega. |
| 1.1 | 2026-10-23 | Limpieza implementada; cuatro criterios comprobados y 80 tests superados por el agente. Revisión y merge pendientes. |
