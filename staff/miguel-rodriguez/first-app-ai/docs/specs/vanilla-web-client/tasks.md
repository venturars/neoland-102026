# Tareas · Cliente web conectado

Issue: #760 · PR: #762, hacia staging.
Referencias: [spec](spec.md) y [plan](plan.md).
Miguel autorizó implementar, guardar, publicar y solicitar revisión a Jimena y
Meghan el 2026-11-03. Estas tareas concretan ese encargo; no se atribuyen
aprobaciones individuales adicionales.

- [x] T01 · Incorporar staging en la rama existente, preservando #822 y la spec.
- [x] T02 · Mantener solo el servicio de consultas y el preflight de /execute;
  abrir el HTML con pnpm web, módulos locales y perfil temporal separado.
  Verificar archivo real, consultas compartidas y limpieza del perfil.
- [x] T03 · Conectar selección, lista y edición a la lógica compartida. Mostrar
  errores junto a los campos y conservar entradas al fallar. Evitar envíos dobles.
- [x] T04 · Confirmar borrado por email guardado; comprobar vacío, error,
  cancelación y éxito. Separar el borrado correcto de una recarga fallida.
- [x] T05 · Ejecutar las pruebas Node en serie. Recorrer la app en navegador:
  validaciones, navegación, teclado, móvil, lista vacía, fallo del servicio y
  contacto eliminado desde otro cliente. Comprobar datos compartidos, persistencia,
  lecturas sin cambios y conservación de otros contactos, con datos ficticios.
- [x] T06 · Actualizar guías. Formato y lint correctos, diff revisado,
  dependencias intactas, evidencia registrada y temporales retirados.

La entrega Git autorizada se registra en la PR: commits pequeños, push,
descripción actualizada y revisión solicitada a jiji-mena y meghanmartin995.

La evidencia de ejemplos con localStorage pertenece a la revisión anterior de
#762 y no acredita esta versión conectada. La nueva verificación se registra aquí.


## Evidencia histórica · 2026-11-03

La entrega HTTP descrita aquí fue corregida por el feedback del 4 de noviembre.
Sus pruebas de archivos servidos no acreditan la apertura actual como archivo.

Node 24.22.1. Verificación en copias desechables sin la base de trabajo.

- Formato y lint: salida 0. En la copia con node_modules enlazado se utilizó
  `pnpm --config.verifyDepsBeforeRun=false format` y después `lint` para evitar
  una instalación automática. HTML, CSS y la nueva prueba también formateados
  con el Prettier existente.
- `node --test --test-concurrency=1 tests/serve-data-through-node.test.js tests/web-client.test.js`:
  2 pruebas, 2 pasan. Incluyen los contratos previos, tipos de los módulos,
  redirección, archivos no expuestos, fallo de lectura y tabla sin inicializar.
- Recorrido real Chromium/Playwright: selección por ID, menú, Notas deshabilitado,
  navegación por teclado, edición normalizada, recarga y cancelación pasan.
  Nombre vacío, email inválido/duplicado y longitud superior a 64 muestran el
  error junto al campo, conservan lo escrito y enfocan el campo correcto.
  El correo sin punto en el dominio mantiene la aceptación de la lógica común.
- Borrado: confirmación vacía, distinta, cancelada y correcta con mayúsculas y
  espacios pasan. Se compara el email guardado, no una edición sin guardar.
  Se distinguió el borrado correcto de una recarga fallida y se recuperó la lista.
- Peticiones simultáneas de guardar produjeron una única escritura. Una caída
  simulada al guardar conserva campos y rehabilita controles. Un usuario borrado
  desde otro cliente se comunica como inexistente y permite recargar.
- Terminal leyó la edición web y creó otro contacto mediante el ejemplo real.
  El adaptador Jupyter actualizó y listó los mismos datos; la web vio el cambio.
  El otro contacto se conservó al borrar. Un reinicio real del servidor conservó
  la edición web y la lista vacía persistió tras borrar y recargar.
- Con el servidor realmente detenido, la app mostró el error y permitió reintentar,
  sin ejemplos de reemplazo. Móvil 390×844 sin desbordamiento horizontal.
  No hubo errores JavaScript no capturados en el recorrido principal. Las pruebas
  de fallo producen los errores de red esperados en la consola del navegador.
- La prueba entre clientes inicialmente asumió un email e ID distintos de los
  que usa el ejemplo real; se corrigió el guion y la repetición pasó. Se añadió
  un favicon vacío embebido para evitar una petición de icono inexistente.
- Dependencias, lockfile, SQL, lógica de negocio, clasificador y clientes
  Terminal/Jupyter coinciden con staging. Solo cambia su presentación web y la
  entrega de archivos desde el servicio. La descripción de DATABASE también
  se ajustó porque el servicio ahora sirve la web.

Verificación final repetida en la rama de entrega: formato, lint y ambas pruebas
correctos. Integración local de staging resuelta; la comparación de la entrega
se limita a first-app-ai. Servidores propios detenidos y copia desechable retirada.


## Corrección · 2026-11-04

- Retirados WEB_FILES, redirección y entrega de archivos del servidor. Se conserva
  POST /execute y OPTIONS para el preflight que necesita el navegador.
- Añadidos scripts/web.js y pnpm web: archivo HTML con módulos locales, perfil
  temporal exclusivo y cierre/limpieza al salir. No se añadieron paquetes.
- Prueba real de pnpm web en una copia cuyo nombre incluye espacios. Se utilizó
  Chrome de macOS con un wrapper externo solo de prueba para añadir modo headless
  y depuración local; esas opciones no forman parte del lanzador entregado.
  El lanzador suministró la URL file://, el permiso local y el perfil temporal.
- Verificados módulos desde disco, listado, email inválido/duplicado, normalización,
  edición y persistencia al recargar; confirmación vacía, incorrecta, cancelada y
  correcta del borrado. El otro contacto se conservó. Cero excepciones JavaScript.
  Todas las peticiones HTTP observadas fueron a /execute.
- Ctrl+C terminó el navegador dedicado con salida 0 y eliminó su perfil temporal.
  CHROME_BIN inexistente produjo salida 1 con un mensaje claro.
- La revisión corrigió el reconocimiento de URL en el lanzador importándolo de
  node:url. La repetición de formato, lint y pruebas se registra tras completarla.

Solo se acredita la ejecución del navegador en macOS; las rutas de búsqueda de
Windows/Linux están previstas en el script, sin atribuirles una prueba real.

Repetición final en copia: formato y lint con salida 0; las dos pruebas Node en
serie pasan. El recorrido file:// y la limpieza del perfil pasan. Se mantienen
intactos la lógica, queries, main.js, los datos de trabajo y las dependencias.
Los procesos propios se detuvieron y las copias de prueba se retiraron.
