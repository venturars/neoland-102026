// Permite agrupar las piezas de la app en un módulo.
import { Module } from "@nestjs/common";
// Sirve para activar el filtro de fallos en toda la app.
import { APP_FILTER } from "@nestjs/core";

// El filtro que traduce cada fallo a su respuesta.
import { LogicExceptionFilter } from "./logic-exception.filter.js";
// Las rutas de la API.
import { UsersController } from "./users.controller.js";
// El servicio que llama a la lógica.
import { UsersService } from "./users.service.js";

// Une el controlador, el servicio y el filtro.
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: LogicExceptionFilter,
    },
  ],
})
export class AppModule {}
