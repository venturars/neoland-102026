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
import { UsersService } from "./users-service.js";

const CREATE_USER_SCHEMA = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string", example: "Ana" },
    email: { type: "string", example: "ana@example.com" },
  },
};

const UPDATE_USER_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
  example: { name: "Ana Durán" },
};

const ID_PARAM = {
  name: "id",
  required: true,
  schema: { type: "string", example: "1" },
};

@Controller("users")
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Post()
  @HttpCode(201)
  @ApiBody({ schema: CREATE_USER_SCHEMA })
  @Bind(Body())
  async create(body) {
    const name = body.name;
    const email = body.email;
    const user = await this.usersService.create({ name, email });
    return user;
  }

  @Get()
  async list() {
    const users = await this.usersService.list();
    return users;
  }

  @Get(":id")
  @ApiParam(ID_PARAM)
  @Bind(Param("id"))
  async find(id) {
    const user = await this.usersService.find(id);
    return user;
  }

  @Patch(":id")
  @HttpCode(200)
  @ApiParam(ID_PARAM)
  @ApiBody({ schema: UPDATE_USER_SCHEMA })
  @Bind(Param("id"), Body())
  async update(id, body) {
    const changes = {};
    if (body.name !== undefined) {
      changes.name = body.name;
    }
    if (body.email !== undefined) {
      changes.email = body.email;
    }
    const user = await this.usersService.update(id, changes);
    return user;
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiParam(ID_PARAM)
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
