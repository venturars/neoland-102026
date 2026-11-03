# Estilo de código

El código nuevo y las partes modificadas se mantienen en un nivel junior: sencillo, explícito y lineal. Deben poder leerse y explicarse con conocimientos iniciales de programación. Una solución más larga es preferible si resulta más fácil de comprender.

## 1. Forma del código

- Usa el menor número de conceptos necesario y evita abstracciones prematuras. Generaliza cuando exista un segundo caso real.
- Valida y transforma los datos en pasos visibles.
- Escribe el caso principal de arriba abajo y termina pronto los casos de error.
- Usa nombres descriptivos y completos, como `showLiveClassroom` o `isSessionOpen`. Solo se admiten abreviaturas habituales, como `id`.
- Cada función tiene una responsabilidad y coordina pasos con nombre.
- Evita trucos de una línea, anidación profunda y ayudantes genéricos.
- No dupliques reglas, no conviertas valores inválidos silenciosamente y no crees funciones que solo trasladen otra llamada sin aportar una responsabilidad.

La interfaz, los errores, la documentación y las specs se escriben en español. Los nombres técnicos pueden estar en inglés. Los comentarios nuevos siguen el apartado siguiente.

## 2. Tipos y docstrings en Python

Los parámetros y resultados llevan anotaciones de tipo. El docstring explica los parámetros con `:param`, el resultado con `:return` y `:rtype`, y las excepciones de su contrato con `:raises` cuando existan.

Puede añadirse un ejemplo breve en `Usage::`. No inventes una excepción ni un valor devuelto para completar una etiqueta; documenta el contrato real.

## 3. Comentarios educativos

Escribe comentarios en inglés sencillo, con frases completas, cuando expliquen algo que el código no muestra por sí solo:

- una decisión y su motivo;
- un límite o caso especial;
- una regla de negocio, privacidad o seguridad;
- una entrada, salida o error importante;
- el orden necesario entre dos pasos.

```js
// Keep the first load silent so existing students are not announced as new arrivals.
```

Si un nombre más claro evita el comentario, mejora el nombre. No añadas comentarios que solo traduzcan la línea siguiente ni modifiques código antiguo únicamente para añadirlos.

## 4. Presentación y accesibilidad

Utiliza HTML semántico y etiquetas `<label>` asociadas a los controles de formulario. Comprueba el contraste y la navegación con teclado.

Verifica las pantallas en un ancho móvil de referencia de unos 400 px. Una comprobación visual no sustituye las reglas de datos del servidor.
