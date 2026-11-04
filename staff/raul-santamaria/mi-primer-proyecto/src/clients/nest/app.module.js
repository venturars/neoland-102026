import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { LogicExceptionFilter } from "./logic-exception.filter.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

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
class AppModule {}

export { AppModule };
