# Flujo de trabajo de Git

Issue: #663.

Estado: aprobado mediante autorización anticipada de Diego para implementar, comprobar y entregar esta tarea. Fecha: 2026-10-30. No se atribuye una revisión individual de cada documento.

## Necesidad

Quien construye first-app quiere dejar una tarea escrita, preparar su rama, guardar avances y pedir revisión con pasos pequeños y resultados comprobables. Las instrucciones deben poder seguirse desde distintos clientes de IA conservando las decisiones de la persona responsable.

## Personas y resultados

- La persona responsable define el cambio y decide sus aprobaciones y revisores.
- El agente principal coordina el trabajo y recibe resultados de encargos delimitados.
- Los agentes especializados realizan la acción asignada, sin ampliar su alcance ni inventar resultados.

## Criterios de aceptación

- **CA-01:** La copia de Diego contiene los agentes, procedimientos, herramientas, plantillas y referencia de acceso de la plantilla compartida, adaptados a su ubicación.
- **CA-02:** Una delegación se ejecuta realmente mediante la herramienta disponible del cliente, con un encargo concreto y un resultado devuelto al principal. Leer un archivo de instrucciones no se presenta como ejecución de un subagente.
- **CA-03:** Las instrucciones conservan las fases y decisiones humanas; una autorización anticipada válida se respeta sin pedir aprobaciones ya concedidas. Las dudas o accesos pendientes se comunican con su causa.
- **CA-04:** Las operaciones remotas comprueban identidad y existencia previa de la tarea o solicitud de revisión. Si la conexión principal no ejecuta la acción, la alternativa oficial conserva el alcance y evita duplicados sin cambiar credenciales ni configuración personal.
- **CA-05:** Guardar un avance incluye únicamente los archivos nombrados y conserva el trabajo preparado ajeno. La apertura vacía no incorpora archivos preparados.
- **CA-06:** Actualizar la base solo la adelanta; se conserva la rama de trabajo. Los rechazos no se resuelven forzando integraciones o publicaciones y no se realiza la fusión de la solicitud de revisión.
- **CA-07:** Las instrucciones, rutas y herramientas se comprueban en repositorios temporales aislados, con resultados reales y límites documentados, sin modificar el historial del repositorio de trabajo para probarlas.
- **CA-08:** Se mantienen UTF-8, comentarios breves y documentación en español; no se añaden paquetes ni una suite de tests a la aplicación ni se cambia su funcionamiento o sus datos.

## Fuera de alcance

Cambiar operaciones de usuarios, clientes, datos, dependencias, configuración global o tokens. La integración en las guías comunes, la reorganización de capas y el procedimiento de Socket se coordinan en sus desarrollos correspondientes dentro de la issue #663.
