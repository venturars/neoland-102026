# Spec 002 · Spec antes del cambio

Estado: aprobada el 2026-10-25. Autorizados el plan y las tareas.
Ámbito: esta aplicación. El manual que se sigue dentro de `asistencia/` vive en `asistencia/AGENTS.md`.

## 1. Problema

Un cambio puede escribirse antes de que exista una spec aprobada que lo cubra. El manual heredado pide ese orden, pero no es el que se consulta al trabajar dentro de `asistencia/`: tiene otro nombre, señala otra carpeta y deja la aprobación en manos de otra persona.

Quien es responsable de la aplicación necesita decidir qué se hará antes de que se modifique. Una issue, una rama o una pull request organizan el trabajo, pero no sustituyen esa decisión. La spec 001 está terminada y no cubre este pedido.

## 2. Usuarios

- Quien aprueba: revisa y aprueba cada fase del cambio en la aplicación.
- Agente: necesita saber qué puede escribir antes de obtener esa aprobación.

## 3. Historias de usuario

- HU-01: Como responsable de la aplicación, quiero aprobar una spec que cubra cualquier cambio dentro de `asistencia/` antes de que ese cambio se escriba.
- HU-02: Como responsable de la aplicación, quiero que el agente prepare primero solo la spec y espere mi aprobación antes del plan, las tareas y la implementación.
- HU-03: Como responsable de la aplicación, quiero una spec nueva si la activa no cubre mi petición, sin reutilizar ni reescribir la 001.
- HU-04: Como responsable de la aplicación, quiero que una issue, una rama o una pull request no sustituyan la spec aprobada.
- HU-05: Como responsable de la aplicación, quiero que el manual que se sigue dentro de `asistencia/` señale esta aplicación y a quien la aprueba, y viva en `asistencia/AGENTS.md`.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dado un cambio dentro de `asistencia/` sin spec aprobada que lo cubra, cuando se inicia el trabajo, entonces no se modifica ese cambio y lo primero que se escribe es la spec.
- CA-02 (HU-02): Dada una spec recién redactada, cuando termina su preparación, entonces se presenta a quien aprueba y se espera su aprobación, sin escribir todavía plan, tasks ni implementación.
- CA-03 (HU-02): Dada la aprobación de la spec, cuando continúa el trabajo, entonces se prepara el plan y se espera su aprobación, se preparan las tareas y se espera su aprobación, y después se implementa.
- CA-04 (HU-03): Dada una petición no cubierta por la spec activa, cuando se prepara el cambio, entonces se abre otra spec. La spec 001 permanece intacta.
- CA-05 (HU-04): Dada una issue, una rama o una pull request, cuando falta una spec aprobada, entonces esos elementos no autorizan a modificar la aplicación.
- CA-06 (HU-05): Dado el manual que se sigue al trabajar dentro de `asistencia/`, cuando se lee, entonces está en `asistencia/AGENTS.md`, señala esta aplicación como ámbito y a quien es responsable de ella como quien aprueba cada fase.
- CA-07 (HU-03): Dado el historial de la spec 001, cuando se actualizan las reglas, entonces sus nombres, fechas y comprobaciones quedan intactos.

## 5. Fuera de alcance

El README de la raíz de la app, incluido el texto de cómo activar el entorno y cómo arrancar la app. Cambios de pasar lista, nuevas formas de registro y reescribir la spec 001. Este manual no cubre archivos que estén fuera de `asistencia/`.

## 6. Preguntas abiertas

Ninguna.
