# Plan · Validación de paquetes con Socket

> Estado: **Aprobado** (2026-10-27) · Spec: [spec.md](spec.md) v1.0 · Issue: #492

## 1. Visión

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`, ni firma ni SQL. Solo documentación: la constitución exige Socket; el procedimiento concreto va en `AGENTS.md`.

La consulta usa el MCP `socket-mcp` del bootcamp ([`MCP.md`](../../../../../MCP.md) en la raíz del repo; en Cursor el namespace es `user-socket`).

## 2. Ficheros

| Acción | Fichero |
| --- | --- |
| Tocar | `docs/CONSTITUTIONS.md` |
| Tocar | `AGENTS.md` |
| Crear | esta carpeta `specs/socket-package-validation/` |

No se tocan `package.json`, `pnpm-lock.yaml`, el código, ni el `AGENTS.md` de la raíz del repositorio.

## 3. Constitución

Añadir la sección `## 8. Paquetes` al final de `docs/CONSTITUTIONS.md`, con este texto (o equivalente corto):

Un paquete de Node nuevo, o un cambio de su versión, se valida con Socket. El procedimiento concreto está en `AGENTS.md`.

No detallar herramientas MCP, capas ni tablas en la constitución.

## 4. AGENTS.md

Añadir la sección `## Paquetes` después de `## Reglas` y antes de `## Al terminar cualquier tarea`, con el procedimiento:

### Cuándo

Antes de dar por aceptado un `plan.md` que añade un paquete de Node o cambia su versión en `package.json`. También antes de ejecutar `tasks.md` que incluya ese cambio si el plan aún no trae el resumen.

### Qué se revisa

Ecosistema `npm`. Paquete principal con la versión exacta del plan. Dependencias hasta **3 capas**, cada una con versión concreta (no rangos en el resumen).

Árbol: `pnpm view <paquete>@<versión> dependencies`, y repetir por cada dependencia nueva hasta la tercera capa. Si un `name@version` ya salió, no se vuelve a consultar.

### MCP Socket

1. Si el MCP no responde o pide autenticación, usar `mcp_auth` y reintentar. Si sigue fallando, no se acepta el plan ni se inventa el resumen.
2. Llamar a `organizations` y guardar `org_slug`.
3. Por cada `depname@version` del árbol (capa 0 = directo, 1–3 = dependencias):
   - **`depscore`**: `ecosystem` `npm`, `depname`, `version`. Marcar **stat < 50** si cualquier puntuación numérica es menor que 50.
   - **`alerts`**: `org_slug`, `artifact_type` `npm`, `artifact_name` = `depname`, `status` `open`. Filtrar a esa versión si la respuesta lo permite.
   - **`threat_feed`**: `org_slug`, `ecosystem` `npm`, `name`, `version`. Coincidencia = campaña.
4. **Alertas**: comentarlas en la conversación (paquete, versión, tipo/categoría, severidad). Parar hasta que la persona diga si las acepta.
5. **Resumen**: sección `## Validación Socket` en el `plan.md` del desarrollo **antes** de aceptarlo. Columnas: capa, paquete@versión, campaña (sí/no), alertas (sí/no; detalle en conversación), stats < 50 (cuáles o «ninguna»).

Fuera: no Node; versión que no cambia; más de 3 capas; decidir alertas sin la persona; sustituir el MCP Socket por otras herramientas.

## 5. Plantilla de resumen

```markdown
## Validación Socket

| Capa | Paquete@versión | Campaña | Alertas | Stats < 50 |
| --- | --- | --- | --- | --- |
| 0 | ejemplo@1.0.0 | no | no | ninguna |

Alertas comentadas en conversación: (ninguna / listar).
Decisión humana sobre alertas: (pendiente / aceptadas / rechazadas).
```

Este desarrollo de docs no cambia dependencias: no rellena la plantilla con datos reales.

## 6. Comprobación

| CA | Cómo |
| --- | --- |
| CA-01–CA-06 | Quedan como reglas en `AGENTS.md` para planes futuros |
| CA-07 | CONSTITUTIONS tiene la obligación; AGENTS tiene el cómo; el cómo no está duplicado en la constitución |
