# Spec 005 · Documentación en `docs/` y código por capas

> Estado: **Implementada v1.3 (2026-10-26)** · Creada: 2026-10-26

---

## 1. Problema

La documentación de reglas está suelta en la raíz de la carpeta y el manual del agente se llama `AGENT.md`, un nombre que las herramientas de IA no reconocen como estándar (`AGENTS.md`). No hay ningún documento que diga cómo se organiza el código: hoy casi toda la lógica de la aplicación vive mezclada con la parte web en un solo fichero, y quien quiere cambiar algo no sabe dónde ponerlo.

La issue #365 pide ordenar la documentación y que el código siga una arquitectura escrita, basada en un ejemplo público de arquitectura limpia, adaptada a esta app y sin complejidad que no haga falta (constitución P2 y P3): tres partes (reglas, acciones y almacenamiento) más el borde web, sin capas vacías.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Saber dónde va cada pieza de código y poder cambiarla sin romper el resto. |
| **El agente de IA** | Un `AGENTS.md` con las normas de escritura del código y un documento de arquitectura al que obedecer. |
| **Quien lee el proyecto por primera vez** | Encontrar las reglas en un sitio claro (`docs/`). |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja aquí, quiero que las reglas del proyecto estén en una carpeta `docs/`, para encontrarlas juntas.
- **HU-02**: Como persona que trabaja aquí, quiero un documento de arquitectura sencillo, para saber dónde va cada pieza.
- **HU-03**: Como agente de IA, quiero un `AGENTS.md` con las normas de escritura del código, para escribirlo siempre igual.
- **HU-04**: Como persona que trabaja aquí, quiero que el código siga esa arquitectura, para que lo escrito y lo hecho coincidan.
- **HU-05**: Como profesor o alumno, quiero que la app funcione exactamente igual que antes, para no notar el cambio.
- **HU-07**: Como persona que trabaja aquí, quiero que el almacenamiento solo guarde y lea lo que la acción ya decidió, gestionando él mismo su acceso a los datos, para que ninguna otra parte tenga que preocuparse de abrirlo ni de cerrarlo.
- **HU-08**: Como persona que trabaja aquí, quiero que la parte web no sepa cómo se guardan los datos y solo sepa dónde están, para poder cambiar el almacenamiento sin tocar las rutas.
- **HU-06**: Como persona que trabaja aquí, quiero que un test automático vigile la arquitectura y los documentos, para que nadie la rompa sin darse cuenta.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### La carpeta `docs/` (HU-01)

- **CA-01**: **Dado** la carpeta del proyecto, **cuando** se lista, **entonces** existe `docs/` y dentro está `CONSTITUTION.md`, con exactamente el mismo contenido que tenía: ni el texto ni la versión ni el historial de enmiendas cambian.
- **CA-02**: **Dado** la raíz del proyecto, **cuando** se lista, **entonces** ya no hay `CONSTITUTION.md` en ella.

### La arquitectura (HU-02)

- **CA-03**: **Dado** `docs/ARCHITECTURE.md`, **cuando** se lee, **entonces** describe las capas del proyecto, qué contiene cada una y en qué sentido pueden depender unas de otras.
- **CA-04**: **Dado** ese documento, **cuando** se lee, **entonces** está adaptado a esta app y no exige nada que la constitución P2 y P3 no permita (sin dependencias nuevas, sin capas vacías "por si acaso").
- **CA-05**: **Dado** ese documento, **cuando** se lee, **entonces** dice dónde va cada cosa que la app ya hace hoy: las reglas de negocio (códigos, nombres y las decisiones «la sesión no existe», «la sesión está cerrada» y «el código no es válido», cada una con su error), las acciones de la app, el acceso a los datos, la exportación, el túnel y la parte web. La parte web solo traduce esas decisiones a una respuesta; no las toma. La exportación y el túnel se quedan donde están.

### Las normas de escritura (HU-03)

- **CA-06**: **Dado** la raíz del proyecto, **cuando** se lista, **entonces** `AGENT.md` ya no está y sí está `AGENTS.md`.
- **CA-07**: **Dado** `AGENTS.md`, **cuando** se lee, **entonces** conserva el flujo de trabajo actual y añade normas de escritura del código concretas, al estilo de la API pública de la biblioteca `requests`: una frase que explica cada módulo; en cada función pública, `:param`, `:return` y `:rtype`; un ejemplo `Usage::`; tipos en los parámetros y el resultado; y las normas de nombres, funciones pequeñas y errores.
- **CA-08**: **Dado** cualquier enlace o mención a `AGENT.md` o a `CONSTITUTION.md` en el README y en `AGENTS.md`, **cuando** se revisa, **entonces** apunta a la ruta nueva. Las specs 001–004 no se tocan: sus menciones quedan como historia.

