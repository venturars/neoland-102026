# Plan 003 · Separar activación y arranque

Responsable: Jimena Durán. Issue #240. PR #241.
Spec y plan aprobados por Jimena Durán el 2026-10-22.

## Solución técnica

Modificar únicamente la organización del apartado 2 de README.md:

1. Cambiar `## 2. Arrancar la app` por `## 2. Activar el entorno`.
2. Mantener bajo ese título el texto sobre cada terminal nueva y el bloque
   existente que entra en la carpeta y activa el entorno.
3. Insertar `### Arrancar la app` después del bloque de activación y antes
   de la tabla con las dos opciones de arranque.
4. Conservar la tabla, explicación del enlace y notas de funcionamiento.

El subtítulo mantiene la numeración de las demás secciones. No se cambian
comandos, rutas, dependencias, arquitectura, datos ni API. Las referencias
heredadas del README y comandos para otro entorno quedan fuera de la 003.

## Archivos afectados

- README.md: dos cambios de títulos, sin otras modificaciones de contenido.
- tests/test_readme_environment.py: nuevas comprobaciones documentales.
- AGENT.md: únicamente añadir/actualizar la fila de estado de la spec 003.
- specs/003-activar-el-entorno/: spec, plan y tasks, según sus aprobaciones.

La fila de estado cumple la obligación de mantener el seguimiento SDD de
AGENT.md. No se modifica la constitución ni el contenido de las specs 001 y 002.

## Verificación por criterio

Crear las comprobaciones antes del cambio de README y ejecutarlas para
confirmar que detectan la confusión actual. Usar pathlib y pytest existentes;
resolver rutas desde el archivo del test, sin depender del directorio actual.

- CA-01: la sección 2 se llama Activar el entorno y contiene el bloque original
  de cambio de carpeta y activación.
- CA-02: el subtítulo Arrancar la app precede a la tabla original y conserva
  las opciones de clase online y prueba local con sus comandos.
- CA-03: el bloque de activación precede al subtítulo y no pertenece al bloque
  de arranque, delimitado hasta la siguiente sección principal.
- CA-04: comparar el README completo con la versión previa aplicando solo
  las dos transformaciones previstas; cualquier otra diferencia falla.

Para CA-04, registrar antes de editar el SHA256 del README base. La prueba
puede deshacer en memoria las dos transformaciones y comparar ese hash;
no requiere Git ni una copia adicional de producción para ejecutar los tests.

Después del cambio ejecutar las nuevas comprobaciones y pytest completo.
Revisar el diff de README: solo título principal y subtítulo insertado.
No arrancar servidores ni túneles: la 003 no modifica su comportamiento.

## Comprobación de la constitución

- P1: sin integraciones ni cambios de plataforma.
- P2: dos cambios documentales directos, sin automatización adicional.
- P3: sin dependencias nuevas; pytest ya declarado.
- P4: sin acceso a registros de asistencia ni cambios de almacenamiento.
- P5: sin cambios en interfaz o accesibilidad de la aplicación.
- P6: textos y documentación en español.
- §5: comprobar CA-01–CA-04 y ejecutar toda la suite pytest.
- §6: sin cambios de códigos, sesiones, validación o duplicados.
- §4: esperar aprobación del plan, después de las tareas, antes de implementar.

## Git y alcance

Rama: jimena-duran-221020264. Base de PR #241: jimena-duran-221020263.
Revisar cambios relativos a esa base para aislar la 003 de la 002.
Mantener la PR en draft y actualizar su descripción con resultados reales
cuando se autorice guardar y subir el trabajo.
No incluir bases locales, archivos de otros proyectos ni cambios 004 o 005.

## Estado

No hay decisiones pendientes. Este plan está aprobado;
no se han creado las tareas ni los tests ni modificado el README o AGENT.md.
## Resultado de implementación

Implementada tras aprobar spec, plan y tareas. Verificación local: 97 pruebas pasan;
README sin cambios adicionales. Aprobación humana final pendiente. Sin commit ni push.
