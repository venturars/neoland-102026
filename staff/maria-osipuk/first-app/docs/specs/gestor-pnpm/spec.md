# Gestor pnpm

## Qué se pide

Por política de seguridad, el proyecto usa solo pnpm para instalar dependencias, ejecutar scripts y lanzar herramientas. La misma regla vale para las próximas funcionalidades.

No se usa npm ni npx. Tampoco yarn ni bun.

## Por qué pnpm

pnpm 10 no ejecuta los scripts de instalación de las dependencias hasta que se autorizan. Esos scripts son código de terceros y se lanzan al instalar. npm puede ejecutarlos en ese momento.

pnpm aísla cada paquete: solo puede usar lo que declaró. npm aplana `node_modules`, y un paquete puede acabar usando otro que nadie pidió de forma explícita.

Usar pnpm no sustituye la revisión. Antes de autorizar una dependencia hay que mirar qué instala y qué hace su script de instalación.

## A quién obliga

A quien trabaje en el proyecto: al añadir una dependencia, al instalar las que ya existen, al ejecutar un script o al lanzar una herramienta.

## La regla

- Instalar lo que ya está declarado: `pnpm install`.
- Añadir una dependencia: `pnpm add <paquete>`.
- Ejecutar un script: `pnpm run <script>`.
- Ejecutar una herramienta ya instalada: `pnpm exec`.
- Descargar una herramienta de forma temporal: `pnpm dlx`.
- El archivo de bloqueo que se conserva es el de pnpm. No se genera el de npm ni el de otro gestor.
- Si el comando es `npm` o `npx`, no se sigue. El proyecto tiene que impedirlo, no solo decirlo.

## Ejemplo correcto

```text
pnpm install
pnpm run test
```

## Ejemplo que no se sigue

```text
npm install
npx prettier
yarn add better-sqlite3
```

Esos comandos no son la forma de trabajar del proyecto. `npm install` tiene que terminar con error.

## Cómo se comprueba

- El proyecto declara pnpm 10 como gestor.
- Existe el archivo de bloqueo de pnpm y no existe el de npm.
- `pnpm install` termina sin error.
- `npm install` termina con error.
- La constitución describe esta regla y no presenta npm como gestor del proyecto.
