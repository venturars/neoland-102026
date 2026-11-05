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
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";

const USER_BODY = {
  schema: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
    },
  },
};

@ApiTags("users")
@Controller()
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Post("users")
  @HttpCode(201)
  @ApiBody(USER_BODY)
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
  @Bind(Param("id"))
  async find(id) {
    const user = await this.usersService.find(id);
    return user;
  }

  @Patch("users/:id")
  @ApiBody(USER_BODY)
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
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
