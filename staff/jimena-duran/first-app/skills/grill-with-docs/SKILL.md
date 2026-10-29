---
name: grill-with-docs
description: Aclara una tarea de first-app consultando sus documentos antes de dejarla escrita.
---

# Pensar una tarea de la aplicación

La invoca `agents/help-me-to-think.md`. Lee las guías del proyecto y la petición. Distingue lo que los documentos responden de lo que Jimena tiene que decidir. No conviertas la carpeta nombrada en requisitos adicionales.

Devuelve al orquestador una sola pregunta concreta, o un resumen de qué se pide y cómo se comprueba. El orquestador pregunta a Jimena y devuelve la respuesta al agente. No esperes una respuesta en el hilo del subagente. No escribas spec, issue ni código y no ejecutes Git.

Si queda una decisión que el repositorio no puede responder, indica que corresponde continuar con `skills/grill-me/SKILL.md`.
