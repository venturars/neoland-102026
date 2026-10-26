# Revisión final local 009 · 2026-10-26

Implementación contrastada con spec, plan, tareas, AGENTS.md y constitución 4.1. No se identifican defectos bloqueantes en las comprobaciones locales realizadas. La aprobación del resultado por Miguel y la publicación todavía están pendientes.

## Problemas resueltos por su causa

- Los registrados avanzaban por CSS y la antigua llegada los desplazaba hacia atrás: se retiró el avance automático en escritorio/móvil y el recorrido ahora parte del origen una sola vez.
- La llegada dependía de promesas cancelables: el calendario monotónico y la ejecución activa gobiernan el tramo, sin callbacks de animación que puedan revivir resultados anteriores.
- Quince filas más el encabezado largo quedaban fuera de pantalla: escena compacta propia sobre la misma parrilla, con ocultación de no registrados durante el recorrido y clasificación completa después. Verificación geométrica real, no solo scroll automático.
- Un aviso de red podía permanecer tras recuperarse la consulta: el estado de error de polling se limpia al recibir respuesta válida; se conservan los errores de acciones.

## Resultado de la revisión

Se conserva el registro inmediato, puestos/horas del servidor y seguridad 008. El reloj final es únicamente decorativo. Cancelación, retirada, resize, recarga, movimiento reducido y pérdida de autorización no inician otra carrera ni otro intento. Se conserva un único polling, espera de acciones, UUID y cuerpo de reintentos. No hay cambios Python, de esquema, privacidad o dependencias.

El tema elimina texto redundante y se limita a las vistas adoptantes. Los dibujos conservan correspondencias y rasgos, con validación y revisión a tamaño real. El registro normal y la descarga se probaron, además de la suite íntegra y los ensayos de 007.

## Límites de la evidencia

La prueba de ocultación automatizada simula el evento de visibilidad, no una suspensión real del ordenador. No se afirma una auditoría de lector de pantalla. La recaptura de referencia 007 es posterior al desarrollo sobre la copia conservada. La prueba física de QR anterior corresponde a 007; 009 conserva generador y rutas sin cambios, pero no atribuye a Miguel un nuevo ensayo físico todavía.

La spec aprobada prevé una celebración local a cada presentación, sin sincronización estricta entre ventanas. Los presupuestos y accesos continúan siendo duraderos en el backend. La identidad débil no cambia.

Evidencia y cobertura de los catorce criterios: [evidence.md](evidence.md). El siguiente paso de revisión de producto es la demo real en navegador de 009, seguida de la respuesta de Miguel.
