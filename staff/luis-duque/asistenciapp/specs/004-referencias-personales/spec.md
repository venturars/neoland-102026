# Spec 004 · Quitar referencias personales

Estado: aprobada el 2026-10-25. Autorizados el plan y las tareas.
Ámbito: asistenciapp.

## 1. Problema

En asistenciapp quedan referencias personales de Victor: su nombre y comprobaciones hechas con su móvil. Esas notas están en la spec 001. Quien lee esa spec ve a una persona, no solo la decisión o el resultado de la prueba.

La spec 001 está terminada y no cubre este pedido. La spec 002 exige una spec nueva antes del cambio y deja la 001 intacta salvo en lo que esta spec autorice. La spec 003 no cubre este pedido.

## 2. Usuarios

- Quien aprueba: decide que esas referencias salgan de la aplicación.
- Quien lee la spec 001: necesita las decisiones y las pruebas, sin el nombre ni el móvil de una persona.

## 3. Historias de usuario

- HU-01: Como responsable de la aplicación, quiero que asistenciapp no nombre a Victor.
- HU-02: Como quien lee la spec 001, quiero conservar la fecha y el resultado de cada decisión y de cada prueba.
- HU-03: Como quien aprueba, quiero que el resto de la spec 001, y el comportamiento de pasar lista, no cambien.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dado asistenciapp, salvo el texto de esta spec que dice a quién se quita, cuando se busca «Victor», entonces no aparece.
- CA-02 (HU-02): Dadas las decisiones del plan y las pruebas del 2026-10-20 en la spec 001, cuando se leen, entonces siguen la fecha y el resultado técnico.
- CA-03 (HU-03): Dado el comportamiento de pasar lista y el resto de las specs 001, 002 y 003, cuando se aplica este cambio, entonces no se modifican.

## 5. Fuera de alcance

Reescribir el resto de la spec 001. Cambiar las specs 002 y 003. Cambiar el comportamiento de la aplicación, la forma de pasar lista o las instrucciones de arranque.

## 6. Preguntas abiertas

Ninguna.
