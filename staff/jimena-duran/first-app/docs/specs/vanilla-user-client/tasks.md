Issue: #757

# Tareas del cliente vanilla de usuarios

Spec, plan y T01–T18 aprobados. Implementación y comprobaciones realizadas; pendiente de revisión humana. Evidencia en [verification.md](verification.md). Commit selectivo, push y PR draft contra staging autorizados en la rama existente; sin revisores ni merge.
Rama: `757-feat-vanilla-user-client`. Rutas relativas a first-app. Los criterios citados corresponden a la numeración de la spec.

- [x] T01. Capturar estado y hashes de lógica, consultas, conexión, clientes existentes, dependencias, specs anteriores y datos locales.
      Resultado: referencia para comprobar su conservación durante la implementación. (Criterio 7)
- [x] T02. Preparar `tests/vanilla-user-client.test.js` con una copia temporal que excluya SQLite real y sus auxiliares, esquema existente y usuarios ficticios.
      Resultado: fixtures aisladas, sin importar la lógica del checkout real; cerrar la conexión de preparación antes de arrancar la copia. (Criterios 1, 4–7)
- [x] T03. Crear `src/clients/http/create-user-client-server.js` con `createUserClientServer()` y las cuatro rutas de la API y archivos estáticos del plan.
      Resultado: transporte con forma y tipos comprobados, respuestas y errores previstos, llamando a la lógica existente sin SQL, conexiones o reglas de negocio nuevas. (Criterios 1–6)
- [x] T04. Crear `src/clients/http/start-user-client.js`.
      Resultado: comprueba la existencia de la base antes de importar el servidor y arranca en `127.0.0.1:3000`, sin crear, mover ni migrar datos. (Criterio 7)
- [x] T05. Crear `src/clients/web/index.html` con lista, menú y formulario de edición, usando controles y etiquetas semánticos.
      Resultado: el menú contiene exactamente «Volver» y «Modificar usuario»; la edición ofrece guardar, eliminar y volver, con ID no editable y sin contraseña. (Criterios 1–3, 5)
- [x] T06. Crear `src/clients/web/styles.css` para las tres vistas y sus mensajes.
      Resultado: contenido legible, foco visible y estados de vista distinguibles, sin bibliotecas o estilos externos. (Criterios 1–3, 6)
- [x] T07. Crear `src/clients/web/app.js` con selección en memoria, navegación, lectura y edición, confirmación de borrado y tratamiento de errores.
      Resultado: guardar vuelve al menú con datos devueltos; borrar confirmado actualiza la lista sin selección; cancelar o volver no guarda ni cambia de usuario. (Criterios 1–6)
- [x] T08. Añadir únicamente el comando `start:vanilla` a `package.json`.
      Resultado: ejecuta el arranque previsto; dependencias, versiones y comandos existentes intactos. (Criterio 7)
- [x] T09. Ajustar `eslint.config.js` solo para los globals necesarios de los nuevos clientes y pruebas.
      Resultado: lint compatible con sus entornos, sin desactivar ni relajar reglas existentes. (Criterio 7)
- [x] T10. Actualizar el comando de ejecución en `AGENTS.md`.
      Resultado: permite localizar el nuevo arranque conservando el SDD y las autorizaciones vigentes. (Criterio 7)
- [x] T11. Actualizar `docs/TREE.md`.
      Resultado: refleja exactamente los archivos incorporados al cliente y sus pruebas. (Criterio 7)
- [x] T12. Actualizar `docs/ARCHITECTURE.md`.
      Resultado: documenta navegador → cliente HTTP → lógica → consultas → conexión única, conservando las responsabilidades actuales. (Criterio 7)
- [x] T13. Crear `docs/VANILLA-CLIENT.md` con uso local desde PowerShell y requisito de conservar la base existente.
      Resultado: explica arranque y las tres pantallas, la selección sin autenticación y el menú de dos acciones, sin ampliar funciones. (Criterios 1–7)
- [x] T14. Ejecutar las pruebas de transporte con `node:test` sobre las fixtures de T02.
      Resultado: verificar lista vacía/ordenada, consulta por ID, actualización válida, validaciones y duplicados, ID ausente o inválido, petición mal formada, borrado y conservación de otros usuarios; cerrar servidores de ensayo. (Criterios 1, 4–7)
- [x] T15. Recorrer en navegador la copia desechable: selección, menú de dos acciones, volver, editar, guardar y confirmar/cancelar eliminación.
      Resultado: pantallas y mensajes cumplen la spec, sin controles adicionales, deshabilitados ni pantallas alternativas; cerrar únicamente los procesos propios. Registrar cualquier recorrido pendiente. (Criterios 1–6)
- [x] T16. Comprobar los cuatro clientes terminal existentes de las operaciones reutilizadas en una copia con datos desechables.
      Resultado: conservan resultados y errores; no se ejecutan ejemplos destructivos sobre la base personal ni pruebas ajenas al cambio. (Criterio 7)
- [x] T17. Ejecutar el formato y lint previstos y comprobar espacios del diff, incluidos archivos nuevos.
      Resultado: archivos afectados correctos, sin instalar paquetes ni introducir cambios fuera del alcance aprobado. (Criterio 7)
- [x] T18. Revisar el diff final y los hashes protegidos y registrar comandos, resultados y límites en `verification.md` junto a esta spec.
      Resultado: evidencia propia de lo ejecutado, datos y trabajos ajenos conservados y tareas marcadas solo al completarse; durante la implementación, sin commit, push ni PR. (Criterios 1–7)

Publicación de los 16 archivos autorizada mediante commit selectivo, push y PR draft contra staging. Pendiente revisión del código; sin revisores ni merge.


## Revisión correctiva autorizada

Revisión sobre el commit inicial `ba7b36490b3018c51353b6579383064df51aabff`, reutilizando la rama y la PR existentes. La autorización expresa permite corregir defectos dentro de estos criterios, comprobarlos con datos desechables y publicar selectivamente en draft sin nuevas pausas intermedias. No cambia el alcance ni el SDD general.

- [x] R01. Localizar rama y PR existentes y capturar el alcance protegido; sin duplicar recursos.
- [x] R02. Reproducir y corregir decodificación UTF-8 fragmentada y URL mal formada; cuatro casos afectados satisfactorios.
- [x] R03. Recorrer las tres pantallas en navegador sobre datos ficticios, incluido texto HTML literal y conservación de otro usuario.
- [x] R04. Revisar capas, arranque, rutas, diff y conservación; preparar publicación selectiva autorizada en draft.
