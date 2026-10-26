# Plan técnico 003 · Títulos de las instrucciones de arranque

> Estado: **Aprobado** · Spec: [spec.md](spec.md) aprobada · Creado: 2026-10-23 · Paso a las tareas: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

No hay arquitectura nueva, ni modelo de datos, ni rutas. No se añade ninguna dependencia. El cambio es el título de dos bloques en el documento de uso que ya existe.

---

## 1. Archivos

| Archivo | Qué se hace | Cubre |
| --- | --- | --- |
| `README.md` | El apartado 2 pasa a titularse «Activar el entorno». «Arrancar la app» queda solo encima de los pasos que ejecutan la aplicación | CA-01, CA-02, CA-03 |

No se crean código ni tests. No se toca la aplicación, la constitución ni el manual del agente. `tasks.md` se escribe en la fase siguiente, no aquí.

La ruta que ya está en las instrucciones (`staff/victor-chang/asistenciapp/`) no se cambia: la spec no lo pide. Los apartados 3 a 7 y la mención de la sección 4 tampoco se renumeran.

---

## 2. Decisiones

### 2.1 El apartado 2 (CA-01, CA-03)

El título `## 2. Arrancar la app` pasa a `## 2. Activar el entorno`.

Se quedan igual el párrafo «En cada terminal nueva, primero activa el entorno» y el bloque de comandos que entra en la carpeta y prepara el entorno.

### 2.2 Los pasos que ejecutan la aplicación (CA-02, CA-03)

Justo antes de la tabla de esos pasos se añade el título `### Arrancar la app`.

La tabla no se reescribe. Sigue teniendo las dos filas que ya existen: una para una clase online y otra para probar solo en el ordenador. El ejemplo de salida y el resto del apartado se quedan donde están.

El título nuevo es un subtítulo del apartado 2 para no renumerar los apartados 3 a 7.

---

## 3. Verificación manual

No hay test nuevo. La app no cambia de comportamiento. La comprobación es leer `README.md` y el diff.

| Criterio | Qué se lee | Resultado |
| --- | --- | --- |
| CA-01 | Apartado 2 del `README.md` | El bloque que entra en la carpeta y prepara el entorno se titula «Activar el entorno» y ya no se titula «Arrancar la app» |
| CA-02 | La tabla de ese mismo apartado | Los dos pasos que ejecutan la aplicación están bajo «Arrancar la app» |
| CA-03 | El diff de `README.md` | Solo cambian esos dos títulos. Comandos, rutas, formato y el resto del documento siguen igual. Ningún otro archivo cambia |

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade ninguna plataforma ni se toca el registro de asistencia |
| P2 Simplicidad | Sí | Son dos títulos en el documento que ya existe. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guarda ningún dato nuevo |
| P5 Accesible y móvil | Sí | No hay pantallas nuevas |
| P6 Español | Sí | La spec, este plan y los títulos del documento de uso están en español |
| Apartado 5, calidad | Sí | CA-01 a CA-03 se comprueban leyendo, en la tabla de arriba. No hay test automático porque la app no cambia |
| Apartado 6, seguridad | Sí | Los códigos, el registro único y la sesión cerrada no se tocan |
