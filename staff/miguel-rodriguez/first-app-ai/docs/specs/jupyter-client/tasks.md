# Tareas · Cliente Jupyter

Fecha: 2026-10-26. [Spec](spec.md) · [Plan](plan.md) · Issue #370 · PR #371.

Autorización: Miguel pidió completar todo el trabajo pendiente y dejarlo para aprobación. Se preparan y revisan los documentos antes del código, sin inventar aprobaciones individuales.

- [x] **T01 · Capturar referencia.** Inventario y hashes de lógica, consultas, conexión y terminal; identificar herramientas existentes. CA-08–CA-09.
- [x] **T02 · Preparar ejecución local.** Script de arranque, requisitos de Notebook, script pnpm y dependencia de tablas exacta, lock generado. CA-02, CA-05.
- [x] **T03 · Conectar el cliente.** Adaptador JSON sin shell y ejecutor explícito de nueve acciones, con errores fieles y tablas. CA-04–CA-08.
- [x] **T04 · Escribir los nueve notebooks.** Secciones, ejemplos y valores editables propios, ID explícito, limpieza de salidas. CA-01, CA-03–CA-07.
- [x] **T05 · Documentar uso y regla acotada.** README y constitución coherentes con el cliente y sus dependencias; conservar contratos existentes. CA-02–CA-03, CA-08.
- [x] **T06 · Ejecutar operaciones y errores.** Kernel real, datos ficticios y copia desechable; nueve documentos, reinicio, vacíos y conservación. CA-01, CA-04–CA-09.
- [x] **T07 · Probar arranque y reutilización.** Servidor local y kernel del proyecto, parada y ausencia de procesos propios. CA-02, CA-09.
- [x] **T08 · Revisar entrega.** Hashes, diff, versiones, salidas vacías y resultados reales; commits pequeños únicamente del cliente. CA-01–CA-09.

## Evidencia

Verificación realizada el 2026-10-26 en una copia desechable sin base de trabajo. Entorno: Node **24.12.0**, pnpm **10.20.0**, Python **3.14.8**, Notebook **7.6.3**, nbformat **5.11.1** y nbclient **0.11.0**. No se instalaron herramientas globales ni se cambió el servicio del modelo.

- Instalación de presentación: `corepack pnpm@10.20.0 add --save-exact --save-dev cli-table3@0.6.5`, con caché de Corepack temporal. pnpm generó el lockfile; `openai@7.39.0` permanece igual.
- Arranque inicial real desde una copia sin `node_modules` ni `.venv`: `corepack pnpm@10.20.0 jupyter --no-browser --port=0`. Preparó ambas dependencias locales, registró el kernel **First app AI** y arrancó Notebook. HTTP `/tree`, `/api/contents` y `/api/kernelspecs`: 200; exactamente nueve notebooks, raíz correcta y ejecutable del kernel dentro de esa `.venv`.
- Ejecución mediante `nbclient.NotebookClient(..., kernel_name="first-app-ai", resources={"metadata": {"path": notebook_directory}}).execute()`. Se creó un kernel nuevo en cada ejecución, sin escribir sus salidas al archivo entregado. Se ejecutaron realmente las nueve operaciones; en los documentos con ID se sustituyó `None` por el ID leído tras crear el contacto ficticio, nunca por un 1 supuesto.
- **Once grupos de verificación pasan**: arranque; inicialización y vacíos; creación y errores; cuatro consultas y conservación; clasificación no vacía real; fallo de transporte controlado; actualización y borrado; ID pendiente; ocho errores sin tabla inicializada; app ausente; y limpieza de los nueve archivos.
- Casos concretos: dos contactos llamados Ada y uno Ada Lovelace; búsqueda `Ada` y ` Ada ` con los dos resultados en orden; `ada`, `Ad` y nombre ausente sin filas; nombre vacío; email normalizado, inválido, repetido y ausente; ID ausente; campos omitidos al actualizar y fechas de creación conservadas; borrado permanente y repetido. Las consultas conservan todas las filas y fechas.
- Tablas vacías conservan encabezados; se comprobó el color ANSI cian en la salida real del kernel. Las confirmaciones de preparación y borrado corresponden a operaciones que devuelven `undefined`. Los ocho errores de acceso con tabla no inicializada coinciden exactamente con sus mensajes `Could not…`, sin tabla de éxito.
- Modelo **real**: el Ollama que ya estaba activo disponía de `llama3.2`; se ejecutó el recuento con tres contactos ficticios y los tres enteros sumaron tres. Con tabla vacía devolvió tres ceros. Por separado, un fallo de transporte **simulado** mediante sustitución de `fetch` en el proceso de prueba produjo exactamente `Could not classify the users`, sin ceros ni tabla parcial; no se detuvo ni modificó Ollama.
- App ausente: retirar temporalmente `package.json` de la copia hizo que el notebook mostrara exactamente «No encuentro la app.» y no ejecutara otra copia.
- Reutilización real: tras parar el servidor por su API autenticada, el mismo comando volvió a arrancar Notebook sin instalar paquetes; las fechas de `.venv/pyvenv.cfg` y `node_modules/.modules.yaml` no cambiaron. Un kernel nuevo creó y devolvió correctamente el nombre ficticio `Lucía 🏎️`, verificando UTF-8 explícito. El acceso anónimo a `/api/contents` obtuvo 403.
- Se corrigió la herencia simultánea de `NO_COLOR` y `FORCE_COLOR`: el cliente elimina `NO_COLOR` solo de su proceso hijo. La salida ya no incluye ese aviso. Se fijó la codificación UTF-8 de stdin/stdout para evitar depender de la página de códigos del sistema.
- Comparación SHA-256: los **27 archivos** de lógica, consultas, conexión y cliente de terminal permanecen idénticos. `git diff --check` pasa. Los nueve `.ipynb` son válidos, con `execution_count: null` y `outputs: []`. Ninguna base, salida personal, entorno o caché se incluye en los commits.

