Issue: #601

# Tareas — reorganizar la aplicación bajo src

Spec, plan y T01–T18 aprobados, incluida su implementación y verificación. Resultados en [verification.md](verification.md). Se conservan el commit de implementación `b62abae3` y el de integración `db267b51`; las comprobaciones posteriores están registradas por separado. Jimena autoriza ahora commit selectivo de los tres documentos activos, push de la rama existente y creación de PR draft contra staging, sin revisores ni merge. No se anticipan resultados de publicación.

Rama: `601-refactor-move-app-folders-under-src`. La pendiente inicial de integrar #600 es histórica y está resuelta: #600 fue mergeada en staging y esta rama contiene el snapshot de origin/staging `64e3edf5` mediante `db267b51`. No incorporar esta reorganización a la rama de #600 ni modificar sus entregas históricas. Las rutas siguientes son relativas a first-app.

- [x] T01. Comprobar rama, cambios locales y estado de la dependencia #600 antes de implementar.
  Resultado: base y alcance registrados, sin modificar ChromaDB ni resolver bloqueos automáticamente. Criterios: 1 y 5.
- [x] T02. Inventariar archivos de las cuatro capas y registrar hashes de módulos, SQL y datos locales.
  Resultado: referencia verificable para distinguir el traslado de cambios de contenido. Criterios: 2, 4 y 5.
- [x] T03. Comprobar que SQLite esté en reposo y crear una copia de seguridad local fuera de Git.
  Resultado: base y auxiliares presentes respaldados por hash; ante procesos activos o bloqueos, informar sin cerrarlos automáticamente. Criterio: 4.
- [x] T04. Tras validar rutas absolutas y ausencia de colisiones, trasladar las cuatro carpetas completas a src con PowerShell.
  Resultado: `src/db/`, `src/clients/`, `src/logic/` y `src/queries/` conservan su contenido; automatización y configuración permanecen en la raíz. Criterios: 1 y 4.
- [x] T05. Comprobar existencia y hashes de SQLite y sus auxiliares trasladados antes de abrir la app.
  Resultado: datos conservados en `src/db/`, sin sustituirlos por una base vacía ni ejecutar clientes contra la base personal. Criterio: 4.
- [x] T06. Revisar imports entre capas y resolución de SQL y SQLite desde los módulos trasladados.
  Resultado: se conservan las referencias relativas válidas; solo se corrigen rutas afectadas, sin cambiar firmas, consultas o reglas. Criterios: 1, 2 y 5.
- [x] T07. Ajustar los imports de los nueve ejemplos de `src/clients/terminal/` al prefijo `./src/`.
  Resultado: mantienen sus here-strings PowerShell y su ejecución desde first-app. Criterio: 3.
- [x] T08. Comprobar la búsqueda de la carpeta logic desde los nueve notebooks trasladados.
  Resultado: encuentran src; se conservan imports internos y celdas válidos, sin regenerar outputs ni modificar negocio. Criterios: 2, 3 y 5.
- [x] T09. Anteponer src a los tres patrones de format en package.json.
  Resultado: el formato apunta a las nuevas capas; lint, dependencias y lockfile permanecen iguales. Criterio: 5.
- [x] T10. Actualizar el arranque documentado de Jupyter a `src/clients/jupyter`.
  Resultado: `docs/JUPYTER.md` utiliza las herramientas existentes desde first-app, sin nuevos lanzadores ni entornos. Criterios: 3 y 5.
- [x] T11. Actualizar las rutas vigentes de AGENTS.md, TREE.md, ARCHITECTURE.md, DATABASE.md, STYLE.md y ERRORS.md.
  Resultado: guías coherentes con src; otras referencias se ajustan solo si están afectadas y las specs históricas quedan intactas. Criterios: 1 y 5.
- [x] T12. Preparar una copia temporal de la app con SQLite desechable en una ruta Windows con espacios.
  Resultado: entorno de comprobación aislado que reutiliza las instalaciones existentes sin acceder a la base personal. Criterios: 3 y 4.
- [x] T13. Verificar funciones existentes, validaciones y errores sobre la copia temporal.
  Resultado: crear, consultar por ID/correo/nombre, listar, actualizar, borrar y clasificar con Ollama real conservan sus contratos. Criterio: 2.
- [x] T14. Ejecutar los nueve clientes PowerShell desde first-app en la copia temporal.
  Resultado: imports y salidas comprobados con datos desechables y sin modificar la base personal. Criterios: 3 y 4.
- [x] T15. Ejecutar los nueve notebooks con el kernel existente sobre la copia temporal.
  Resultado: documentos funcionales desde su nueva ubicación, con fallos o límites de ejecución registrados explícitamente. Criterios: 3 y 4.
- [x] T16. Ejecutar pnpm format y pnpm lint desde first-app y revisar sus cambios.
  Resultado: comandos y salidas registrados, sin cambios de contenido ajenos a la reorganización. Criterio: 5.
- [x] T17. Revisar hashes, ignore, índice y diff final antes de dar la implementación por terminada.
  Resultado: SQLite y auxiliares fuera de Git; datos personales, ChromaDB, automatización y specs históricas conservados, sin dependencias ni Socket nuevos. Criterios: 1, 4 y 5.
- [x] T18. Registrar comandos ejecutados, resultados y comprobaciones pendientes junto a los documentos de esta entrega.
  Resultado: evidencia de la reorganización sin atribuirle pruebas históricas ni repetir suites de Git cuyo código no cambió. Criterios: 2, 3, 4 y 5.

## Cierre local

Implementación y verificaciones completadas en la rama indicada. La reanudación conserva `b62abae3` e incorpora origin/staging (`64e3edf5`) mediante el commit de integración autorizado `db267b51`, sin conflictos. Los 13 archivos operativos de #600 quedan incorporados y los tres documentos activos de #601 se conservan como cambios locales; las specs históricas solo reciben los cambios de upstream, sin reescrituras manuales. La verificación posterior pasó: 41 comprobaciones funcionales, nueve clientes, nueve notebooks, formato y lint; resultados y límites en verification.md. Está autorizada la publicación del commit selectivo documental y la creación de PR draft contra staging; su ejecución y comprobación siguen pendientes en este punto. No se autorizan revisores ni merge.
