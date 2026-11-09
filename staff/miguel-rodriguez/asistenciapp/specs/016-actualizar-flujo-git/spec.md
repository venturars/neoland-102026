# Actualizar el flujo de trabajo de asistenciapp

Issue: [#1171](https://github.com/venturars/neoland-102026/issues/1171).
Ejecución completa autorizada por Miguel el 2026-11-09; revisión documental por el agente.

## Problema

El flujo local se ha quedado atrás respecto al material del curso. Quien prepara
una tarea necesita reutilizar identidades conocidas, publicar con el responsable
y destino correctos y solicitar las revisiones indicadas sin repetir trabajo.

## Usuarios e historias

- HU-01: quien prepara tareas quiere reutilizar revisores ya conocidos.
- HU-02: quien publica quiere expresar el cambio y pedir revisión con el destino correcto.

## Criterios de aceptación

- CA-01: dado un nombre resuelto, cuando se vuelve a pedir antes de 48 horas,
  entonces se reutiliza solo en la misma cuenta, servidor y repositorio.
  Al vencer o fallar la consulta, no se presentan identidades ni permisos como comprobados.
- CA-02: dada una tarea de conocimiento, cuando se prepara su entrega,
  entonces dispone de plantilla, rama y commit de ese tipo.
- CA-03: dada una PR con revisores indicados, cuando se pide revisión,
  entonces el rol encargado comprueba acceso actual, excluye al autor,
  evita duplicados y verifica la solicitud sin restablecer el borrador.
- CA-04: dada una rama publicada, cuando se abre su PR,
  entonces nace en borrador hacia staging y asignada a la cuenta activa.
  Al reanudar se conservan el trabajo existente y sus enlaces.
- CA-05: dado un cambio preparado, cuando se guarda un commit,
  entonces explica el cambio, referencia la tarea y conserva archivos ajenos.
  La documentación permite localizar y comprobar el flujo vigente.

Se conserva el proceso SDD propio y el comportamiento de la aplicación.

## Fuera de alcance

El comportamiento de asistencia y los cambios de stack de la aplicación.

## Preguntas abiertas

Ninguna pendiente para esta actualización.

## Comprobación

Verificar los criterios con identidades y tiempos controlados, peticiones simuladas
y repositorios desechables. Contrastar los documentos y ejecutar los controles
del proyecto. Una simulación no demuestra permisos reales de GitHub.
