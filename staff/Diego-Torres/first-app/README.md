# Usuarios

Reglas para crear, actualizar y eliminar usuarios. Esta carpeta no abre una base de datos ni un servidor. Las reglas reciben un almacén y devuelven usuarios o errores.

La base de esas reglas está en [docs/CONSTITUCION.md](docs/CONSTITUCION.md).

## Tres cajas

| Carpeta | Pregunta | Ahora | Más adelante |
|---|---|---|---|
| `src/dominio` | ¿Qué es un usuario válido? | Nombre obligatorio y email con forma válida | Las mismas reglas |
| `src/casos-de-uso` | ¿Qué pasa al crear, actualizar o eliminar? | Comprueban email único y que el usuario exista | Las mismas funciones |
| `src/almacen` | ¿Dónde están los usuarios? | Un `Map` en memoria | SQLite con las mismas 5 funciones |

Cada caso de uso recibe el almacén como primer argumento. No elige SQLite, Express ni el navegador.

```javascript
import { crearAlmacenMemoria, crearUsuario } from "./src/index.js";

const almacen = crearAlmacenMemoria();
const ana = await crearUsuario(almacen, {
  nombre: "Ana Ruiz",
  email: "ana@ejemplo.com",
});
```

El almacén, sea memoria o SQL, tiene que ofrecer `guardar`, `buscarPorId`, `buscarPorEmail`, `listar` y `borrar`. Las funciones son `async` porque la base de datos, cuando llegue, tendrá que esperar.

## Qué hace cada operación

- **Crear.** Exige nombre y email. El email se guarda en minúsculas y no puede repetirse.
- **Actualizar.** El usuario tiene que existir. Se puede cambiar nombre, email o los dos. El email nuevo no puede ser el de otra persona.
- **Eliminar.** El usuario tiene que existir. Devuelve el usuario que se borró.
- **Consultar.** `obtenerUsuario` falla si el id no existe. `listarUsuarios` devuelve la lista.

Los errores son `DatosInvalidos`, `EmailDuplicado` y `UsuarioNoEncontrado`.

## Probarlo

Desde esta carpeta:

```bash
npm run paso-1
node ejemplo.js
npm test
```

## Lo que viene después

1. Un almacén SQLite que cumpla el mismo contrato. Los casos de uso no se modifican.
2. Rutas HTTP que llamen a estos casos de uso.
3. Jupyter y el frontend hablando con esas rutas. La regla de “email único” se queda aquí.
