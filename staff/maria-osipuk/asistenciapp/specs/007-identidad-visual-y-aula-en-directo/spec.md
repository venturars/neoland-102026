# Spec 007 · Identidad visual y aula en directo

> Estado: **Implementada, pendiente de aprobación final** (2026-10-28) · Aprobada: 2026-10-28 · Issue: #549 · Pull request: #550

---

## 1. Problema

AsistenciApp permite pasar lista, pero sus pantallas actuales parecen una herramienta provisional. La aplicación no tiene una identidad visual reconocible, la información aparece en tarjetas muy básicas y las acciones importantes no destacan lo suficiente.

Durante una clase, el profesor comparte una pantalla pensada como panel de gestión. El código se ve, pero la experiencia no se siente como un aula en directo: la cuenta atrás tiene poco peso visual, las nuevas llegadas pasan desapercibidas y también quedan visibles controles que no aportan nada a la proyección.

El alumno encuentra un formulario correcto pero plano. No percibe con claridad en qué paso está ni recibe una confirmación visual memorable cuando termina.

La aplicación también necesita una apariencia coherente. La decisión final es mantener un único tema oscuro para reducir controles y conservar la misma identidad en todas las pantallas.

Por último, las reglas actuales piden funciones comprensibles, pero no recogen con la misma claridad el enfoque educativo de First App: código sencillo, explícito, lineal y acompañado de comentarios que ayuden a una desarrolladora junior a entender las decisiones importantes.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Abrir y gestionar sus clases desde un panel claro, atractivo y profesional. |
| **Profesor que comparte pantalla** | Mostrar un aula en directo donde el código, el tiempo restante y las llegadas se entiendan de un vistazo. |
| **Alumno** | Registrarse con una experiencia sencilla, guiada y agradable desde el móvil. |
| **Persona usuaria** | Encontrar siempre una apariencia oscura coherente, sin tener que configurarla. |
| **Desarrolladora junior** | Leer el código nuevo o modificado y entender sus pasos y decisiones sin tener que adivinarlos. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero que todas las pantallas compartan una identidad visual propia, para sentir que uso un producto terminado y no un prototipo.
- **HU-02**: Como profesor, quiero encontrar en el panel las acciones y resúmenes principales con una jerarquía clara, para preparar una clase rápidamente.
- **HU-03**: Como persona usuaria, quiero una apariencia oscura consistente, para reconocer la aplicación sin tener que elegir ni configurar un tema.
- **HU-04**: Como profesor, quiero activar un modo Aula en directo, para proyectar solamente la información útil durante la asistencia.
- **HU-05**: Como profesor, quiero notar visualmente cuándo entra un alumno, para seguir las llegadas sin leer de nuevo toda la lista.
- **HU-06**: Como alumno, quiero ver mi registro como un recorrido corto y guiado, para saber qué falta y reconocer claramente cuándo he terminado.
- **HU-07**: Como persona que utiliza animaciones, quiero que expliquen cambios y estados sin impedirme leer ni manejar la aplicación.
- **HU-08**: Como persona que prefiere menos movimiento, quiero que la aplicación respete esa preferencia, para usarla con comodidad.
- **HU-09**: Como desarrolladora junior, quiero reglas que pidan código explícito, lineal y con nombres descriptivos, para poder explicar cada parte del cambio.
- **HU-10**: Como desarrolladora junior, quiero comentarios educativos solo donde aporten contexto, para aprender las decisiones importantes sin llenar el código de explicaciones redundantes.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Identidad visual y panel del profesor (HU-01, HU-02)

- **CA-01**: **Dado** cualquiera de las pantallas de AsistenciApp, **cuando** se abre, **entonces** utiliza una identidad visual común con marca, colores, tipografía, iconos, espacios, tarjetas y estados coherentes. La interfaz se reconoce como el mismo producto en el inicio, el panel, la sesión y el registro del alumno.
- **CA-02**: **Dado** el profesor en su panel, **cuando** lo consulta, **entonces** distingue con claridad la acción de abrir una clase, un resumen de las sesiones existentes y el historial reciente. Los resúmenes solo utilizan información que la aplicación ya conoce.
- **CA-03**: **Dado** el profesor navegando por el panel, **cuando** cambia entre el inicio, la clase actual y el historial, **entonces** conserva el contexto y puede volver a la acción principal sin perder datos.
- **CA-04**: **Dado** una pantalla de aproximadamente 400 píxeles de ancho, **cuando** se usa cualquier vista nueva, **entonces** el contenido se adapta sin desplazamiento horizontal, texto cortado ni controles inaccesibles.

### Apariencia (HU-03)

- **CA-05**: **Dado** cualquiera de las pantallas, **cuando** se abre, **entonces** utiliza el mismo tema oscuro y mantiene contraste suficiente.
- **CA-06**: **Dado** el tema oscuro único, **cuando** la persona recarga o vuelve a abrir la aplicación, **entonces** no encuentra selectores de apariencia ni cambios de tema.
- **CA-07**: **Dado** que no existe una preferencia visual, **cuando** se consulta la privacidad, **entonces** la apariencia no guarda datos en el navegador ni los envía al servidor.

### Aula en directo (HU-04, HU-05, HU-07)

