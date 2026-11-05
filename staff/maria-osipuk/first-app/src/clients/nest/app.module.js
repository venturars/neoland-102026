import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { UsersController } from "./users.controller.js";
import { UsersExceptionFilter } from "./users-exception.filter.js";
import { UsersService } from "./users.service.js";

// The module joins the three parts of this client. APP_FILTER makes the
// exception filter work for every route, not only for one controller.
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_FILTER,
      useClass: UsersExceptionFilter,
    },
  ],
})
export class AppModule {}
