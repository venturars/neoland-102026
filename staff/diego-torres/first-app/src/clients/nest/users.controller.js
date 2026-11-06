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
// Decoradores que explican cada ruta en la página de documentación.
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

// Lo que explica la página sobre los datos y los fallos.
import {
  CREAR_USUARIO,
  FALLO_400,
  FALLO_404,
  FALLO_409,
  FALLO_500,
  LISTA_USUARIOS,
  MODIFICAR_USUARIO,
  RECUENTO,
  USUARIO,
} from "./users.swagger.js";
// El servicio que llama a la lógica.
import { UsersService } from "./users.service.js";

// Todas las rutas de esta clase empiezan por /users.
// Dependencies le dice a Nest qué servicio tiene que pasar al constructor.
// ApiTags agrupa estas rutas en la página de documentación.
@ApiTags("users")
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
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Crea un usuario" })
  @ApiBody({ schema: CREAR_USUARIO })
  @ApiResponse({ status: 201, description: "El usuario", schema: USUARIO })
  @ApiResponse(FALLO_400)
  @ApiResponse(FALLO_409)
  @ApiResponse(FALLO_500)
  create(body) {
    const { name, email } = body ?? {};
    return this.usersService.create(name, email);
  }

  // GET /users devuelve todos los usuarios.
  @Get()
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Lista todos los usuarios" })
  @ApiResponse({ status: 200, description: "La lista", schema: LISTA_USUARIOS })
  @ApiResponse(FALLO_500)
  list() {
    return this.usersService.list();
  }

  // GET /users/by-email?email= busca un usuario por su email.
  // Va antes que /users/:id. Si no, "by-email" se tomaría por un id.
  // Bind(Query("email")) pasa a la función el email que llega en la dirección.
  @Get("by-email")
  @Bind(Query("email"))
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Busca un usuario por su email" })
  @ApiQuery({ name: "email", schema: { type: "string" } })
  @ApiResponse({ status: 200, description: "El usuario", schema: USUARIO })
  @ApiResponse(FALLO_400)
  @ApiResponse(FALLO_404)
  @ApiResponse(FALLO_500)
  findByEmail(email) {
    return this.usersService.findByEmail(email);
  }

  // GET /users/by-name?name= busca usuarios por su nombre.
  // Va antes que /users/:id. Si no, "by-name" se tomaría por un id.
  // Bind(Query("name")) pasa a la función el nombre que llega en la dirección.
  @Get("by-name")
  @Bind(Query("name"))
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Busca usuarios por su nombre" })
  @ApiQuery({ name: "name", schema: { type: "string" } })
  @ApiResponse({ status: 200, description: "La lista", schema: LISTA_USUARIOS })
  @ApiResponse(FALLO_400)
  @ApiResponse(FALLO_500)
  findByName(name) {
    return this.usersService.findByName(name);
  }

  // GET /users/gender-count cuenta los usuarios por género.
  // Va antes que /users/:id. Si no, "gender-count" se tomaría por un id.
  @Get("gender-count")
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Cuenta los usuarios por género" })
  @ApiResponse({ status: 200, description: "Los recuentos", schema: RECUENTO })
  @ApiResponse(FALLO_500)
  countByGender() {
    return this.usersService.countByGender();
  }

  // GET /users/:id devuelve un usuario.
  // Bind(Param("id")) pasa el id de la ruta a la función.
  @Get(":id")
  @Bind(Param("id"))
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Devuelve un usuario" })
  @ApiParam({ name: "id", schema: { type: "integer" } })
  @ApiResponse({ status: 200, description: "El usuario", schema: USUARIO })
  @ApiResponse(FALLO_404)
  @ApiResponse(FALLO_500)
  find(id) {
    return this.usersService.find(id);
  }

  // PATCH /users/:id cambia los datos que llegan.
  @Patch(":id")
  @Bind(Param("id"), Body())
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Cambia los datos que llegan" })
  @ApiParam({ name: "id", schema: { type: "integer" } })
  @ApiBody({ schema: MODIFICAR_USUARIO })
  @ApiResponse({ status: 200, description: "El usuario", schema: USUARIO })
  @ApiResponse(FALLO_400)
  @ApiResponse(FALLO_404)
  @ApiResponse(FALLO_409)
  @ApiResponse(FALLO_500)
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
  // Esto explica la ruta en la página de documentación.
  @ApiOperation({ summary: "Borra un usuario" })
  @ApiParam({ name: "id", schema: { type: "integer" } })
  @ApiResponse({ status: 204, description: "Borrado, sin cuerpo" })
  @ApiResponse(FALLO_404)
  @ApiResponse(FALLO_500)
  async remove(id) {
    await this.usersService.remove(id);
  }
}
