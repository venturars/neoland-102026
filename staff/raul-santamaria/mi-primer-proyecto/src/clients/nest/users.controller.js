import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service.js";

@Controller("users")
class UsersController {
  constructor(@Inject(UsersService) usersService) {
    this.usersService = usersService;
  }

  @Post()
  @HttpCode(201)
  @Bind(Body())
  create(body) {
    const name = body.name;
    const email = body.email;
    return this.usersService.createUser({ name, email });
  }

  @Get()
  findAll() {
    return this.usersService.listUsers();
  }

  @Get(":id")
  @Bind(Param("id"))
  findOne(id) {
    return this.usersService.findUserById(id);
  }

  @Patch(":id")
  @Bind(Param("id"), Body())
  update(id, body) {
    const input = { id };
    if (body.name !== undefined) {
      input.name = body.name;
    }
    if (body.email !== undefined) {
      input.email = body.email;
    }
    return this.usersService.updateUser(input);
  }

  @Delete(":id")
  @HttpCode(204)
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.deleteUser({ id });
  }
}

export { UsersController };
