import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller.js";

export class AppModule {}

// Plain Node does not read "@", so the decorator is called as a function.
Module({ controllers: [UsersController] })(AppModule);