- **CA-08**: **Dado** una sesión abierta, **cuando** el profesor activa Aula en directo, **entonces** ve una presentación inmersiva con el título de la clase, el código vigente en primer plano, una cuenta atrás visual, el total de presentes y una cuadrícula de alumnos.
- **CA-09**: **Dado** Aula en directo, **cuando** el código se acerca a su cambio, **entonces** la cuenta atrás comunica visualmente que queda poco tiempo. Cuando aparece el siguiente código, la cuenta vuelve a empezar sin recargar la página.
- **CA-10**: **Dado** Aula en directo abierta, **cuando** entra un alumno nuevo, **entonces** su avatar aparece con sus iniciales, su nombre queda visible y se muestra una notificación temporal de llegada. Una actualización que no trae nuevas llegadas no repite notificaciones antiguas.
- **CA-11**: **Dado** que el profesor está proyectando Aula en directo, **entonces** no se muestran el enlace privado ni las acciones de descargar o cerrar la asistencia. El profesor puede salir del modo de proyección y recuperar esos controles sin perder la sesión.
- **CA-12**: **Dado** que un alumno se registra, **cuando** la lista del profesor se actualiza, **entonces** sigue apareciendo en cinco segundos como máximo, tanto en la vista normal como en Aula en directo.

### Recorrido del alumno (HU-01, HU-06, HU-07)

- **CA-13**: **Dado** un alumno con un enlace válido, **cuando** abre el registro, **entonces** ve un recorrido corto con los estados Nombre, Código y Listo, y sabe cuál está completando.
- **CA-14**: **Dado** el paso del código, **cuando** el alumno introduce sus cuatro cifras, **entonces** cada cifra se distingue con claridad y el formulario sigue siendo manejable con teclado y móvil.
- **CA-15**: **Dado** un registro correcto, **cuando** termina, **entonces** el alumno llega al estado Listo y ve una confirmación visual con su nombre y hora. Los errores conservan su significado actual, indican qué hacer y no avanzan al estado Listo.
- **CA-16**: **Dado** el nuevo recorrido, **cuando** un alumno se registra con normalidad, **entonces** continúa pudiendo completar el proceso en menos de 30 segundos.

### Movimiento y accesibilidad (HU-07, HU-08)

- **CA-17**: **Dado** cualquier animación de la nueva interfaz, **cuando** ocurre, **entonces** es breve, no bloquea ninguna acción y no es la única forma de comunicar información.
- **CA-18**: **Dado** que el dispositivo indica una preferencia por reducir el movimiento, **cuando** se usa la aplicación, **entonces** las animaciones decorativas se eliminan o se reducen sin ocultar estados ni información.
- **CA-19**: **Dado** una persona que utiliza teclado, **cuando** recorre las nuevas pantallas, **entonces** alcanza todos los controles en un orden comprensible y ve con claridad qué elemento tiene el foco.

### Reglas educativas del código (HU-09, HU-10)

- **CA-20**: **Dado** el manual de trabajo de AsistenciApp, **cuando** se consulta el nivel esperado para el código nuevo o modificado, **entonces** pide una solución sencilla, explícita, lineal, con nombres descriptivos y pasos visibles. Una solución algo más larga se acepta si resulta más fácil de comprender.
- **CA-21**: **Dado** ese manual, **cuando** explica los comentarios educativos, **entonces** pide inglés sencillo y frases completas para aclarar decisiones, límites, reglas, entradas, salidas o errores que no resulten evidentes. No pide comentar una línea cuyo significado ya se entiende.
- **CA-22**: **Dado** una regla educativa nueva, **cuando** se aplica esta tarea, **entonces** afecta al código nuevo y a las partes modificadas por esta funcionalidad. No provoca una reescritura de funcionalidades antiguas que no estén relacionadas.

### Conservación del funcionamiento (HU-01 a HU-10)

- **CA-23**: **Dado** el rediseño, **cuando** se usan las funciones existentes, **entonces** siguen funcionando la apertura de sesiones, el código rotatorio, el registro y su límite por navegador, la lista en vivo, el cierre, el historial y la descarga.
- **CA-24**: **Dado** el cambio visual, **cuando** se revisan los datos de asistencia y el acceso del profesor, **entonces** no cambian las reglas de privacidad, validación ni seguridad existentes.
- **CA-25**: **Dado** que la funcionalidad está terminada, **cuando** una persona consulta las instrucciones, **entonces** encuentra explicado el tema oscuro único y cómo entrar y salir de Aula en directo.

---

## 5. Fuera de alcance

- Cambiar las reglas que deciden quién puede registrarse o cuándo es válido un código.
- Guardar una lista previa de alumnos, correos, fotografías o nuevos datos personales.
- Añadir autenticación, contraseñas o cuentas de usuario.
- Añadir estadísticas que necesiten datos que la aplicación no guarda actualmente.
- Igualar píxel a píxel los previews conceptuales. Los previews marcan la identidad, la jerarquía y la experiencia esperada.
- Reescribir código antiguo que no sea necesario tocar para esta funcionalidad.
- Copiar a AsistenciApp las reglas de First App específicas de usuarios, correos, paquetes o herramientas que este proyecto no utiliza.

---

## 6. Preguntas abiertas

Ninguna. La decisión aprobada combina una identidad visual completa para toda la aplicación con un modo Aula en directo inmersivo dentro de la sesión del profesor.

---

## 7. Resultado de la implementación

La identidad visual oscura, el nuevo panel, Aula en directo y el recorrido Nombre/Código/Listo están implementados sin modificar las rutas, el dominio ni la base de datos. La comprobación final aprobó 112 pruebas automatizadas y un recorrido local con datos temporales. Durante la revisión visual se ajustaron el tamaño de los códigos, la distribución de asistentes y sus tarjetas centradas con avatar, nombre y hora.

