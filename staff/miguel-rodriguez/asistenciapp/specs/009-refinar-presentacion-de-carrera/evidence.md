# Evidencia 009 · 2026-10-26

Spec y plan aprobados por separado; tareas aprobadas bajo la autorización expresa de Miguel «revisa y si las ves bien apruebalas de una». Implementación en copia local 009. Publicación pendiente: #252/#284 siguen abiertas y no hay PR de 007/008 integrada que permita publicar un diff exclusivo de #332. No se ha ejecutado Git ni modificado bases de PR.

## Entorno y secuencia de verificación

Python 3.14.8, Flask 3.1.3, pytest 9.1.1 y qrcode 8.2 del entorno autorizado. Node 24.22.1 ya disponible, solo como herramienta de comprobación; no se modifican requisitos o archivos de versión. Sin nuevas instalaciones.

- Base de 009 antes de cambios de producto: **226 passed in 5.91s**. Dos invocaciones se hicieron por error desde la raíz del workspace (al iniciar y al completar documentación) y recogieron varias copias: fallaron en colección. Se corrigió el directorio, sin alterar pruebas para pasar.
- Calendario: tests preparados antes de su módulo, fallo real ERR_MODULE_NOT_FOUND. Después del módulo: **15/15 tests Node pasan**. Límites de 0 a 13000 ms y duraciones para uno/dos/tres/quince finalistas.
- Ensayo de navegador previo: **El kart avanza antes de la celebración**. Tras separar CSS/renderer/controlador, el mismo ensayo pasa sus cinco comprobaciones.
- Regresión después de integrar tema, pantallas, activos y controlador: **226 passed in 5.87s**, más los quince tests Node. Ejecución final tras completar documentación/enlaces: **226 passed in 5.41s**; quince tests Node pasan y los cuatro JS pasan node --check.

Comandos, desde la app:

```bash
python -m pytest -q -p no:cacheprovider
node --test tests/browser/test-race-finale.mjs
node --check static/race.js
node --check static/race-display.js
node --check static/race-renderer.js
node --check static/race-finale.js
```

Los ensayos en tests/browser se ejecutaron con Playwright contra un servidor propio en 127.0.0.1:8769 y base ficticia nueva. No se usaron clases ajenas, datos reales o un túnel para estos ensayos. La identidad de prueba es exclusiva de loopback; no está en la app como credencial de producción.

## Resultados de navegador

| Ensayo | Resultado |
| --- | --- |
| race-finale-review.js | 5 comprobaciones: confirmación inmediata, kart quieto tras primer registro, ganador/cuenta previos, única llegada y podio real de dos. |
| race-finale-fifteen.js | Quince clientes independientes, quince asistencias, quince filas visibles. En 1366 × 768: banner visible, scrollY=0 y final de pista y=671. Quince animaciones, primera 5800 ms y última 8000 ms. Podio visible y recarga directa sin animaciones. |
| race-finale-interruptions.js | 13 comprobaciones: cancelación de cierre, cierre vacío, un finalista, movimiento reducido activado durante anuncio, retiradas durante ganador/cuenta/llegada, resize con progreso conservado, retirada desde podio y 401 que oculta datos y cancela movimiento. |
| race-finale-resume.js | 5 comprobaciones: recargar durante ganador/cuenta/llegada muestra resultado directo; reanudar dentro de llegada conserva progreso; pasada la duración va al podio. La ocultación se simula mediante el evento/propiedad de visibilidad para ejercitar el controlador; no se atribuye una prueba de suspensión real del sistema operativo. |
| race-review.js, conservado de 007 | 17 comprobaciones de auth, título como texto, 503 mismo UUID/cuerpo, respuesta de éxito perdida, un intento conservado, 202 sin reenvío, 422, 410 y pérdida de acceso después de Go. |
| race-concurrency.js, conservado de 007 | 8 comprobaciones: Tab/Enter, startsAt tras recarga, dos ventanas, plaza agotada, presupuesto ajeno intacto, cierre manual, panel normal y zoom 200 % sin overflow horizontal. |
| race-queued-action.js, conservado de 007 | 3 comprobaciones: una acción espera la consulta, un POST y máximo una petición API simultánea. |

En los tres scripts de regresión solo se actualizó la dirección/credencial ficticia del servidor de prueba; no se eliminaron las comprobaciones. Se probaron además consulta 500 durante lobby, conservación de su estado sin inventar ganador y limpieza del error tras recuperar conexión. La revisión detectó que el aviso podía quedar obsoleto: se limpia solo el error de polling recuperado, no los errores de acciones del profesor.

