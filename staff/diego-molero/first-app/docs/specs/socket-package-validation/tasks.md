# Tareas — validar paquetes de node con socket

- [x] Documentar la regla y el procedimiento de revisión.
- [x] Consultar puntuaciones de la dependencia y sus tres niveles.
- [x] Comprobar las versiones resueltas en el lockfile.
- [ ] Completar la consulta de campañas y la cobertura individual de alertas por versión; el servicio limita la información disponible.

## Comprobación

El 27 de octubre de 2026 las siete versiones resueltas en el lockfile coincidieron con las consultadas mediante Socket depscore, sin puntuaciones inferiores a 50. Con autenticación se consultaron alertas abiertas de los siete nombres de paquete: las respuestas de la organización consultada no contenían elementos ni páginas adicionales. Esto describe el inventario de esa organización, no un informe global de cada versión. La consulta de campañas por nombre y versión devolvió 403, código threat_feed_not_entitled: la función no está habilitada en el plan de la organización. La comprobación de campañas sigue pendiente.

## Iteración del 30 de octubre de 2026 · Issue #663

La autorización anticipada de Diego permite preparar los documentos, implementar y comprobar esta ampliación sin aprobaciones intermedias. No se atribuye una revisión individual de cada documento.

- [x] **S01 · Concretar conexión y credenciales.** Crear `docs/SOCKET.md`, la referencia de `MCPS/socket-mcp/` y `.mcp.example.json` con el endpoint OAuth, sin un token real ni cambios de configuración personal. CA-01, CA-02 y CA-06.
- [x] **S02 · Precisar el procedimiento de revisión.** Documentar versiones exactas, tres niveles transitivos, opcionales instaladas, argumentos actuales de las herramientas, paginación y límites. Explicar las alertas para la decisión humana. CA-03 y CA-04.
- [x] **S03 · Registrar la evidencia fechada.** Conservar el informe del 27 y añadir el del 30, con siete puntuaciones, siete consultas de alertas organizativas y el único intento de campañas rechazado por el plan. CA-05.
- [x] **S04 · Comprobar los documentos y el ejemplo.** Validar JSON, UTF-8, enlaces, árbol de versiones y conservación del informe histórico. Confirmar ausencia de secretos y cambios de dependencias en este bloque. CA-01 a CA-06.

### Resultado de la iteración

Implementación y comprobaciones documentales realizadas por el subagente Socket el 2026-10-30; consultas al servicio realizadas por el agente principal y registradas en el plan. No se atribuyen estas comprobaciones a Diego.

- El ejemplo se pudo analizar como JSON y coincide exactamente con la conexión pública OAuth prevista, sin cabeceras de autorización, variables de token ni credenciales.
- Los seis archivos de este bloque se leyeron con UTF-8 estricto. Se comprobaron cuatro enlaces locales o fragmentos de los documentos y la referencia relativa de `mcp.txt` al procedimiento.
- El contenido anterior de los tres documentos de especificación permanece como prefijo íntegro frente al commit `77184d29fad68e8ad19102ac56c6dab845ba4d68`.
- Se cotejaron siete versiones y seis relaciones de dependencia del lockfile, incluidas la opcional y la tercera capa transitiva. El lockfile no tiene diferencias frente al mismo commit.
- CA-01 y CA-02 quedan cubiertos por la guía, el ejemplo y la respuesta autenticada a `organizations` obtenida por el principal. CA-03 y CA-04 quedan cubiertos por el procedimiento y sus argumentos reales; CA-05, por el informe fechado y la conservación del anterior. CA-06 queda cubierto por el ejemplo sin secretos, el alcance documental y el lockfile intacto.

No se creó una suite de tests, se instaló un paquete ni se accedió a la base personal por este bloque. La integración de los enlaces en las guías comunes y la revisión conjunta de la entrega corresponden al agente principal.

### Límites que permanecen

La casilla histórica sobre campañas y alertas individuales por versión sigue pendiente. Que la conexión esté autenticada y las consultas organizativas respondan no amplía la cobertura del plan Free ni añade un filtro de versión a la herramienta de alertas.
