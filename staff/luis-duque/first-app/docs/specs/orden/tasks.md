# Tareas — un solo gestor de paquetes

Este desarrollo ya está aplicado. Cada paso comprueba el resultado.

1. Abre `package.json` en `first-app`.
   El campo `packageManager` queda en `pnpm@12.15.0`.
   `openai` sigue en `7.39.0`.
   Ese campo se puede leer.

2. Abre la carpeta `first-app`.
   `pnpm-lock.yaml` está al lado de `package.json`.
   No está `package-lock.json` ni `yarn.lock`.
   El lock no se edita a mano.

3. Abre `AGENTS.MD`.
   Dice que el gestor es pnpm `12.15.0`, en `packageManager`.
   Dice que se instala con pnpm desde `first-app`.
   Dice que no se use npm ni yarn.

4. Abre `docs/CONSTITUTIONS.MD`.
   La introducción dice que `package.json` declara pnpm `12.15.0`.
   Dice que pnpm escribe `pnpm-lock.yaml`.
   Se lee y coincide con `package.json`.
