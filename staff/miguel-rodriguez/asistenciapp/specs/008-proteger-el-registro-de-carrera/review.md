# Revisión final 008 tras corregir R1/R2

Fecha: 2026-10-24. Resultado: **sin defectos conocidos que bloqueen la aprobación de la implementación local**. Miguel aprobó el resultado local el 2026-10-25; la publicación sigue pendiente.

## Hallazgos resueltos

| Hallazgo | Corrección comprobada | Regresión |
| --- | --- | --- |
| R1 · Lectura privada con reloj anterior a una espera | me y lobby validan el reloj después de cargar la carrera y después de cargar la respuesta. Al caducar, rechazan sin datos y liberan la lectura antes de limpiar. No se prolonga el límite original. | Espera con conexión EXCLUSIVE independiente; éxito ya guardado; caducidad al cargar operaciones/plazas exactamente en el límite y después. |
| R2 · Contención anterior a reserva tratada como 500 | Se reconocen BUSY/LOCKED al abrir/configurar conexiones y consultar datos previos. Devuelve 503 con Retry-After: 1 sin gasto nuevo. La conexión fallida se cierra. | Bloqueo EXCLUSIVE real antes de A; bloqueo de conexión en B; bloqueo real de COMMIT tras evaluar; error de E/S que conserva 500; fallo de inicialización sin conexión abierta. |

El cambio no convierte fallos de commit en intentos libres. B conserva 202 si no pudo comenzar y su oportunidad sigue gastada. Si falla la confirmación después de evaluar, A permanece reserved, no queda asistencia parcial y repetir el identificador nunca evalúa de nuevo.

## Comprobaciones realizadas

- Las dos reproducciones incorporadas a la app fallaron antes del cambio: **2 failed in 0.68s**.
- Selección de regresiones, casos de uso, HTTP y arquitectura: **64 passed in 3.29s**.
- Suite completa y reproducciones originales externas: **220 passed in 5.93s** (218 pruebas de aplicación y dos originales externas).
- Se volvió a revisar el contrato contra spec, plan y tareas: fases, ocupación, permisos, reserva A/B, 3/45, recuperación, cierre, retirada, clasificación, caducidad y conservación de las clases normales. Matriz por criterio en [evidence.md](evidence.md).
- Se revisaron AGENTS.md y constitución 4.0: tipos y documentación de funciones nuevas, capas, dependencias, mensajes españoles, datos mínimos y alcance local autorizado. Corregidos el ejemplo del reloj callable y las descripciones de retorno HTTP señaladas en el review.
- Compilación, nombres de pruebas citadas y enlaces locales comprobados. El checkout original coincide con el manifiesto de partida; dependencias y static/ siguen iguales. La constitución 4.0 aprobada no cambió durante estas correcciones.
- El ensayo de HTTP real de quince clientes/cincuenta envíos sigue pasando; detiene su servidor y comprueba el puerto libre. Las regresiones nuevas usan bases ficticias y no arrancan servicios.

No se encontraron otros defectos que requieran cambiar la spec o el plan. La identidad débil y el posible acaparamiento de nombres siguen siendo las limitaciones aceptadas, no hallazgos nuevos. No se afirma protección absoluta contra saturación de red/servidor.

## Tareas y entrega

T10/T19/T21/T26/T33/T43/T45 se reabrieron, verificaron y cerraron de nuevo. T47–T49 y la evidencia se actualizaron. Permanecen abiertas las partes de T02/T50/T51/T52 correspondientes a publicación, revisión/prueba de Miguel y limpieza final tras conservar el trabajo. No se ha creado una PR acumulada, cambiado una base, hecho commit/push/merge ni tocado main. La entrega futura conserva staging como destino.


2026-10-25: Miguel indicó «ok apruebo 008, sigamos con la implementación de 007, sigue las tareas y revisa mientras avanzas». Aprobación final del resultado local de 008 registrada; no atribuye una prueba manual del juego, publicación ni aprobación de peers. Se conserva esta copia como base revisada para 007.
