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
import { ValidationError } from "../../logic/errors.js";
import { UsersService } from "./users.service.js";

@Controller()
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

  @Post("users")
  @HttpCode(201)
  @Bind(Body())
  async create(body) {
    this.checkBody(body);

    const name = body.name;
    const email = body.email;
    const user = await this.usersService.create(name, email);
    return user;
  }

  @Patch("users/:id")
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
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
