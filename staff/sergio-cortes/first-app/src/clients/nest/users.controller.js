import {
  Bind,
  Body,
  Controller,
  Delete,
  Dependencies,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationError } from "../../logic/errors.js";
import { UsersService } from "./users.service.js";

const MESSAGE_SCHEMA = {
  type: "object",
  properties: {
    message: { type: "string", example: "User not found" },
  },
  required: ["message"],
  example: { message: "User not found" },
};

const USER_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "integer", example: 1 },
    name: { type: "string", example: "Ada" },
    email: { type: "string", example: "ada@example.com" },
    createdAt: {
      type: "string",
      format: "date-time",
      example: "2026-11-05 12:00:00",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      example: "2026-11-05 12:00:00",
    },
  },
  example: {
    id: 1,
    name: "Ada",
    email: "ada@example.com",
    createdAt: "2026-11-05 12:00:00",
    updatedAt: "2026-11-05 12:00:00",
  },
};

const CREATE_USER_BODY_SCHEMA = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string", example: "Ada" },
    email: { type: "string", example: "ada@example.com" },
  },
  example: { name: "Ada", email: "ada@example.com" },
};

const UPDATE_USER_BODY_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", example: "Ada Lovelace" },
    email: { type: "string", example: "ada@example.com" },
  },
  example: { name: "Ada Lovelace", email: "ada@example.com" },
};

const GENDER_COUNT_SCHEMA = {
  type: "object",
  properties: {
    woman: { type: "integer", example: 1 },
    man: { type: "integer", example: 1 },
    genderUndefined: { type: "integer", example: 2 },
  },
  required: ["woman", "man", "genderUndefined"],
  example: { woman: 1, man: 1, genderUndefined: 2 },
};

const ID_PARAM = {
  name: "id",
  required: true,
  schema: { type: "string", example: "1" },
};

@Controller()
@ApiTags("users")
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  checkBody(body) {
    if (body === undefined) {
      throw new ValidationError("Body is invalid");
    }

    if (body === null) {
      throw new ValidationError("Body is invalid");
    }

    if (typeof body !== "object") {
      throw new ValidationError("Body is invalid");
    }
  }

  @Get("users")
  @ApiResponse({
    status: 200,
    description: "Lista de usuarios",
    schema: { type: "array", items: USER_SCHEMA },
  })
  @ApiResponse({
    status: 500,
    description: "Could not list the users",
    schema: MESSAGE_SCHEMA,
  })
  async list() {
    const users = await this.usersService.list();
    return users;
  }

  @Get("users/gender-count")
  @ApiResponse({
    status: 200,
    description: "Recuento por género",
    schema: GENDER_COUNT_SCHEMA,
  })
  @ApiResponse({
    status: 500,
    description: "Could not classify the users",
    schema: MESSAGE_SCHEMA,
  })
  async genderCount() {
    const count = await this.usersService.genderCount();
    return count;
  }

  @Get("users/:id")
  @ApiParam(ID_PARAM)
  @ApiResponse({ status: 200, description: "Usuario", schema: USER_SCHEMA })
  @ApiResponse({
    status: 400,
    description: "Id is invalid",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 500,
    description: "Could not find the user",
    schema: MESSAGE_SCHEMA,
  })
  @Bind(Param("id"))
  async find(id) {
    const user = await this.usersService.find(id);
    return user;
  }

  @Post("users")
  @HttpCode(201)
  @ApiBody({ schema: CREATE_USER_BODY_SCHEMA })
  @ApiResponse({
    status: 201,
    description: "Usuario creado",
    schema: USER_SCHEMA,
  })
  @ApiResponse({
    status: 400,
    description: "Body is invalid, Name is empty, Email is invalid",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 409,
    description: "Email is already used",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 500,
    description: "Could not create the user",
    schema: MESSAGE_SCHEMA,
  })
  @Bind(Body())
  async create(body) {
    this.checkBody(body);

    const name = body.name;
    const email = body.email;
    const user = await this.usersService.create(name, email);
    return user;
  }

  @Patch("users/:id")
  @ApiParam(ID_PARAM)
  @ApiBody({ schema: UPDATE_USER_BODY_SCHEMA })
  @ApiResponse({
    status: 200,
    description: "Usuario actualizado",
    schema: USER_SCHEMA,
  })
  @ApiResponse({
    status: 400,
    description:
      "Id is invalid, Body is invalid, Name is empty, Email is invalid",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 409,
    description: "Email is already used",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 500,
    description: "Could not update the user",
    schema: MESSAGE_SCHEMA,
  })
  @Bind(Param("id"), Body())
  async update(id, body) {
    this.checkBody(body);

    const name = body.name;
    const email = body.email;
    const user = await this.usersService.update(id, name, email);
    return user;
  }

  @Delete("users/:id")
  @HttpCode(204)
  @ApiParam(ID_PARAM)
  @ApiResponse({ status: 204, description: "Sin cuerpo" })
  @ApiResponse({
    status: 400,
    description: "Id is invalid",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
    schema: MESSAGE_SCHEMA,
  })
  @ApiResponse({
    status: 500,
    description: "Could not delete the user",
    schema: MESSAGE_SCHEMA,
  })
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
