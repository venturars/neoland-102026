# Spec 679 · Formato de specs e historial

> Estado: **Implementada** (2026-10-30) · Creada: 2026-10-30 · Tipo: **proceso**

Issue: #679.

---

## 1. Problema

1. **Los números de spec pueden repetirse.** Se numeran con tres dígitos seguidos. Si dos ramas abren una spec a la vez, las dos cogen el mismo número.
2. **Leer todas las specs cuesta cada vez más.** Cada spec nueva suma lectura para quien empieza una tarea, y no hay forma de condensar las antiguas.
3. **La historia está repartida.** El estado de cada spec vive en una tabla del manual y las enmiendas en la constitución. Ninguna de las dos es su sitio.
4. **El propósito no se comprueba.** La constitución dice que una funcionalidad que no sirve al propósito queda fuera, pero ningún paso lo mira.
5. **La constitución entra en detalle que no es suyo.** La forma de trabajar, la calidad y la seguridad nombran herramientas, ejemplos y specs concretas.
6. **El manual describe por dentro el flujo de git.** Si ese flujo cambia, el manual también tiene que cambiar.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Abrir specs en paralelo sin choques, ver la historia en un sitio y una constitución corta. |
| **Agente de IA** | Saber qué leer sin recorrer todas las specs, y si una funcionalidad sirve al propósito. |
| **Quien revisa** | Encontrar la issue de una spec por su nombre. |

---

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en esta carpeta, quiero que cada spec nueva lleve el número de su issue, para que dos specs nunca compartan nombre.
- **HU-02**: Como agente, quiero que las specs antiguas tengan un resumen, para leer menos sin perder lo que se decidió.
- **HU-03**: Como quien trabaja en esta carpeta, quiero que las specs resumidas sigan intactas, para poder volver a ellas.
- **HU-04**: Como quien revisa, quiero un índice de todas las specs y otro de todas las enmiendas, cada uno en un solo sitio.
- **HU-05**: Como agente, quiero que una funcionalidad diga a qué objetivo sirve, para pararme si no sirve a ninguno.
- **HU-06**: Como quien trabaja en esta carpeta, quiero una constitución corta que diga los principios y no el detalle.
- **HU-07**: Como quien trabaja en esta carpeta, quiero que el manual no dependa de cómo funciona por dentro el flujo de git, sin dejar de apuntar a él.

---

## 4. Criterios de aceptación

### El nombre de las specs (HU-01)

- **CA-01**: **Dado** una spec nueva, **cuando** se crea, **entonces** su carpeta empieza por el número de su issue, seguido del nombre en kebab-case.
- **CA-02**: **Dado** las specs `001` a `008`, **cuando** se aplica este cambio, **entonces** conservan su nombre y su contenido.
- **CA-03**: **Dado** el orden de las specs, **cuando** se consulta, **entonces** primero van `001` a `008` y después las demás por número de issue.

### Los resúmenes (HU-02, HU-03)

- **CA-04**: **Dado** 8 specs sin resumir, **cuando** se aplica la regla, **entonces** las 4 más antiguas quedan en un solo resumen. No cuentan el historial, los resúmenes ni las specs descartadas.
- **CA-05**: **Dado** un resumen, **cuando** se lee, **entonces** dice, por cada spec, qué problema resolvió, qué decisiones siguen vigentes y qué cambió después, con un enlace a la spec original.
- **CA-06**: **Dado** las specs resumidas, **cuando** se escribe el resumen, **entonces** no se editan ni se borran.
- **CA-07**: **Dado** este cambio, **cuando** termina, **entonces** existe el resumen de `001` a `004`.
- **CA-20**: **Dado** una spec que hace llegar a 8 las specs sin resumir, **cuando** se implementa, **entonces** el agente escribe el resumen en ese mismo momento y en la misma pull request.

### El historial (HU-04)

- **CA-08**: **Dado** el historial de specs, **cuando** se lee, **entonces** lista cada spec con su identificador, nombre, issue, fecha, tipo, estado y, si lo tiene, el resumen que la recoge.
- **CA-09**: **Dado** el historial de enmiendas, **cuando** se lee, **entonces** tiene todas las enmiendas de la constitución, de la 1.0 a la de este cambio, y la constitución ya no las repite.
- **CA-10**: **Dado** el manual, **cuando** se busca el estado de las specs, **entonces** apunta al historial y no tiene su propia tabla.

### El propósito (HU-05)

- **CA-11**: **Dado** una spec, **cuando** se escribe, **entonces** dice su tipo: funcionalidad o proceso.
- **CA-12**: **Dado** una spec de funcionalidad, **cuando** se escribe, **entonces** tiene una sección «Para qué sirve» que nombra el objetivo de la constitución al que sirve.
- **CA-13**: **Dado** una funcionalidad que no sirve a ningún objetivo, **cuando** se escribe la spec, **entonces** el agente se para con `[NECESITA ACLARACIÓN]` y no escribe ni plan ni tareas. Quien trabaja en la carpeta la descarta, la reformula o enmienda el propósito. Si se descarta, queda en el historial como descartada.

### La constitución (HU-06)

- **CA-14**: **Dado** la constitución, **cuando** se lee la forma de trabajo, **entonces** dice que es SDD en pocas líneas, sin pasos ni herramientas, y remite al manual para el día a día.
- **CA-15**: **Dado** la constitución, **cuando** se leen la calidad y la seguridad, **entonces** dicen principios sin ejemplos, sin herramientas y sin nombrar specs.
- **CA-16**: **Dado** la constitución, **cuando** se lee su versión, **entonces** es la 4.1 y dice dónde está el historial de enmiendas.

### El manual (HU-07)

- **CA-17**: **Dado** el manual, **cuando** se lee, **entonces** sigue diciendo que el git sigue el flujo de la carpeta y conserva el momento 2, pero no describe cómo funciona ese flujo por dentro.
- **CA-18**: **Dado** los comandos del manual, **cuando** se leen, **entonces** no repiten las dependencias: están en la constitución.

### Lo que no se rompe

- **CA-19**: **Dado** este cambio, **cuando** se pasan los tests, **entonces** todos pasan.

---

## 5. Fuera de alcance

- Renombrar o mover las specs `001` a `008`.
- Borrar las specs resumidas (queda para otra reunión).
- Cambiar el código de la app.
- Cambiar el flujo de git o su orquestador.
- Cambiar el propósito de la constitución.

---

## 6. Preguntas abiertas

Ninguna. El resumen lo escribe el agente, en el momento 4 de la spec que hace llegar a 8 las specs sin resumir, dentro de esa misma pull request (CA-20).

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-30 | Borrador inicial | La issue 679 recoge lo acordado en la entrevista |
| 1.0 | 2026-10-30 | Quién y cuándo escribe el resumen (CA-20) | Quien trabaja en esta carpeta cerró la pregunta abierta |
| 1.1 | 2026-10-30 | Implementada | T01–T09 hechas; 114 tests en verde |
