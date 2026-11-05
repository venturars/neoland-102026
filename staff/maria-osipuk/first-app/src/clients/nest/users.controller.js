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

// Without TypeScript, Swagger cannot read the body or the id from the
// methods, so the page is told here what each route receives.
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

// The controller only turns the request into calls to the service and the
// result into the response. Without TypeScript, Nest cannot read the
// parameter types, so @Dependencies names what the constructor receives
// and @Bind names what each method receives.
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
    // Without a JSON body the body can be undefined. An empty object lets
    // logic/ answer that the name is missing, instead of a TypeError that
    // would end as a 500.
    let safeBody = body;

    if (safeBody === undefined) {
      safeBody = {};
    }

    const name = safeBody.name;
    const email = safeBody.email;
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
  async find(idText) {
    // The route gives text and logic/ needs a number. The number is used
    // only if it writes back the same text: "1e3" would silently become
    // 1000, so it stays as text and logic/ rejects it.
    const idNumber = Number(idText);
    const idNumberText = String(idNumber);
    let id = idText;

    if (idNumberText === idText) {
      id = idNumber;
    }

    const user = await this.usersService.find(id);
    return user;
  }

  @Patch("users/:id")
  @ApiParam(ID_PARAM)
  @ApiBody({ schema: UPDATE_USER_SCHEMA })
  @Bind(Param("id"), Body())
  async update(idText, body) {
    const idNumber = Number(idText);
    const idNumberText = String(idNumber);
    let id = idText;

    if (idNumberText === idText) {
      id = idNumber;
    }

    let safeBody = body;

    if (safeBody === undefined) {
      safeBody = {};
    }

    // updateUser looks at which keys exist, so a field that was not sent
    // must not be in changes: that is how it keeps the stored value.
    const changes = {};

    if (safeBody.name !== undefined) {
      changes.name = safeBody.name;
    }

    if (safeBody.email !== undefined) {
      changes.email = safeBody.email;
    }

    const user = await this.usersService.update(id, changes);
    return user;
  }

  @Delete("users/:id")
  @HttpCode(204)
  @ApiParam(ID_PARAM)
  @Bind(Param("id"))
  async remove(idText) {
    const idNumber = Number(idText);
    const idNumberText = String(idNumber);
    let id = idText;

    if (idNumberText === idText) {
      id = idNumber;
    }

    await this.usersService.remove(id);
  }
}
