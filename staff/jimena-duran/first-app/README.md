# first-app

## API de usuarios con NestJS

Desde `staff/jimena-duran/first-app`, en terminales PowerShell separadas:

```powershell
corepack pnpm server
```

```powershell
corepack pnpm nest
```

El servidor SQL escucha en http://127.0.0.1:3000 y NestJS en
http://127.0.0.1:3003. Mantén ambas terminales abiertas.
El comando `nest` compila JavaScript con Babel antes de arrancar.
Abre http://127.0.0.1:3003/ para gestionar usuarios desde Swagger UI:

1. Abre `POST /users`, pulsa **Try it out**, introduce nombre y un email
   libre y pulsa **Execute**. Devuelve 201 con el usuario y su id.
2. Ejecuta `GET /users` para listar y `GET /users/{id}` para consultar
   el id recibido. Ambas operaciones devuelven 200.
3. Ejecuta `PATCH /users/{id}` con ese id y solo el nombre, solo el email
   o ambos. Devuelve 200 y conserva los campos omitidos.
4. Ejecuta `DELETE /users/{id}` con ese id. Devuelve 204 sin cuerpo;
   volver a consultarlo devuelve 404 con `User not found`.

La tabla debe existir según [DATABASE.md](docs/DATABASE.md).
Para probar con datos ficticios utiliza una copia desechable de la app.

Express también puede arrancarse en otra terminal con `corepack pnpm http`;
conserva http://127.0.0.1:3001 y comparte los datos del servidor SQL.

Prueba en otra terminal de PowerShell:

```powershell
$api = "http://127.0.0.1:3003/users"
$email = "nest-$([guid]::NewGuid().ToString('N'))@example.com"
$body = @{ name = "Ana"; email = $email } | ConvertTo-Json
$user = Invoke-RestMethod $api -Method Post -ContentType "application/json" -Body $body
Invoke-RestMethod $api
Invoke-RestMethod "$api/$($user.id)"
$changes = @{ name = "Ana Durán" } | ConvertTo-Json
Invoke-RestMethod "$api/$($user.id)" -Method Patch -ContentType "application/json" -Body $changes
Invoke-RestMethod "http://127.0.0.1:3001/users/$($user.id)"
Invoke-WebRequest "$api/$($user.id)" -Method Delete -UseBasicParsing
```

Crear devuelve 201 y el usuario; listar y consultar, 200.
PATCH devuelve 200 con el usuario actualizado y conserva campos omitidos.
DELETE devuelve 204 sin cuerpo. Los errores incluyen `message`:
400 para nombre vacío o email inválido, 409 para email repetido,
404 para usuario inexistente y 500 si falla una operación.
Una ruta desconocida devuelve 404 sin cuerpo.

El cliente no añade autenticación, validaciones ni consultas de usuarios.

## Extensión de Chrome

En dos terminales de PowerShell, desde la raíz del repositorio:

```powershell
Set-Location staff/jimena-duran/first-app
```

En la primera terminal, mantener abierta la base:

```powershell
corepack pnpm server
```

En la segunda, mantener abierta la API de la extensión:

```powershell
corepack pnpm chrome
```

La base escucha en http://127.0.0.1:3000 y la API en
http://127.0.0.1:3002.

Para abrir la extensión en Chrome:

1. Entrar en `chrome://extensions` y activar el modo de desarrollador.
2. Pulsar **Cargar extensión sin empaquetar** y seleccionar
   `staff/jimena-duran/first-app/src/clients/chrome`.
3. Abrir el icono **Usuarios** para gestionar los usuarios.
