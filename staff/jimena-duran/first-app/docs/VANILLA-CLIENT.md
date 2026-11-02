# Cliente vanilla de usuarios

Desde la carpeta first-app, en PowerShell:

```powershell
pnpm start:vanilla
```

Abrir `http://127.0.0.1:3000`. El proceso escucha únicamente en la interfaz local; detenerlo con Ctrl+C. Requiere la base existente `src/db/users.sqlite` con el esquema actual. El arranque falla si no existe; no crea tablas, mueve datos ni migra la base.

1. Elegir un usuario por ID y nombre y pulsar «Entrar». La selección no requiere contraseña ni constituye autenticación.
2. El menú muestra ID, nombre y correo. «Volver» regresa a la lista; «Modificar usuario» abre la edición.
3. Editar nombre o correo y pulsar «Guardar». «Volver» descarta lo no guardado. «Eliminar usuario» solicita confirmación; cancelarla conserva el usuario y confirmarla vuelve a la lista sin selección.

Guardar o borrar actúa sobre la base abierta: para ensayos, usar exclusivamente una copia con usuarios ficticios. Las reglas y mensajes de la lógica existente se conservan.

Comprobaciones aisladas, sin importar la lógica de la base personal:

```powershell
node --test tests/vanilla-user-client.test.js
```

Estas pruebas crean copias temporales sin SQLite personal ni sus auxiliares. No sustituyen el recorrido de las tres pantallas en navegador.
