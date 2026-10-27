# Tareas — validar paquetes de Node con Socket

1. Abre [docs/CONSTITUTIONS.md](../../CONSTITUTIONS.md).
   Añade `## Paquetes` después de `## Specs` y antes de `## Base de datos`.
   El texto es el de la constitución en el plan.
   El procedimiento no está en esa sección.

2. Abre [AGENTS.MD](../../../AGENTS.MD).
   Añade `## Paquetes` después de `## Reglas` y antes de `## Comandos`.
   El texto es el de `AGENTS.MD` en el plan (cuándo, qué se revisa, MCP Socket, fuera).
   No se toca el `AGENTS.md` de la raíz del repositorio.

3. Comprueba los dos textos.
   La constitución solo dice que el paquete se valida con Socket y que el cómo está en `AGENTS.MD`.
   `AGENTS.MD` dice campaña, alerta, stats por debajo de 50, 3 capas, alertas comentadas, resumen `## Validación Socket` en el plan y herramientas MCP del plan.
   `package.json`, `pnpm-lock.yaml` y el código no cambian.
