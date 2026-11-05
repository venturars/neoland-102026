import {
  BadRequestException,
  Bind,
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
import { listGmailUsers } from "../../logic/list-gmail-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

// Each method calls one function of logic/. The rules stay there. The error filter answers what it throws.
@Controller()
export class UsersController {
  @Post("users")
  @Bind(Body())
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

  @Get("users")
  async list() {
    return listUsers();
  }

  // Declared before users/:id, or gmail would be read as an id.
  @Get("users/gmail")
  async listGmail() {
    return listGmailUsers();
  }

  @Get("users/:id")
  @Bind(Param("id"))
  async findOne(idText) {
    // The id comes from the path as text. Text that is not a number matches no user.
    const id = Number(idText);

    return findUserById({ id });
  }

  @Patch("users/:id")
  @Bind(Param("id"), Body())
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

  @Delete("users/:id")
  @HttpCode(204)
  @Bind(Param("id"))
  async remove(idText) {
    const id = Number(idText);

    await deleteUser({ id });
  }
}
