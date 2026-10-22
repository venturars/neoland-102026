# Spec 005 · Arquitectura clara y código alineado

> Estado: **Implementada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22 · Issue: #239

---

## 1. Problema

La app funciona y cumple lo acordado en specs anteriores, pero la lógica de negocio, el acceso a datos y la parte que atiende al navegador viven mezclados en pocos módulos. Eso dificulta entender dónde va un cambio nuevo, probar reglas sin levantar el servidor y mantener el proyecto cuando crezca (más pantallas, más reglas o integraciones futuras).

La issue #239 pide documentar una arquitectura explícita — inspirada en un ejemplo público de arquitectura limpia en Python, pero sin añadir herramientas ni capas de más — y reorganizar el código y la gobernanza (manual del agente y constitución) para que todo apunte a las mismas reglas.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Que la app siga comportándose igual: abrir clase, código rotatorio, check-in, cerrar, exportar. |
| **Alumno** | Registrar asistencia con el mismo flujo y mensajes de error claros. |
| **Quien trabaja en esta carpeta** | Saber en qué capa va cada cambio y tener una guía única (`ARCHITECTURE.md`) alineada con el código. |
| **Compañero que revisa la issue #239** | Comprobar documento de arquitectura, código coherente con él, y reglas transversales en constitución y manual del agente. |
| **Agente** | Seguir capas y dependencias documentadas sin inventar frameworks ni patrones innecesarios. |

---

## 3. Historias de usuario

- **HU-01**: Como quien trabaja en esta carpeta, quiero un documento `docs/ARCHITECTURE.md` que diga qué capas existen, qué puede depender de qué y dónde va cada tipo de lógica, adaptado a AsistenciApp y sin complejidad de más.
- **HU-02**: Como quien mantiene la app, quiero que el código del servidor siga esa guía para que las reglas de asistencia no queden acopladas al detalle de almacenamiento ni a las rutas del navegador.
- **HU-03**: Como compañero que prueba la issue #239, quiero que `AGENTS.md` y la constitución reflejen las mismas decisiones arquitectónicas y de gobernanza que `ARCHITECTURE.md`, para que no haya dos narrativas distintas.
- **HU-04**: Como profesor o alumno, quiero que tras este cambio todo siga igual en pantalla y en la API pública que ya usan las páginas actuales.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Documentación de arquitectura (HU-01)

- **CA-01**: **Dado** la carpeta `docs/` de esta app, **cuando** alguien busca las normas de arquitectura, **entonces** existe `docs/ARCHITECTURE.md` en español y describe al menos: propósito de cada capa, regla de dependencias (hacia dentro), convención de nombres o carpetas, y qué queda fuera a propósito (sin ORM, sin colas, sin microservicios, etc.).
- **CA-02**: **Dado** `docs/ARCHITECTURE.md`, **cuando** se compara con el ejemplo de referencia de la issue #239, **entonces** se reconoce la misma idea de dominio, casos de uso e infraestructura, pero simplificada a lo que esta app necesita hoy.

### Código alineado (HU-02)

- **CA-03**: **Dado** el árbol de código del servidor bajo esta app, **cuando** se revisa la estructura de paquetes, **entonces** la lógica de reglas de negocio (sesiones, check-in, códigos, nombres) no depende de detalles de la base de datos ni de la librería web.
- **CA-04**: **Dado** el punto de entrada que arranca la app y atiende peticiones, **cuando** se implementa un flujo ya existente (p. ej. check-in o listado de sesiones), **entonces** delega en casos de uso o equivalentes documentados en `ARCHITECTURE.md`, no concentra toda la regla en un solo fichero monolítico.
- **CA-05**: **Dado** el acceso a datos de asistencia, **cuando** se guarda o lee información, **entonces** vive en la capa de infraestructura prevista en `ARCHITECTURE.md` y cumple la constitución (solo datos mínimos, local).

### Gobernanza transversal (HU-03)

- **CA-06**: **Dado** `AGENTS.md`, **cuando** se lee la sección de estructura de carpetas y el flujo de trabajo, **entonces** describe la organización arquitectónica acordada en `ARCHITECTURE.md` (no la estructura antigua si ya no aplica).
- **CA-07**: **Dado** `docs/CONSTITUTIONS.md`, **cuando** se revisan principios de simplicidad, stack y calidad, **entonces** no contradice `ARCHITECTURE.md`; si hace falta enmienda de versión, queda registrada en el historial §8.

### Comportamiento preservado (HU-04)

- **CA-08**: **Dado** la suite de tests automatizados y los criterios de la spec `001-checkin-codigo`, **cuando** se cierra esta spec, **entonces** `pytest` pasa y el comportamiento verificado de check-in, códigos, cierre de sesión y exportación se mantiene.
- **CA-09**: **Dado** las pantallas de alumno y profesor sin cambios funcionales pedidos en esta spec, **cuando** se usa la app en local, **entonces** las URLs y respuestas JSON relevantes para el front siguen siendo equivalentes a las actuales (mismos campos y códigos de error para los mismos casos).

### Manual del agente

- **CA-10**: **Dado** que esta spec avance de fase, **cuando** se mira la tabla de estado en `AGENTS.md` §7, **entonces** incluye una fila para `005-clean-architecture` con la fase correspondiente.

---

## 5. Fuera de alcance

- Cambiar el comportamiento funcional acordado en specs anteriores (nuevas pantallas, nuevas reglas de negocio, bot de Discord).
- Sustituir SQLite, Flask o el front estático; añadir ORM, migraciones automáticas, colas, contenedores o servicios externos no justificados.
- Reescribir el front (`static/`) salvo ajustes mínimos si cambia la forma de importar módulos del servidor.
- Modificar carpetas fuera de `staff/sergio-cortes/asistenciapp/`.
- Duplicar el ejemplo de referencia al completo (CLI alternativa, PostgreSQL, capas de logging genéricas, etc.).

---

## 6. Preguntas abiertas

Ninguna por ahora. Si al planificar aparece duda sobre el grado de separación (p. ej. un solo paquete de casos de uso vs. uno por agregado), se decide en el `plan.md` priorizando simplicidad (constitución P2).

---

## 7. Historial de cambios

| Fecha | Cambio |
| --- | --- |
| 2026-10-22 | Borrador inicial para issue #239; rama base del bootcamp: `245-chore-remove-victor-references-sergio-cortes`. |
