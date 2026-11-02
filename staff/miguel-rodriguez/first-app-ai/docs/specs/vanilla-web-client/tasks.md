# Tareas del cliente web

Issue: #760. Referencias: [spec](spec.md), [plan](plan.md).
Preparación y ejecución delegadas por Miguel el 2026-11-02.

- [x] T01 · CA-05. Inventario inicial y copia aislada sin datos reales.
- [x] T02 · CA-01,03,04,05. Escribir pruebas HTTP de contratos y preservación.
- [x] T03 · CA-01,03,04,05. Adaptador HTTP mínimo y errores de entrada.
- [x] T04 · CA-07. Arranque loopback e inicialización explícita sin datos de ejemplo.
- [x] T05 · CA-01,02,06. Pantallas y navegación accesible de lista y menú.
- [x] T06 · CA-03,04,06. Edición, mensajes y borrado confirmado.
- [x] T07 · CA-02. Notas visible como pendiente, sin implementar almacenamiento.
- [x] T08 · CA-05,07. Comandos, lint, guías y enmienda descriptiva limitada.
- [x] T09 · CA-01 a CA-07. Ejecutar pruebas y recorrido de navegador; revisar fallos.
- [x] T10 · CA-05. Formato/lint, conservación, limpieza y evidencia real.

## Revisión previa

Las tareas cubren el plan y los siete criterios; no requieren paquetes nuevos ni
cambian contratos existentes. Primero pruebas HTTP, después implementación.

## Evidencia

Implementación y revisión local realizadas el 2026-11-02 en copia aislada de
staging. El encargo de Miguel delega terminar los pendientes; no se atribuyen
aprobaciones individuales de estos documentos.

- Node builtin: dos escenarios de integración HTTP pasan, con más de 40 aserciones
  sobre lista/consulta sin escrituras, validación de transporte, normalización,
  duplicados, conservación del otro contacto, borrado, vaciado, estáticos,
  métodos, origen ajeno, inicialización vacía y error interno sin detalles.
- pnpm --config.verifyDepsBeforeRun=false format y después lint: salida 0.
- pnpm --config.verifyDepsBeforeRun=false test:web: 2 pruebas, 2 pasan.
- Primera ejecución sin permiso de loopback: servidor no pudo arrancar; se repitió
  con autorización de red local y ambas pruebas pasaron. Los servidores y bases
  temporales de las pruebas se eliminaron al terminar.
- No se añadieron dependencias ni se alteró pnpm-lock.yaml. Los 113 archivos
  existentes fuera de README, arquitectura, árbol, constitución descriptiva,
  package scripts y lint quedaron idénticos a staging. En particular db, queries,
  logic, clientes Terminal/Jupyter, clasificador y scripts Git no cambiaron.
- Correcciones durante revisión: usar el mensaje real Email is already used,
  decodificar UTF-8 después de reunir los chunks y enfocar el campo después de
  rehabilitar el formulario. Volver a ejecutar formato/lint y pruebas: todo pasa.
- T09–T10: recorrido real por Playwright en copia separada con Ada y Grace
  ficticias: selección ID, menú, edición/guardado y normalización, email duplicado,
  volver sin guardar, cancelar/confirmar borrado, otro contacto conservado, volver
  a selección y Notas deshabilitado como futura opción. Probados desconexión y
  recuperación, contacto eliminado desde otra petición y lista vacía. Sin
  desbordamiento horizontal en el viewport de escritorio observado.
- Revisión independiente de servidor, arranque, UI y pruebas contra spec/plan:
  sin defectos bloqueantes. Servidor temporal 8872 detenido y puerto libre.
  Sin datos reales ni dependencias nuevas. Publicación aún pendiente de registrar
  mediante sus commits y GitHub; no se atribuye un merge o revisión de compañeros.


- Comprobación adicional en viewport móvil 390×844: lista, menú y editor sin
  desbordamiento horizontal. Selección y entrada al editor mediante Tab/Enter;
  foco en el título del menú y después en Nombre. Un nombre con marcado HTML
  se mostró literalmente en lista/menú, sin crear imágenes ni ejecutar eventos.
  Servidor temporal detenido; sin datos reales ni servidor público.
