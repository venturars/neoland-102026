# Spec 003 · Aclarar las instrucciones de arranque

> Estado: **Implementada** (2026-10-23) · Creada: 2026-10-23 · Issue: #298

---

## 1. Problema

Quien abre las instrucciones de arranque del README ve mezclados tres momentos distintos. El apartado que se titula como arrancar la aplicación empieza activando el entorno. Quien lo lee puede creer que, al activar el entorno en una terminal nueva, la aplicación ya está funcionando.

Hace falta distinguir estos tres momentos:

- Preparar el entorno por primera vez.
- Activar el entorno virtual en cada terminal nueva.
- Arrancar la aplicación, tanto en local como para una clase online.

Activar el entorno no debe presentarse como si la aplicación ya estuviera funcionando.

Este cambio solo aclara los títulos y la organización de esas instrucciones.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien arranca la aplicación** | Saber qué hace la primera vez, qué repite en cada terminal nueva y qué pone la aplicación en marcha, sin confundir activar el entorno con arrancar. |
| **Quien trabaja en esta carpeta** | Que este cambio se quede en los títulos y la organización de esas instrucciones. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que arranca la aplicación, quiero ver por separado preparar el entorno por primera vez, activar el entorno virtual en cada terminal nueva y arrancar la aplicación, para no saltarme un paso ni creer que ya está en marcha.
- **HU-02**: Como persona que arranca la aplicación, quiero que activar el entorno no se presente como si la aplicación ya estuviera funcionando, para saber que todavía tengo que arrancarla.
- **HU-03**: Como persona que arranca la aplicación, quiero que el paso de arrancar cubra tanto el uso en local como una clase online, para elegir el modo sin buscarlo dentro del paso de activar.
- **HU-04**: Como persona que trabaja en esta carpeta, quiero que este cambio solo corrija los títulos y la organización de esas instrucciones, para no mezclarlo con limpiar referencias personales, reorganizar código o cambiar el funcionamiento.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Tres pasos distintos (HU-01, HU-03)

- **CA-01**: **Dado** el README de esta aplicación, **cuando** se leen las instrucciones de arranque, **entonces** preparar el entorno por primera vez, activar el entorno virtual en cada terminal nueva y arrancar la aplicación aparecen como pasos distintos.
- **CA-02**: **Dado** el paso de arrancar la aplicación, **cuando** se lee, **entonces** distingue el arranque en local y el arranque para una clase online.

### Activar no es arrancar (HU-02)

- **CA-03**: **Dado** el paso de activar el entorno virtual, **cuando** se lee su título y el texto que lo acompaña, **entonces** no se presenta como si la aplicación ya estuviera funcionando.

### Solo títulos y organización (HU-04)

- **CA-04**: **Dado** este cambio, **cuando** se compara el README con el de antes, **entonces** solo cambian los títulos y la organización de las instrucciones de arranque. Las referencias personales, el código y el funcionamiento de la aplicación siguen igual.

---

## 5. Fuera de alcance

- Limpiar referencias personales del README (nombres o carpetas de otras personas).
- Reorganizar el código.
- Cambiar el funcionamiento de la aplicación.
- Cambiar cómo se pasa lista, se cierra la aplicación o se resuelven los problemas frecuentes, salvo el número de sección que les toque si los pasos de arranque pasan a ser tres.

---

## 6. Preguntas abiertas

Ninguna. Los tres momentos, la separación entre activar y arrancar, y el límite de solo títulos y organización quedaron decididos el 2026-10-23 (issue #298).

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-23 | Versión inicial, aprobada el mismo día | Issue #298: aclarar las instrucciones de arranque del README |
| 1.0 | 2026-10-23 | Implementada, sin cambio de requisitos | T01–T03 hechas en el README |
