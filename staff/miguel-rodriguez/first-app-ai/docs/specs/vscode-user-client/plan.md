# Plan: cliente de usuarios en VS Code

Issue: #904 · PR: #906. Parte de la [spec aprobada](spec.md). Pendiente de revisión y aprobación de Miguel.

## Enfoque

Crear una extensión de escritorio independiente en `src/clients/vscode/`, sin reutilizar la interfaz web. Su manifiesto `package.json` declara un comando para abrir un panel webview. El punto de entrada de la extensión registra el comando y gestiona el panel. La interfaz del panel muestra lista, búsqueda, formularios y confirmación; usa HTML, CSS y JavaScript propios.

La webview envía mensajes a la extensión. El punto de entrada acepta únicamente las acciones previstas, llama a las operaciones existentes en `src/logic/` y devuelve resultados o errores al panel. No ejecuta SQL ni duplica reglas de negocio. Las consultas existentes acceden al servicio local y a los mismos datos de los demás clientes. La API de webview y su comunicación están descritas en la [documentación oficial](https://code.visualstudio.com/api/extension-guides/webview); el manifiesto se define en la [referencia de extensiones](https://code.visualstudio.com/api/references/extension-manifest).

Se propone un punto de entrada CommonJS que use la API `vscode` suministrada por el editor e importe dinámicamente los módulos ES existentes. Antes de dar por viable la implementación hay que probar en el Extension Development Host que la activación, los imports y las rutas funcionan en esta estructura. No se promete compatibilidad con VS Code web ni entornos remotos en esta tarea.

## Operaciones y comportamiento

- `listUsers()` carga la lista y permite volver a ella; `createUser({ name, email })` crea un contacto.
- `findUserByName(name)`, `findUserByEmail(email)` y `findUserById(id)` realizan las búsquedas existentes. El panel convierte un ID entero seguro a número y rechaza una entrada inválida antes de llamar a la operación. Para nombre muestra todas las coincidencias; para email o ID presenta «User not found» como ausencia de resultados, sin confundirla con un fallo de consulta.
- `updateUser(id, { name, email })` guarda los cambios; `deleteUser(id)` elimina después de confirmar el email guardado. La comprobación del email es una precaución del cliente. Cancelar no llama a la operación.
- Mostrar los errores existentes y conservar los campos al fallar. Esperar cada operación antes de indicar éxito. Si una modificación se guarda pero falla la actualización de la lista, indicar ambos hechos y permitir recargar sin repetir la modificación.
- Mantener el estado de los formularios mientras el panel siga abierto, incluidos los cambios de pestaña, y limpiar recursos al cerrarlo. Usar controles accesibles con etiquetas, foco y teclado. Renderizar los datos como texto, limitar recursos locales y aplicar una política de contenido adecuada a la webview.

## Archivos y dependencias

- Añadir el manifiesto, punto de entrada y recursos de interfaz bajo `src/clients/vscode/`; concretar sus nombres durante las tareas.
- Añadir pruebas del adaptador y de los flujos relevantes, y documentar apertura, servicio y preparación de tabla en `README.md`. Actualizar `docs/ARCHITECTURE.md` y `docs/TREE.md` con los archivos y responsabilidades finales. Ajustar el alcance de formato o lint si es necesario para incluir los nuevos archivos.
- Mantener las operaciones, consultas, esquema y servicio existentes. La tabla se prepara explícitamente y `pnpm server` se ejecuta por separado, como en los clientes actuales.
- No se propone instalar paquetes Node: la API `vscode` la proporciona el editor y el cliente usa JavaScript. Si se identifica una dependencia necesaria, revisar sus versiones y capas con Socket según `AGENTS.md` y presentar los resultados a Miguel antes de aprobar el plan o instalarla.

## Verificación prevista

En una copia desechable, iniciar el servicio y preparar la tabla, abrir la extensión mediante el Extension Development Host de VS Code y probar la activación real y los imports. Crear, listar, buscar por los tres criterios, editar y borrar; comprobar datos compartidos y persistencia desde otro cliente. Probar nombre con distinta capitalización, ID inválido, sin resultados, email inválido o duplicado, cancelación y confirmación incorrecta, contacto eliminado por otro cliente, servicio detenido y fallo al recargar tras guardar. Comprobar teclado y conservación del formulario al ocultar y mostrar el panel. Ejecutar las pruebas pertinentes existentes y nuevas, `pnpm format`, `pnpm lint` y `git diff --check`; no usar la base de trabajo para pruebas.

## Punto a contrastar

El README y las guías de arquitectura/base describen de forma distinta cómo se abre el cliente web. No determina el diseño de esta extensión; verificar el comportamiento real antes de escribir instrucciones y resolver cualquier conflicto que afecte a este trabajo. El plan no afirma que el punto de entrada ni la ejecución F5 se hayan probado todavía.
