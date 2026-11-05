# Tareas — Swagger UI en Nest

Un paso. Quien lo revisa marca `- [x]`.

- [x] 1. Abrir `package.json`.
  Añade `@nestjs/swagger` en `12.1.0` a `dependencies`. El resto no cambia salvo lo del plan.

- [x] 2. En `mi-primer-proyecto`, lanzar `pnpm install` y abrir `pnpm-lock.yaml`.
  `@nestjs/swagger` queda en `12.1.0`. El árbol hasta 3 capas coincide con el plan; si no, se para.

- [x] 3. Abrir `src/clients/nest/users.controller.js`.
  Añade `@ApiTags`, `@ApiOperation`, `@ApiParam`, `@ApiBody` y `@ApiResponse` del plan en las cinco rutas. La lógica del controlador no cambia.

- [x] 4. Abrir `src/clients/nest/main.js`.
  Tras `NestFactory.create`, configura `DocumentBuilder`, `createDocument` y `SwaggerModule.setup("docs", ...)`. `listen` sigue en 3003.

- [x] 5. Abrir `docs/ARCHITECTURE.md`.
  El bullet de `src/clients/nest/` menciona Swagger UI en `/docs`. El resto del fichero no cambia.

- [x] 6. Lanzar `pnpm format` y `pnpm lint` desde `mi-primer-proyecto`.
  Ambos terminan bien.

- [x] 7. Lanzar `pnpm server` y `pnpm nest` con la base accesible.
  `http://127.0.0.1:3003/docs` carga Swagger UI con las cinco operaciones. Flujo Ada desde la UI funciona.

- [x] 8. Comprobar error y 404 en 3003.
  Nombre vacío o email inválido devuelve el mismo `{ message }` y HTTP que antes. `GET /no-existe` responde 404 con cuerpo vacío.