### El código sigue la arquitectura (HU-04, HU-05)

- **CA-09**: **Dado** el código de la app, **cuando** se revisa contra `docs/ARCHITECTURE.md`, **entonces** está organizado en tres partes (reglas, acciones y almacenamiento) más el borde web, cada pieza está en la que el documento dice y ninguna dependencia va en sentido contrario al permitido. Solo las acciones usan el almacenamiento.
- **CA-10**: **Dado** los tests de antes del cambio, **cuando** se ejecutan tras el cambio, **entonces** siguen pasando sin que cambie lo que comprueban (solo pueden cambiar rutas de importación y de ficheros movidos). Los tests nuevos se añaden aparte.
- **CA-11**: **Dado** la app arrancada, **cuando** el profesor crea, cierra y exporta una clase y un alumno se registra, **entonces** todo funciona igual que antes: mismas pantallas, mismas rutas, mismos mensajes.
- **CA-12**: **Dado** el README, **cuando** se leen las instrucciones, **entonces** los comandos para preparar, arrancar y probar siguen valiendo tal cual.

### El almacenamiento (HU-07)

- **CA-14**: **Dado** el almacenamiento, **cuando** una acción lo usa, **entonces** cada operación abre y cierra por sí sola su acceso a los datos, sin que quien la llama lo gestione.
- **CA-15**: **Dado** el almacenamiento, **cuando** se revisa, **entonces** no conoce la parte web ni las reglas del dominio (códigos, nombres, decisiones de sesión) y no comprueba si la sesión está cerrada ni si el código vale: guarda y lee lo que la acción ya decidió.

### La parte web no conoce el almacenamiento (HU-08)

- **CA-16**: **Dado** la parte web, **cuando** se revisa, **entonces** no importa el almacenamiento ni la biblioteca de base de datos; solo conoce la ruta de la base y se la pasa a las acciones. Al arrancar, una acción prepara la base (crea su estructura) y devuelve el token del profesor.

### La vigilancia automática (HU-06)

- **CA-13**: **Dado** el conjunto de tests, **cuando** se ejecuta, **entonces** un test comprueba que ninguna parte importa lo que no le toca (el almacenamiento, ninguna otra parte del proyecto; la parte web, ni el almacenamiento ni la biblioteca de base de datos); que existen `docs/CONSTITUTION.md`, `docs/ARCHITECTURE.md` y `AGENTS.md`; que no existen `CONSTITUTION.md` ni `AGENT.md` en la raíz; y que `AGENTS.md` contiene `:param`, `:return` y `Usage`.

---

## 5. Fuera de alcance

- Cambiar lo que hace la app, sus pantallas, sus rutas o sus mensajes.
- Añadir dependencias nuevas o herramientas de calidad de código.
- Cambiar la constitución (ni su texto, ni su versión, ni su historial): solo cambia su ubicación.
- Actualizar las rutas dentro de las specs 001–004.
- Crear carpetas de «web» o «infraestructura» aparte, o mover la exportación y el túnel de donde están.
- Tocar ficheros fuera de `staff/ella-deyavorsky/asistenciapp/`.

---

## 6. Preguntas abiertas

Ninguna. Respuestas de la persona que trabaja en esta carpeta (2026-10-26): la constitución se mueve sin tocarla y las specs antiguas se dejan como historia.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | La issue #365 pide `docs/`, `ARCHITECTURE.md`, `AGENTS.md` y un código que siga la arquitectura. La constitución §4 exige un spec aprobado antes de tocar cualquier fichero. |
| 0.2 | 2026-10-26 | Resueltas las preguntas abiertas: constitución intacta; specs 001–004 intactas | Respuestas antes de aprobar |
| 1.0 | 2026-10-26 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-26 | Tres partes en vez de cuatro; la exportación y el túnel no se mueven; las decisiones de sesión y código van al dominio (CA-05, CA-09); normas de escritura concretas (CA-07); test de arquitectura y documentos (HU-06, CA-13) | Decisión de la persona antes de empezar el código. Aprobada |
| 1.2 | 2026-10-26 | El almacenamiento gestiona su propio acceso a los datos y no importa nada del proyecto (HU-07, CA-14, CA-15); CA-13 lo vigila | Decisión de la persona tras revisar el almacenamiento. Aprobada e implementada |
| 1.3 | 2026-10-26 | La parte web deja de importar el almacenamiento; una acción prepara la base y devuelve el token (HU-08, CA-16); CA-09 y CA-13 lo recogen | Decisión de la persona: como en el diseño de Ventura. Aprobada |
