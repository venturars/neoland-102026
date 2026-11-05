# Tareas — Nest

Issue #1044 · PR #1050. Referencias: spec.md y plan.md.
Miguel autorizó revisión conjunta y ejecución el 2026-11-05.

- [x] N01 · Contrastar alcance y responsabilidades con la referencia y revisar los tres documentos.
- [x] N02 · Resolver versiones y revisar tres capas con Socket; registrar hallazgos y decisión delegada.
- [x] N03 · Instalar las versiones exactas y comparar el lockfile con la resolución revisada.
- [x] N04 · Crear servicio, controlador, módulo, filtro y arranque usando decoradores e inyección real.
- [x] N05 · Configurar Babel, comando y lint; documentar excepción local y actualizar guías y árbol.
- [x] N06 · Ejecutar CRUD, errores, campos omitidos e inyección sobre copia y base desechables.
- [x] N07 · Revisar diff, ejecutar formato/lint, publicar solo esta tarea en #1050 hacia staging.

## Revisión antes del código

Spec, plan y tareas contrastados entre sí: cinco operaciones, nueve errores,
fallback por acción, 404 vacío, servicio de datos compartido y dependencia
inyectada. La revisión Socket es parcial y no acredita ausencia de alertas.

Instalación sin scripts: los316 bloques de packages y snapshots son idénticos
a la resolución previa de Socket; ninguna versión nueva, distinta o ausente.

## Evidencia · 2026-11-05

Node24.22.1, pnpm12.15.0, macOSarm64. Formato y lint pasan; Babel compila
29 archivos. Las dos pruebas de tests/nest-client.test.js pasan: CRUD sobre
base desechable, estados y campos exactos, orden, ambas actualizaciones parciales,
rechazos sin cambios, otro contacto conservado, 404 vacío, datos inaccesibles
en las cinco acciones y proveedor sustituido en un módulo real de Nest.
El controlador recibe esa instancia desde el contenedor, sin construirla.
Errores desconocidos, incluido Error('toString'), no filtran detalles internos.

Las cinco regresiones existentes también pasan en serie en una copia con
puertos24000–24001: datos, web y VS Code. Una primera ejecución paralela
chocó entre fixtures por compartir puerto; se repitió en serie, como requieren
las pruebas del proyecto, sin modificar sus puertos en el código de entrega.

Se ejecutó HTTP real automatizado; no se ejecutó la interfaz Postman. El README
contiene las cinco peticiones para repetirlas allí. Las pruebas crean y eliminan
sus datos; no usan la base ni los procesos de demostración del alumno.
La revisión Socket mantiene 52 comprobaciones incompletas y los hallazgos
aceptados técnicamente por delegación; no se afirma una revisión limpia.

Publicación verificada en ff5b17a4, sin force push. PR #1050 hacia staging,
issue #1044 abierta y enlazada. Se conserva en draft hasta integrar #1025 y
ajustar la configuración compartida antes de solicitar las primeras revisiones.
Una comparación local merge-tree detectó solapamientos en README, arquitectura,
ESLint, package y lockfile/workspace. No se cambió ninguna rama al comprobarlo.
