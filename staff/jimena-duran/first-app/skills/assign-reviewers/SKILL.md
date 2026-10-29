---
name: assign-reviewers
description: Solicita revisión a las personas nombradas por Jimena y saca una PR de draft solo cuando ella pide que la revisen.
---

# Pedir revisión

La ejecuta el orquestador cuando Jimena nombra a quienes deben revisar una PR existente. No inventes nombres. Comprueba que las cuentas existen, tienen acceso al repositorio y no son la autora. Si una identidad o permiso no puede verificarse, pregunta antes de asignar; no pruebes permisos mediante escrituras.

Lee la PR, base staging y revisores actuales. Comprueba identidad `jiji-mena`; prefiere MCP si corresponde a esa cuenta y ofrece las operaciones. En caso contrario informa del motivo y usa `gh` autenticado como Jimena. Preserva revisores ya asignados y solicita solo los que falten.

Alternativa PowerShell, por cada login validado: `gh pr edit $number --repo $repository --add-reviewer $reviewerLogin`. Comprueba `$LASTEXITCODE` tras cada llamada. Cuando las asignaciones hayan terminado correctamente y Jimena haya pedido revisión, ejecuta `gh pr ready $number --repo $repository` solo si aún es draft; comprueba también su salida.

Relee lista de revisores y estado draft. Devuelve resultados reales y cualquier paso pendiente. Si una operación falla, informa antes de resolver; no sigas publicando la revisión a pesar del fallo. No hace merge, push ni abre PR. Si esta entrega prohíbe PR, no ejecutes el paso para probarlo.

En los comandos, `$repository` es el repositorio `owner/name` comprobado a partir de origin y del contexto de esta tarea. No lo tomes de un nombre personal fijo ni actúes sobre otro repositorio.
