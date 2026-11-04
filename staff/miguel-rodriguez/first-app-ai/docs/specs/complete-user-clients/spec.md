# Completar clientes de usuarios

Issue #1024 · PR #1025.
Autorización: Miguel pidió el 2026-11-04 «termina todo, todo aprobado, hasta PR en
review de todo lo que falta». Esa autorización conjunta cubre esta entrega; no
se atribuyen revisiones individuales de estos documentos.

## Resultado

Usar los contactos guardados desde una ventana de escritorio independiente,
una extensión de Chrome y una API Nest. Cada cliente permite crear, listar,
consultar por ID, modificar nombre/email y eliminar. Comparte datos y reglas con
los clientes actuales: cinco campos por usuario, lista ordenada, campos omitidos
conservados, errores actuales y borrado sin usuario devuelto.

Los clientes visuales y las APIs ofrecen el resumen existente de categorías por
nombre: women, men y genderUndefined. Una tabla vacía devuelve tres ceros; con
contactos se necesita el modelo local existente. Un fallo muestra Could not
classify the users y nunca un conteo parcial. Son estimaciones por nombre, no
identidades verificadas. Consultar el resumen conserva registros y fechas.

VS Code conserva búsquedas, edición y confirmación de borrado; añade el resumen.
Terminal y Jupyter ya ofrecen el resumen. La web mantiene su flujo de selección,
edición y confirmación. La aplicación de escritorio tiene sus propias pantallas,
no encapsula la página web. Chrome usa una extensión de permisos locales.

## Correcciones autorizadas tras la revisión

Miguel pidió el 2026-11-04 completar los tres hallazgos de revisión de esta PR.
Electron y Chrome muestran también las fechas de creación y actualización del
contacto seleccionado. Una escritura confirmada conserva su resultado aunque
falle la recarga posterior: no vuelve a ofrecer crear el mismo contacto, no
conserva el email anterior tras editar y retira el editor después de borrar.
La pantalla informa del éxito y de la recarga pendiente por separado.

La web consulta el resumen por la misma operación de negocio que los otros
clientes; no depende de iniciar otro cliente HTTP para obtenerlo. Se conservan
modelo, instrucciones, agrupación, categorías y errores del resumen existente.
La compatibilidad del transporte con el navegador forma parte de esta corrección.

## Comprobación

En copias y bases desechables recorrer creación, consulta, edición parcial,
rechazos y borrado conservando un segundo contacto. Comprobar que los otros
clientes ven los mismos datos. Abrir el escritorio y la extensión reales;
ejecutar Nest por HTTP y comprobar VS Code en su host. Verificar resumen vacío,
resultado con modelo local, fallo del modelo y conservación de datos. Registrar
qué se ejecutó realmente y cualquier límite de la comprobación.

Se conserva el servicio de datos separado, las operaciones de negocio, la
clasificación existente y sus dependencias de modelo. No se añade autenticación,
notas, distribución de instaladores ni reglas nuevas de contactos.
