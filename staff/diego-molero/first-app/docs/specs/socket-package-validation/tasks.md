# Tareas — validar paquetes de node con socket

- [x] Documentar la regla y el procedimiento de revisión.
- [x] Consultar puntuaciones de la dependencia y sus tres niveles.
- [x] Comprobar las versiones resueltas en el lockfile.
- [ ] Completar la consulta de campañas y la cobertura individual de alertas por versión; el servicio limita la información disponible.

## Comprobación

El 27 de octubre de 2026 las siete versiones resueltas en el lockfile coincidieron con las consultadas mediante Socket depscore, sin puntuaciones inferiores a 50. Con autenticación se consultaron alertas abiertas de los siete nombres de paquete: las respuestas de la organización consultada no contenían elementos ni páginas adicionales. Esto describe el inventario de esa organización, no un informe global de cada versión. La consulta de campañas por nombre y versión devolvió 403, código threat_feed_not_entitled: la función no está habilitada en el plan de la organización. La comprobación de campañas sigue pendiente.
