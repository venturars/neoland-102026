# Spec 009 · Un AGENTS.md más simple

> Estado: **Implementada (2026-10-29)** · Creada: 2026-10-29 · Aprobada: 2026-10-29

---

## 1. Problema

`AGENTS.md` repite cosas que ya tienen su sitio. La estructura de carpetas es arquitectura y debería estar en `docs/ARCHITECTURE.md`. Los comandos para preparar y arrancar la app son para personas y deberían estar en el `README.md`. Las reglas de comportamiento y el párrafo de presentación alargan el archivo sin decir cómo se trabaja.

Además, la frase que dice qué hacer cuando una petición contradice la constitución («**para y avisa** antes de escribir nada») no deja claro qué hay que parar, a quién avisar ni qué decir.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **El agente de IA** | Un `AGENTS.md` corto que solo diga cómo se trabaja, y una instrucción clara cuando algo choca con la constitución. |
| **La persona que trabaja en esta carpeta** | Encontrar cada cosa en un solo sitio: la estructura en la arquitectura y los comandos en el README. |

---

## 3. Historias de usuario

- **HU-01**: Como agente de IA, quiero que `AGENTS.md` empiece directamente por lo que tengo que leer, sin párrafo de presentación.
- **HU-02**: Como agente de IA, quiero una frase clara sobre qué hacer si lo que me piden contradice la constitución, para no dudar.
- **HU-03**: Como persona que trabaja en esta carpeta, quiero la estructura de carpetas en `docs/ARCHITECTURE.md`, junto al resto de la organización del código.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero todos los comandos en el `README.md`, sin repetirlos en `AGENTS.md`.
- **HU-05**: Como agente de IA, quiero que `AGENTS.md` no tenga la sección de reglas de comportamiento.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Sin presentación (HU-01)

- **CA-01**: **Dado** `AGENTS.md`, **cuando** se lee desde el principio, **entonces** después del título no está el párrafo que presentaba la constitución, la arquitectura y este archivo (las antiguas líneas 3 y 4).

### La frase de la constitución (HU-02)

- **CA-02**: **Dado** `AGENTS.md`, **cuando** se lee qué hacer si una petición contradice la constitución, **entonces** la frase dice, en palabras sencillas, que el agente no cambia ningún fichero, le cuenta a la persona que trabaja en esta carpeta qué regla choca con la petición y espera su respuesta.

### Estructura de carpetas (HU-03)

- **CA-03**: **Dado** `AGENTS.md`, **cuando** se busca la sección «Estructura de carpetas», **entonces** no está.
- **CA-04**: **Dado** `docs/ARCHITECTURE.md`, **cuando** se lee, **entonces** contiene la estructura de carpetas de la app y la regla de cómo se numeran y nombran las specs.

### Comandos (HU-04)

- **CA-05**: **Dado** `AGENTS.md`, **cuando** se busca la sección «Comandos», **entonces** no está.
- **CA-06**: **Dado** el `README.md`, **cuando** se compara con la antigua tabla de comandos de `AGENTS.md`, **entonces** cada comando y cada dato de esa tabla está en el README. Lo que ya estaba no se repite.

### Reglas de comportamiento (HU-05)

- **CA-07**: **Dado** `AGENTS.md`, **cuando** se busca la sección «Reglas de comportamiento», **entonces** no está.

### Lo que no cambia

- **CA-08**: **Dado** `AGENTS.md`, **cuando** se leen la lectura obligatoria, el flujo SDD, las normas de escritura del código, la definición de «terminado» y el estado actual, **entonces** dicen lo mismo que antes. Solo cambian la frase de CA-02 y las referencias a secciones que se mueven o desaparecen.
- **CA-09**: **Dado** el conjunto de tests, **cuando** se ejecuta, **entonces** pasa en verde.

### Numeración

- **CA-10**: **Dado** `AGENTS.md` sin las secciones 3, 4 y 5, **cuando** se leen sus títulos, **entonces** van seguidos del 1 al 5: las normas de escritura son la 3, «terminado» la 4 y el estado actual la 5. Toda referencia de `AGENTS.md` a sus propias secciones, y la de la tarea abierta T32 de la spec 007, apunta al número nuevo.

---

## 5. Fuera de alcance

- Cambiar la constitución.
- La comprobación de la constitución de «2.2 Planificar» (se quitó de la issue #565).
- Cambiar el comportamiento de la app.
- Editar las specs 001–008. Sus menciones a secciones de `AGENTS.md` quedan como historia. La única excepción es la tarea abierta T32 de la spec 007 (CA-10), porque todavía se va a ejecutar.

---

## 6. Preguntas abiertas

Ninguna. Las secciones que quedan se renumeran (decisión del 2026-10-29). Ver CA-10.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-29 | Borrador inicial | La issue #565 pide simplificar `AGENTS.md` y mover sus secciones a su documento. |
| 1.0 | 2026-10-29 | Aprobada. Se renumeran las secciones (CA-10) | Ok de la persona que trabaja en esta carpeta; respuesta a la pregunta abierta |
| 1.1 | 2026-10-29 | Implementada | Verificado con el plan §3 (CA-01…10) y 295 tests en verde |
