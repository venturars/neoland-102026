# Revisión de 007 · 2026-10-25

Se contrastaron implementación, spec, plan, tareas, AGENTS.md y constitución 4.1. No quedan defectos bloqueantes identificados en la revisión local. Miguel confirmó después el recorrido en ordenador y el QR desde su móvil. La preparación para publicar queda autorizada por su «go».

## Resultado por responsabilidad

- **007:** QR SVG privado, panel con elección de modo, pantalla del alumno, presentación, quince personajes, llegada y podio implementados. El servidor decide puestos y fases; la animación los representa.
- **008:** conserva dominio, almacenamiento, casos de uso, cookies, CSRF, reservas A/B, límites, caducidad y limpieza. El único añadido a su adaptador HTTP es la ruta QR de 007. Sus pruebas originales permanecen.
- **006 y datos anteriores:** suite de regresión íntegra; clases normales conservan sus límites y precedencia. No hay cambios en la base real ni en los originales de Halloween.
- **SDD y dependencias:** ejecución autorizada por Miguel tras aprobar por separado documentos y backend. P3/4.1 aplica el texto aprobado; qrcode==8.2 sin extras, colorama de plataforma documentada. Sin frameworks, IA de producto o servicios de QR.
- **Recuperación:** UUID y cuerpo no cambian al repetir; respuesta perdida se recupera sin registrar dos veces; 202 no concede un reintento gratuito. Acciones serializadas tras polling y ausencia de consultas superpuestas comprobadas con una petición retenida.
- **Experiencia:** código decide ganador, no QR; cuenta atrás única; ausentes no impiden Go; agotamiento no bloquea otra plaza; cierre manual explícito; movimiento reducido muestra resultado sin carrera. Los quince pilotos son adaptaciones de personajes, no retratos de alumnos.

## Correcciones de la revisión

La espera de acciones durante polling resuelve la pérdida del clic en su origen. El foco no se altera deshabilitando controles cada segundo. Los karts animan transformaciones y los resultados no dependen de animationend. Se corrigieron los estados antiguos de documentación y se completaron sus enlaces de evidencia, sin quitar pruebas para obtener verde.

## Pendiente concreto

- T43 completada después de esta revisión: Miguel confirmó el escaneo físico y recorrido por HTTPS con túnel real.
- T49: recorrido del juego probado por Miguel; se conserva la copia de código hasta publicar para no perder la única implementación. Servicios detenidos. Limpieza definitiva de la copia pendiente tras conservar el trabajo en Git.
- T02/T50: publicación exclusiva de 007 a staging cuando estén integradas sus bases. No se ejecutó Git ni se encadenaron PRs.

Los límites aceptados siguen explícitos: elegir nombres no autentica personas; se puede acaparar el lobby; perder el acceso tras Go impide recuperarlo; tres intentos no son una garantía de cero aciertos por azar. La carrera limita evaluaciones por plaza, no toda forma de sabotaje.

Procedimientos, cifras y cobertura de los 25 criterios: [evidence.md](evidence.md).
