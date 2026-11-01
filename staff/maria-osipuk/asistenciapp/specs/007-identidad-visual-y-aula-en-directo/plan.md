# Plan 007 · Identidad visual y aula en directo

> Estado: **Implementado, pendiente de aprobación final** (2026-10-28) · Spec aprobada: 2026-10-28 · Issue: #549 · Pull request: #550

---

## 1. Decisiones principales

1. El rediseño se hace con el stack actual. No se añaden paquetes, servicios, tipografías remotas ni librerías de iconos o animación.
2. La base de datos, las acciones de asistencia y las rutas HTTP no cambian. El frontend reutiliza los datos que ya recibe.
3. La identidad visual se construye con variables CSS, formas sencillas y SVG incluidos en el HTML. No hacen falta archivos de imagen nuevos.
4. La aplicación utiliza un único tema oscuro. No necesita selector, preferencia guardada ni JavaScript de apariencia.
5. Aula en directo es otra presentación de la sesión actual, no otra sesión ni otra fuente de datos.
6. Las animaciones mejoran la orientación, pero toda la información se conserva también como texto.
7. Las reglas educativas de First App se adaptan a este proyecto. No se copian sus reglas específicas de Node, usuarios, correos, paquetes o base de datos.

---

## 2. Arquitectura

El recorrido de datos existente permanece igual:

```text
navegador → app.py → acciones → dominio y almacenamiento
```

Esta funcionalidad solo amplía la presentación del navegador:

```text
profesor.js
  ├─ sigue cargando panel y sesiones con las rutas actuales
  ├─ calcula los resúmenes a partir de la lista ya recibida
  ├─ presenta la sesión normal
  └─ presenta los mismos datos en Aula en directo

alumno.js
  ├─ conserva la carga y el registro actuales
  └─ coordina los pasos Nombre, Código y Listo
```

Ninguna regla visual entra en el dominio, las acciones o el almacenamiento.

---

## 3. Modelo de datos y rutas

### 3.1 Base de datos

No cambia. No se añaden tablas ni columnas.

### 3.2 Rutas y respuestas

No cambian. Se reutilizan:

- `GET /api/sessions` para el historial y los resúmenes del panel.
- `POST /api/sessions` para abrir una clase.
- `GET /api/sessions/<session_id>` para la sesión normal y Aula en directo.
- Las rutas actuales de cierre, retirada y descarga.
- Las rutas públicas actuales para cargar la clase y registrar al alumno.

### 3.3 Apariencia visual

La apariencia se define únicamente en `styles.css`. El navegador no guarda ninguna preferencia visual y no se carga un script para elegir temas.

---

## 4. Diseño visual compartido

### 4.1 Tokens

`styles.css` reunirá al principio las variables de:

- fondo y superficies;
- texto principal y secundario;
- bordes y sombras;
- violeta de marca, turquesa, coral y estados;
- radios, espacios y duraciones de movimiento.

El tema oscuro usa esas variables. Los componentes no mantienen variantes visuales que no se usan.

### 4.2 Marca

Las tres páginas compartirán:

- la marca AsistenciApp;
- un símbolo de verificación sencillo;
- la misma jerarquía tipográfica;
- botones, tarjetas, insignias y mensajes con la misma forma;
- una apariencia oscura común sin controles de tema.

La fuente seguirá siendo la del sistema para no añadir descargas externas.

### 4.3 Movimiento

Las transiciones durarán poco y se limitarán a:

- entrada de tarjetas y avatares;
- notificación de nueva llegada;
- cambio de estado del alumno;
- progreso de la cuenta atrás;
- respuesta al foco y al cursor.

Una regla `prefers-reduced-motion` quitará desplazamientos, escalas y transiciones decorativas.

---

## 5. Apariencia compartida

Las tres páginas cargan la misma hoja `styles.css`. Sus variables de `:root` definen directamente el tema oscuro. No existen botones de tema, atributos de elección, almacenamiento local ni listeners del sistema.

---

## 6. Panel del profesor

### 6.1 Estructura

