# My First App en Jupyter

## Notebook del cliente Node HTTP

Desde first-app, abrir tres terminales PowerShell para el servidor SQL,
el cliente HTTP y los cinco notebooks, respectivamente:

```powershell
pnpm server
pnpm node-http
pnpm jupyter-node-http
```

`node-http` escucha en `http://127.0.0.1:3004`; SQL conserva 3000.
`jupyter-node-http` requiere el `sh` de Git Bash disponible en PATH.
Si esta terminal no lo encuentra, usar la carpeta real de la instalación
de Git Bash solo en el PATH de esta sesión, por ejemplo:

```powershell
$env:Path = 'E:/Desarrollos/Git/Git/bin;' + $env:Path
pnpm jupyter-node-http
```

El script resuelve first-app desde su propia ubicación, reutiliza o crea
`.venv`, comprueba Notebook exactamente 7.6.3 y lo instala ahí únicamente
si falta o difiere. No instala paquetes Node ni modifica Python global.
Abre `src/clients/node-http/jupyter/` en Notebook con el kernel
**Python 3 (ipykernel)**; los procesos heredan UTF-8.

Con una copia de ensayo y lista vacía, ejecutar en orden `create-user`,
`list-users`, `find-user-by-id`, `update-user` y `delete-user`.
Se crea Ada, se reutiliza su ID real y se cambia solo su nombre a Ada
Lovelace conservando email. El borrado responde 204 sin contenido.
Los notebooks muestran el estado y resultado HTTP mediante Node `fetch`,
sin importar logic. Sus anotaciones incluyen errores actuales y SQL
detenido; mantener el cliente HTTP abierto al detener solo el SQL propio
para comprobar los cinco mensajes 500. No usar datos personales para
ese ensayo. Al terminar, cerrar únicamente los procesos propios.

El arranque JupyterLab y los nueve notebooks actuales se conservan como
se documenta a continuación; no utilizan este nuevo comando.

Abre un documento, selecciona su celda y pulsa **▶** o **Shift+Enter**.
La acción se ejecuta y muestra una tabla con encabezados cian. No hay que
escribir código ni rellenar formularios.

## Servidor SQL

Antes de ejecutar celdas, iniciar el servidor desde first-app en otra terminal:

```powershell
node src/db/server.js
```

El script `pnpm server` es equivalente si pnpm está disponible. Los notebooks de usuarios ejecutan Node con await e importan logic directamente; el de preparar la tabla importa queries. El acceso a datos pasa por `http://127.0.0.1:3000/execute`. No abren SQLite ni llaman a otro cliente. Mantener el servidor abierto durante el recorrido y detener el proceso propio con Ctrl+C al terminar.

Los nueve notebooks comparten la base de ese servidor. Reejecutar un listado muestra las escrituras realizadas desde otro cliente; una salida guardada no se actualiza automáticamente. Para comprobaciones, utilizar únicamente un servidor y usuarios ficticios de la misma copia desechable.

## Abrir

Antes de ejecutar celdas en un checkout actualizado, comprueba el [traslado manual de SQLite](DATABASE.md#conservar-la-base-al-actualizar-un-checkout). Git no mueve la base ignorada de `db/` a `src/db/`.

Desde `staff/jimena-duran/first-app`:

```powershell
python -m jupyterlab src/clients/jupyter --ServerApp.ip=127.0.0.1 --port=8899 --IdentityProvider.token= --PasswordIdentityProvider.hashed_password=
```

Desde `staff/jimena-duran/first-app/src`, el mismo arranque usa:

```powershell
python -m jupyterlab clients/jupyter --ServerApp.ip=127.0.0.1 --port=8899 --IdentityProvider.token= --PasswordIdentityProvider.hashed_password=
```

Los nueve notebooks localizan exclusivamente `staff/jimena-duran/first-app/src` de este checkout. Pueden ejecutarse con el kernel iniciado desde first-app, src o la carpeta de los notebooks; una carpeta `logic/` de otro alumno no identifica esta aplicación.

Abre `http://127.0.0.1:8899/lab`. Esta demo local no pide token ni contraseña
y solo admite conexiones desde este equipo. Si otra persona la prueba en su
ordenador, ejecuta el mismo comando en su copia del proyecto.

Selecciona Python 3 (ipykernel). Se utilizan el Jupyter ya instalado, Node.js
con node:sqlite y las dependencias habituales de la app. No se añaden paquetes.
Si falta la dependencia de Node, quien prepara la demo ejecuta previamente
`pnpm install --frozen-lockfile` desde first-app.

## Recorrido

1. `create-users-table.ipynb`: preparar la tabla y mostrar sus nombres mediante createUsersTable/listTables, sin borrar usuarios.
2. `create-user.ipynb`: crear a Jimena Demo con demo.jimena.jupyter@example.com.
3. `list-users.ipynb`: listar los usuarios.
4. `find-user-by-id.ipynb`: buscar al usuario de demo por su ID real.
5. `find-user-by-email.ipynb`: buscar por su correo.
6. `find-user-by-name.ipynb`: buscar las coincidencias exactas de Jimena Demo.
7. `update-user.ipynb`: cambiar su nombre a Jimena Demo Actualizada.
8. `users-gender-count.ipynb`: mostrar los tres totales si Ollama y llama3.2 están preparados.
9. `delete-user.ipynb`: eliminar al usuario de demo.

Las acciones de escritura cambian los datos reales de esta app. Las de actualizar
y eliminar localizan el registro de demo por su correo; no usan un ID arbitrario.
Si ese correo ya estaba registrado antes de la demo, quien la prepara debe
comprobar que corresponde al registro destinado al recorrido antes de ejecutarlo.

Repetir el alta sin eliminar el registro muestra Email is already used.
Buscar, actualizar o eliminar antes de crearlo muestra User not found.
Las búsquedas sin coincidencias muestran No hay filas. No se inventan resultados.

El recuento necesita el Ollama y llama3.2 de la app. Sin modelo muestra
Could not classify the users. La estimación por nombre no se guarda en los datos.
No se descarga el modelo automáticamente. Espera a que termine la celda
antes de repetirla; no ejecutes escrituras de varios notebooks a la vez.
