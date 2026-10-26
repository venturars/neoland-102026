# Spec 003 · Activar el entorno y arrancar la app

Estado: aprobada el 2026-10-25. Autorizada la preparación del plan.
Ámbito: las instrucciones de uso de esta aplicación.

## 1. Problema

Las instrucciones llaman «arrancar la app» a los pasos que solo preparan el entorno. Quien las sigue cree que la aplicación ya está en marcha, y no lo está. Arrancar la app es otra acción, y en las instrucciones queda mezclada con la anterior.

La spec 001 está terminada y no cubre este pedido. La spec 002 deja estas instrucciones fuera de su alcance.

## 2. Usuarios

- Quien prepara la aplicación: necesita saber cuándo el entorno está listo y cuándo la aplicación está arrancada.
- Quien aprueba: revisa que las instrucciones no confundan las dos acciones.

## 3. Historias de usuario

- HU-01: Como quien prepara la aplicación, quiero que los pasos que solo activan el entorno se llamen así, y no «arrancar la app».
- HU-02: Como quien prepara la aplicación, quiero ver «arrancar la app» junto a los pasos que de verdad la inician.
- HU-03: Como quien aprueba, quiero que las dos acciones sigan siendo distintas en las instrucciones.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dadas las instrucciones de una terminal nueva, cuando solo se entra en la carpeta y se activa el entorno, entonces ese apartado se titula activar el entorno y no se titula arrancar la app.
- CA-02 (HU-02): Dadas esas mismas instrucciones, cuando se busca cómo arrancar la app, entonces esa acción aparece junto a los pasos que la inician.
- CA-03 (HU-03): Dado el apartado de preparar el entorno y el de arrancar la app, cuando se leen seguidos, entonces no usan el mismo nombre para las dos acciones.

## 5. Fuera de alcance

Cambiar el comportamiento de la aplicación, la forma de pasar lista, los pasos de la primera instalación y reescribir las specs 001 y 002.

## 6. Preguntas abiertas

Ninguna.