`profesor.html` pasa a tener una carcasa de aplicación con:

- cabecera y marca;
- navegación a Inicio, Clase en directo e Historial;
- zona principal con el formulario para abrir clase;
- tres resúmenes: total de clases, media de asistentes y sesiones abiertas;
- historial reciente con el estado y las acciones actuales;
- vista normal de la sesión;
- vista inmersiva de Aula en directo.

En móvil la navegación pasa a una fila compacta y el contenido queda en una sola columna.

### 6.2 Resúmenes

`profesor.js` calcula los tres resúmenes desde el array recibido por `GET /api/sessions`:

- `sessions.length`;
- suma de asistentes dividida entre el número de sesiones, con cero cuando no hay sesiones;
- sesiones cuyo cierre está vacío.

No se presenta ningún porcentaje ni dato que la aplicación no pueda justificar.

### 6.3 Navegación

La navegación del panel desplaza o enfoca secciones de la misma pantalla. En una sesión, `Clase en directo` activa la presentación inmersiva. El hash secreto y el identificador de sesión siguen conservándose como ahora.

---

## 7. Aula en directo

### 7.1 Entrada y salida

La sesión abierta muestra un botón `Presentar Aula en directo`.

Al entrar:

1. se activa una clase visual en la página;
2. se muestra la vista inmersiva;
3. se solicita pantalla completa cuando el navegador la permite;
4. si no la permite, la vista sigue ocupando la ventana y funciona igual.

Un botón visible permite salir. La tecla Escape puede sacar de pantalla completa; el código sincroniza entonces la vista normal sin cerrar ni cambiar la sesión.

### 7.2 Cuenta atrás

La función actual de cuenta atrás también actualizará:

- el texto de segundos restantes;
- una variable visual de progreso;
- un estado de aviso en los últimos cinco segundos.

Cuando llega el nuevo código, se reinician texto, progreso y aviso.

### 7.3 Avatares

Cada registro genera:

- iniciales obtenidas de las primeras palabras del nombre;
- un color estable elegido mediante una suma sencilla de los caracteres del nombre;
- nombre completo como texto literal;
- hora en una etiqueta accesible cuando aporte contexto.

No se solicitan ni se generan fotografías.

### 7.4 Nuevas llegadas

`profesor.js` conserva un conjunto con los identificadores ya vistos.

- La primera carga rellena el conjunto sin mostrar notificaciones antiguas.
- Cada carga posterior compara los identificadores.
- Los nuevos muestran una notificación temporal y reciben la clase de entrada.
- Los identificadores que ya estaban no vuelven a avisar.

La lista normal y Aula en directo se actualizan con los mismos datos. Los textos del servidor continúan insertándose con `textContent`.

### 7.5 Controles privados

La vista inmersiva solo contiene:

- título;
- código y cuenta atrás;
- total;
- avatares y nombres;
- estado en directo;
- botón de salida.

El enlace de alumnos, la descarga y el cierre permanecen en la vista normal. La ruta de retirada continúa disponible para conservar la compatibilidad del servidor, pero el panel no muestra ese control.

---

## 8. Recorrido del alumno

`alumno.html` separará visualmente tres estados dentro del mismo formulario:

1. **Nombre**: campo de nombre y botón para continuar.
2. **Código**: código de cuatro cifras y botón de registro.
3. **Listo**: confirmación con nombre y hora.

Se mantiene un solo campo de código. CSS dibuja cuatro posiciones visuales sin obligar a coordinar cuatro campos distintos. Así siguen funcionando pegar, seleccionar, teclado numérico y lectores de pantalla con una lógica sencilla.

`alumno.js` tendrá una función `showStep` que:

- muestra un estado;
- actualiza el indicador de pasos;
- mueve el foco al control adecuado.

El nombre recordado se rellena como ahora, pero el alumno puede revisarlo antes de continuar. Un error de nombre vuelve a Nombre; un error de código permanece en Código; un registro correcto o ya existente llega a Listo. Una clase cerrada o inexistente mantiene su mensaje propio.

