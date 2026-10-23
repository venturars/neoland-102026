# Spec 004 · Quitar referencias personales heredadas

Responsable: Jimena Durán. Issue #242.
Autorización: Jimena solicita preparar el SDD completo y continuar con la tarea.

## Problema y usuarios
Quien sigue el README encuentra una carpeta de otra persona. Las notas heredadas
atribuyen decisiones y pruebas a esa persona. Se necesita documentación genérica
sin perder fechas ni resultados ni atribuir antecedentes a Jimena.

## Historias de usuario
- HU-01: Como lectora quiero rutas genéricas para ubicar mi copia.
- HU-02: Como lectora quiero conservar las decisiones y resultados históricos sin nombres heredados.

## Criterios de aceptación
- CA-01: Los dos cambios de carpeta del README usan literalmente staff/<usuario>/asistenciapp.
- CA-02: Ningún Markdown de la aplicación fuera de esta spec y entornos locales
  conserva el nombre o la carpeta personal heredados que se eliminan.
- CA-03: Las notas conservan fechas, decisiones y resultados; no se atribuyen a Jimena.
- CA-04: Los demás comandos y contenido del README y el comportamiento de la app no cambian.

## Fuera de alcance
Eliminar la responsabilidad de Jimena de sus reglas, adaptar comandos al sistema
operativo, cambiar arquitectura o funcionalidad. La 005 sigue independiente.

## Decisión de compatibilidad
La 002 conservó intacta la spec 001 en su entrega. La 004 autoriza ahora únicamente
su anonimización; se actualizan las comprobaciones históricas para esta nueva base.
No se reescriben las evidencias de lo ocurrido durante la 002 o la 003.

## Preguntas abiertas
Ninguna para el alcance de la referencia solicitado.
