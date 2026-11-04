import "reflect-metadata";
import {
  Body,
  Catch,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Module,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { usersGenderCount } from "../../logic/users-gender-count.js";

const HOST = "127.0.0.1";
const PORT = 3003;
const ERROR_STATUS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Email is already used": 409,
  "User not found": 404,
  "Could not create the user": 500,
  "Could not list the users": 500,
  "Could not find the user": 500,
  "Could not update the user": 500,
  "Could not delete the user": 500,
  "Could not classify the users": 500,
};

class UsersController {
  async create(body) {
    const name = body.name;
    const email = body.email;
    const user = await createUser({ name, email });
    return user;
  }

  async list() {
    const users = await listUsers();
    return users;
  }

  async genderCount() {
    const counts = await usersGenderCount();
    return counts;
  }

  async find(idText) {
    const id = Number(idText);
    const user = await findUserById(id);
    return user;
  }

  async update(idText, body) {
    const id = Number(idText);
    const name = body.name;
    const email = body.email;
    const changes = { name, email };
    const user = await updateUser(id, changes);
    return user;
  }

  async remove(idText) {
    const id = Number(idText);
    await deleteUser(id);
  }
}

Controller("users")(UsersController);
const controller = UsersController.prototype;
const createDescriptor = Object.getOwnPropertyDescriptor(controller, "create");
Post()(controller, "create", createDescriptor);
Body()(controller, "create", 0);
const listDescriptor = Object.getOwnPropertyDescriptor(controller, "list");
Get()(controller, "list", listDescriptor);
const genderDescriptor = Object.getOwnPropertyDescriptor(
  controller,
  "genderCount",
);
Get("gender-count")(controller, "genderCount", genderDescriptor);
const findDescriptor = Object.getOwnPropertyDescriptor(controller, "find");
Get(":id")(controller, "find", findDescriptor);
Param("id")(controller, "find", 0);
const updateDescriptor = Object.getOwnPropertyDescriptor(controller, "update");
Patch(":id")(controller, "update", updateDescriptor);
Param("id")(controller, "update", 0);
Body()(controller, "update", 1);
const removeDescriptor = Object.getOwnPropertyDescriptor(controller, "remove");
Delete(":id")(controller, "remove", removeDescriptor);
HttpCode(204)(controller, "remove", removeDescriptor);
Param("id")(controller, "remove", 0);

class LogicErrorFilter {
  catch(error, host) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();
    const frameworkError = error instanceof HttpException;
    if (frameworkError) {
      const status = error.getStatus();
      response.status(status);
      response.end();
      return;
    }

    const isError = error instanceof Error;
    if (isError) {
      const message = error.message;
      const status = ERROR_STATUS[message];
      const recognized = Object.hasOwn(ERROR_STATUS, message);
      if (recognized) {
        response.status(status);
        response.json({ message });
        return;
      }
    }

    const method = request.method;
    let message = "Could not list the users";
    const creating = method === "POST";
    const updating = method === "PATCH";
    const deleting = method === "DELETE";
    if (creating) {
      message = "Could not create the user";
    } else if (updating) {
      message = "Could not update the user";
    } else if (deleting) {
      message = "Could not delete the user";
    } else {
      const path = request.path;
      const genderRoute =
        path === "/users/gender-count" || path === "/users/gender-count/";
      const id = request.params.id;
      const finding = id !== undefined;
      if (genderRoute) {
        message = "Could not classify the users";
      } else if (finding) {
        message = "Could not find the user";
      }
    }
    response.status(500);
    response.json({ message });
  }
}

Catch()(LogicErrorFilter);
class UsersModule {}
Module({ controllers: [UsersController] })(UsersModule);

try {
  const app = await NestFactory.create(UsersModule);
  const filter = new LogicErrorFilter();
  app.useGlobalFilters(filter);
  await app.listen(PORT, HOST);
  console.log(`http://${HOST}:${PORT}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
