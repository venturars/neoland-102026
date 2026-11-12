# Constitución de AsistenciApp

> Versión 3.2 · Ratificada: 2026-10-19 · Última enmienda: 2026-11-03

Este documento recoge los principios y las decisiones fundamentales del producto. El proceso de trabajo está en [AGENTS.md](../AGENTS.md); los detalles técnicos, en las guías. Una propuesta que contradiga estos principios requiere una enmienda aprobada antes de implementarse.

## 1. Propósito

AsistenciApp permite pasar lista en una clase online de forma rápida, fiable y respetuosa con la privacidad. Existe para ahorrar tiempo en la gestión y dejar constancia de la asistencia. Las funcionalidades deben servir a esos objetivos.

## 2. Principios

### P1 · Independiente de la plataforma

La asistencia no depende de una plataforma concreta de videollamada o comunicación. Las integraciones son fuentes adicionales conectadas al mismo modelo; no se convierten en el núcleo del producto.

### P2 · Simplicidad primero

Se elige la solución más simple que cumpla la especificación. No se crean abstracciones para necesidades hipotéticas. El registro debe poder completarse en menos de 30 segundos desde que se ve el código.

### P3 · Dependencias mínimas

Se priorizan la biblioteca estándar y las capacidades del navegador. Las dependencias adicionales requieren una necesidad justificada y aprobación en el plan. El conjunto tecnológico aprobado se recoge en §3.

### P4 · Privacidad mínima

El registro de asistencia conserva únicamente el nombre indicado y la hora. No se incorporan emails, identificadores de dispositivo ni otros datos personales ajenos a esa finalidad.

La dirección de red puede conservarse por separado y exclusivamente para contar intentos de registro y mantener el bloqueo de ese control. No se incorpora a la asistencia ni se reutiliza para otra finalidad.

Los datos se almacenan localmente. No se autoriza almacenamiento externo. Un proveedor de túnel puede utilizarse como transporte cifrado para el acceso remoto, enviando solo lo imprescindible; se distingue ese tránsito del almacenamiento de la aplicación.

### P5 · Accesible y usable en móvil

Todas las pantallas funcionan en un móvil de unos 400 px de ancho. Usan HTML semántico, contraste suficiente y formularios con `<label>`, y se pueden recorrer con el teclado.

### P6 · Comunicación en español

La interfaz, los errores, la documentación y las especificaciones se escriben en español. Los nombres técnicos pueden estar en inglés. Las convenciones de código y comentarios están en [STYLE.md](STYLE.md).

## 3. Decisiones tecnológicas

La aplicación utiliza Python con Flask, SQLite para los datos locales y HTML, CSS y JavaScript vanilla para la presentación. pytest es la herramienta de pruebas. Flask y pytest son las dependencias externas aprobadas de base.

Cambiar este conjunto requiere enmendar la constitución. Las versiones mínimas, ubicaciones y comandos se documentan en la arquitectura y el README; una dependencia adicional compatible con este conjunto sigue la aprobación de P3.

## 4. Desarrollo guiado por especificaciones

Todo cambio de la aplicación, incluida su documentación, debe estar cubierto por una spec local. Se conservan las fases de especificación, plan, tareas e implementación, en ese orden. La persona responsable interviene en cinco momentos: la issue, el draft, las tres specs en la misma pasada, la implementación y lo que se pida sobre la PR. No hay un ok entre spec, plan y tareas. Una issue, una rama o una PR no autorizan el código.

La spec define qué se necesita y por qué; el plan explica cómo cumplirlo y comprobarlo. Las dudas de requisitos se resuelven antes de implementar. El procedimiento concreto está en [AGENTS.md](../AGENTS.md).

## 5. Calidad

Cada criterio de aceptación debe tener evidencia de cumplimiento: una prueba automatizada o, para aspectos visuales, una comprobación manual documentada. Las pruebas deben pasar antes de presentar la implementación como terminada.

Los errores visibles deben ser claros, estar en español e indicar cómo continuar. El código y las guías deben describir el mismo comportamiento.

## 6. Seguridad

- Los códigos de asistencia caducan y deben resistir la adivinación manual durante su vigencia.
- Un mismo alumno no puede registrarse dos veces en la misma sesión. El control compara el nombre normalizado y no acredita por sí solo la identidad de una persona.
- Una sesión cerrada no acepta registros nuevos.
- Toda entrada se valida en el servidor y se presenta sin permitir inyección de HTML.
- Los límites de intentos aprobados forman parte de su control específico; no se promete protección general frente a ataques automatizados.

## 7. Alcance del trabajo

El proyecto vive entero en la carpeta de AsistenciApp. No se tocan archivos fuera de esta carpeta. Sus especificaciones locales delimitan cada tarea; las ubicaciones concretas se consultan en las guías locales.

## 8. Enmiendas y guías

Una persona o un agente puede proponer una enmienda. Solo la persona responsable de esta aplicación puede aprobarla de forma explícita. Una aprobación de otro proyecto no es suficiente.

Cada enmienda registra versión, fecha y motivo en el [historial](CONSTITUTION-HISTORY.md). Se incrementa la versión menor para aclaraciones o añadidos compatibles y la mayor si se elimina o contradice un principio.

- [AGENTS.md](../AGENTS.md): proceso, autorizaciones y cierre.
- [ARCHITECTURE.md](ARCHITECTURE.md): responsabilidades, dependencias y configuración técnica.
- [STYLE.md](STYLE.md): legibilidad, tipos, docstrings y comentarios.
- [README.md](../README.md): preparación, comandos y uso.
