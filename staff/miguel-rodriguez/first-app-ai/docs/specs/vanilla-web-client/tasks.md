# Tareas · Cliente web conectado

Issue: #760 · PR: #762, hacia staging.
Referencias: [spec](spec.md) y [plan](plan.md).
Miguel autorizó implementar, guardar, publicar y solicitar revisión a Jimena y
Meghan el 2026-11-03. Estas tareas concretan ese encargo; no se atribuyen
aprobaciones individuales adicionales.

- [x] T01 · Incorporar staging en la rama existente, preservando #822 y la spec.
- [x] T02 · Servir HTML/CSS/módulos con lista explícita; mantener /execute y
  comprobar redirección, tipos, archivos excluidos e inicialización separada.
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


## Evidencia · 2026-11-03

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
