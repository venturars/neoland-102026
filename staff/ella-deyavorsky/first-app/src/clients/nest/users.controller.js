import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

// Each method calls one function of logic/. The rules stay there. The error filter answers what it throws.
export class UsersController {
  async create(body) {
    // The method checks the shape of the input. The rules stay in logic/.
    if (body === undefined || body === null || typeof body !== "object") {
      throw new BadRequestException("The request is not valid.");
    }

    const name = body.name;
    const email = body.email;
    if (typeof name !== "string" || typeof email !== "string") {
      throw new BadRequestException("The request is not valid.");
    }

    return createUser({ name, email });
  }

  async list() {
    return listUsers();
  }

  async findOne(idText) {
    // The id comes from the path as text. Text that is not a number matches no user.
    const id = Number(idText);

    return findUserById({ id });
  }

  async update(idText, body) {
    const id = Number(idText);

    if (body === undefined || body === null || typeof body !== "object") {
      throw new BadRequestException("The request is not valid.");
    }

    // A field that is not sent stays undefined, so logic/ keeps the old value.
    const name = body.name;
    const email = body.email;
    if (name !== undefined && typeof name !== "string") {
      throw new BadRequestException("The request is not valid.");
    }
    if (email !== undefined && typeof email !== "string") {
      throw new BadRequestException("The request is not valid.");
    }

    return updateUser({ id, name, email });
  }

  async remove(idText) {
    const id = Number(idText);

    await deleteUser({ id });
  }
}

// Plain Node does not read "@", so each decorator is called as a function.
const methods = UsersController.prototype;

Controller("users")(UsersController);

Post()(methods, "create", Object.getOwnPropertyDescriptor(methods, "create"));
Body()(methods, "create", 0);

Get()(methods, "list", Object.getOwnPropertyDescriptor(methods, "list"));

Get(":id")(
  methods,
  "findOne",
  Object.getOwnPropertyDescriptor(methods, "findOne"),
);
Param("id")(methods, "findOne", 0);

Patch(":id")(
  methods,
  "update",
  Object.getOwnPropertyDescriptor(methods, "update"),
);
Param("id")(methods, "update", 0);
Body()(methods, "update", 1);

Delete(":id")(
  methods,
  "remove",
  Object.getOwnPropertyDescriptor(methods, "remove"),
);
HttpCode(204)(
  methods,
  "remove",
  Object.getOwnPropertyDescriptor(methods, "remove"),
);
Param("id")(methods, "remove", 0);
