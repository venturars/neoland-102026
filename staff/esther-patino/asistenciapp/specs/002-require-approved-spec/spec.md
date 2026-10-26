# Spec 002 · Ningún fichero sin spec aprobada

> Estado: **Aprobado** · Creada: 2026-10-23

---

## 1. Problema

Se puede modificar un fichero de la aplicación sin un spec aprobado que cubra ese cambio. La regla actual solo habla del código nuevo. Una issue, una rama o una pull request pueden tomarse como permiso para editar.

Quien aprueba cada fase ya está dicho en la constitución. Esta spec no lo cambia.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien mantiene la app** | Que un cambio de la app nazca de un spec aprobado que cubra ese cambio, y que esa puerta no se pueda saltar. |
| **Agente de IA** | Saber que debe parar si ese spec no está aprobado. |

## 3. Historias de usuario

- **HU-01**: Como quien mantiene la app, quiero que ningún fichero de la app se modifique sin un spec aprobado que cubra ese cambio, para que el trabajo no empiece en el fichero.
- **HU-02**: Como quien mantiene la app, quiero que una issue, una rama o una pull request no sustituyan a ese spec, para que el permiso de trabajo no cuente como especificación.
- **HU-03**: Como quien mantiene la app, quiero la misma puerta en las reglas del proyecto y en el manual de trabajo del agente, para que no se pueda saltar leyendo solo uno de los dos.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01**: **Dado** un cambio en código, tests, el documento de uso de la app u otra documentación de uso, **cuando** no hay un spec aprobado que cubra ese cambio, **entonces** ese fichero no se modifica.
- **CA-02**: **Dado** un spec aprobado de otro cambio, **cuando** el cambio actual no está cubierto por ese spec, **entonces** los ficheros de la app no se modifican.
- **CA-03**: **Dado** una issue, una rama o una pull request, **cuando** no hay un spec aprobado que cubra el cambio, **entonces** ninguna de las tres autoriza modificar ficheros de la app.
- **CA-04**: **Dado** las reglas del proyecto y el manual de trabajo del agente, **cuando** se consulta solo uno de los dos, **entonces** los dos dicen CA-01, CA-02 y CA-03. Cumplir solo uno no abre la puerta.

## 5. Fuera de alcance

- Cambiar cómo se pasa lista.
- Cambiar quién aprueba las fases o las enmiendas.
- Reescribir la spec `001-checkin-codigo`.
- Corregir el documento de uso de la app.
- Hacer el cambio de las reglas o del manual en este documento. Eso va después del plan y de las tareas.

## 6. Preguntas abiertas

Ninguna.
