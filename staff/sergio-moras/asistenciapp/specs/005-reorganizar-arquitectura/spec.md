# Spec 005 · Ordenar documentos y código por responsabilidades

> Estado: **Implementada** (2026-11-01) · Creada: 2026-11-01 · Aprobada: 2026-11-01 · Issue: #726

---

## 1. Problema

**Documentos.** La constitución y el manual del agente están sueltos en la raíz, junto al código. No existe ningún documento que explique cómo está organizado el código ni cómo hay que escribir una función nueva, así que cada cambio depende de leer el código entero.

**Código.** La pieza que atiende las peticiones de la app hace a la vez tres trabajos distintos:

- decide si un registro vale (clase abierta, código vigente, nombre correcto);
- abre la base de datos y guarda o lee;
- prepara la respuesta para la pantalla del profesor o del alumno.

Por eso un cambio pequeño en una regla (por ejemplo, cuándo caduca un código) obliga a tocar el mismo sitio donde se guardan los datos y donde se responde a la pantalla, y las reglas no se pueden probar sin levantar la app.

**Constitución.** Si el código cambia de sitio, la constitución tiene que nombrar los sitios nuevos; si no, las reglas describen un proyecto que ya no existe.

---

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| **Quien trabaja en esta carpeta** | Saber dónde está cada cosa y cambiar una parte sin tener que tocar las demás. |
| **Agente de IA** | Tener por escrito cómo se organiza el código y cómo se escribe cada función. |
| **Profesor y alumnos** | Seguir pasando lista exactamente igual. |

---

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en esta carpeta, quiero los documentos de reglas en una carpeta propia, para separarlos del código.
- **HU-02**: Como quien trabaja en esta carpeta, quiero un documento que explique cómo está organizado el código, para saber dónde va cada cambio.
- **HU-03**: Como agente, quiero que el manual explique cómo se documenta una función (qué recibe, qué devuelve y un ejemplo), para escribir todas igual.
- **HU-04**: Como quien trabaja en esta carpeta, quiero que las reglas de pasar lista, el guardado y la atención a las pantallas vivan en partes separadas, para cambiar una sin romper las otras.
- **HU-05**: Como profesor o alumno, quiero que pasar lista funcione igual que antes, para no notar el cambio.

---

## 4. Criterios de aceptación

### Documentos (HU-01, HU-02, HU-03)

- **CA-01**: **Dado** el proyecto, **cuando** se busca la constitución, **entonces** está en `docs/CONSTITUTION.md` y no en la raíz.
- **CA-02**: **Dado** `docs/ARCHITECTURE.md`, **cuando** se lee, **entonces** explica qué partes tiene el código, qué fichero va en cada una y qué puede llamar cada parte; y dice qué cosas del ejemplo de referencia no se usan aquí por no hacer falta.
- **CA-03**: **Dado** la raíz, **cuando** se busca el manual del agente, **entonces** se llama `AGENTS.md` (ya no existe `AGENT.md`) y, además del día a día, explica cómo se documenta una función: qué recibe, qué devuelve, de qué tipo y un ejemplo de uso.
- **CA-04**: **Dado** el README y `AGENTS.md`, **cuando** se siguen sus enlaces a la constitución y al manual, **entonces** llevan al fichero en su sitio nuevo.

### Código (HU-04)

- **CA-05**: **Dado** la parte que decide si un registro vale, **cuando** se lee, **entonces** no abre la base de datos ni prepara respuestas para las pantallas, y se puede probar sola.
- **CA-06**: **Dado** la parte que guarda y lee los datos, **cuando** se lee, **entonces** no decide reglas de pasar lista ni prepara respuestas para las pantallas.
- **CA-07**: **Dado** la parte que atiende las pantallas, **cuando** se lee, **entonces** no abre la base de datos ni decide reglas: pide cada acción a otra parte y traduce el resultado a una respuesta.

### Lo que no cambia (HU-05)

- **CA-08**: **Dado** una clase, **cuando** el profesor la abre, los alumnos se registran, el profesor quita un registro, exporta la lista y la cierra, **entonces** las respuestas y los mensajes son los mismos que antes del cambio.
- **CA-09**: **Dado** la demo de hack ético de esta carpeta, **cuando** se lanza contra la app, **entonces** sigue funcionando sin cambios, porque la app responde igual que antes.

### Constitución

- **CA-10**: **Dado** la constitución, **cuando** nombra carpetas o ficheros, **entonces** coinciden con la organización nueva. Su propósito, sus principios y las reglas de pasar lista no cambian, y la enmienda queda en el historial con su versión.

---

## 5. Fuera de alcance

- Funcionalidades nuevas de pasar lista.
- Dependencias o herramientas que la app no usa hoy.
- Cambiar las pantallas.
- Reescribir las specs `001` a `004`; conservan los nombres de fichero que tenían cuando se escribieron.
- Mejorar la demo de hack ético.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 0.1 | 2026-11-01 | Borrador |
| 1.0 | 2026-11-01 | Aprobada |
| 1.1 | 2026-11-01 | Implementada: T01–T13, 108 tests en verde y demo de hack ético comprobada contra la app |
