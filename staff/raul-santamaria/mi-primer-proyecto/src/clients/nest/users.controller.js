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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "./users.service.js";

const userSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    email: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
  },
};

const errorSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

const createBodySchema = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
};

const patchBodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
};

@ApiTags("users")
@Controller("users")
class UsersController {
  constructor(@Inject(UsersService) usersService) {
    this.usersService = usersService;
  }

  @Post()
  @HttpCode(201)
  @Bind(Body())
  @ApiOperation({ summary: "Create a user" })
  @ApiBody({ schema: createBodySchema })
  @ApiResponse({ status: 201, schema: userSchema })
  @ApiResponse({
    status: 400,
    schema: errorSchema,
    description: "Name is empty or Email is invalid",
  })
  @ApiResponse({ status: 409, schema: errorSchema })
  @ApiResponse({ status: 500, schema: errorSchema })
  create(body) {
    const name = body.name;
    const email = body.email;
    return this.usersService.createUser({ name, email });
  }

  @Get()
  @ApiOperation({ summary: "List users" })
  @ApiResponse({
    status: 200,
    schema: { type: "array", items: userSchema },
  })
  @ApiResponse({ status: 500, schema: errorSchema })
  findAll() {
    return this.usersService.listUsers();
  }

  @Get(":id")
  @Bind(Param("id"))
  @ApiOperation({ summary: "Find user by id" })
  @ApiParam({ name: "id", schema: { type: "string" } })
  @ApiResponse({ status: 200, schema: userSchema })
  @ApiResponse({ status: 400, schema: errorSchema })
  @ApiResponse({ status: 404, schema: errorSchema })
  @ApiResponse({ status: 500, schema: errorSchema })
  findOne(id) {
    return this.usersService.findUserById(id);
  }

  @Patch(":id")
  @Bind(Param("id"), Body())
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", schema: { type: "string" } })
  @ApiBody({ schema: patchBodySchema })
  @ApiResponse({ status: 200, schema: userSchema })
  @ApiResponse({
    status: 400,
    schema: errorSchema,
    description: "Name is empty, Email is invalid or User id is not valid",
  })
  @ApiResponse({ status: 404, schema: errorSchema })
  @ApiResponse({ status: 409, schema: errorSchema })
  @ApiResponse({ status: 500, schema: errorSchema })
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
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", schema: { type: "string" } })
  @ApiResponse({ status: 204, description: "No content" })
  @ApiResponse({ status: 400, schema: errorSchema })
  @ApiResponse({ status: 404, schema: errorSchema })
  @ApiResponse({ status: 500, schema: errorSchema })
  async remove(id) {
    await this.usersService.deleteUser({ id });
  }
}

export { UsersController };
