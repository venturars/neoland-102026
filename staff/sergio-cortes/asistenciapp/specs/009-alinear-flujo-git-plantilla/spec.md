# Spec 009 · Alinear el flujo de git con la plantilla

> Estado: **Implementada** (2026-11-05), salvo CA-06 pendiente de fusión de [#1143](https://github.com/venturars/neoland-102026/pull/1143) · Versión 1.1 · Creada: 2026-11-05 · Issue: [#1145](https://github.com/venturars/neoland-102026/issues/1145)

> Nota: los cambios de la rama `1145-chore-align-asistenciapp-git-workflow` se hicieron antes de escribir esta spec (commit `0d018e3d`). Se revisan contra estos criterios. La PR queda en borrador hasta que se apruebe esta spec.

---

## 1. Problema

La carpeta de AsistenciApp tiene una copia antigua del flujo de trabajo del curso. La plantilla del ejercicio es la fuente de la verdad y ha cambiado desde entonces: instrucciones del agente, skills, plantillas de issue y pull request, y herramientas. Quien trabaja en esta carpeta sigue reglas que ya no son las del curso.

Además, una de las herramientas, la que abre la pull request, no puede ejecutarse directamente porque no tiene el permiso de ejecución que sí tienen las demás.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien trabaja en esta carpeta** | Usar el flujo actual del curso sin copiarlo a mano. |
| **Quien revisa y el profesor** | Que las copias del flujo coincidan con la plantilla, salvo las rutas propias de cada carpeta. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que trabaja en esta carpeta, quiero que las instrucciones del flujo sean las de la plantilla, para no seguir reglas antiguas.
- **HU-02**: Como persona que trabaja en esta carpeta, quiero que cada herramienta del flujo se pueda ejecutar directamente, para que todas se comporten igual.
- **HU-03**: Como revisor, quiero comparar esta carpeta con la plantilla y ver solo diferencias de ruta, para revisar rápido.
- **HU-04**: Como profesor, quiero que la plantilla siga siendo la única fuente, para que las copias no se desvíen.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Contenido (HU-01, HU-04)

- **CA-01**: **Dado** el flujo de la plantilla, **cuando** se compara con esta carpeta, **entonces** las instrucciones, skills, plantillas y herramientas coinciden, salvo las rutas propias de esta carpeta.
- **CA-02**: **Dado** las skills de terminal de esta carpeta, **cuando** se leen, **entonces** su ruta apunta a `staff/sergio-cortes/asistenciapp/tools/`.
- **CA-03**: **Dado** la plantilla del ejercicio, **cuando** se revisa este cambio, **entonces** no se ha editado.

### Herramientas ejecutables (HU-02)

- **CA-04**: **Dado** cada herramienta de `tools/`, **cuando** se mira el permiso registrado en el repositorio, **entonces** es ejecutable (`100755`), incluida la que abre pull requests.
- **CA-05**: **Dado** la herramienta que abre pull requests, **cuando** se ejecuta sin argumentos, **entonces** muestra el mensaje de uso y sale con código 1, sin error de permisos.

### Comparación y pendientes (HU-03)

- **CA-06**: **Dado** que la PR #1143 de la plantilla se fusiona, **cuando** se compara, **entonces** la copia y la plantilla coinciden también en el permiso de esa herramienta.
- **CA-07**: **Dado** este cambio, **cuando** se revisan los ficheros modificados, **entonces** solo hay ficheros de flujo de git dentro de esta carpeta. No cambia el código de la app.
- **CA-08**: **Dado** el pasar lista, **cuando** se ejecutan sus tests, **entonces** pasan los 96 de antes.

---

## 5. Fuera de alcance (en esta spec)

- Cambiar el código de la app, sus tests, sus dependencias o su README.
- Editar la plantilla del ejercicio.
- Tocar las carpetas de otros alumnos.
- Modificar las specs 001 a 008.
- Fusionar la pull request a `staging`.
- Incluir `test.py` ni `contextlibtest.py`, que siguen fuera de este cambio.

---

## 6. Preguntas abiertas

- **¿La pull request se queda en borrador hasta aprobar esta spec, o se puede pedir revisión antes?** Resuelta: se queda en borrador por ahora.
- **¿Esta spec se cierra antes de fusionar #1143, o espera a que CA-06 se cumpla?** Resuelta: se cierra cuando se cumplan CA-01 a CA-05 y CA-08. CA-06 se verifica al fusionar #1143.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-11-05 | Borrador inicial | Issue #1145: alinear el flujo de git con la plantilla del ejercicio |
| 0.2 | 2026-11-05 | Preguntas resueltas | La PR queda en borrador por ahora. El cierre de la spec no espera a #1143; CA-06 se verifica al fusionarla |
| 1.0 | 2026-11-05 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-11-05 | Implementada | T01 a T09 hechas; CA-01 a CA-05, CA-07 y CA-08 verificados. CA-06 pendiente de fusión de #1143 (T10) |