Móvil: alumno a 400 px, ancho de documento 400; entrada enviada con Tab/Enter después de seleccionar nombre; pantalla propia legible. Profesor móvil sin overflow horizontal. Panel normal: clase creada, código visible, registro ficticio real y descarga CSV sin fallo. No se presenta la selección programática del nombre como prueba del menú nativo por flechas.

## Diseño y conservación

Se revisaron quince personajes grandes y en 54 × 36, también en grises. Carrocería simplificada, mismos slugs y al menos dos rasgos de personaje. Los quince SVG son XML válido sin scripts, eventos, image/foreignObject o referencias externas. No se añaden imágenes de terceros.

Conservación: 75 archivos protegidos de la base —Python, dependencias, configuración y specs anteriores— idénticos. Los 43 originales de Halloween mantienen sus hashes. [Detalle de conservación y contraste](evidence/preservation.json).

Contraste medido: texto 17.93:1, secundario 7.00:1, acción naranja con texto oscuro 6.28:1, error 7.82:1, foco 6.90:1. Estados y puestos también aparecen como texto.

Las capturas de referencia del panel/alumno/presentación de 007 se recapturaron de su copia conservada en otro servidor ficticio (8771) después del desarrollo: no se atribuyen a una captura previa inexistente. La captura inicial de la presentación durante el ensayo red se conservó temporalmente fuera del producto. Los accesos/QR están ocultos en las capturas de referencia y lobby.

## Cobertura de aceptación

| CA | Evidencia |
| --- | --- |
| 01 | Tema común, capturas de las vistas, contraste y revisión visual. |
| 02 | Fuera héroes/eslóganes y duplicados; etiquetas, errores, confirmaciones y teclado conservados. |
| 03 | Lobby/salida/registro/resultados en navegador; regresión de QR, código y accesos. |
| 04 | Quince activos revisados grandes/pequeños/grises; referencias y originales conservados. |
| 05 | Primer registro confirma resultado sin desplazar kart; recuperación y última respuesta sin esperar la celebración. |
| 06 | Límites Node y ensayo real winner → countdown → finish, sin reiniciar por polling. |
| 07 | Podios cero/uno/dos/tres/quince. El ensayo real adicional de tres finalistas muestra tres animaciones de 5800 a 8000 ms, escena visible y recarga directa. |
| 08 | Cancelar mantiene lobby/open; manual con un finalista y vacío directo. |
| 09 | Recarga en tres tramos, nueva lectura cerrada, visibilidad simulada y conexión recuperada. |
| 10 | Retiradas en los tres tramos y desde podio, animaciones canceladas y clasificación actualizada. |
| 11 | 400 px, zoom 200 %, foco/Tab/Enter, contraste y movimiento reducido inicial/durante celebración. |
| 12 | Las dos preferencias de Miguel añadidas a AGENTS.md, conservando etiquetas útiles y SDD. |
| 13 | 226 tests Python, tres ensayos originales conservados, registro/CSV normal, hashes protegidos y sin nuevas dependencias. |
| 14 | Quince filas dentro de 1366 × 768, pista hasta y=671, sin scroll manual y podio visible; capturas por tramo. |

## Capturas

- [Antes: panel](evidence/antes-panel.png), [profesor](evidence/antes-profesor.png), [alumno](evidence/antes-alumno.png).
- [Quince pilotos](evidence/pilotos.png).
- [Ganador](evidence/ganador-15.png), [cuenta](evidence/cuenta-15.png), [llegada](evidence/llegada-15.png), [podio](evidence/podio-15.png).
- [Alumno móvil](evidence/alumno-movil.png), [lobby móvil con QR oculto](evidence/lobby-movil.png).

## Demostración y pendientes

La prueba por Miguel de esta versión 009 todavía no consta. No se confunde su prueba anterior de 007 con aprobación del nuevo diseño. La demo de 009 usa tres participantes simulados y lo indica en el título, para poder observar la celebración sin montar tres teléfonos. No hay función de simulación incorporada al producto.

Publicación e integración pendientes de base staging y proceso del repositorio. El código local se conserva. Al terminar los ensayos se detienen los servidores de review y referencia y se eliminan sus bases temporales; la demo solo se mantiene mientras Miguel la prueba y queda explícitamente registrada.


### Estado de la demo al entregar

Servidores de review (8769) y referencia (8771) detenidos, puertos libres y sus bases temporales eliminadas. Demo 009 abierta en navegador, puerto 8770, con base ficticia nueva y tres clientes simulados; espera a que Miguel pulse Empezar. Se mantiene encendida durante su prueba, según su petición de ver la aplicación. No hay túnel público. T41 queda pendiente de su respuesta y T42 de apagar/limpiar esta demo al terminar.
