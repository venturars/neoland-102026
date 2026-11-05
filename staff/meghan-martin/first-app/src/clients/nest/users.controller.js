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
import { ApiBody, ApiParam } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";

const CREATE_USER_SCHEMA = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string", example: "Ada" },
    email: { type: "string", example: "ada@example.com" },
  },
};

const UPDATE_USER_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", example: "Ada Lovelace" },
    email: { type: "string", example: "ada@example.com" },
  },
};

const ID_PARAM = {
  name: "id",
  required: true,
  schema: { type: "string", example: "1" },
};

@Controller()
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Post("users")
  @HttpCode(201)
  @ApiBody({ schema: CREATE_USER_SCHEMA })
  @Bind(Body())
  async create(body) {
    const payload = body ?? {};
    const name = payload.name;
    const email = payload.email;
    const user = await this.usersService.create(name, email);
    return user;
  }

  @Get("users")
  async list() {
    const users = await this.usersService.list();
    return users;
  }

  @Get("users/:id")
  @ApiParam(ID_PARAM)
  @Bind(Param("id"))
  async find(id) {
    const user = await this.usersService.find(id);
    return user;
  }

  @Patch("users/:id")
  @ApiParam(ID_PARAM)
  @ApiBody({ schema: UPDATE_USER_SCHEMA })
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
  @ApiParam(ID_PARAM)
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
