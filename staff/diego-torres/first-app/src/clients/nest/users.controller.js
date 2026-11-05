// Herramientas de Nest para definir las rutas y leer las peticiones.
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
  Query,
} from "@nestjs/common";

// El servicio que llama a la lógica.
import { UsersService } from "./users.service.js";

// Todas las rutas de esta clase empiezan por /users.
// Dependencies le dice a Nest qué servicio tiene que pasar al constructor.
@Controller("users")
@Dependencies(UsersService)
export class UsersController {
  // Nest nos pasa el servicio al crear el controlador.
  constructor(usersService) {
    this.usersService = usersService;
  }

  // POST /users crea un usuario y responde 201.
  // Bind(Body()) pasa el cuerpo de la petición a la función.
  @Post()
  @HttpCode(201)
  @Bind(Body())
  create(body) {
    const { name, email } = body ?? {};
    return this.usersService.create(name, email);
  }

  // GET /users devuelve todos los usuarios.
  @Get()
  list() {
    return this.usersService.list();
  }

  // GET /users/by-name?name= busca usuarios por su nombre.
  // Va antes que /users/:id. Si no, "by-name" se tomaría por un id.
  // Bind(Query("name")) pasa a la función el nombre que llega en la dirección.
  @Get("by-name")
  @Bind(Query("name"))
  findByName(name) {
    return this.usersService.findByName(name);
  }

  // GET /users/:id devuelve un usuario.
  // Bind(Param("id")) pasa el id de la ruta a la función.
  @Get(":id")
  @Bind(Param("id"))
  find(id) {
    return this.usersService.find(id);
  }

  // PATCH /users/:id cambia los datos que llegan.
  @Patch(":id")
  @Bind(Param("id"), Body())
  update(id, body) {
    const { name, email } = body ?? {};

    // Lo que no llega no entra en los cambios y conserva su valor.
    const changes = {};
    if (name !== undefined) {
      changes.name = name;
    }
    if (email !== undefined) {
      changes.email = email;
    }

    return this.usersService.update(id, changes);
  }

  // DELETE /users/:id borra un usuario y responde 204, sin cuerpo.
  @Delete(":id")
  @HttpCode(204)
  @Bind(Param("id"))
  async remove(id) {
    await this.usersService.remove(id);
  }
}
