Issue: #1054

# Tareas — API REST de usuarios con NestJS

Estado: tareas 1 a 29 completadas para la issue #1054, con instalación e implementación autorizadas y comprobadas en Windows.
Spec y plan aprobados con PATCH 200 y usuario actualizado; Babel se conserva.
La persona usuaria acepta expresamente los cuatro hallazgos altos documentados y autoriza instalar las versiones aprobadas e implementar estas tareas.
La aceptación no se extiende a nuevos paquetes o versiones; campañas conserva su limitación de acceso no bloqueante.

1. Resolver con la persona responsable los pendientes Socket del plan.
   append-field y alertas por versión resueltos; decidir los hallazgos, con el 403 de campañas como limitación no bloqueante.
   Resultado: decisión explícita documentada, sin asumir aceptación por aprobar tareas.

2. Confirmar la autorización de instalación e implementación antes de continuar.
   Comprobar versiones fijadas y dependencias hasta tres capas contra el plan.
   Resultado: árbol autorizado; cualquier versión distinta vuelve a revisión Socket.

3. Actualizar package.json con las diez versiones exactas del plan.
   Mantener versiones existentes y excluir validadores, websockets, microservicios y @babel/node.
   Resultado: manifiesto limitado a los paquetes aprobados.

4. Instalar con corepack pnpm en first-app y revisar pnpm-lock.yaml.
   Comparar las versiones resueltas hasta tres capas con la revisión autorizada.
   Resultado: lockfile coherente; detenerse si aparecen versiones sin revisar.

5. Crear babel.config.json con preset-env, targets.node current y modules false.
   Configurar plugin-proposal-decorators en modo legacy.
   Resultado: configuración Babel idéntica a la solución aprobada.

6. Añadir el script nest: limpiar dist local con node:fs rmSync, compilar src con Babel y arrancar dist/clients/nest/main.js.
   Limitar la limpieza al directorio dist de first-app y usar comandos compatibles con Windows.
   Resultado: comando corepack pnpm nest definido, conservando los demás scripts.

7. Añadir src/clients/nest/**/*.js al script format.
   Resultado: el formateo incluye el cliente nuevo y conserva sus rutas actuales.

8. Configurar @babel/eslint-parser solo para src/clients/nest/**/*.js con babel.config.json.
   Excluir dist de ESLint y mantener las reglas recomendadas.
   Resultado: ESLint admite los decoradores del cliente.

9. Crear .gitignore local de first-app con dist/ ignorado.
   Resultado: la compilación no añade artefactos de salida a Git.

10. Crear src/clients/nest/users-service.js con @Injectable.
    Delegar crear, listar, consultar, modificar y borrar en las cinco funciones existentes de logic, sin reglas nuevas.
    Resultado: servicio con createUser({ name, email }) y updateUser(id, changes) conservados.

11. Crear src/clients/nest/users-controller.js con @Controller, @Dependencies y @Bind.
    Exponer POST /users, GET /users, GET /users/:id, PATCH /users/:id y DELETE /users/:id.
    Resultado: rutas conectadas al servicio; PATCH incluye solo campos presentes y el id sigue siendo texto.

12. Fijar las respuestas de éxito del controlador.
    POST devuelve 201 y usuario; ambos GET devuelven 200; PATCH devuelve 200 con el usuario actualizado.
    Resultado: DELETE devuelve 204 sin cuerpo y los demás cuerpos coinciden con la spec.

13. Crear src/clients/nest/http-exception-filter.js con @Catch.
    Mapear mensajes del catálogo a 400, 409, 404 o 500; fallos inesperados usan el Could not de su operación.
    Resultado: errores JSON con message y rutas desconocidas con 404 sin cuerpo.

14. Crear src/clients/nest/app-module.js con @Module.
    Registrar controlador, servicio y filtro global.
    Resultado: módulo sin imports directos de logic.

15. Crear src/clients/nest/main.js importando primero reflect-metadata.
    Arrancar AppModule mediante NestFactory en http://127.0.0.1:3003 y mostrar esa dirección.
    Resultado: entrada compilada conectada al servidor SQL original en 3000 mediante logic y queries.

16. Actualizar docs/TREE.md y docs/ARCHITECTURE.md.
    Reflejar archivos, compilación Babel y flujo cliente → logic → queries → servidor SQL.
    Resultado: documentación de Nest en 3003 y convivencia con Express en 3001.

17. Actualizar docs/STYLE.md y docs/ERRORS.md con la excepción aprobada.
    Limitar clases, métodos, this y decoradores al cliente Nest y mantener nombres kebab-case.
    Resultado: filtro de transporte permitido sin nuevas clases de error de negocio.

