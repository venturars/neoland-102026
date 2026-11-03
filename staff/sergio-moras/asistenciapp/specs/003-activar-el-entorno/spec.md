# Spec 003 · Separar «activar el entorno» de «arrancar la app»

> Estado: **Implementada** (2026-11-01) · Creada: 2026-11-01 · Aprobada: 2026-11-01 · Issue: #722

---

## 1. Problema

En el README, la sección «2. Arrancar la app» empieza con un bloque que solo entra en la carpeta y activa el entorno virtual. Después de ejecutarlo, la app sigue parada. Quien lo sigue paso a paso puede pensar que ya la ha arrancado y no entender por qué el enlace no responde.

Arrancar la app es otra cosa: elegir entre clase online y prueba en el propio ordenador. Las dos acciones están bajo el mismo título y se confunden.

---

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| **Quien sigue el README para dar clase o probar la app** | Saber qué paso solo prepara la terminal y cuál pone la app en marcha. |

---

## 3. Historias de usuario

- **HU-01**: Como quien sigue el README, quiero que el paso que prepara la terminal tenga su propio título, para no confundirlo con arrancar.
- **HU-02**: Como quien sigue el README, quiero que bajo «Arrancar la app» solo estén las formas de arrancarla, para saber qué ejecutar después de preparar la terminal.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** el README, **cuando** se busca el bloque que entra en la carpeta y activa el entorno, **entonces** está bajo un título propio de activar el entorno.
- **CA-02**: **Dado** el título «Arrancar la app», **cuando** se lee su contenido, **entonces** solo aparecen la clase online y la prueba local, con lo que se ve al arrancar.
- **CA-03**: **Dado** el título «Arrancar la app», **cuando** se lee su contenido, **entonces** no incluye el paso de activar el entorno.
- **CA-04**: **Dado** el resto del README, **cuando** se aplica el cambio, **entonces** su contenido es el mismo; solo cambia la numeración de las secciones y las remisiones a ellas.

---

## 5. Fuera de alcance

- La ruta de la carpeta que aparece en los comandos.
- Cómo arranca la app.
- Otros títulos o textos del README.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Aprobada e implementada |