El servidor de las dos ejecuciones de prueba se detuvo con `POST /api/shutdown` autenticado y ambos procesos de arranque terminaron. No se inició un túnel ni se modificó el servidor Jupyter ajeno que Miguel ya tuviera abierto. Windows se ha contemplado en rutas, selección de Python, ejecución sin shell y UTF-8; no se afirma una ejecución real en Windows.

Revisión final del código, plan, spec y nueve documentos realizada por otro agente: sin hallazgos pendientes.

## Corrección de revisión · 2026-10-26

El comentario de Meghan en #371 identifica que el arranque invoca ipykernel sin declararlo directamente. Los metadatos de PyPI muestran que Notebook 7.6.3 depende de JupyterLab 4.6.4, que a su vez exige ipykernel: no se reprodujo la afirmación de que una instalación limpia siempre carece del kernel. Aun así, el cliente debe declarar lo que utiliza y reparar entornos incompletos.

- Se añade `ipykernel==7.1.0`, compatible con el mínimo documentado Python 3.10; no se amplía el mínimo a Python 3.11 que requiere la versión 7.4.0 consultada. Notebook permanece en 7.6.3.
- El arranque comprueba la importación del kernel y las dos versiones antes de reutilizar `.venv`; reinstala los requisitos si falta el kernel, aunque Notebook ya esté instalado.
- Verificación real con Node 24.12.0, pnpm 10.20.0 y Python 3.14.8: `python3 /tmp/verify-371-kernel-fix.py`, en una copia desechable inicialmente sin `.venv` ni `node_modules`. Instalación, nueve documentos por HTTP autenticado y kernel dentro del entorno local correctos. Los notebooks de preparación y listado se ejecutaron cada uno en un kernel nuevo.
- Después de detener el servidor, se desinstaló únicamente ipykernel de esa copia temporal. El mismo comando de arranque lo reinstaló en 7.1.0 y volvió a mostrar los nueve documentos sin recrear el entorno. Ambos servidores propios se detuvieron y la copia temporal se eliminó.
- `node --check scripts/jupyter.js` y `git diff --check` pasan. La prueba inicial detectó una comparación literal entre `/var` y su alias `/private/var`; se corrigió la normalización del comprobador y las pruebas anteriores pasaron. No fue un fallo del lanzador.
- No se modifican lógica de contactos, consultas, notebooks, datos de trabajo ni cliente de terminal. La verificación original de las nueve operaciones permanece registrada arriba; esta corrección comprueba específicamente instalación y reparación.
