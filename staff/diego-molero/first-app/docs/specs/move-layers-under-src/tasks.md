# Tareas — capas dentro de src

Issue: #663. Spec, plan e implementación autorizados anticipadamente por Diego el 2026-10-30; no se atribuye una revisión individual.

- [x] T01 Registrar los hashes de módulos, SQL, lockfile y base local y verificar los destinos dentro de first-app. CA-01, CA-04.
- [x] T02 Mover las cuatro carpetas conservando sus archivos y adaptar exclusiones, package.json y el destino del lanzador Jupyter. CA-01, CA-02, CA-04.
- [x] T03 Adaptar los nueve clientes de terminal y nueve notebooks: imports, raíz y enlaces; limpiar solo metadatos de ejecución. CA-02, CA-03.
- [x] T04 Comprobar sintaxis, hashes, contratos y clientes en una copia temporal sin la base personal, distinguiendo respuestas controladas de IA real. CA-02, CA-03, CA-04.
- [x] T05 Comprobar Jupyter en Windows y coordinar con el principal las referencias de las guías activas; registrar límites y evidencia real. CA-02, CA-03, CA-05.

## Evidencia

Implementación y verificación terminadas por los agentes y el principal el 2026-10-30. Se conservan los 20 hashes de módulos, SQL, base personal y lockfile; comprobación repetida al cierre.

- Sintaxis de diez módulos JavaScript y nueve notebooks correcta. Ocho comandos sin IA ejecutados en la copia aislada, y contratos CRUD y clasificador con respuestas controladas comprobados por el subagente. La instalación offline utilizó pnpm 11.25.0 sin cambiar el lockfile.
- Nueve notebooks ejecutados con kernels reales en la copia aislada; `notebook-results.json` registra salida no vacía de cada uno. El clasificador utilizó Ollama real; el primer intento con el servicio apagado produjo ECONNREFUSED y no se contó como éxito. El servidor propio fue detenido al cierre. Los originales mantienen contadores nulos y ninguna salida.
- El principal ejecutó el lanzador desde first-app: HTTP 200 en /api/contents del puerto 8896 y nueve documentos de src/clients/jupyter, sin kernels sobre la base personal. Apagado por /api/shutdown y proceso terminado.
- Guías comunes y seis planes anteriores actualizados con ubicaciones vigentes sin borrar evidencia. Comprobaciones reales en Windows; Linux y macOS pendientes. No se añade una suite de tests al proyecto.
