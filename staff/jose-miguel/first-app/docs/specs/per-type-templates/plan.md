# Plan · Plantillas por tipo en el flujo git

Issue: #733

## Enfoque

Copiar `templates/` desde el ejercicio. Sustituir el texto de `agents/create-issue.md`, `agents/create-pr.md` y `agents/create-branch.md` por el del ejercicio post-plantillas por tipo. Alinear skills `create-issue`, `create-pr-base-staging`, `link-pr-to-issue`, `create-branch` y `create-branch-from-staging` (manteniendo rutas `staff/jose-miguel/first-app/tools/` en las de terminal).

Actualizar en `docs/ARCHITECTURE.md` las entradas de `templates/`. No hay paquetes Node ni validación Socket.

## Comprobación

| CA | Cómo |
| --- | --- |
| 1–3 | Listar `templates/issues/` y `templates/pull-request/` |
| 4 | Buscar cadenas prohibidas fuera de `templates/` |
| 5 | Comparar bytes con el ejercicio |
| 6 | Leer agents y skills citados |
| 7 | Diff vacío en `src/` y `package.json` |

## Validación Socket

No aplica: este cambio no añade ni cambia paquetes de Node.
