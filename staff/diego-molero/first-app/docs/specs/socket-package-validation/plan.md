# Plan — validar paquetes de node con socket

Añadir la regla breve a la constitución y el procedimiento al AGENTS.md. Registrar aquí las versiones concretas, las puntuaciones y el alcance de la revisión. No se añaden llamadas a Socket al código de negocio.

## Revisión del 27 de octubre de 2026

Puntuaciones obtenidas con Socket depscore antes de instalar. Orden: licencia, mantenimiento, calidad, cadena de suministro, vulnerabilidades.

| Paquete | Nivel | Puntuaciones |
| --- | --- | --- |
| cli-table3@0.6.5 | 0 | 100 / 81 / 100 / 100 / 100 |
| string-width@4.2.3 | 1 | 100 / 85 / 81 / 100 / 100 |
| @colors/colors@1.5.0 (opcional) | 1 | 100 / 82 / 100 / 100 / 100 |
| emoji-regex@8.0.0 | 2 | 100 / 84 / 91 / 100 / 100 |
| is-fullwidth-code-point@3.0.0 | 2 | 100 / 79 / 77 / 100 / 100 |
| strip-ansi@6.0.1 | 2 | 100 / 80 / 74 / 100 / 100 |
| ansi-regex@5.0.1 | 3 | 100 / 85 / 90 / 100 / 100 |

No hay puntuaciones inferiores a 50 en esta consulta. Las siete versiones coinciden con el lockfile instalado.

## Alertas y campañas

Tras autenticar Socket, la consulta de alertas abiertas de cada nombre de paquete en la organización disponible devolvió una lista vacía, sin páginas adicionales. El filtro de esta herramienta no selecciona versión: este resultado describe la organización consultada y no garantiza ausencia de alertas globales en cada versión.

Para los siete paquetes, la consulta de campañas por nombre y versión devolvió HTTP 403 con código threat_feed_not_entitled: la función no está habilitada en el plan actual de la organización. No se ha comprobado su pertenencia a campañas. Esta parte de la revisión permanece pendiente; las puntuaciones no la sustituyen.
