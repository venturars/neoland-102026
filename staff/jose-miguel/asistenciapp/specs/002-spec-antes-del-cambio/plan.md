# Plan técnico 002 · Spec antes del cambio

> Estado: **Implementado** (2026-10-22) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-22

Este documento explica **cómo** queda lo que pide la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. El cambio ya está escrito en las reglas de esta copia. Este plan no añade código de la app.

---

## 1. Visión general

La parada vive en las reglas de esta copia, no en código nuevo. Quien trabaja aquí es Jose Miguel y la carpeta es `staff/jose-miguel/asistenciapp/`.

Si pide un cambio y no hay una spec aprobada por él, el agente no escribe. Eso vale para las instrucciones de uso, las comprobaciones, el resto de documentación de uso y el código de una funcionalidad nueva. La issue, la rama y la pull request del bootcamp dejan la tarea apuntada y no sustituyen a la spec de la app.

El historial de la spec 001 no se reescribe.

---

## 2. Decisiones clave

### 2.1 La constitución frena cualquier cambio (CA-01, CA-02, CA-03, CA-04, CA-05)

En `CONSTITUTION.md`, versión 3.0, el §4 dice: no hay cambio sin especificación aprobada. Incluye el código de una funcionalidad nueva, las instrucciones de uso, las comprobaciones y el resto de documentación de uso. Jose Miguel aprueba la spec antes de pasar al plan. La issue, la rama y la pull request no sustituyen a esta spec. Si no hay spec aprobada, no se escribe.

### 2.2 Carpeta y quien aprueba (CA-06)

- §7: el proyecto vive en `staff/jose-miguel/asistenciapp/`. No se tocan archivos fuera de esta carpeta.
- §8: solo Jose Miguel aprueba una enmienda.
- La enmienda 3.0 queda en el historial, con fecha 2026-10-22.

### 2.3 El manual del agente repite la parada (CA-01 a CA-06)

Al inicio del flujo de `AGENT.md` está la misma frase: nada se escribe sin una spec aprobada por Jose Miguel. El ok de cada fase se le pide a él. Los comandos y la edición se limitan a `staff/jose-miguel/asistenciapp/`. La tabla de estado marca esta spec como implementada.

### 2.4 Las instrucciones de arranque usan esta carpeta (CA-01)

En `README.md`, los dos `cd` de preparar el entorno y de arrancar la app apuntan a `staff/jose-miguel/asistenciapp`.

### 2.5 Cómo se comprueba

CA-01 a CA-06 se comprueban leyendo esas frases. No hay test automático: la parada es una regla para el agente, no un comportamiento de la pantalla de asistencia (constitución §5).

---

## 3. Comprobación de la constitución (v3.0)

- **P1** Independiente de plataforma. Esta spec no cambia el check-in.
- **P2** Simplicidad. La parada es una frase en las reglas que ya existían. No se añade código.
- **P3** Dependencias mínimas. No se añade ninguna.
- **P4** Privacidad. No se guardan datos nuevos.
- **P5** Accesible y móvil. No hay pantalla nueva.
- **P6** Español. Las reglas nuevas están en español.
- **§5** Calidad. CA-01 a CA-06 se verifican al leer las reglas, como permite §5 cuando no cabe un test automático.
- **§6** Seguridad. No cambia los códigos ni los registros.
- **§7 y §8** La carpeta y quien aprueba son los de esta copia.
