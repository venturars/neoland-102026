# Plan: selector aleatorio

Spec: [spec.md](spec.md). Issue: [#1174](https://github.com/venturars/neoland-102026/issues/1174).
Miguel autorizó preparar y revisar plan y tareas y continuar con la implementación
el 2026-11-09, sin las paradas de aprobación separadas para estos dos documentos.

## Implementación

1. Añadir `src/logic/pick-random-user.js`, con una operación asíncrona
   `pickRandomUser()` sin parámetros. Recupera los contactos mediante `listUsers()`.
   Traduce únicamente el fallo de recuperación a `Could not pick a user`.
   Devuelve `null` si la lista está vacía. Calcula una posición con
   `Math.floor(Math.random() * contacts.length)` en pasos explícitos y devuelve
   el contacto de esa posición. listUsers ya construye objetos ordinarios nuevos
   con los cinco campos. Cada llamada recupera la lista de nuevo.
2. Añadir `src/clients/terminal/pick-random-user.txt`: espera la operación,
   imprime el contacto o `No users available`, y comunica errores con salida 1.
3. En `src/clients/web/index.html` y `main.js`, añadir un botón y un resultado
   accesible junto al resumen existente. Importar directamente la operación.
   Usar el bloqueo busy existente, limpiar el resultado al empezar y mostrar
   nombre, email e ID mediante textContent. No llamar a selectUser ni showMenu.
4. Actualizar las guías de contratos, errores, arquitectura e inventario y README.
   La constitución incorporará el nuevo retorno null y la presentación del caso
   vacío del ejemplo terminal; las operaciones existentes conservan sus contratos.

No se necesitan paquetes, cambios de esquema ni endpoints nuevos.

## Verificación

- Pruebas con datos controlados: vacío, único, posiciones primera/intermedia/última,
  IDs discontinuos, nombres duplicados, repetición, cambios entre solicitudes,
  cinco campos, independencia de objetos y conservación de datos.
- En una copia desechable, iniciar el servicio de datos en un puerto libre,
  ejecutar el ejemplo terminal real y comprobar tabla sin inicializar, tabla
  vacía, datos, cambios posteriores y servicio detenido. Cualquier adaptación
  del puerto queda solo en la copia de pruebas.
- Probar el controlador web con DOM simulado: éxito, vacío, fallo, limpieza
  inmediata y bloqueo de doble solicitud, conservando la identidad seleccionada.
- Ejecutar pnpm format y pnpm lint, revisar el diff y pedir revisión independiente
  a subagentes antes de entregar. Registrar resultados reales en tasks.md.

## Revisión previa

CA-01 a CA-08 tienen recorrido y comprobación. La aleatoriedad se controla en
pruebas sin añadir parámetros de prueba a la operación pública. Se reutilizan
listado, acceso a datos y estado busy; la presentación sigue en los clientes.
