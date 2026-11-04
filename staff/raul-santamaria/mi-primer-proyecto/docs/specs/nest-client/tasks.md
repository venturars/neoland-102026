# Tareas — cliente HTTP Nest

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Abrir `package.json`.
  Añade `@nestjs/common`, `@nestjs/core` y `@nestjs/platform-express` en `12.3.3`, `reflect-metadata` en `0.2.2` y `rxjs` en `7.8.2` a `dependencies`, el script `nest` y el glob `src/clients/nest/**/*.js` en `format`.
  El resto de scripts y dependencias no cambia salvo lo del plan.

- [x] 2. En `mi-primer-proyecto`, lanzar `pnpm install` y abrir `pnpm-lock.yaml`.
  Las cinco dependencias raíz quedan en las versiones del plan. El árbol hasta 3 capas coincide con lo aceptado en el plan; si no, se para y esa versión vuelve a Socket.

- [x] 3. Abrir `docs/TREE.md`, `docs/ARCHITECTURE.md` y `README.md`.
  El árbol incluye `clients/nest/` con los cinco `.js` del plan. La arquitectura dice que `clients/nest/` llama a `logic/`, escucha en el puerto 3003 y no repite sus reglas. El README avisa de que este cliente no sigue `docs/STYLE.md` ni `docs/ERRORS.md` por dentro.

- [x] 4. Abrir `eslint.config.js`.
  ESLint incluye `src/clients/nest/**/*.js` con las mismas reglas que el resto del JavaScript del proyecto.

- [x] 5. Crear `src/clients/nest/logic-exception.filter.js`.
  Traduce `Error.message` al mismo HTTP que `src/clients/http/app.js`. Si el mensaje no está en la tabla, responde 500 con el `Could not …` de la acción en curso.

- [x] 6. Crear `src/clients/nest/users.service.js`.
  Importa las cinco funciones desde `../../logic/` con extensión `.js` y las expone con los mismos argumentos que usa el cliente Express.

- [x] 7. Crear `src/clients/nest/users.controller.js` y `src/clients/nest/app.module.js`.
  Rutas del plan. El controlador delega en el servicio. El módulo registra controlador, servicio y el filtro de errores.

- [x] 8. Crear `src/clients/nest/main.js`.
  `NestFactory` escucha en `http://127.0.0.1:3003`. Al arrancar, la consola escribe esa URL. Otra ruta responde 404 con cuerpo vacío.

- [x] 9. Lanzar `pnpm format` y `pnpm lint` desde `mi-primer-proyecto`.
  `pnpm format` escribe los ficheros de `src/clients/nest/`. `pnpm lint` termina bien.

- [x] 10. Lanzar `pnpm nest` con la base accesible como hasta ahora.
  `GET /no-existe` responde 404 y un cuerpo vacío. Flujo Ada: crear, listar, ver por id, renombrar a Ada Lovelace y borrar; mismos cuerpos y códigos que la spec.

- [x] 11. Probar validaciones y fallo de base en el puerto 3003.
  Nombre vacío, email inválido, email duplicado e id inexistente devuelven los mismos `{ message }` y HTTP que Express. Sin SQLite, las cinco rutas responden 500 con cada `Could not …`.

- [x] 12. Comprobar que Express y Electron siguen igual.
  `pnpm http` en 3001 responde como antes. Electron abre y lista usuarios como antes. `pnpm format` y `pnpm lint` siguen pasando.
