# Spec — buscar una persona por número

Das el número de una persona ya guardada. El producto enseña esa
persona (nombre, email y fechas) o dice que no existe, o que el
número no vale.

Es lo mismo que buscar por email: si está, la ves; si no, un aviso.
Aquí la clave es el número, no el correo.

No se crea ni se cambia a nadie. Solo se mira.

## Few-shot

- Hay una persona con número 1, Ada, ada@example.com → ves a Ada.
- Pides el número 99 y no hay nadie → no existe.
- No das un número de persona (falta o no es un número de 1 en
  adelante) → el número no vale.
