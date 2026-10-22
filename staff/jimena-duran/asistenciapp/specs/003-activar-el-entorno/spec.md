# Spec 003 · Activar el entorno no es arrancar la app

Responsable: Jimena Durán. Issue #240.
Estado: aprobada por Jimena Durán el 2026-10-22.

## 1. Problema

El README de la aplicación de Jimena titula «Arrancar la app» el bloque que
entra en la carpeta y activa el entorno. Ese bloque no inicia la aplicación.
Las dos opciones de arranque aparecen después, por lo que una persona que
aprende puede creer que la aplicación ya está funcionando al activar el entorno.

## 2. Usuarios

Jimena Durán y cualquier persona que consulte el README para poner la
aplicación en marcha y necesite distinguir preparación, activación y arranque.

## 3. Historias de usuario

- HU-01: Como lectora, quiero que el bloque de activación indique lo que hace,
  para no confundirlo con el arranque de la aplicación.
- HU-02: Como lectora, quiero encontrar las dos opciones de arranque bajo
  su propio título y saber que vienen después de activar el entorno.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dado el README, cuando se lee el bloque que entra en la
  carpeta y activa el entorno, entonces su título dice «Activar el entorno»
  y no «Arrancar la app».
- CA-02 (HU-02): Dado el título «Arrancar la app», cuando se lee el bloque
  de opciones, entonces presenta las dos formas actuales: clase online y
  prueba solo en el propio ordenador.
- CA-03 (HU-01, HU-02): Dada la sección de arranque, cuando se siguen sus
  instrucciones, entonces el paso de activar el entorno está separado y
  aparece antes; no está incluido dentro de esa sección.
- CA-04: Dado el resto del README, cuando se separan los bloques, entonces
  la preparación inicial, los comandos existentes, las instrucciones de uso,
  cierre, problemas frecuentes, pruebas y privacidad conservan su contenido.
  La explicación del enlace y del funcionamiento durante el arranque se conserva.

## 5. Fuera de alcance

Cambiar rutas personales, nombres o ejemplos del README; adaptar los comandos
a otro sistema operativo; modificar el arranque, el producto o la arquitectura;
renumerar otros títulos del README. Las tareas 004 y 005 siguen independientes.

## 6. Preguntas abiertas

Ninguna para este alcance. Los comandos heredados corresponden a otro entorno;
esta tarea solo aclara los títulos y la separación de pasos, sin afirmar que
esos comandos funcionan en PowerShell. Su adaptación requeriría otro alcance.

## 7. Historial

- 2026-10-22: propuesta inicial adaptada al proyecto de Jimena Durán a partir
  del alcance de la referencia 003; sin aprobación ni pruebas de implementación.
- 2026-10-22: Jimena Durán aprueba la spec y autoriza preparar el plan.

## Resultado de implementación

Implementada tras aprobar spec, plan y tareas. Verificación local: 97 pruebas pasan;
README sin cambios adicionales. Aprobación humana final pendiente. Sin commit ni push.
