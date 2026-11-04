# Spec: Validar paquetes de Node con Socket

Issue: #698.

## Qué queremos conseguir
Que quien acepta un plan sepa si un paquete de Node es de fiar antes de añadirlo o de cambiarle la versión. La comprobación se hace con Socket y su resumen va en el plan.

## Cómo se usa
- Un plan añade un paquete de Node o cambia su versión.
- Antes de aceptar el plan, se comprueba con Socket el paquete, su versión exacta y sus dependencias hasta 3 capas.
- El resumen va en el plan. Para el paquete y para cada dependencia dice tres cosas, cada una con su fuente:
  - si alguna puntuación baja de 50;
  - si esa versión tiene una alerta;
  - si esa versión está en una campaña de ataque.
- Si una fuente no se puede consultar, el resumen dice el motivo. No escribe que no hay nada sin haberlo consultado.
- Quien acepta el plan decide si acepta las alertas.

## Ejemplo
Se añade `cli-table3` `0.6.5`. Sus dependencias son `string-width`, `@colors/colors`, `strip-ansi`, `emoji-regex`, `is-fullwidth-code-point` y `ansi-regex`.
- Ninguna puntuación baja de 50.
- La lista de alertas abiertas de la organización está vacía. El resumen lo dice así: es la lista de la organización, no garantiza que esa versión no tenga alertas.
- La campaña no se lee: la cuenta tiene el plan free, que no incluye esa fuente. El resumen dice ese motivo.

La persona decide con eso escrito.

## Reglas de negocio
- `docs/CONSTITUTIONS.md` dice que un paquete nuevo o un cambio de versión se valida con Socket.
- `AGENTS.md` dice cómo: qué entra, qué fuentes se consultan y qué va en el plan.
- `MCPS/socket-mcp/` dice cómo se conecta y se consulta Socket.

## Fuera de alcance
- Paquetes que no son de Node.
- Un paquete cuya versión no cambia.
- Mirar más de 3 capas.
- Decidir las alertas por la persona.
- Contratar un plan de Socket que incluya las campañas.
