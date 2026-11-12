# Plan técnico 009 · Un AGENTS.md más simple

> Estado: **Implementado (2026-10-29)** · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-29 · Aprobado: 2026-10-29

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre. La comprobación es manual: el cambio es documentación, no una pantalla ni un comportamiento de la app.

---

## 1. Visión general

Se editan cuatro ficheros que ya existen:

- [AGENTS.md](../../AGENTS.md)
- [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)
- [README.md](../../README.md)
- [specs/007-lista-de-alumnos/tasks.md](../007-lista-de-alumnos/tasks.md) (solo la tarea T32)

No hay arquitectura nueva, ni modelo de datos, ni rutas, ni código, ni tests nuevos. No se añade ninguna dependencia.

---

## 2. Decisiones

### 2.1 Sin párrafo de presentación (CA-01)

Se borran las líneas 3 y 4 de `AGENTS.md`: el párrafo «Este archivo explica **cómo debe trabajar un agente de IA**…» y la línea en blanco de después. El título queda seguido del separador `---` y de «1. Antes de hacer nada».

### 2.2 La frase de la constitución (CA-02)

La línea 17 pasa de:

> Si algo de lo que te piden contradice la constitución, **para y avisa** antes de escribir nada.

a:

> Si lo que te piden va en contra de la constitución, **no cambies ningún fichero**. Di a la persona que trabaja en esta carpeta qué regla choca con la petición y espera su respuesta.

### 2.3 La estructura de carpetas pasa a la arquitectura (CA-03, CA-04)

Se quita de `AGENTS.md` la sección «3. Estructura de carpetas» entera: el árbol y la frase de cómo se numeran las specs.

En `docs/ARCHITECTURE.md` se añade al final una sección **«6. Estructura de carpetas»**, con el mismo árbol y la misma frase. Va al final para no cambiar los números de las secciones 1–5. En el árbol cambian dos comentarios, porque el fichero ya no es el mismo:

| Línea | Antes | Después |
| --- | --- | --- |
| `AGENTS.md` | `# este archivo` | `# manual de trabajo para agentes de IA` |
| `ARCHITECTURE.md` | `# partes del código y dependencias permitidas` | `# este archivo: partes del código y dependencias permitidas` |

### 2.4 Los comandos pasan al README (CA-05, CA-06)

Se quita de `AGENTS.md` la sección «4. Comandos» entera.

Se comparó cada fila de la tabla con el README:

| Comando de `AGENTS.md` | En el README |
| --- | --- |
| Preparar el entorno (`python3 -m venv .venv`, activar, `pip install -r requirements.txt`) | Ya está (sección 1) |
| Activar el entorno en cada terminal nueva | Ya está (sección 2) |
| `brew install cloudflared` | Ya está (sección 1) |
| `python app.py --tunel`, que imprime el enlace del panel | Ya está (sección 3) |
| `python app.py`, que abre en `http://localhost:8000` | El comando está; **falta la dirección** |
| `pytest` | Ya está (sección 7) |
| «Las únicas dependencias son Flask y pytest (constitución P3)» | El README dice «instala Flask y pytest»; **falta que son las únicas** |

Solo se añade lo que falta:

- En la tabla de «3. Arrancar la app», la fila «Probar solo en tu ordenador» pasa a `python app.py` (abre en `http://localhost:8000`).
- En «1. Preparar el entorno», debajo del bloque de comandos: «Las únicas dependencias son Flask y pytest (constitución P3).»

### 2.5 Sin reglas de comportamiento (CA-07)

Se quita de `AGENTS.md` la sección «5. Reglas de comportamiento» entera, con sus siete puntos.

### 2.6 Renumerar (CA-10)

| Antes | Después |
| --- | --- |
| 6. Normas de escritura del código | 3. Normas de escritura del código |
| 7. Definición de "terminado" | 4. Definición de "terminado" |
| 8. Estado actual | 5. Estado actual |

