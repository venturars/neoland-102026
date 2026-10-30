---
name: grill-me
description: Formula una pregunta de producto cuando la petición o los documentos no permiten definir una tarea concreta.
---

# Aclarar la intención

La invoca `agents/help-me-to-think.md`. Toma la petición y las respuestas ya recibidas. Devuelve al orquestador una pregunta cada vez sobre el comportamiento que falta decidir; ofrece opciones breves cuando ayuden. No inventes la respuesta ni detalles técnicos.

Cuando la tarea esté clara, devuelve un resumen con qué hay que hacer y cómo se sabrá que está hecho. No crees issue, spec, rama ni código. El orquestador mantiene la conversación con Jimena y elige el siguiente momento.
