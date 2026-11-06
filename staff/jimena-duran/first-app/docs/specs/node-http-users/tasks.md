Issue: #1110

# Tareas del cliente Node HTTP

Rama: `1110-feat-node-http-users`. Base: `a727cbe8e8b3739549038205b7a2f8bc3e7f1365`.
Alcance aprobado en [spec.md](spec.md) y [plan.md](plan.md).
La persona aprobó estas nueve tareas y autorizó implementar y verificar,
incluyendo crear/reutilizar `.venv` e instalar Notebook 7.6.3 si hace falta.
La autorización no incluye commit ni push.

1. [x] Implementar `src/clients/node-http/app.js` con cinco operaciones en 3004.
       Resultado: delega en logic y conserva estados, mensajes y cuerpos aprobados.
2. [x] Crear los cinco notebooks en `src/clients/node-http/jupyter/`.
       Resultado: kernel python3, fetch vía Node, ID real y casos online/offline documentados.
3. [x] Crear `scripts/jupyter-node-http.sh` con el arranque definido en el plan.
       Resultado: reutiliza/crea `.venv`, fija Notebook 7.6.3 y abre la carpeta nueva.
4. [x] Añadir `node-http` y `jupyter-node-http` a package.json y ampliar format.
       Resultado: comandos previstos, sin cambiar scripts, dependencias Node ni lockfile actuales.
5. [x] Actualizar TREE.md, ARCHITECTURE.md y JUPYTER.md.
       Resultado: archivos, flujo y PowerShell/Git Bash documentados; JupyterLab y nueve notebooks conservados.
6. [x] Verificar el script con Windows y entorno ausente/existente en copias controladas.
       Resultado: selección Python, versión fijada/reutilizada, errores y UTF-8 coinciden con el plan.
7. [x] Verificar operaciones y notebooks secuencialmente en copia de datos ficticios.
       Resultado: contratos online, ID real, PATCH parcial y DELETE vacío; cinco errores SQL offline exactos.
8. [x] Comprobar el arranque real Notebook en Windows y la carpeta abierta.
       Resultado: `.venv` local y Notebook 7.6.3, sin reemplazar JupyterLab actual.
9. [x] Ejecutar formato y lint; revisar JSON, diff y conservación de datos/clientes/dependencias Node.
       Resultado: evidencia propia de comprobaciones y cierre únicamente de procesos del ensayo.

Los escenarios controlados no alterarán `.venv` personal. Registrar ejecución
real y revisión estática por separado. Ante discrepancias nuevas, anotarlas
en el plan y parar antes de ampliar el alcance. Commit y push requieren
autorización aparte.

## Evidencia de ejecución en Windows

Comprobaciones reales del 5 de noviembre de 2026, separadas de la revisión
documental previa. No se ejecutó una interfaz gráfica de Notebook.

- Launcher: diez escenarios controlados Windows pasados para selección de
  Python, creación/reutilización de entorno, versión fijada, errores y UTF-8.
  No se alteró un entorno personal para simular esos escenarios.
- Entorno real local: Python 3.13.9, Notebook 7.6.3, nbclient 0.11.0 y
  nbformat 5.11.1. Se instaló Notebook y sus dependencias transitivas dentro
  de `.venv`, que permanece ignorada por Git. No se instalaron paquetes Node.
- Arranque real mediante `pnpm jupyter-node-http`: la API de Notebook confirmó
  la raíz `src/clients/node-http/jupyter/`, sus cinco documentos y kernel
  `python3`. Git Bash se añadió al PATH únicamente del proceso. La opción
  `--config.verifyDepsBeforeRun=false` se aplicó únicamente a la invocación
  de pnpm para reutilizar dependencias existentes; no cambió configuración.
- HTTP: 47 comprobaciones online pasadas, incluyendo cinco operaciones,
  estados y mensajes de error, PATCH parcial/campos omitidos, conservación
  de otro usuario, DELETE sin cuerpo y un nombre Unicode dividido entre
  chunks de transporte. Con SQL detenido pasaron otras diez comprobaciones:
  estado 500 y mensaje exacto de cada una de las cinco operaciones.
- Notebooks: ejecución real con nbclient y kernel Python de `.venv`, en
  orden crear/listar/consultar/modificar/borrar. Los cinco resultados online
  fueron 201/200/200/200/204; se conservan sus salidas reales en los documentos.
  Después del borrado se confirmó `GET /users` con 200 y `[]`. Con SQL parado
  se ejecutaron de nuevo los cinco: todos mostraron 500 y su mensaje exacto.
  Las copias con salidas offline permanecen únicamente en el ensayo temporal.
- Datos: copia temporal de JavaScript sin SQLite personal, con SQL en 43100
  y API en 3004. La adaptación del origen SQL afectó solamente a esa copia.
  Carpeta de evidencia:
  `E:/Users/987866/AppData/Local/Temp/first-app-node-http-230a87cf59fa47b882e3652fe501ff4d`;
  resumen `verification-summary.json`, ensayos HTTP y cinco notebooks offline.
- Cierre: SQL 44312 y HTTP 41160 detenidos; puertos 43100 y 3004 sin listeners.
  Notebook respondió 200 al apagado; procesos 41500/42436 ausentes y puerto
  43110 libre. Solo se cerraron procesos propios del ensayo.
- `pnpm format` y `pnpm lint` terminaron con código 0 usando dependencias
  existentes. La verificación previa de pnpm fue bloqueada por el sandbox;
  los scripts de formato y lint sí se ejecutaron y pasaron. JSON de los cinco
  notebooks válido. No cambian dependencias Node ni lockfile, ni los nueve
  notebooks o el arranque documentado de JupyterLab existentes.

Resultado: nueve tareas completadas. Sin commit ni push.
