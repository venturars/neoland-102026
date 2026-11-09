# Tareas: selector aleatorio

Referencias: [spec.md](spec.md), [plan.md](plan.md), issue #1174.
Autorización conjunta de plan, tareas e implementación: Miguel, 2026-11-09.

- [x] T01 Implementar operación compartida y verificar selección, vacío y fallo (CA-01–06).
- [x] T02 Añadir y ejecutar ejemplo terminal en copia desechable (CA-03–06,08).
- [x] T03 Añadir acción web y verificar estados e identidad (CA-03–07).
- [x] T04 Actualizar contratos, errores, arquitectura, inventario y uso (CA-08).
- [x] T05 Ejecutar formato, lint y regresiones relevantes; revisar alcance.
- [x] T06 Revisión independiente de subagentes y resolución de hallazgos.

## Evidencia

2026-11-09:

- T01/T03: `node --test tests/random-user-picker.test.js`: 2/2. Aleatoriedad
  controlada (0, 0.5, 0.999999), IDs 2/8/19, nombres duplicados, repetición,
  cinco campos y objetos independientes; consultas nuevas, null y error.
  DOM simulado ejecuta el controlador web completo y comprueba limpieza,
  bloqueo de doble solicitud, mensajes e identidad. No prueba visual de navegador.
- T02: copia temporal de src/package.json, sin SQLite de trabajo. Puerto13074
  adaptado exclusivamente en la copia para proteger el servicio existente.
  Ejecutado con bash el archivo .txt real: tabla sin inicializar y servicio
  detenido muestran Could not pick a user con salida1; vacío muestra
  No users available; único y datos modificados eligen el contacto esperado.
  Registros y timestamps comparados antes/después sin diferencias.
- T05: en copia desechable, `node --test --test-concurrency=1` sobre
  random-user-picker, serve-data-through-node, web-client y client-ui-state:
  24/24. Copia y proceso temporal eliminados al terminar.
- `pnpm format` terminó0, pero su sincronización automática previa avisó de
  ERR_PNPM_IGNORED_BUILDS para protobufjs. No se autorizó ese build ni se
  modificaron package.json/lockfile. Verificación final con
  `pnpm --config.verifyDepsBeforeRun=false format` y
  `pnpm --config.verifyDepsBeforeRun=false lint`: ambos0, utilizando las
  dependencias existentes sin repetir la instalación automática.
- Primera prueba DOM detectó que al doble de pruebas le faltaba hasAttribute;
  corregido el doble. Primer lint detectó globals no declarados en las pruebas;
  corregidos con globalThis e import explícito de timers/promises. Reejecución
  final de las dos pruebas nuevas: 2/2.
- T06: dos subagentes independientes revisaron contratos/alcance y pruebas/UI.
  Sin defectos funcionales encontrados. Se corrigió su observación de estilo
  del terminal, guardando el chequeo de null antes del if.