18. Añadir a README.md comandos PowerShell de arranque y prueba del plan.
    Explicar servidor SQL, Express y Nest en terminales separadas usando corepack pnpm.
    Resultado: instrucciones reproducibles sin configuración global nueva.

19. Ejecutar corepack pnpm format y corepack pnpm lint.
    Revisar que no cambien logic, queries ni clientes existentes por efecto del formato.
    Resultado: formato y lint correctos, con cambios limitados al alcance.

20. Preparar una copia desechable en Windows con datos ficticios según docs/DATABASE.md.
    Crear allí la tabla con el cliente existente, comprobar puertos libres y arrancar SQL, Express y Nest.
    Resultado: servicios propios operativos sin tocar la base personal ni procesos ajenos.

21. Probar POST y los dos GET de Nest con un email único.
    Verificar 201 al crear, 200 al listar y consultar, e id, name, email, createdAt y updatedAt.
    Resultado: usuario creado visible en colección y consulta individual.

22. Probar PATCH parcial sobre ese usuario.
    Verificar 200 con el usuario actualizado y conservación de id y del campo omitido.
    Resultado: modificación visible también por Express.

23. Modificar un usuario de prueba mediante Express y consultarlo desde Nest.
    Resultado: ambos clientes comparten datos mediante la lógica y el servidor SQL existentes.

24. Probar nombre vacío, email inválido y email duplicado.
    Verificar 400 Name is empty, 400 Email is invalid y 409 Email is already used.
    Resultado: errores del catálogo sin altas adicionales.

25. Probar GET, PATCH y DELETE de un id inexistente y una ruta desconocida.
    Resultado: las tres operaciones devuelven 404 User not found; la ruta desconocida, 404 sin cuerpo.

26. Borrar el usuario de prueba mediante Nest.
    Verificar 204 sin cuerpo y ausencia posterior; comprobar lista vacía si no quedan usuarios ficticios.
    Resultado: borrado confirmado sin eliminar datos ajenos a la prueba.

27. Detener solo el servidor SQL de prueba y llamar a las cinco operaciones con entradas válidas.
    Resultado: cinco respuestas 500 con el Could not correspondiente a cada operación.

28. Reiniciar SQL de prueba y enviar POST sin nombre.
    Resultado: 500 Could not create the user, sin validación ni mensaje nuevo.

29. Registrar estados y cuerpos observados y eliminar solo usuarios ficticios propios restantes.
    Detener los servicios propios de prueba y revisar Git para excluir dist, dependencias y datos.
    Resultado: evidencia comprobable y entorno personal conservado.

## Evidencia de la tarea 1 — 5 de noviembre de 2026

Investigación completada; los cuatro hallazgos altos fueron aceptados
expresamente y la instalación e implementación fueron autorizadas.
El árbol, Babel, las versiones y las aprobaciones documentales se conservan.

PURL autenticado: HTTP 200, 210 de 210 identidades comprobadas por
inputPurl, nombre y versión; cero ausentes, errores, pendingScan, notFound
o respuestas incompletas. Hay 225 hallazgos en 94 versiones; 116 sin
hallazgos en esa consulta. El detalle agrupado está en el bloque Socket del plan.

append-field@1.0.0 resuelto por PURL: licencia 100, mantenimiento 75,
calidad 80, cadena de suministro 100 y vulnerabilidad 100; unmaintained
low/ignore. depscore sigue devolviendo 2.0.0 y no se toma como evidencia
para 1.0.0. Ninguna puntuación del árbol es inferior a 50; mínimo 50.

La consulta de campañas conserva el 403 threat_feed_not_entitled como
limitación de acceso, sin acreditar presencia ni ausencia; por instrucción
expresa de la persona usuaria ya no bloquea. append-field y la cobertura
versionada están resueltos. La persona usuaria acepta los cuatro hallazgos
altos documentados y autoriza instalación e implementación de las versiones
aprobadas. Los demás hallazgos se conservan en el plan como información.

Reconsulta de las cuatro versiones altas: HTTP 200, identidades exactas.
tslib@2.9.1: unstableOwnership/high/monitor, author microsoft1es, sin fix.
Los otros tres tienen socketUpgradeAvailable/high/ignore y proponen
paquetes @socketregistry; el detalle y fix literal están en el plan.
El workflow exige presentar alertas y decisión humana, no cambiar versiones.
No se ejecutó npx socket optimize ni se incorporaron sustituciones de
@socketregistry. Se conservan Babel y las versiones aprobadas.
La política ignore no constituye aceptación; la aceptación de los cuatro
altos procede de la autorización expresa registrada arriba. La ejecución
de las tareas de instalación e implementación se completó con esa autorización.

