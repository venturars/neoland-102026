---
name: github-cache
description: Reutilizar alias y datos públicos de colaboradores al resolver revisores de una PR.
---

# Caché de GitHub

Requiere Node 20+, Git y `gh` autenticado; respeta `GH_HOST`. La herramienta identifica la cuenta activa para aislar sus datos.

Desde la raíz Git, ejecutar `node staff/miguel-rodriguez/first-app-ai/tools/github-cache.mjs` con los siguientes comandos.

## Alias

Consultar primero la caché con `alias get OWNER/REPO "NOMBRE"...`. Si devuelve un login, reutilizarlo sin buscar de nuevo la identidad del revisor en GitHub. Resolver solo los `null` mediante el directorio y los perfiles; si no basta, comprobar autoría de commits del repositorio sin guardar correos.

Guardar coincidencias inequívocas con `alias set OWNER/REPO "NOMBRE" LOGIN`. Para corregirlas, añadir `--replace`; para olvidarlas, usar `alias remove OWNER/REPO "NOMBRE"`. Pedir aclaración ante ambigüedad.

## Colaboradores

Usar primero `directory OWNER/REPO`, que reutiliza el directorio local vigente. GitHub solo se consulta si falta, ha caducado o se pide `--refresh`. Ante una ausencia inesperada, refrescar con ETag: `304` conserva los datos y `200` los actualiza.

## Perfiles

Usar primero `profile OWNER/REPO LOGIN`, que reutiliza el nombre público guardado. GitHub solo se consulta si falta, ha caducado o se pide `--refresh`, usando ETag cuando existe una respuesta vigente.

## Caducidad y fallos

El archivo local ignorado se crea vacío; todos sus datos vencen a las 48 horas y se borran al siguiente acceso. No hay catálogo fijo. `cacheAvailable: false` indica que se continúa sin persistencia.

Un fallo de GitHub no confirma una identidad. Los permisos para revisar se comprueban en vivo mediante `assign-reviewers`.
