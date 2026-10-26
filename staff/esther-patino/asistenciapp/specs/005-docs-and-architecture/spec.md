# Spec 005 · Documentos y arquitectura del código

> Estado: **Aprobada** · Creada: 2026-10-23 · Aprobada: 2026-10-23

---

## 1. Problema

Las reglas del proyecto, el manual de trabajo del agente y el código de la aplicación están mezclados en la raíz. No hay un documento que diga cómo se organiza el código, ni unas normas de escritura que el agente deba seguir al programar.

Quien trabaja en el proyecto quiere tres cosas a la vez:

1. Una carpeta `docs` con las reglas no negociables y, al lado, un documento de arquitectura.
2. El manual del agente con el nombre `AGENTS.md`, y dentro las normas de cómo se escribe el código.
3. El código de la aplicación ordenado según ese documento de arquitectura, solo con lo que esta app necesita para pasar lista.

Hoy el código de asistencia vive en un solo paquete y la entrada de la aplicación concentra reglas, acceso a los datos y la conversación con el navegador. Eso dificulta ver qué es una regla de la asistencia y qué es la forma de llegar a ella.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en el proyecto** | Encontrar las reglas, la arquitectura y el manual en su sitio, y que el código siga esas normas sin cambiar cómo se pasa lista. |
| **Agente de IA** | Saber dónde leer las reglas, cómo organizar el código y cómo escribirlo, sin copiar un ejemplo que trae piezas que esta app no usa. |

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en el proyecto, quiero las reglas no negociables dentro de `docs`, para que la raíz quede para la aplicación y los documentos de reglas vivan juntos.
- **HU-02**: Como quien trabaja en el proyecto, quiero un `docs/ARCHITECTURE.md` que diga cómo se organiza el código de esta app, para que un agente no invente capas ni herramientas de más.
- **HU-03**: Como agente de IA, quiero que el manual se llame `AGENTS.md` y siga en la raíz, para encontrarlo con el nombre habitual y leer ahí cómo se escribe el código.
- **HU-04**: Como quien trabaja en el proyecto, quiero que el código de la aplicación quede repartido como dice `docs/ARCHITECTURE.md`, para separar las reglas de la asistencia de la forma de guardarlas y de mostrarlas.
- **HU-05**: Como quien arranca la app o lee el manual, quiero que los enlaces vivos apunten a los documentos en su sitio nuevo, para no seguir un enlace roto.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01**: **Dado** el árbol de este proyecto, **cuando** se buscan las reglas no negociables, **entonces** están en `docs/CONSTITUTION.md` y ya no hay un `CONSTITUTION.md` en la raíz. El texto de los principios no cambia.
- **CA-02**: **Dado** la carpeta `docs`, **cuando** se abre `ARCHITECTURE.md`, **entonces** explica cómo se organiza el código de esta app a partir del ejemplo de capas indicado abajo, dice qué partes de ese ejemplo se usan y cuáles no se traen, y no añade herramientas que esta app no necesita.
- **CA-03**: **Dado** la raíz del proyecto, **cuando** se busca el manual del agente, **entonces** el archivo se llama `AGENTS.md`, ya no existe `AGENT.md`, y el manual dice cómo se escribe el código según el módulo de ejemplo indicado abajo.
- **CA-04**: **Dado** el código de la aplicación, **cuando** se compara con `docs/ARCHITECTURE.md`, **entonces** las reglas de la asistencia no dependen de las pantallas ni de cómo se guardan los datos, y solo existen las piezas que esta app ya necesita.
- **CA-05**: **Dado** el documento de uso y el manual del agente, **cuando** se siguen sus enlaces a las reglas y al manual, **entonces** esos enlaces abren `docs/CONSTITUTION.md` y `AGENTS.md`.
- **CA-06**: **Dado** una clase ya usable, **cuando** el profesor pasa lista y el alumno se registra, **entonces** el resultado es el mismo que antes de este cambio. Las pruebas automáticas que ya existen siguen en verde.
- **CA-07**: **Dado** las specs `001`, `002`, `003` y `004`, **cuando** se aplica este cambio, **entonces** esos documentos históricos no se reescriben.

### Referencias ya indicadas

Estas dos direcciones son la fuente de las normas. El plan dirá cómo se adaptan. No se copia el repositorio de ejemplo.

- Organización del código: <https://github.com/claudiosw/python-clean-architecture-example>
- Forma de escribir el código: <https://github.com/psf/requests/blob/main/src/requests/api.py>

Del ejemplo de capas se toma la idea de separar reglas, acciones y la forma de llegar a ellas. No se traen la segunda forma de guardar datos, la línea de comandos, el generador de documentación, los ganchos de commit ni una clase y una interfaz por cada detalle que esta app no tiene.

De la forma de escribir se toma: un texto breve al principio del módulo, funciones que se leen de arriba abajo, una función por acción, y en cada función pública un texto que dice qué hace, qué recibe y qué devuelve.

## 5. Fuera de alcance

- Cambiar cómo el profesor pasa lista o cómo el alumno se registra.
- Cambiar el aspecto de las pantallas.
- Añadir una herramienta o una biblioteca que esta app no tenga ya.
- Cambiar el texto de los principios de la constitución. Mover el archivo no es una enmienda.
- Reescribir las specs, planes y tareas ya cerrados para que citen los nombres nuevos.
- Copiar el ejemplo de capas tal cual, con todas sus carpetas, sus variantes y sus herramientas.
- Escribir el plan o las tareas dentro de este documento. Esas son las fases siguientes.

## 6. Preguntas abiertas

Ninguna. `ARCHITECTURE.md` va dentro de `docs`, al lado de la constitución. `AGENTS.md` es el renombre de `AGENT.md` y se queda en la raíz.