Commit, push, cambios de estado de la PR y merge requieren autorización aparte.

## Ejecución autorizada — 5 de noviembre de 2026

La persona usuaria acepta los cuatro hallazgos altos y autoriza instalar
las versiones aprobadas e implementar el alcance descrito, conservando Babel.
Las tareas 1 a 29 están realizadas. Las comprobaciones HTTP y la revisión
documental se completaron en Windows con Node 24.22.0 y pnpm 12.14.0.

Las diez dependencias directas coinciden exactamente con el plan. El
lockfile se cotejó por nombre y versión hasta tres capas: 210 de 210
coincidencias, sin faltantes ni versiones adicionales (10/99/67/34).
Se corrigieron tres resoluciones previas del lock a las ya aprobadas:
@types/estree@1.0.10, electron-to-chromium@1.5.477 y regexpu-core@6.5.4.
regjsparser@0.14.0 corresponde a la cuarta capa, fuera del límite de revisión.

pnpm 12.14.0 aplica una antigüedad mínima predeterminada de 24 horas.
electron-to-chromium@1.5.477 se publicó el 4 de noviembre a las 23:02 UTC;
regexpu-core@6.5.4, el 5 de noviembre a las 03:16 UTC. Son las versiones
exactas cuya instalación se autorizó. Se excluyeron únicamente esas dos
identidades en la invocación con minimumReleaseAgeExclude repetido;
no se desactivó el límite general ni se modificó configuración persistente.
La validación --frozen-lockfile --lockfile-only --ignore-scripts pasó las
políticas de las 367 entradas. La instalación --frozen-lockfile terminó
con código 0 y las diez dependencias directas previstas.

corepack pnpm format terminó con código 0; lógica, consultas, servidor SQL
y Express mantienen su contenido previo. ESLint terminó con código 0.
Se formatearon también las configuraciones Babel/ESLint y package.json.
La comprobación lint posterior al formato de configuración pasó de nuevo.
verifyDepsBeforeRun=false se usó solo en invocaciones de herramientas tras
la instalación congelada, evitando la reverificación automática sin permisos
del almacén; no se guardó esa opción ni se cambiaron dependencias.

### Operaciones HTTP y conservación del entorno

La ejecución completa final pasó 32 peticiones y 68 comprobaciones sobre una
copia desechable bajo .tmp, con SQLite ficticio separado y las dependencias
instaladas mediante una unión local. No se copió ni abrió la base personal.
Se ejecutó el script nest mediante corepack pnpm con verifyDepsBeforeRun=false
solo para esa invocación; Babel compiló src y Nest escuchó en 127.0.0.1:3003.
SQL escuchó en 3000 y Express en 3001 simultáneamente.

Se comprobaron POST 201 y campos id/name/email/createdAt/updatedAt, ambos
GET 200, normalización ya existente y PATCH 200 con el usuario actualizado,
conservando id y campos omitidos. Express leyó cambios hechos por Nest y
Nest leyó cambios hechos por Express. DELETE devolvió 204 sin cuerpo,
el usuario dejó de existir y la colección de prueba quedó vacía.

Nombre vacío y email inválido dieron 400 tanto al crear como al modificar;
email duplicado dio 409 en ambas operaciones. GET/PATCH/DELETE de un id
inexistente dieron 404 User not found, y una ruta desconocida, 404 vacío.
La revisión final corrigió el filtro para que una ruta desconocida también
devuelva 404 vacío si recibe JSON inválido. Ese caso se añadió a la suite
y se repitieron la suite completa, formato y lint, todos con resultado correcto.
Con el proceso SQL de prueba detenido, las cinco operaciones dieron 500
y su mensaje Could not correspondiente. Tras reiniciarlo, POST sin nombre
dio 500 Could not create the user y la colección siguió vacía.

Las primeras ejecuciones detectaron fallos en la espera del cierre del
proceso SQL del comprobador: se corrigió esa espera y se repitió la suite
completa, que pasó. El código de la API no necesitó cambios por esos fallos.
Se detuvieron los procesos propios de SQL, Express y Nest; los tres puertos
quedaron libres. Lógica, consultas, servidor SQL y Express permanecen sin
cambios. Los comandos de arranque y prueba están en README.md.
El commit local está autorizado; push, cambios de estado de la PR y merge siguen pendientes.

