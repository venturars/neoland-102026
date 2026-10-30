---
name: check-status
description: Lee la rama, remoto, índice y cambios locales antes de seleccionar un momento del flujo de Git.
---

# Leer el estado

El orquestador la usa antes de elegir el momento. Desde la raíz del repositorio:

```powershell
& .\staff\jimena-duran\first-app\tools\check-status.ps1
```

Desde `first-app`, usa `& .\tools\check-status.ps1`. Las herramientas resuelven su propia ruta mediante `PSScriptRoot` y la raíz con Git; no cambies una ruta por otra de una persona distinta.

Devuelve el estado real de rama, upstream, índice, cambios sin preparar y archivos sin seguimiento. No hagas fetch ni alteres el índice. Un estado con conflictos, operación Git en curso, HEAD separado o error se informa al orquestador antes de continuar; no se resuelve automáticamente.
