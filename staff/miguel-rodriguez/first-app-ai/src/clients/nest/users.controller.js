import {
  Controller,
  Dependencies,
  Bind,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { UsersService } from "./users.service.js";

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
    const input = { name: body.name, email: body.email };
    return await this.usersService.create(input);
  }

  @Get()
  async list() {
    return await this.usersService.list();
  }

  @Get(":id")
  @Bind(Param("id"))
  async find(idText) {
    const id = Number(idText);
    return await this.usersService.find(id);
  }

  @Patch(":id")
  @Bind(Param("id"), Body())
  async update(idText, body) {
    const id = Number(idText);
    const changes = {};
    const name = body.name;
    const email = body.email;
    if (name !== undefined) {
      changes.name = name;
    }
    if (email !== undefined) {
      changes.email = email;
    }
    return await this.usersService.update(id, changes);
  }

  @Delete(":id")
  @HttpCode(204)
  @Bind(Param("id"))
  async remove(idText) {
    const id = Number(idText);
    await this.usersService.remove(id);
  }
}
