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
import { UsersService } from "./users-service.js";

@Controller("users")
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Post()
  @HttpCode(201)
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
  @Bind(Param("id"))
  async find(id) {
    const user = await this.usersService.find(id);
    return user;
  }

  @Patch(":id")
  @HttpCode(200)
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
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
