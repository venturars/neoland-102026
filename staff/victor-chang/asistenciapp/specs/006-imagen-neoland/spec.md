# Spec 006 · Imagen Neoland

> Estado: **Aprobada** v1.0 (2026-10-27) · Creada: 2026-10-27

---

## 1. Problema

AsistenciApp es un proyecto del Bootcamp de AI Engineering de Neoland, pero sus pantallas usan un estilo neutro (azul y gris, letra del sistema) que no se parece en nada a Neoland. Victor quiere que la app **se reconozca como parte del bootcamp**, con un aspecto parecido al de [neoland.es](https://neoland.es/).

Lo que se ve en neoland.es (medido el 2026-10-27):

| Elemento | Valor |
| --- | --- |
| Color principal | rojo `#E6284E` |
| Fondo oscuro (cabecera, portada) | gris carbón `#333333`, texto blanco |
| Texto normal | `#3A3A3A` sobre blanco |
| Letra de títulos | Montserrat, negrita |
| Letra del texto | Roboto |
| Botón principal | rojo sólido, texto blanco en negrita, esquinas poco redondeadas (4 px) |
| Botón secundario | borde rojo, sin relleno, esquinas totalmente redondeadas |
| Zonas destacadas | franjas con fondo rosa claro |

Es **solo inspiración**: no se copian el logotipo, las imágenes ni ningún otro recurso de Neoland.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Victor** y la clase | Que la app se vea como una herramienta del bootcamp de Neoland. |
| **Profesor** y **alumno** | Que todo siga funcionando **igual**, se lea bien en el móvil y con el modo oscuro, y que se pueda usar con el teclado. |

---

## 3. Historias de usuario

- **HU-01**: Como Victor, quiero que **las pantallas tengan los colores, la letra y la forma de los botones de Neoland**, para que la app se reconozca como parte del bootcamp.
- **HU-02**: Como profesor y como alumno, quiero que **la app funcione y se lea igual de bien que antes**, en el móvil, con el modo oscuro y con el teclado.
- **HU-03**: Como alumno, quiero que **abrir la página no avise a nadie de fuera** de la app, ni siquiera para cargar la letra.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Aspecto Neoland (HU-01)
- **CA-01**: **Dado** cualquier pantalla (inicio, panel del profesor, página del alumno), **entonces** tiene una **cabecera oscura** con el nombre "AsistenciApp" en la letra de títulos, y el color principal de botones, enlaces y marcas es el **rojo de Neoland** (o el tono cercano que fije P1).
- **CA-02**: **Dado** cualquier pantalla, **entonces** los títulos y el código de asistencia usan **Montserrat** y el resto del texto usa **Roboto**. Si la letra aún no ha cargado, el texto se ve igualmente con la letra del sistema.
- **CA-03**: **Dado** los botones, **entonces** el principal es rojo sólido con texto blanco en negrita, el secundario tiene borde rojo y fondo transparente, y el de peligro (borrar, cerrar asistencia) se distingue de los dos.
- **CA-04**: **Dado** las pantallas, **entonces** no aparece el logotipo, ninguna imagen ni ningún texto de Neoland.

### Igual de usable (HU-02)
- **CA-05**: **Dado** el cambio de aspecto, **entonces** no cambia ningún comportamiento: los criterios de las specs 001, 004 y 005 se siguen cumpliendo y todas las comprobaciones automáticas siguen pasando.
- **CA-06**: **Dado** el modo claro y el modo oscuro del sistema, **entonces** todo el texto tiene un contraste de al menos **4,5:1** con su fondo (3:1 en texto grande y en bordes de controles), y el foco del teclado se ve en todos los controles.
- **CA-07**: **Dado** una pantalla de **400 px** de ancho, **entonces** no hay desplazamiento horizontal y todos los botones miden al menos 44 px de alto.

### Nada sale de la app (HU-03)
- **CA-08**: **Dado** cualquier pantalla abierta, **entonces** el navegador solo pide archivos a la propia app: las letras se sirven **desde la app**, no desde Google ni otro sitio, y funcionan sin internet en clase local.

---

## 5. Requisitos no funcionales

- Ninguna dependencia nueva de Python ni de JavaScript. Las letras se añaden como archivos (licencia SIL Open Font License, que permite incluirlas), junto con su licencia.
- Las letras añadidas pesan **menos de 300 KB** en total (solo los caracteres latinos y los pesos que se usan).
- Ningún cambio en lo que se guarda (constitución P4).

---

## 6. Fuera de alcance

- Cambiar textos, pasos o funcionalidades de las pantallas.
- Herramientas de pruebas de navegador (Playwright): la revisión visual se hace a mano en Chrome, como en la spec 004 (T14). Decidido por Victor el 2026-10-27.
- Los puntos pendientes de la spec 004 (cerrar la asistencia de reuniones terminadas, excluir al profesor por nombre).

---

## 7. Preguntas abiertas

Todas resueltas el 2026-10-27 con Victor.

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | El rojo exacto de Neoland (`#E6284E`) con texto blanco tiene un contraste de **4,4:1**, justo por debajo del 4,5:1 de CA-06. ¿Qué rojo se usa? | **`#D01F45`** (5,3:1), casi igual a la vista, para botones y enlaces. Aprobado por Victor el 2026-10-27 con la spec. `#E6284E` se puede usar en detalles que no son texto. En modo oscuro, un rojo más claro (`#FF5C7A`, 5,5:1 sobre el fondo oscuro). |
| P2 | ¿Cómo se cargan las letras? | **Desde la propia app** (archivos en `static/fonts/`), no desde Google Fonts. Decidido por Victor el 2026-10-27. |
