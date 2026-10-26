# Spec 005 · Arquitectura y documentos

Estado: aprobada el 2026-10-25. Autorizados el plan y las tareas.
Ámbito: asistenciapp.

## 1. Problema

Los documentos de trabajo y el código están mezclados en la raíz de asistenciapp. `CONSTITUTION.md` y `AGENT.md` viven al lado de la aplicación. No hay un sitio donde quede escrito cómo se parte el código.

El código de pasar lista también está mezclado: la misma pieza abre la web, decide si un registro vale y guarda los datos. Quien cambia una regla de la clase tiene que entrar en la web, y quien cambia la web tiene que tocar la regla.

La referencia es el ejemplo de arquitectura limpia en https://github.com/claudiosw/python-clean-architecture-example. Ese ejemplo separa las reglas, las acciones y los bordes. También trae base de datos de servidor, un migrador, una aplicación de consola, otra en memoria y documentación generada. Nada de eso hace falta para pasar lista.

Las specs 001 a 004 están terminadas y no cubren este pedido.

## 2. Usuarios

- Quien aprueba: quiere los documentos en su sitio y el código partido sin cambiar lo que ya hace la aplicación.
- Quien escribe código: necesita leer en un solo archivo qué capas hay y qué no se copia del ejemplo.
- Quien usa la aplicación: el profesor y el alumno siguen pasando lista igual que ahora.

## 3. Historias de usuario

- HU-01: Como responsable de la aplicación, quiero `CONSTITUTION.md` dentro de una carpeta `docs`.
- HU-02: Como quien escribe código, quiero un `ARCHITECTURE.md` dentro de `docs` que diga cómo se parte el código y qué del ejemplo no se trae.
- HU-03: Como quien sigue el manual de trabajo, quiero que `AGENT.md` se llame `AGENTS.md` y que siga diciendo cómo se trabaja.
- HU-04: Como profesor o alumno, quiero seguir abriendo una clase, registrarme, ver la lista, quitar un registro, cerrar la clase y descargar la lista, igual que ahora.
- HU-05: Como responsable, quiero que no entren herramientas ni dependencias que esta aplicación no usa.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dada la raíz de asistenciapp, cuando se busca la constitución, entonces está en `docs/CONSTITUTION.md` y ya no está en la raíz.
- CA-02 (HU-02): Dado `docs/ARCHITECTURE.md`, cuando se lee, entonces dice que el código se parte en tres capas: las reglas de una clase y de un registro, las acciones de pasar lista, y los bordes (la web, el guardado y el túnel). También dice que no se traen la base de datos de servidor, el migrador, la aplicación de consola, la aplicación en memoria ni la documentación generada del ejemplo.
- CA-03 (HU-03): Dada la raíz de asistenciapp, cuando se busca el manual de trabajo, entonces el archivo se llama `AGENTS.md`, ya no existe `AGENT.md`, y el manual sigue señalando la constitución y el orden spec, plan, tareas e implementación.
- CA-04 (HU-04): Dado el paso de lista de la spec 001, cuando se prueba abrir una clase, registrarse, ver la lista, quitar un registro, cerrar la clase y descargar la lista, entonces el resultado es el mismo que antes de este cambio.
- CA-05 (HU-05): Dadas las dependencias de la aplicación, cuando se aplica este cambio, entonces no se añade ninguna. Siguen siendo las que ya permite la constitución.

## 5. Fuera de alcance

Cambiar lo que el profesor o el alumno pueden hacer. Reescribir las specs 001 a 004. Enmendar los principios de la constitución. Copiar el ejemplo carpeta por carpeta. Añadir una base de datos de servidor, un migrador, una aplicación de consola o documentación generada.

## 6. Preguntas abiertas

Ninguna.
