# Spec 008 · Aspecto de Neoland

> Estado: **Aprobada v1.0 (2026-10-28)** · Creada: 2026-10-28 · Issue relacionada: #544

---

## 1. Problema

La app la van a usar los profesores de Neoland. Hoy tiene un aspecto propio (azul, botones casi rectangulares) que no se parece a la web de la escuela, neoland.es. Los profesores y los alumnos deberían reconocerla como una herramienta de Neoland.

**Solución en una frase.** La app toma los colores, las tipografías y las formas de neoland.es, sin cambiar nada de lo que hace ni de lo que dice.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor de Neoland** | Una herramienta que se vea como el resto de Neoland y que se lea bien al compartir pantalla. |
| **Alumno** | Registrarse igual de rápido que hoy, en el móvil, con el aspecto de la web de su escuela. |
| **Persona que trabaja en esta carpeta** | Cambiar solo el aspecto: ninguna funcionalidad ni ningún texto cambian, y nada nuevo sale del ordenador del profesor. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero que el panel, los grupos y las sesiones tengan el aspecto de neoland.es.
- **HU-02**: Como alumno, quiero que la página para pasar lista tenga ese mismo aspecto, también en el móvil.
- **HU-03**: Como persona que trabaja aquí, quiero que todo siga funcionando igual y que la app no dependa de servicios de fuera para verse así.

---

## 4. Requisitos funcionales

### 4.1 Aspecto · HU-01, HU-02

- **RF-1** Colores de neoland.es: carmesí `#E6284E` como color principal, gris carbón `#333333` en las zonas oscuras, fondo gris muy claro `#F5F5F5`, tarjetas blancas y texto gris oscuro `#3A3A3A`. Donde el carmesí no se leería bien (texto pequeño sobre fondo claro), se usa un carmesí algo más oscuro, `#C41E42`.
- **RF-2** Tipografías de neoland.es: Montserrat muy gruesa en los títulos y Roboto en el resto.
- **RF-3** Formas de neoland.es: tarjetas sin sombra y muy redondeadas, campos redondeados y botones en forma de píldora. Hay tres tipos de botón:
  - **principal**, relleno de carmesí («Abrir asistencia», «Subir lista», «Ver la lista», «Estoy en clase»…);
  - **secundario**, con borde gris oscuro («Editar», «Archivar», «Ver», «Descargar lista», «Revisar»…);
  - **de peligro**, con borde carmesí («Borrar», «Quitar», «Cerrar asistencia»…). Las confirmaciones («Sí, borrar», «Sí, cerrar»…) van rellenas de carmesí oscuro.
- **RF-4** El código de la sesión se ve en una banda gris carbón, con los números en blanco y en Montserrat, como la portada de neoland.es, para que se lea bien al compartir pantalla. El enlace y el botón de copiarlo van dentro de esa banda.
- **RF-5** Las etiquetas que hoy van encima de un título o del código («Pasar lista», «Código para pasar lista») se ven como en neoland.es: pequeñas, en mayúsculas y en carmesí.
- **RF-6** Los estados («abierta», «cerrada»), las marcas de los nombres con problema («Repetido», «Demasiado largo») y los mensajes (correcto, aviso, error) mantienen su significado, con las formas nuevas.
- **RF-7** Modo oscuro: si el ordenador o el móvil está en modo oscuro, la app usa los grises oscuros de Neoland (fondo `#262626`, tarjetas `#333333`), texto claro y un carmesí más claro donde haga falta para leerse bien.
- **RF-8** Sin cabecera ni logo de Neoland: solo colores, tipografías y formas.

### 4.2 Lo que no cambia · HU-03

- **RF-9** Todas las funcionalidades, pantallas, textos y el orden de los elementos siguen como hoy.
- **RF-10** Las tipografías van dentro de la app: ni el navegador del profesor ni el de los alumnos piden nada a servicios de fuera para mostrarlas (constitución P4). Si no cargaran, la app se ve con las tipografías del sistema.
- **RF-11** Accesible (constitución P5): todo texto y todo botón cumple el contraste AA (4,5:1 en texto normal y 3:1 en texto grande), en modo claro y oscuro; se sigue usando con teclado, con el foco visible; y a unos 400 px se usa sin zoom ni desplazamiento lateral.

---

## 5. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01** (RF-9): **Dado** cualquier flujo de hoy (crear y editar un grupo, abrir una sesión rápida o con grupo, registrarse como alumno, liberar, cerrar, decidir sobre un nuevo, descargar), **cuando** se hace después del cambio, **entonces** funciona igual y con los mismos textos.
- **CA-02** (RF-1 a RF-6, RF-8): **Dado** la página de inicio, el panel, la vista de grupo, una sesión abierta y una cerrada, y la página del alumno, **cuando** se miran junto a neoland.es, **entonces** usan sus colores, sus tipografías, sus tarjetas y sus botones píldora; el código sale en la banda gris carbón; y no hay cabecera ni logo.
- **CA-03** (RF-7): **Dado** un ordenador en modo oscuro, **cuando** se abren esas mismas pantallas, **entonces** se ven con los grises oscuros de Neoland y todo se lee bien.
- **CA-04** (RF-1, RF-7, RF-11): **Dado** cada combinación de texto y fondo de la app, en modo claro y oscuro, **cuando** se mide su contraste, **entonces** cumple AA.
- **CA-05** (RF-11): **Dado** un móvil de unos 400 px, **cuando** se usan esas pantallas, **entonces** no hay desplazamiento lateral ni hace falta zoom, y todo se puede usar con el teclado.
- **CA-06** (RF-2, RF-10): **Dado** el panel y la página del alumno abiertos, **cuando** se miran las peticiones del navegador, **entonces** todas van a la propia app, y los títulos salen en Montserrat y el texto en Roboto.

---

## 6. Fuera de alcance

- Logo, cabecera o pie de Neoland.
- Cambiar textos, añadir pantallas o funcionalidades.
- Iconos, imágenes o animaciones de neoland.es.
- Un selector de tema para el profesor.

---

## 7. Preguntas abiertas

Ninguna. Decisiones de la persona que trabaja en esta carpeta (2026-10-28):

- **Tarea:** nueva (issue #544), sobre la rama de la spec 007, para que también cambien las pantallas de grupos.
- **Tipografías:** dentro de la app, sin pedirlas a servicios de fuera.
- **Modo oscuro:** se mantiene, con los grises oscuros de Neoland.
- **Marca:** sin cabecera ni logo; solo colores, tipografías y formas.
- **Medidas:** los colores, las tipografías, los radios y los botones se tomaron de neoland.es el 2026-10-28.

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-28 | Borrador inicial | Issue #544: la app la usarán profesores de Neoland y debe parecerse a neoland.es |
| 1.0 | 2026-10-28 | Aprobada | Ok de la persona que trabaja en esta carpeta |
