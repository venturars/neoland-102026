import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { HttpExceptionFilter } from "./http-exception.filter.js";

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
