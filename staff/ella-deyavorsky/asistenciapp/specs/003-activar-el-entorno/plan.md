# Plan técnico 003 · Activar el entorno no es arrancar la app

> Estado: **Implementado (2026-10-24)** · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-24 · Aprobado: 2026-10-24

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación es manual: el cambio es un título del README, no una pantalla ni un comportamiento de la app.

En esta rama (#306) el README **ya trae** este cambio (de la issue #301). Por eso la implementación será sobre todo **verificar** que el texto cumple CA-01…04, y ajustarlo si algo faltara.

---

## 1. Visión general

Se edita un solo fichero que ya existe: [README.md](../../README.md).

No hay arquitectura nueva, ni modelo de datos, ni rutas, ni código, ni tests nuevos. No se añade ninguna dependencia.

El bloque que estaba bajo «2. Arrancar la app» mezclaba dos pasos. Se separan en dos títulos seguidos. El texto de cada paso se queda donde está.

---

## 2. Decisiones

### 2.1 El bloque del entorno cambia de título (CA-01, CA-03)

La sección 2 pasa a llamarse **Activar el entorno**. Debajo se quedan la frase «En cada terminal nueva, primero activa el entorno» y el bloque con `cd` y `source .venv/bin/activate`.

Ese bloque no lleva el título «Arrancar la app».

La ruta para entrar en la carpeta no se toca. Está fuera de alcance.

### 2.2 «Arrancar la app» queda en la sección siguiente (CA-02, CA-03)

Justo después, una sección nueva se titula **Arrancar la app**. Debajo solo van:

- la tabla con las dos formas de ponerla en marcha: `python app.py --tunel` (clase online) y `python app.py` (prueba en el propio ordenador);
- lo que ya explica qué se ve al arrancar (el panel, el enlace privado y las dos notas).

Ahí no está el paso de activar el entorno.

### 2.3 El resto conserva el texto y se renumeran los títulos (CA-04)

Al insertar un título, los siguientes suben un número. El cuerpo no cambia.

| Antes | Después |
| --- | --- |
| 3. Pasar lista, paso a paso | 4. Pasar lista, paso a paso |
| 4. Cerrar la app | 5. Cerrar la app |
| 5. Problemas frecuentes | 6. Problemas frecuentes |
| 6. Tests | 7. Tests |
| 7. Privacidad | 8. Privacidad |

En problemas frecuentes, la frase del puerto ocupado decía «ciérrala (sección 4)». Esa sección 4 era «Cerrar la app», que pasa a ser la 5. Se cambia solo ese número, a «sección 5», para que siga señalando el mismo sitio. Es el único cambio de palabras fuera de los dos títulos.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | El bloque con `cd` y `source .venv/bin/activate` está bajo «Activar el entorno» y no bajo «Arrancar la app» |
| CA-02 | Bajo «Arrancar la app» solo están `python app.py --tunel` y `python app.py`, más el texto de lo que se ve al arrancar |
| CA-03 | Bajo «Arrancar la app» no aparece `source .venv/bin/activate` |
| CA-04 | El diff del README, fuera de los dos títulos y de «sección 4» → «sección 5», no cambia frases de preparar el entorno, pasar lista, cerrar, problemas, tests ni privacidad. La ruta para entrar en la carpeta sigue igual |

`pytest` se lanza una vez al terminar, para confirmar que el código no se ha tocado. No hay un test nuevo: la constitución §5 admite la verificación manual cuando el criterio no es un comportamiento de la app.

---

## 4. Comprobación de la constitución (v2.1)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Se parten dos títulos en el README. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Los títulos nuevos y este plan están en español |
| §5 Calidad | Sí | Cada criterio tiene un paso manual en §3 |
| §6 Seguridad | Sí | No se tocan códigos, sesiones ni entradas del usuario |

---

## 5. Decisiones tomadas

1. **Dos secciones seguidas** (2026-10-24): «Activar el entorno» y, después, «Arrancar la app». No se deja el entorno como un párrafo dentro de arrancar.
2. **Renumerar** (2026-10-24): los títulos de después suben un número. El único ajuste de texto es la remisión «sección 4» → «sección 5».
3. **Sin test automático** (2026-10-24): la comprobación es leer el README, como permite la constitución §5.
