# first-app

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
