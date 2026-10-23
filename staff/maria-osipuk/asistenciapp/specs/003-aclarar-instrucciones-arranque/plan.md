# Plan técnico 003 · Aclarar las instrucciones de arranque

> Estado: **Aprobado** (2026-10-23) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-23

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación es manual: el cambio es de títulos y de organización en el README, no de pantallas ni de comportamiento.

---

## 1. Visión general

Solo se edita [README.md](../../README.md). No se crea código. No se cambian comandos, rutas ni el funcionamiento de la aplicación.

El apartado 1 ya se titula «Preparar el entorno (solo la primera vez)» y se queda como está, cuerpo incluido.

El apartado 2, hoy titulado «Arrancar la app», mezcla activar el entorno con arrancar. Se parte en dos:

- **2. Activar el entorno (en cada terminal nueva).** Se lleva aquí el texto y los comandos que ya activan el entorno.
- **3. Arrancar la app.** Se queda aquí la tabla de clase online y de uso en local, y el texto de lo que se ve al arrancar.

Los apartados siguientes solo cambian de número. Su texto no se reescribe.

---

## 2. Decisiones

### 2.1 Tres apartados distintos (CA-01, CA-02)

| Apartado | Qué contiene | Qué no se mueve |
| --- | --- | --- |
| 1. Preparar el entorno (solo la primera vez) | El bloque actual, sin cambios | — |
| 2. Activar el entorno (en cada terminal nueva) | La frase «En cada terminal nueva, primero activa el entorno» y los dos comandos de entrar en la carpeta y activar | La tabla de arranque y el texto «Al arrancar verás» |
| 3. Arrancar la app | La tabla (clase online y solo en el ordenador) y todo lo que hoy sigue a esa tabla dentro del apartado 2 | Los comandos de activar |

La tabla sigue dentro de «Arrancar la app», así el arranque en local y el de una clase online se leen en ese paso y no en el de activar.

### 2.2 Activar no es arrancar (CA-03)

El título del apartado 2 pasa a ser «Activar el entorno (en cada terminal nueva)». Ese apartado deja de llamarse «Arrancar la app» y deja de incluir los comandos que ponen la aplicación en marcha.

No se añade una frase nueva. La frase que ya existe se queda, ahora bajo el título de activar.

### 2.3 Solo títulos, organización y números de sección (CA-04)

No se tocan:

- Las rutas personales de las instrucciones de uso.
- Los comandos, los comentarios de esos comandos y el ejemplo de lo que se ve al arrancar.
- El código, los tests y el resto de ficheros de la app.
- El texto de pasar lista, cerrar, problemas frecuentes, tests y privacidad.

Sí se renumeran los apartados que vienen detrás, para que la lista siga en orden:

| Ahora | Pasa a |
| --- | --- |
| 3. Pasar lista, paso a paso | 4. Pasar lista, paso a paso |
| 4. Cerrar la app | 5. Cerrar la app |
| 5. Problemas frecuentes | 6. Problemas frecuentes |
| 6. Tests | 7. Tests |
| 7. Privacidad | 8. Privacidad |

En problemas frecuentes, «ciérrala (sección 4)» pasa a «ciérrala (sección 5)», porque «Cerrar la app» cambia de número. Es el único ajuste de texto fuera de los títulos de arranque, y solo para que la remisión siga apuntando al mismo apartado.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | En el README, preparar, activar y arrancar son tres apartados con título propio |
| CA-02 | El apartado «Arrancar la app» contiene la tabla de clase online y de uso en local |
| CA-03 | El apartado de activar no se titula como arrancar y no incluye `python app.py` |
| CA-04 | El diff del README no cambia rutas, comandos ni el texto de los apartados posteriores, salvo los números de sección y la remisión «sección 5». `git diff` del resto de la app está vacío |

---

## 4. Comprobación de la constitución (v2.2)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se añade una plataforma ni se cambia el registro |
| P2 Simplicidad | Sí | Se parten títulos que ya existían. No hay un mecanismo nuevo |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos nuevos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | La spec, este plan y los títulos del README están en español |
| §3 Stack | Sí | El stack no cambia |
| §4 SDD | Sí | El spec está aprobado. Este plan espera el ok antes de las tasks y del cambio |
| §5 Calidad | Sí | Cada criterio tiene un paso manual en §3. No hay comportamiento nuevo que cubrir con tests |
| §6 Seguridad | Sí | No se toca el registro ni los códigos |
| §7 Alcance | Sí | El único fichero de la app que cambia en la implementación es el README, dentro de `staff/maria-osipuk/asistenciapp/` |
| §8 Enmiendas | Sí | No se enmienda la constitución |

---

## 5. Decisiones tomadas

1. **El apartado 1 no se reescribe** (2026-10-23): su título ya dice que preparar el entorno es solo la primera vez.
2. **Sin frase nueva** (2026-10-23): basta con el título de activar y con sacar de ese apartado los comandos de arranque.
3. **Las referencias personales se quedan** (2026-10-23): las rutas a otra carpeta no entran en este cambio.
4. **La remisión de problemas frecuentes sigue a «Cerrar la app»** (2026-10-23): «sección 4» pasa a «sección 5» y nada más de ese apartado cambia.
