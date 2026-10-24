# Plan técnico 004 · Quitar las referencias personales

> Estado: **Borrador** (2026-10-24) · Spec: [spec.md](spec.md) v0.1 · Creado: 2026-10-24

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

---

## 1. Visión general

Se editan documentos de texto y documentación Markdown. No hay cambios en la lógica de Python ni en los archivos estáticos de la aplicación.

Se añade un nuevo archivo de test `tests/test_personal_references.py` para verificar automáticamente que no queden referencias personales.

---

## 2. Decisiones

### 2.1 Rutas genéricas en el README (CA-01, CA-04)

En `README.md`, se sustituirán todas las apariciones de `staff/jose-miguel/asistenciapp` por `staff/<usuario>/asistenciapp`. Esto afecta principalmente a las secciones de "Preparar el entorno" y "Activar el entorno".

### 2.2 Anonimización de AGENT.md y CONSTITUTION.md (CA-02)

Se sustituirá "Jose Miguel" por "el usuario" o se reformularán las frases para que sean impersonales.
Ejemplo: "aprobada por Jose Miguel" → "aprobada por el usuario" o "aprobada en esta copia".

### 2.3 Limpieza de Specs anteriores (CA-03)

En `specs/001...`, `specs/002...` y `specs/003...`:
- Se eliminarán las menciones a "Jose Miguel" en el historial de cambios y notas de decisiones.
- Se mantendrán las fechas y los hechos (ej: "Implementada", "Aprobada").

### 2.4 Test de verificación (CA-01, CA-02, CA-03)

Se creará `tests/test_personal_references.py` que:
1. Verificará que el README use la ruta genérica `<usuario>`.
2. Buscará el término "jose-miguel" (sin distinguir mayúsculas) en todos los archivos `.md` de la carpeta del proyecto, excepto en la propia carpeta de la Spec 004.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | El README muestra `staff/<usuario>/asistenciapp` en los comandos `cd`. |
| CA-02 | `AGENT.md` y `CONSTITUTION.md` no mencionan nombres propios. |
| CA-03 | Las specs anteriores conservan sus fechas y estados sin mencionar nombres. |
| CA-04 | `pytest` termina en verde. |

---

## 4. Comprobación de la constitución (v2.1)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Solo cambios en texto y un test sencillo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | Mejora la privacidad al eliminar nombres reales |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Todo el contenido nuevo está en español |
| §5 Calidad | Sí | Se añade un test específico de verificación |
| §6 Seguridad | Sí | No se tocan códigos ni entradas del usuario |

---

## 5. Decisiones tomadas

1. **Uso de `<usuario>`** (2026-10-24): Es el estándar del proyecto para representar rutas genéricas.
2. **Excluir Spec 004 del test** (2026-10-24): Esta spec debe nombrar la referencia para poder documentar qué se quita.
