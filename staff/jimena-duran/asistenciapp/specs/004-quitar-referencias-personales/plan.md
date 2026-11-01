# Plan 004 · Anonimizar referencias heredadas

Responsable: Jimena Durán. Issue #242. Autorizado continuar con el conjunto de la tarea.

## Cambios
README.md: sustituir solo sus dos rutas personales por staff/<usuario>/asistenciapp.
Spec 001: sustituir atribuciones personales por formulaciones impersonales,
conservando fechas, decisiones y resultados. No sustituirlas por Jimena.
Los documentos 002 y 003 no contienen actualmente ese nombre heredado:
se conservan sus evidencias históricas; la autorización posterior es esta 004.
AGENT.md: añadir el seguimiento de la 004, conservando responsables y arquitectura.
Tests: añadir test_personal_references.py; adaptar las comprobaciones de integridad
002 y 003 para admitir exclusivamente los cambios documentales de esta tarea.
Sin dependencias nuevas, sin cambios de API, datos, runtime o interfaz.

## Verificación
Probar antes y después: rutas genéricas, búsqueda de referencias heredadas,
frases históricas esperadas y hashes de contenido. Para 001 se registra el hash
anonimizado tras revisar las sustituciones; para README se normaliza solo la ruta
antes de aplicar la comprobación de la 003. Ejecutar pytest completo y diff --check.

## Comprobación de la constitución
P1: sin plataformas nuevas. P2: sustituciones directas. P3: solo pytest existente.
P4: sin datos nuevos. P5: sin interfaz modificada. P6: documentación en español.
§5: comprobar CA-01–CA-04 y suite completa. §6: sin cambios de seguridad.
La orden de Jimena autoriza preparar el SDD completo y continuar; no autoriza
commit o push de implementación. Conservar la arquitectura original.
