# Probar Express con Bruno

La colección comprueba las cinco operaciones CRUD de Express, sus errores y la
conservación de datos. Necesita Node compatible con `node:sqlite` y pnpm.

## Preparar una copia de prueba

Desde `first-app-ai`, crea una copia sin bases de datos ni dependencias instaladas:

```sh
bruno_copy=$(mktemp -d "${TMPDIR:-/tmp}/first-app-bruno.XXXXXX")
rsync -a --exclude=node_modules --exclude=.venv --exclude=dist \
  --exclude='*.sqlite*' ./ "$bruno_copy/"
cd "$bruno_copy"
pnpm install --frozen-lockfile --ignore-scripts
pwd
```

Usa la ruta que muestra `pwd` en las otras terminales. Los puertos 3000 y 3001
deben estar libres: si otra instancia los ocupa, detén esa instancia o realiza
las pruebas cuando estén disponibles.

En la primera terminal, desde la copia:

```sh
pnpm server
```

En otra terminal, desde la misma copia, inicializa la tabla y arranca Express:

```sh
sh src/clients/terminal/create-users-table.txt
pnpm http
```

## Base en marcha

En una tercera terminal, desde la copia:

```sh
pnpm bruno
```

Se ejecutan 30 peticiones en orden. La primera comprueba que la tabla esté vacía;
`--bail` detiene el recorrido ante un fallo. La colección crea Ada y Grace,
comprueba consultas, edición parcial, rechazos y conservación de fechas, y elimina
sus contactos de prueba. Un recorrido correcto termina con lista vacía y puede
repetirse aunque los IDs hayan aumentado.

El resumen muestra las peticiones y pruebas que pasan o fallan. Una prueba
fallida termina con código distinto de cero. Corrige su causa antes de repetir;
si el recorrido quedó a medias, prepara una copia nueva para volver a empezar
con la tabla vacía.

## Base detenida

Detén con Ctrl+C solo `pnpm server`, dejando Express abierto. Desde la copia:

```sh
cd src/clients/http/bruno
../../../../node_modules/.bin/bru run 02-sql-offline -r --bail
```

Las cinco peticiones deben recibir `500` con el mensaje de su operación.
Las respuestas esperadas cuentan como pruebas correctas; una conexión rechazada
al puerto de Express indica que también se detuvo la API.

## Terminar

Detén Express con Ctrl+C y cualquier proceso de datos que hayas reiniciado.
Elimina únicamente la carpeta temporal de prueba, cuya ruta obtuviste con `pwd`.
Los contactos de tu proyecto original permanecen intactos.
