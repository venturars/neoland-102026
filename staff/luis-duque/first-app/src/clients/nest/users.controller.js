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
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";

const userSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
  },
};

const messageSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

const createBody = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
};

const updateBody = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
};

const idParam = {
  name: "id",
  required: true,
  schema: { type: "string" },
};

@Controller()
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Post("users")
  @HttpCode(201)
  @ApiOperation({ summary: "crear" })
  @ApiBody({ schema: createBody })
  @ApiResponse({ status: 201, schema: userSchema })
  @ApiResponse({ status: 400, schema: messageSchema })
  @ApiResponse({ status: 409, schema: messageSchema })
  @ApiResponse({ status: 500, schema: messageSchema })
  @Bind(Body())
  async create(body) {
    const payload = body ?? {};
    const name = payload.name;
    const email = payload.email;
    const user = await this.usersService.create(name, email);
    return user;
  }

  @Get("users")
  @ApiOperation({ summary: "listar" })
  @ApiResponse({ status: 200, schema: { type: "array", items: userSchema } })
  @ApiResponse({ status: 500, schema: messageSchema })
  async list() {
    const users = await this.usersService.list();
    return users;
  }

  @Get("users/:id")
  @ApiOperation({ summary: "buscar por id" })
  @ApiParam(idParam)
  @ApiResponse({ status: 200, schema: userSchema })
  @ApiResponse({ status: 400, schema: messageSchema })
  @ApiResponse({ status: 404, schema: messageSchema })
  @ApiResponse({ status: 500, schema: messageSchema })
  @Bind(Param("id"))
  async find(id) {
    const user = await this.usersService.find(id);
    return user;
  }

  @Patch("users/:id")
  @ApiOperation({ summary: "modificar" })
  @ApiParam(idParam)
  @ApiBody({ schema: updateBody })
  @ApiResponse({ status: 200, schema: userSchema })
  @ApiResponse({ status: 400, schema: messageSchema })
  @ApiResponse({ status: 404, schema: messageSchema })
  @ApiResponse({ status: 409, schema: messageSchema })
  @ApiResponse({ status: 500, schema: messageSchema })
  @Bind(Param("id"), Body())
  async update(id, body) {
    const payload = body ?? {};
    const changes = {};

    if (payload.name !== undefined) {
      changes.name = payload.name;
    }

    if (payload.email !== undefined) {
      changes.email = payload.email;
    }

    const user = await this.usersService.update(id, changes);
    return user;
  }

  @Delete("users/:id")
  @HttpCode(204)
  @ApiOperation({ summary: "eliminar" })
  @ApiParam(idParam)
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 400, schema: messageSchema })
  @ApiResponse({ status: 404, schema: messageSchema })
  @ApiResponse({ status: 500, schema: messageSchema })
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