---

## 9. Reglas educativas

`AGENTS.md` conservará sus reglas específicas de Python, SDD y arquitectura. Se añadirán solo las ideas aplicables de First App:

- el código nuevo o modificado es sencillo, explícito, lineal y se lee de arriba abajo;
- los nombres describen la acción o el dato completo;
- los pasos importantes se ven en lugar de esconderse en abstracciones prematuras;
- una solución más larga se prefiere si es más fácil de comprender;
- los comentarios educativos usan inglés sencillo y frases completas;
- un comentario explica decisiones, límites, reglas, entradas, salidas o errores no evidentes;
- no se comenta una línea que ya se entiende;
- estas reglas se aplican solo al código nuevo y a las partes modificadas por la tarea.

No se copian reglas sobre Node, paquetes, usuarios, correos ni consultas que no pertenecen a AsistenciApp.

---

## 10. Archivos

| Archivo | Cambio |
| --- | --- |
| `static/styles.css` | Reorganiza tokens, tema oscuro, componentes, layouts, animaciones, móvil y movimiento reducido. |
| `static/index.html` | Aplica la nueva marca y estructura inicial. |
| `static/profesor.html` | Añade carcasa, resúmenes, navegación y Aula en directo. |
| `static/profesor.js` | Renderiza resúmenes, navegación, cuenta visual, avatares, llegadas y entrada/salida del modo inmersivo. |
| `static/alumno.html` | Añade marca, indicador y tres estados del registro. |
| `static/alumno.js` | Coordina pasos, foco, errores y confirmación sin cambiar la petición existente. |
| `tests/test_visual_identity.py` | Nuevo. Comprueba la estructura estable del rediseño y sus reglas documentales. |
| `tests/test_layout.py` | Comprueba que cada spec documentada existe sin duplicar su estado en `AGENTS.md`. |
| `AGENTS.md` | Reúne las reglas de trabajo y las reglas educativas sin duplicar arquitectura, comandos ni historial. |
| `docs/ARCHITECTURE.md` | Describe el tema oscuro compartido y las dos presentaciones de la sesión. |
| `README.md` | Explica el tema oscuro y Aula en directo. |
| `specs/007-identidad-visual-y-aula-en-directo/` | Registra spec, plan, tareas y su estado. |

No se modifica `app.py`, el dominio, las acciones, el almacenamiento ni el esquema de datos.

---

## 11. Pruebas y verificación

### 11.1 Pruebas automatizadas

`tests/test_visual_identity.py` leerá los archivos estáticos y comprobará:

- que las tres páginas cargan la hoja visual compartida;
- que el tema oscuro es único y no hay controles de apariencia;
- que el panel contiene resúmenes, navegación y Aula en directo;
- que Aula en directo no incluye los controles privados dentro de su contenedor;
- que el alumno contiene los tres estados y un solo campo de código;
- que hay estilos móviles, foco visible y movimiento reducido;
- que `AGENTS.md` contiene las reglas educativas acordadas;
- que el README documenta las dos funciones nuevas;
- que no se cargan recursos de presentación externos.

La suite existente seguirá comprobando las rutas, reglas, seguridad, exportación y estructura actuales.

### 11.2 Verificación manual

Con la app local y una base temporal:

1. revisar inicio, panel, sesión y alumno en el tema oscuro único;
2. recargar y confirmar que no aparecen selectores de tema;
3. revisar panel y alumno a 400 px y a escritorio;
4. recorrer todos los controles con teclado;
5. abrir una clase y entrar y salir de Aula en directo;
6. comprobar el fallback cuando no se concede pantalla completa;
7. registrar dos alumnos y observar avatar, total y una sola notificación por llegada;
8. esperar un cambio de código y observar el reinicio del progreso;
9. completar Nombre, Código y Listo, y probar un nombre y un código incorrectos;
10. activar movimiento reducido y comprobar que la información permanece;
11. cerrar y descargar para confirmar que siguen disponibles en la vista normal;
12. parar el servidor y confirmar que el puerto 8000 queda libre.

