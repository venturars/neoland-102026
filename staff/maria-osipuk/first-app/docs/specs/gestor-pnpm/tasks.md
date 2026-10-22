# Gestor pnpm

## 1. Activar pnpm 10

Con Node 24, activar pnpm 10 mediante corepack.
Ejecutar `pnpm -v` y anotar la versión exacta, con la forma `10.x.x`.
No instalar dependencias del proyecto en este paso.
Si `pnpm -v` no es una versión 10, no se sigue.

## 2. Declarar pnpm en el paquete

Abrir `package.json`.
Añadir `packageManager` con `pnpm@` y la versión anotada.
Añadir el script `preinstall` descrito en `docs/specs/gestor-pnpm/plan.md`.
No añadir dependencias. Guardar el archivo.

## 3. Crear el archivo de bloqueo

En la raíz de `first-app`, ejecutar `pnpm install`.
Comprobar que aparece `pnpm-lock.yaml` y que el comando termina sin error.
Comprobar que no aparece `package-lock.json`. Si aparece, borrarlo.
Dejar `pnpm-lock.yaml` en el proyecto.

## 4. Actualizar la constitución

Abrir `docs/CONSTITUTION.md`.
Añadir `pnpm-lock.yaml` al árbol, junto a `package.json`.
Escribir «Gestión de dependencias» con la regla de `docs/specs/gestor-pnpm/spec.md`.
La sección nombra pnpm y prohíbe `npm` y `npx`. No presenta npm como gestor.

## 5. Comprobar

Ejecutar `pnpm -v` y ver una versión 10.
Confirmar que `pnpm-lock.yaml` existe y que `package-lock.json` no existe.
Ejecutar `npm install` y ver que termina con error.
Leer la constitución y ver que la regla y el árbol coinciden con esos archivos.
