import {
  All,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const NAME_IS_EMPTY = "Name is empty";
const EMAIL_IS_INVALID = "Email is invalid";
const EMAIL_IS_ALREADY_USED = "Email is already used";
const INVALID_ID = "Invalid id";
const USER_NOT_FOUND = "User not found";
const COULD_NOT_CREATE_THE_USER = "Could not create the user";
const COULD_NOT_LIST_THE_USERS = "Could not list the users";
const COULD_NOT_FIND_THE_USER = "Could not find the user";
const COULD_NOT_UPDATE_THE_USER = "Could not update the user";
const COULD_NOT_DELETE_THE_USER = "Could not delete the user";

@Controller()
class UsersController {
  @Post("users")
  async create(request, response) {
    try {
      const body = request.body;
      const name = body.name;
      const email = body.email;
      const user = await createUser({ name, email });
      response.status(201);
      response.json(user);
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === NAME_IS_EMPTY) {
          response.status(400);
          response.json({ message });
          return;
        }
        if (message === EMAIL_IS_INVALID) {
          response.status(400);
          response.json({ message });
          return;
        }
        if (message === EMAIL_IS_ALREADY_USED) {
          response.status(409);
          response.json({ message });
          return;
        }
        if (message === COULD_NOT_CREATE_THE_USER) {
          response.status(500);
          response.json({ message });
          return;
        }
      }
      response.status(500);
      response.json({ message: COULD_NOT_CREATE_THE_USER });
    }
  }

  @Get("users")
  async list(request, response) {
    try {
      const users = await listUsers();
      response.status(200);
      response.json(users);
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === COULD_NOT_LIST_THE_USERS) {
          response.status(500);
          response.json({ message });
          return;
        }
      }
      response.status(500);
      response.json({ message: COULD_NOT_LIST_THE_USERS });
    }
  }

  @Get("users/:id")
  async find(request, response) {
    try {
      const rawId = request.params.id;
      const id = Number(rawId);
      const user = await findUserById(id);
      response.status(200);
      response.json(user);
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === INVALID_ID) {
          response.status(400);
          response.json({ message });
          return;
        }
        if (message === USER_NOT_FOUND) {
          response.status(404);
          response.json({ message });
          return;
        }
        if (message === COULD_NOT_FIND_THE_USER) {
          response.status(500);
          response.json({ message });
          return;
        }
      }
      response.status(500);
      response.json({ message: COULD_NOT_FIND_THE_USER });
    }
  }

  @Patch("users/:id")
  async update(request, response) {
    try {
      const rawId = request.params.id;
      const id = Number(rawId);
      const body = request.body;
      const changes = {};
      if (body.name !== undefined) {
        changes.name = body.name;
      }
      if (body.email !== undefined) {
        changes.email = body.email;
      }
      const user = await updateUser(id, changes);
      response.status(200);
      response.json(user);
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === NAME_IS_EMPTY) {
          response.status(400);
          response.json({ message });
          return;
        }
        if (message === EMAIL_IS_INVALID) {
          response.status(400);
          response.json({ message });
          return;
        }
        if (message === EMAIL_IS_ALREADY_USED) {
          response.status(409);
          response.json({ message });
          return;
        }
        if (message === INVALID_ID) {
          response.status(400);
          response.json({ message });
          return;
        }
        if (message === USER_NOT_FOUND) {
          response.status(404);
          response.json({ message });
          return;
        }
        if (message === COULD_NOT_UPDATE_THE_USER) {
          response.status(500);
          response.json({ message });
          return;
        }
      }
      response.status(500);
      response.json({ message: COULD_NOT_UPDATE_THE_USER });
    }
  }

  @Delete("users/:id")
  async remove(request, response) {
    try {
      const rawId = request.params.id;
      const id = Number(rawId);
      await deleteUser(id);
      response.status(204);
      response.end();
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message === INVALID_ID) {
          response.status(400);
          response.json({ message });
          return;
        }
        if (message === USER_NOT_FOUND) {
          response.status(404);
          response.json({ message });
          return;
        }
        if (message === COULD_NOT_DELETE_THE_USER) {
          response.status(500);
          response.json({ message });
          return;
        }
      }
      response.status(500);
      response.json({ message: COULD_NOT_DELETE_THE_USER });
    }
  }

  @All("*path")
  async miss(response) {
    response.status(404);
    response.end();
  }
}

// Babel no lee un decorador puesto en un parámetro.
Req()(UsersController.prototype, "create", 0);
Res()(UsersController.prototype, "create", 1);
Req()(UsersController.prototype, "list", 0);
Res()(UsersController.prototype, "list", 1);
Req()(UsersController.prototype, "find", 0);
Res()(UsersController.prototype, "find", 1);
Req()(UsersController.prototype, "update", 0);
Res()(UsersController.prototype, "update", 1);
Req()(UsersController.prototype, "remove", 0);
Res()(UsersController.prototype, "remove", 1);
Res()(UsersController.prototype, "miss", 0);

export { UsersController };
