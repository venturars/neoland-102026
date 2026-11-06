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
import { ApiBody, ApiParam } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";

const CREATE_BODY = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string", example: "Ada" },
    email: { type: "string", example: "ada@example.com" },
  },
};
const UPDATE_BODY = {
  type: "object",
  properties: {
    name: { type: "string", example: "Ada Lovelace" },
    email: { type: "string", example: "ada@example.com" },
  },
};
const ID_PARAMETER = {
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
  @ApiBody({ schema: CREATE_BODY })
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
  @ApiParam(ID_PARAMETER)
  @Bind(Param("id"))
  async find(idText) {
    const id = Number(idText);
    return await this.usersService.find(id);
  }

  @Patch(":id")
  @ApiBody({ schema: UPDATE_BODY })
  @ApiParam(ID_PARAMETER)
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
  @ApiParam(ID_PARAMETER)
  @Bind(Param("id"))
  async remove(idText) {
    const id = Number(idText);
    await this.usersService.remove(id);
  }
}