En «1. Antes de hacer nada», el punto 4 pasa de «(ver §8 "Estado actual")» a «(ver §5 "Estado actual")». Es la única referencia de `AGENTS.md` a sus propias secciones. Las demás («constitución §5», «constitución §8») son de la constitución y no cambian.

En `specs/007-lista-de-alumnos/tasks.md`, la tarea abierta T32 pasa de «`AGENTS.md` §8» a «`AGENTS.md` §5». Las tareas ya hechas y el resto de specs 001–008 no se tocan.

### 2.7 Lo que no cambia (CA-08, CA-09)

El texto de «1. Antes de hacer nada» (salvo 2.2 y 2.6), «2. Flujo SDD», las normas de escritura, «terminado» y el estado actual se queda igual. `tests/test_architecture.py` sigue encontrando `AGENTS.md` con `:param`, `:return` y `Usage`, porque las normas de escritura se quedan.

Al terminar, la tabla del estado actual recibe la fila de la spec 009.

---

## 3. Comprobación manual

| Criterio | Qué mirar |
| --- | --- |
| CA-01 | Debajo del título de `AGENTS.md` no está el párrafo «Este archivo explica…» |
| CA-02 | La frase de la constitución es la de 2.2 |
| CA-03 | `grep -n "Estructura de carpetas" AGENTS.md` no devuelve nada |
| CA-04 | `docs/ARCHITECTURE.md` tiene la sección 6 con el árbol y la frase de numeración de specs |
| CA-05 | `grep -n "## .*Comandos" AGENTS.md` no devuelve nada |
| CA-06 | Cada fila de la tabla de 2.4 está en el README; la dirección `http://localhost:8000` y «las únicas dependencias» aparecen una vez |
| CA-07 | `grep -n "Reglas de comportamiento" AGENTS.md` no devuelve nada |
| CA-08 | El diff de `AGENTS.md`, fuera de lo quitado, la frase de 2.2 y los números de 2.6, no cambia texto |
| CA-09 | `pytest` en verde |
| CA-10 | Los títulos de `AGENTS.md` van del 1 al 5; `grep -n "§8" AGENTS.md` solo encuentra «constitución §8»; T32 de la spec 007 dice §5 |

No hay un test nuevo: la constitución §5 admite la verificación manual cuando el criterio no es un comportamiento de la app.

---

## 4. Comprobación de la constitución (v4.0)

| Regla | ¿Cumple? | Cómo |
| --- | --- | --- |
| P1 Independiente de plataforma | Sí | No se cambia el registro ni se ata a una plataforma |
| P2 Simplicidad | Sí | Se quita texto repetido; cada cosa queda en un solo sitio |
| P3 Dependencias mínimas | Sí | No se añade ninguna dependencia |
| P4 Privacidad | Sí | No se guardan datos |
| P5 Accesible y móvil | Sí | No se tocan pantallas |
| P6 Español | Sí | Todo el texto nuevo está en español |
| §3 Stack | Sí | El stack no cambia |
| §4 SDD | Sí | Spec 009 aprobada antes de tocar ningún fichero; plan y tasks esperan el ok |
| §5 Calidad | Sí | Cada criterio tiene un paso manual en §3 y `pytest` pasa |
| §6 Seguridad | Sí | No se tocan códigos, sesiones ni entradas del usuario |
| §7 Alcance | Sí | Todo queda en `staff/ella-deyavorsky/asistenciapp/`. La regla «solo se edita dentro de esta carpeta» sigue en la constitución §7 aunque desaparezca de `AGENTS.md` |
| §8 Enmiendas | Sí | No se enmienda la constitución |

---

## 5. Decisiones tomadas

1. **Renumerar** (2026-10-29): las secciones de `AGENTS.md` van del 1 al 5, y se actualizan la referencia «§8» y la tarea abierta T32 de la spec 007.
2. **La estructura va al final de la arquitectura** (2026-10-29): sección 6, para no cambiar los números de las secciones 1–5.
3. **Sin test automático** (2026-10-29): la comprobación es leer los documentos, como permite la constitución §5.
