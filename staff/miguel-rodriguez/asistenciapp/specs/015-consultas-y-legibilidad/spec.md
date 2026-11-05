# Consultas separadas y pasos legibles

Issue: #1033 · PR: #1035.
Miguel autorizó el 2026-11-04 completar conjuntamente esta corrección, preparar sus documentos,
implementar y publicar. Se registra esa petición, no aprobaciones individuales.

## Problema

Las instrucciones para guardar y recuperar datos siguen mezcladas con las
funciones que las ejecutan. Algunas funciones concentran varios pasos y nombres
abreviados, lo que dificulta seguir una operación y revisar sus efectos.

## Usuarios

Miguel y quienes mantienen o revisan la aplicación; profesor y alumnado que
necesitan conservar el funcionamiento de las clases y carreras.

## Historias de usuario

- Como mantenedor, quiero encontrar cada consulta separada y reconocer sus datos
  de entrada, ejecución y resultado.
- Como revisor, quiero leer nombres y pasos concretos sin reconstruir varias
  operaciones dentro de una expresión.
- Como usuario, quiero conservar mis clases, asistencias y resultados al actualizar.

## Criterios de aceptación

- **CA-01:** Dada una función de almacenamiento, cuando se revisa, entonces el
  texto de sus consultas está separado de su ejecución y se encuentra respecto
  a la propia aplicación, con independencia de la carpeta desde la que se arranque.
- **CA-02:** Dadas las funciones modificadas, cuando se leen, entonces sus nombres
  y pasos distinguen datos recibidos, consulta, conversión y resultado. Las
  funciones mantienen sus responsabilidades y las expresiones claras se conservan.
- **CA-03:** Dados datos anteriores o una instalación nueva, cuando se prepara y
  utiliza la aplicación, entonces se mantienen registros, esquema, orden, fechas,
  respuestas y validaciones. Repetir la preparación conserva los datos guardados.
- **CA-04:** Dada una escritura o una comprobación de carrera, cuando se confirma,
  revierte, repite o falla, entonces conserva el presupuesto, la reserva previa,
  la evaluación de un uso, la recuperación y los límites de vigencia y concurrencia.
- **CA-05:** Dada una entrada en las funciones de dominio modificadas, cuando se
  evalúa antes y después del cambio, entonces obtiene los mismos resultados y
  rechazos, también en los límites de tiempo y normalización.
- **CA-06:** Dada la entrega, cuando se comprueba, entonces cada criterio tiene
  evidencia concreta y la arquitectura y el estado del trabajo describen lo
  implementado conservando las especificaciones anteriores.

## Fuera de alcance

Cambiar pantallas, reglas de asistencia, dependencias, proceso de trabajo o
seguridad; introducir proveedores intercambiables o una gestión genérica de datos.

## Preguntas abiertas

Ninguna para el alcance definido en la issue.
