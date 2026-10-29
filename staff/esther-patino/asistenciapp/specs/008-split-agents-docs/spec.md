# Spec 008 · El manual solo dice cómo se trabaja

> Estado: **Aprobada** · Creada: 2026-10-29 · Aprobada: 2026-10-29 · Issue: #563

---

## 1. Problema

El manual del agente mezcla el modo de trabajo con datos que ya viven en otro documento, o que deben vivir en el suyo: el árbol de carpetas, cómo se escribe el código, los comandos de arranque y unas reglas de comportamiento que repiten el flujo.

Quien abre el manual no distingue qué tiene que leer ahí. Además, el manual manda parar solo si un pedido contradice las reglas no negociables, y al justificar una dependencia señala un apartado concreto de esas reglas.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en el proyecto** | Un manual más corto, con cada dato en su documento y sin la misma regla dos veces. |
| **Agente de IA** | Saber qué leer al empezar, dónde está el árbol, cómo se escribe el código y cuándo tiene que parar. |

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en el proyecto, quiero que el manual no explique qué es ese archivo, para que empiece directamente por el trabajo.
- **HU-02**: Como agente de IA, quiero que el manual me diga que pare y pregunte si un pedido contradice la documentación, para no escribir nada que choque con ella.
- **HU-03**: Como agente de IA, quiero que una dependencia externa se justifique citando solo el documento de las reglas, para no quedar atada a un apartado concreto.
- **HU-04**: Como quien busca la estructura de carpetas, quiero verla en su propio documento, para no leerla dentro del manual.
- **HU-05**: Como agente de IA, quiero leer cómo se escribe el código en su propio documento, para no buscarlo dentro del manual.
- **HU-06**: Como quien arranca la app, quiero los comandos donde ya están y, junto a ellos, cuáles son las únicas dependencias, citando solo el documento de las reglas.
- **HU-07**: Como agente de IA, quiero las reglas de comportamiento en la lectura inicial, sin repetir la puerta del spec aprobado, para leerlas una sola vez.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01**: **Dado** el manual del agente, **cuando** se lee el inicio, **entonces** no hay un párrafo que explique qué es ese archivo ni que lo contraste con las reglas. El título se queda.
- **CA-02**: **Dado** el manual del agente, **cuando** se lee qué hacer si un pedido contradice la documentación, **entonces** dice que hay que parar y preguntar antes de escribir nada.
- **CA-03**: **Dado** el apartado de planificar, **cuando** se lee cómo justificar una dependencia externa, **entonces** se nombra solo el documento de las reglas, sin un principio ni un apartado numerado. La línea que pide repasar los principios en la comprobación del plan se queda como está.
- **CA-04**: **Dado** la carpeta de documentos, **cuando** se abre el documento del árbol, **entonces** contiene el árbol que estaba en el manual, la forma de numerar las specs y también los dos documentos nuevos. El documento de arquitectura lista también el árbol y el estilo. Las capas del código siguen igual.
- **CA-05**: **Dado** el documento de estilo, **cuando** se lee, **entonces** contiene cómo se escribe el código, incluido qué recibe y qué devuelve una función pública. Ese texto ya no está en el manual.
- **CA-06**: **Dado** el documento de uso, **cuando** se buscan los comandos de preparar el entorno, activar, instalar el túnel, arrancar y ejecutar las pruebas, **entonces** siguen donde ya estaban y no hay una segunda copia. El documento dice que las únicas dependencias son Flask y pytest, y enlaza solo el documento de las reglas, sin citar un principio. El manual ya no tiene la sección de comandos.
- **CA-07**: **Dado** el punto 1 del manual, **cuando** se leen las reglas de comportamiento, **entonces** están, una sola vez: editar solo en esta carpeta, preguntar antes de suponer, explicar al cerrar cada fase, cambios pequeños, nada de commits ni pushes sin que lo pida quien trabaja en el proyecto, parar lo que se arranque, y no tocar la constitución salvo para proponer una enmienda. La puerta de ningún fichero sin spec aprobado sigue solo en el flujo.
- **CA-08**: **Dado** la lectura obligatoria, **cuando** se empieza una tarea, **entonces** señala el documento del árbol y el de estilo. «Definición de terminado» es el apartado 3 y «Estado actual» es el apartado 4. La referencia interna al estado apunta al apartado 4.
- **CA-09**: **Dado** la comprobación de que el manual dice cómo se escribe el código, **cuando** se ejecuta después de este cambio, **entonces** mira el documento de estilo. Sigue comprobando que el manual se llama como ahora y que el documento de uso y el manual enlazan el documento de las reglas. Las specs 001 a 007 no se reescriben. Las pruebas que ya existen siguen en verde.

## 5. Fuera de alcance

- Enmendar las reglas no negociables.
- Cambiar las capas del código.
- Cambiar cómo se pasa lista o cualquier otro comportamiento de la app.
- Copiar otra vez, en el documento de uso, la tabla de comandos que ya está ahí.
- Quitar la línea de planificar que pide repasar los principios en la comprobación del plan.
- Reescribir las specs, planes y tareas 001 a 007.
- Escribir el plan o las tareas dentro de este documento. Esas son las fases siguientes.

## 6. Preguntas abiertas

Ninguna.
