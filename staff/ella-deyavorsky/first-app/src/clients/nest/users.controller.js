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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { listGmailUsers } from "../../logic/list-gmail-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

// What the page /docs shows of a user, and of an error. The decorators below only describe; they check nothing.
const USER = {
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    email: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};
const ERROR = {
  type: "object",
  properties: { error: { type: "string" } },
};
const USERS = { type: "array", items: USER };

// Each method calls one function of logic/. The rules stay there. The error filter answers what it throws.
@ApiTags("users")
@Controller()
export class UsersController {
  @Post("users")
  @ApiOperation({ summary: "Create a user" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["name", "email"],
      properties: { name: { type: "string" }, email: { type: "string" } },
    },
  })
  @ApiResponse({ status: 201, description: "The user.", schema: USER })
  @ApiResponse({
    status: 400,
    description:
      "The name is missing. / The email is not valid. / The request is not valid.",
    schema: ERROR,
  })
  @ApiResponse({
    status: 409,
    description: "This email is already used.",
    schema: ERROR,
  })
  @ApiResponse({
    status: 500,
    description: "The database failed.",
    schema: ERROR,
  })
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
  @ApiOperation({ summary: "List the users" })
  @ApiResponse({
    status: 200,
    description: "The list, empty if there are none.",
    schema: USERS,
  })
  @ApiResponse({
    status: 500,
    description: "The database failed.",
    schema: ERROR,
  })
  async list() {
    return listUsers();
  }

  // Declared before users/:id, or gmail would be read as an id.
  @Get("users/gmail")
  @ApiOperation({ summary: "List the users whose email contains @gmail" })
  @ApiResponse({
    status: 200,
    description: "The list, empty if there are none.",
    schema: USERS,
  })
  @ApiResponse({
    status: 500,
    description: "The database failed.",
    schema: ERROR,
  })
  async listGmail() {
    return listGmailUsers();
  }

  @Get("users/:id")
  @ApiOperation({ summary: "View one user" })
  @ApiParam({ name: "id", type: "integer" })
  @ApiResponse({ status: 200, description: "The user.", schema: USER })
  @ApiResponse({
    status: 404,
    description: "No user was found.",
    schema: ERROR,
  })
  @ApiResponse({
    status: 500,
    description: "The database failed.",
    schema: ERROR,
  })
  @Bind(Param("id"))
  async findOne(idText) {
    // The id comes from the path as text. Text that is not a number matches no user.
    const id = Number(idText);

    return findUserById({ id });
  }

  @Patch("users/:id")
  @ApiOperation({ summary: "Update the name, the email or both of a user" })
  @ApiParam({ name: "id", type: "integer" })
  @ApiBody({
    description: "At least one of the two is needed.",
    schema: {
      type: "object",
      properties: { name: { type: "string" }, email: { type: "string" } },
    },
  })
  @ApiResponse({ status: 200, description: "The user.", schema: USER })
  @ApiResponse({
    status: 400,
    description:
      "The email is not valid. / There is nothing to update. / The request is not valid.",
    schema: ERROR,
  })
  @ApiResponse({
    status: 404,
    description: "No user was found.",
    schema: ERROR,
  })
  @ApiResponse({
    status: 409,
    description: "This email is already used.",
    schema: ERROR,
  })
  @ApiResponse({
    status: 500,
    description: "The database failed.",
    schema: ERROR,
  })
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
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", type: "integer" })
  @ApiResponse({ status: 204, description: "Deleted. The body is empty." })
  @ApiResponse({
    status: 404,
    description: "No user was found.",
    schema: ERROR,
  })
  @ApiResponse({
    status: 500,
    description: "The database failed.",
    schema: ERROR,
  })
  @HttpCode(204)
  @Bind(Param("id"))
  async remove(idText) {
    const id = Number(idText);

    await deleteUser({ id });
  }
}
