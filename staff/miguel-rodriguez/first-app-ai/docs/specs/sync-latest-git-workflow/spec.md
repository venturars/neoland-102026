# Actualizar el flujo de trabajo de first-app-ai

Issue: [#1170](https://github.com/venturars/neoland-102026/issues/1170).
Ejecución completa autorizada por Miguel el 2026-11-09; revisión documental por el agente.

## Problema y resultado

El flujo local se ha quedado atrás respecto al material del curso. Quien prepara
una tarea necesita reutilizar identidades conocidas, publicar con el responsable
y destino correctos y solicitar las revisiones indicadas sin repetir trabajo.

## Criterios de aceptación

- CA-01: nombres conocidos reutilizables durante 48 horas, separados por cuenta,
  servidor y repositorio. Un fallo o dato vencido no confirma identidades ni permisos.
- CA-02: las tareas de conocimiento disponen de plantillas y tipo de rama y commit.
- CA-03: el responsable de las PR gestiona las revisiones pedidas, excluye al autor,
  evita duplicados y comprueba el resultado sin restablecer el borrador.
- CA-04: la PR nueva nace en borrador, asignada a la cuenta activa y dirigida a
  staging. La reanudación conserva el trabajo existente y sus enlaces.
- CA-05: los commits explican el cambio y referencian la tarea; conservan archivos
  ajenos preparados. Los documentos explican las herramientas vigentes.

Se conserva el proceso SDD propio y el comportamiento de la aplicación.

## Comprobación

Verificar los criterios con identidades y tiempos controlados, peticiones simuladas
y repositorios desechables. Contrastar los documentos y ejecutar los controles
del proyecto. Una simulación no demuestra permisos reales de GitHub.
