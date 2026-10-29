---
name: assign-reviewers
description: "Asigna los revisores que nombra el alumno a la pull request y la saca de draft. Úsala en el momento «que la revisen»."
---

### Herramienta: ASSIGN_REVIEWERS

* **Descripción**: Úsala cuando el alumno nombra a quienes tienen que mirar la pull request. Asigna esos nombres y sácala de draft. No la uses para asignar al autor.
* **MCP**: El servidor MCP `github`, declarado en `apm.yml`. No uses `gh` ni un script.

#### Especificación de Argumentos

1. **Pull request** *(Obligatorio)*: El número o la URL.
2. **Revisores** *(Obligatorio)*: Los nombres que dijo el alumno, separados por comas.

#### Reglas de Invocación Críticas

* **Procesamiento de respuestas**: Quita al autor de la lista si aparece. Deja la pull request lista para revisión. Si el MCP falla, comunica el error y no marques la revisión como pedida.
