Issue: #832

# Verificación del cliente del navegador

Trece tareas implementadas y comprobadas localmente el 2026-11-03. Entrega aprobada para publicación en la PR draft #834, sin revisores ni merge. Las pruebas funcionales utilizaron exclusivamente usuarios ficticios en una copia desechable, con un único servidor y SQLite compartidos por navegador y Jupyter. No se repitió la batería del servidor SQL intacto.

## Entorno y cómo abrir

Node v24.22.0 y npm están disponibles. Se utilizó Chrome 156.0.8078.80, instalado en `C:/Program Files/Google/Chrome/Application/chrome.exe`; también se detectó Edge en su ruta habitual de Program Files (x86). No se instalaron navegadores, paquetes ni dependencias ni se activó Corepack. pnpm no se encontró en PATH ni en las ubicaciones consultadas.

Desde first-app, mantener esta terminal abierta:

```powershell
node src/db/server.js
```

En otra terminal, desde la misma carpeta:

```powershell
npm.cmd run browser
```

El comando browser usa PowerShell, convierte la ruta absoluta de index.html en una URI file y abre Chrome con el perfil separado `%TEMP%/first-app-chrome` y `--allow-file-access-from-files`. La ejecución real de npm.cmd run browser abrió Chrome con ambos argumentos desde una copia desechable cuya ruta contiene espacios; la URI codificó esos espacios como %20. No sirve HTML ni utiliza el perfil habitual. El esquema se prepara únicamente con los clientes técnicos existentes si la tabla todavía no existe; no se inicializa automáticamente.

## Resultados

Las diecinueve comprobaciones funcionales reales pasaron mediante Chrome y su protocolo de depuración:

- Archivo abierto mediante file:// y listado inicial vacío.
- Listado con ID, nombre y correo; selección, menú, Notas desactivado e ID no modificable.
- Volver descarta entradas pendientes; guardar normaliza los valores, actualiza menú y campos y permanece en edición.
- Nombre Unicode y contenido con apariencia de HTML mostrados como texto.
- Nombre vacío, correo inválido y correo duplicado muestran sus mensajes de negocio y no escriben cambios; usuario eliminado por otra vía muestra User not found.
- Eliminación inmediata devuelve el listado sin selección y conserva otro usuario ficticio.
- Servidor detenido: listar, guardar y eliminar muestran los respectivos Could not ... sin presentar éxito.
- Jupyter real con NBClient ejecutó list-users y observó la escritura del navegador. Después ejecutó update-user y el navegador vio la escritura al refrescar el listado. Ambos usaron el mismo servidor y SQLite ficticios; no se atribuye actualización automática a salidas guardadas.
- La captura de peticiones HTTP solo contiene /execute; la página y sus módulos se cargan desde archivos locales.

## Sintaxis, formato y conservación

- `node --check src/clients/browser/app.js`: satisfactorio.
- Prettier: los tres archivos browser conformes, sin cambios necesarios.
- ESLint sobre app.js: código de salida 0.
- Arquitectura y árbol incluyen los tres archivos y el flujo de persistencia existente. No hay API CRUD adicional, funciones de negocio ni dependencias nuevas.
- Cincuenta archivos protegidos coinciden por hash, incluidos SQLite, doce plantillas y los archivos SQL, logic y clientes existentes comprobados. El código del servidor SQL y las capas existentes no tienen diferencias. El cotejo final tras las pruebas confirmó cincuenta coincidencias, sin diferencias. package.json cambia únicamente el comando browser y la carpeta browser contiene exactamente los tres archivos aprobados. Al cerrar las pruebas, el índice estaba vacío y HEAD no había cambiado.

## Evidencia y límites

Los artefactos de comprobación están fuera del producto, en `.tmp/pr832-browser-verification/`: `launcher-result.json`, `results.json`, `notebook-web.json`, `notebook-update.json`, `requests.json`, `browser.png`, `protected-result.json` y `attempts.json`. Los harnesses temporales son browser-check.mjs, verify-launcher.mjs y jupyter-browser-check.py; no se añaden archivos auxiliares a la aplicación.

Un primer intento restringido cerró Chrome antes de conectar con su protocolo de depuración; se cerraron solo los procesos propios y se repitió el ensayo con la ejecución autorizada. El primer intento de NBClient agotó 45 segundos al iniciar el kernel en Windows. Se ajustó solo el harness a la política Selector y 120 segundos, y las dos ejecuciones reales posteriores fueron satisfactorias. Los diecinueve casos produjeron resultados satisfactorios; la salida inicial del harness fue 1 por esperar otra vez el evento exit durante su limpieza después de SIGTERM. Se corrigió únicamente esa condición de limpieza del harness para comprobar signalCode antes de esperar; no se repitieron los casos funcionales ni la batería SQL. La comprobación final de limpieza terminó con código 0: puerto 3000 libre y sin procesos propios de Chrome, kernel o harness. No se presenta el incidente del ensayo como un fallo del cliente.

Se comprobó Chrome, no Edge. No se añadieron paquetes ni se modificaron las capas existentes. La evidencia no valida IA, otros navegadores ni comportamiento distinto de las trece tareas aprobadas.
