# Spec 009 · Reorganizar los documentos SDD

> Estado: **Implementada, pendiente de aprobación final** (2026-11-02) · Aprobada: 2026-11-02 · Issue: #754 · Pull request: #755

## 1. Problema

Los documentos de trabajo de AsistenciApp mezclan papeles. La constitución contiene principios, pero también procedimientos, detalles técnicos y el historial completo de enmiendas. El manual de trabajo contiene, además del proceso, las reglas de estilo del código. Cuando una regla cambia, hay que buscarla en varios sitios y es fácil que dos copias digan cosas distintas.

Además, una reorganización de este tipo se redactó en local antes de tener issue y spec, aunque la constitución exige una spec aprobada para cualquier cambio de la aplicación, también para la documentación. El flujo de trabajo debe dejar claro que la spec es un paso obligatorio después de preparar la tarea y antes de editar cualquier archivo.

## 2. Usuarios

| Rol | Qué necesita |
| --- | --- |
| Persona responsable de la app | Encontrar cada regla en un solo documento y aprobar sus cambios por fases. |
| Agente de desarrollo | Saber qué documento consultar y no editar nada antes de tener la spec aprobada. |
| Persona revisora | Comprobar que la reorganización no pierde reglas ni cambia el comportamiento de la app. |

## 3. Historias de usuario

- **HU-01**: Como persona responsable, quiero que la constitución contenga solo propósito, principios y decisiones fundamentales, para leerla y enmendarla sin ruido.
- **HU-02**: Como agente, quiero que el proceso, el estilo y el historial estén cada uno en su documento, para consultar la regla correcta sin copias contradictorias.
- **HU-03**: Como persona responsable, quiero que la spec sea un paso obligatorio del flujo para cualquier cambio, incluido uno solo documental, para que nada se edite sin mi aprobación.
- **HU-04**: Como persona revisora, quiero que las reglas concretas y comprobables se conserven, para poder verificarlas igual que antes.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Un papel por documento (HU-01, HU-02)

- **CA-01**: **Dada** la constitución, **cuando** se lee, **entonces** contiene el propósito, los principios P1–P6, las decisiones tecnológicas, la calidad, la seguridad, el alcance y las enmiendas, y enlaza a los demás documentos. No contiene el procedimiento detallado de las fases ni el historial completo.
- **CA-02**: **Dado** el historial de enmiendas, **cuando** se consulta, **entonces** está en un documento propio con versión, fecha, cambio y motivo de cada enmienda, incluida la de esta tarea.
- **CA-03**: **Dadas** las reglas de forma del código (sencillez, tipos, docstrings y comentarios educativos), **cuando** se consultan, **entonces** están en una guía de estilo propia y el manual de trabajo la enlaza en lugar de repetirlas.
- **CA-04**: **Dado** el manual de trabajo, **cuando** se lee, **entonces** describe el alcance, el flujo de Git, las fases SDD con su aprobación, la implementación y el cierre, sin duplicar reglas que tienen otra fuente.
- **CA-05**: **Dada** la arquitectura, **cuando** se lee, **entonces** describe las cinco responsabilidades, sus dependencias reales y el entorno técnico (versión mínima, entorno virtual, puerto y ubicación de los datos).

### La spec es obligatoria (HU-03)

- **CA-06**: **Dada** cualquier petición que cambie un archivo de la app, incluida la documentación, **cuando** se prepara, **entonces** el orden es issue, rama, pull request en borrador y spec local, y ningún archivo se edita antes de la aprobación de la spec. Lo dicen el manual de trabajo y el orquestador de Git.
- **CA-07**: **Dado** el orquestador de Git, **cuando** termina el paso de empezar una tarea, **entonces** remite a las fases SDD del manual y no encadena la edición de archivos. Las aprobaciones ya concedidas no se piden de nuevo.
- **CA-08**: **Dada** una pull request ya existente, **cuando** se vuelve a pasar por ella, **entonces** se reutiliza y conserva su estado de revisión y su enlace con la issue.

### Reglas que se conservan (HU-04)

- **CA-09**: **Dada** la constitución reorganizada, **cuando** se compara con la versión 3.0, **entonces** conserva estos criterios comprobables:
  - P5: las pantallas funcionan con unos 400 px de ancho, con HTML semántico, formularios con `<label>` y navegación con teclado;
  - §6: un mismo alumno no puede registrarse dos veces en la misma sesión;
  - §7: no se tocan archivos fuera de la carpeta de la aplicación.
- **CA-10**: **Dada** la enmienda, **cuando** se registra, **entonces** es la versión 3.1 con fecha y motivo, porque aclara y reorganiza sin eliminar ni contradecir ningún principio.
- **CA-11**: **Dada** la reorganización, **cuando** se ejecutan las pruebas, **entonces** `pytest` pasa y no cambia el código, las pantallas, los datos ni las dependencias de la aplicación.

## 5. Fuera de alcance

- Cambiar el comportamiento, las pantallas, los datos o las dependencias de la aplicación.
- Cambiar los principios P1–P6 o el proceso de aprobación por fases.
- Modificar first-app (tiene su propia spec en la misma issue), otras aplicaciones o la plantilla compartida del curso.
- Reescribir specs históricas.

## 6. Preguntas abiertas

Ninguna.