### 11.3 Relación con los criterios

| Criterios | Comprobación |
| --- | --- |
| CA-01 a CA-03 | Prueba estructural del panel + revisión manual de identidad y navegación. |
| CA-04 | Prueba de estilos responsive + verificación manual a 400 px. |
| CA-05 a CA-07 | Prueba del tema oscuro único y ausencia de controles o almacenamiento visual. |
| CA-08 a CA-12 | Prueba estructural de Aula en directo + clase manual con registros y cambio de código. |
| CA-13 a CA-16 | Prueba estructural de los pasos + registro manual correcto e incorrecto. |
| CA-17 a CA-19 | Prueba de movimiento reducido y foco + recorrido manual con teclado. |
| CA-20 a CA-22 | Prueba documental de `AGENTS.md` + revisión del diff. |
| CA-23 y CA-24 | Suite existente completa. |
| CA-25 | Prueba documental de `README.md`. |

### 11.4 Resultado real

- Suite completa: 112 pruebas aprobadas.
- JavaScript: los tres archivos pasan la comprobación de sintaxis.
- Navegador con base temporal: apertura de clase, código rotatorio, Aula en directo, avatares, actualización de llegadas y recorrido Nombre/Código/Listo comprobados.
- Apariencia: todas las páginas conservan el único tema oscuro después de recargar.
- Revisión visual: el código queda dentro del anillo, el panel no pisa su halo y los asistentes forman tarjetas compactas y centradas con avatar, nombre y hora.
- Limpieza: el servidor temporal se detuvo y su base temporal se eliminó.

---

## 12. Comprobación de la constitución

### P1 · Independiente de la plataforma

El rediseño usa la sesión propia de AsistenciApp. No depende de Discord, Meet ni otra plataforma.

### P2 · Simplicidad primero

Se reutilizan rutas y datos existentes. El alumno tiene dos acciones breves antes de la confirmación y mantiene el objetivo de menos de 30 segundos. Aula en directo es una vista, no otro flujo de negocio.

### P3 · Dependencias mínimas

No se añaden dependencias. Identidad, tema oscuro, iconos y animaciones usan las capacidades existentes del navegador.

### P4 · Privacidad mínima

No se guardan nuevos datos del alumno ni preferencias visuales. Los avatares se forman temporalmente con las iniciales del nombre que ya está en la asistencia.

### P5 · Accesible y usable en móvil

El diseño parte de una columna móvil, mantiene controles de al menos 44 px, foco visible, etiquetas, regiones de estado, orden de teclado y reducción de movimiento.

### P6 · Todo en español

La interfaz, los mensajes, README, spec, plan y tareas se escriben en español. Los nombres de código y los comentarios educativos pueden ir en inglés sencillo como parte del código.

### §5 · Calidad

Cada criterio tiene prueba automatizada, verificación manual o ambas. La suite completa debe pasar. Los errores existentes conservan su texto y su orientación.

### §6 · Seguridad

No cambian códigos, caducidad, duplicados, cierre, acceso del profesor ni validación. Los nombres se siguen insertando como texto literal. Los controles privados no aparecen dentro de la vista proyectada.

---

## 13. Riesgos y límites

- **Pantalla completa no disponible o rechazada:** la clase visual sigue ocupando la ventana y mantiene un botón de salida.
- **Avisos repetidos por el polling:** la primera carga inicializa los identificadores sin avisar; solo las diferencias posteriores generan una llegada.
- **Pérdida de foco por las actualizaciones:** se conserva la regla actual de no repintar listas sin cambios y se evita mover el foco durante el polling.
- **Demasiado movimiento:** las animaciones son breves y existe una variante de movimiento reducido.
- **JavaScript demasiado grande:** las funciones se agrupan por responsabilidad visible y cada una realiza un paso concreto; no se crea una abstracción general para un único caso.
- **Preview imposible de reproducir exactamente:** se priorizan jerarquía, identidad, legibilidad e interacción sobre una copia píxel a píxel.

