Issue: #993

# Tareas — actualizar el flujo de git con la plantilla del curso

1. Copia de `exercises/git-workflow-agent-template` estos ficheros, tal cual: `agents/create-pr.md`, `agents/git-workflow-agent.md`, `agents/help-me-to-think.md`, `skills/create-draft/SKILL.md`, `skills/grill-me/SKILL.md` y `skills/grill-with-docs/SKILL.md`.
   Al compararlos con la plantilla, son iguales.

2. Copia `skills/commit-changes/SKILL.md` y deja su comando en `staff/diego-torres/first-app/tools/commit-changes.sh`.
   Entra la regla del mensaje técnico. La única diferencia con la plantilla es la ruta.

3. Copia `skills/create-pr-base-staging/SKILL.md` y deja su comando en `staff/diego-torres/first-app/tools/create-pr-base-staging.sh`.
   Quita la frase para quien copia la plantilla.
   Las únicas diferencias con la plantilla son la ruta y esa frase.

4. Copia `tools/create-pr-base-staging.sh`.
   Queda con permiso de ejecución al subirlo, como los otros scripts.
   Sin argumentos responde con su uso y sale con error, sin crear nada.

5. Compara `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/` con la plantilla.
   Solo quedan las rutas de `tools/`, la frase quitada y `MCPS/socket-mcp`.

6. En `first-app`, lanza `pnpm lint`.
   Termina bien.
   `git status` no muestra cambios en `src/`.
