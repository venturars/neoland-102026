---
name: assign-reviewers
description: "Asigna los revisores que nombra el alumno a la pull request y la saca de draft. Úsala en el momento «que la revisen»."
---

### Herramienta: ASSIGN_REVIEWERS

* **Descripción**: Úsala cuando el alumno nombra a quienes tienen que mirar la pull request. Resuelve el login dentro de este repositorio, asigna esos logins y sácala de draft. No la uses para asignar al autor.
* **MCP**: El servidor MCP `github`, declarado en `apm.yml`. No uses `gh` ni un script.

#### Especificación de Argumentos

1. **Pull request** *(Obligatorio)*: El número o la URL.
2. **Revisores** *(Obligatorio)*: Los nombres que dijo el alumno, separados por comas.

#### Reglas de Invocación Críticas

* **Login**: Cada nombre se resuelve dentro de este repositorio. Primero un colaborador cuyo login o nombre coincida. Si no coincide, el login de quien hace commits aquí con ese nombre o ese correo. No elijas un usuario público que no colabora.
* **Si no hay login de colaborador**: Dilo y no pidas la revisión de ese nombre.
* **Procesamiento de respuestas**: Quita al autor de la lista si aparece. Deja la pull request lista para revisión. Si el MCP falla, comunica el error y no marques la revisión como pedida.
