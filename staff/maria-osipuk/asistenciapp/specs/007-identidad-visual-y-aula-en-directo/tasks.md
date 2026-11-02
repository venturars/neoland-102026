# Tasks 007 · Identidad visual y aula en directo

> Estado: **Implementadas, pendiente de aprobación final** (2026-10-28) · Spec, plan y tasks aprobados: 2026-10-28

Las tareas se ejecutan en orden. Cada casilla se marca al terminar y comprobar ese paso.

---

## Pruebas antes de implementar

- [x] **T01 · Crear las pruebas estructurales del rediseño.** Crear `tests/test_visual_identity.py` con comprobaciones de apariencia compartida, tema oscuro único, panel, Aula en directo, pasos del alumno, foco, movimiento reducido, reglas educativas y documentación. **Cubre:** CA-01 a CA-08, CA-11, CA-13, CA-14, CA-17 a CA-22 y CA-25.

---

## Reglas educativas

- [x] **T02 · Alinear `AGENTS.md` con el nivel educativo de First App.** Mantener solo instrucciones de trabajo reutilizables y comprobables. Pedir código sencillo, explícito, declarativo, lineal, con nombres descriptivos y pasos visibles; preferir claridad a brevedad; definir comentarios educativos en inglés sencillo; limitar las reglas al código nuevo o modificado; conservar las reglas propias de Python, SDD y AsistenciApp sin duplicar arquitectura, comandos ni historial. Comprobado con las pruebas documentales existentes. **Cubre:** CA-20, CA-21 y CA-22.

---

## Apariencia compartida

- [x] **T03 · Mantener un único tema oscuro.** Definir la apariencia directamente en `styles.css` y eliminar `theme.js`, los selectores y el almacenamiento de preferencias. **Cubre:** CA-05, CA-06 y CA-07.
- [x] **T04 · Rediseñar `static/index.html`.** Añadir la marca común y una introducción clara para profesor y alumno sin cambiar las instrucciones de acceso. **Cubre:** CA-01, CA-04, CA-05 y CA-19.
- [x] **T05 · Construir los estilos base.** Reorganizar `static/styles.css` con tokens oscuros, marca, botones, tarjetas, mensajes, foco y componentes compartidos. **Cubre:** CA-01, CA-05, CA-17 y CA-19.

---

## Panel del profesor

- [x] **T06 · Crear la nueva estructura de `static/profesor.html`.** Añadir carcasa, navegación, formulario principal, tarjetas de resumen, historial, vista normal de sesión y contenedor separado de Aula en directo. Mantener fuera de este último los controles privados. **Cubre:** CA-01 a CA-05, CA-08, CA-11 y CA-19.
- [x] **T07 · Renderizar navegación y resúmenes en `profesor.js`.** Calcular total de clases, media de asistentes y sesiones abiertas con los datos existentes; conectar la navegación sin perder token ni sesión; conservar historial, descarga y apertura de clases. **Cubre:** CA-02, CA-03 y CA-23.
- [x] **T08 · Renderizar avatares y detectar nuevas llegadas.** Crear funciones legibles para obtener iniciales, elegir un color estable, construir avatares con texto seguro y comparar identificadores vistos. La primera carga no avisa; las posteriores muestran una sola notificación por llegada. **Cubre:** CA-10, CA-12, CA-17 y CA-24.
- [x] **T09 · Implementar la entrada y salida de Aula en directo.** Activar la vista inmersiva, solicitar pantalla completa con fallback, sincronizar Escape, devolver el foco y recuperar la vista normal sin cambiar la sesión. **Cubre:** CA-08, CA-11, CA-17 y CA-19.
- [x] **T10 · Ampliar la cuenta atrás visual.** Actualizar texto, progreso y aviso de los últimos cinco segundos desde la cuenta existente; reiniciar los tres estados al recibir un código nuevo. **Cubre:** CA-09, CA-12 y CA-17.
- [x] **T11 · Estilizar el panel y la sesión normal.** Añadir a `styles.css` el layout oscuro, navegación, formulario protagonista, resúmenes, historial, tarjetas de alumnos y controles de sesión. **Cubre:** CA-01 a CA-05 y CA-19.
- [x] **T12 · Estilizar Aula en directo.** Añadir a `styles.css` la composición inmersiva, anillo de progreso, cuadrícula de avatares, notificación de llegada y estado en directo. **Cubre:** CA-08 a CA-12 y CA-17.

---

## Recorrido del alumno

- [x] **T13 · Crear los tres estados en `static/alumno.html`.** Añadir marca, indicador Nombre/Código/Listo, dos pasos de formulario y confirmación final manteniendo un solo campo de código. **Cubre:** CA-01, CA-04, CA-05, CA-13, CA-14 y CA-19.
- [x] **T14 · Coordinar los pasos en `alumno.js`.** Añadir `showStep`, validación visible del paso Nombre, foco, regreso al paso adecuado ante errores y confirmación Listo. Mantener almacenamiento, mensajes y peticiones actuales. **Cubre:** CA-13 a CA-16, CA-19, CA-23 y CA-24.
- [x] **T15 · Estilizar el recorrido del alumno.** Añadir a `styles.css` el panel centrado oscuro, indicador de pasos, campo de cuatro posiciones, confirmación y estados de error. **Cubre:** CA-01, CA-04, CA-13 a CA-17 y CA-19.

---

## Responsive, accesibilidad y documentación

- [x] **T16 · Completar responsive y movimiento reducido.** Añadir a `styles.css` los puntos de adaptación para 400 px y escritorio, y una variante `prefers-reduced-motion` que preserve toda la información. **Cubre:** CA-04, CA-17, CA-18 y CA-19.
- [x] **T17 · Actualizar `docs/ARCHITECTURE.md`.** Explicar el tema oscuro compartido y que la sesión del profesor tiene una presentación normal y otra inmersiva sin cambiar el recorrido de datos. **Cubre:** CA-22 y CA-24.
- [x] **T18 · Actualizar `README.md`.** Explicar el tema oscuro único y cómo entrar, proyectar y salir de Aula en directo. **Cubre:** CA-25.
- [x] **T19 · Actualizar la prueba de estado y la documentación SDD.** Añadir la spec 007 a `tests/test_layout.py`, mantener sincronizadas las tablas de estado y registrar el avance real en spec, plan y tasks. **Cubre:** CA-20 a CA-25.

---

## Verificación final

- [x] **T20 · Ejecutar todas las pruebas automatizadas.** Ejecutar `pytest` desde AsistenciApp y corregir solo fallos relacionados con esta tarea. Confirmar que las funciones anteriores siguen pasando. Resultado: 112 pruebas aprobadas. **Cubre:** CA-01 a CA-25, especialmente CA-23 y CA-24.
- [x] **T21 · Verificar la experiencia completa en el navegador.** Con una base temporal se comprobaron el tema oscuro único, el panel, la sesión normal, Aula en directo, el cambio de código, las llegadas, las tarjetas centradas con nombre y hora, y Nombre/Código/Listo. La suite cubre cierre, descarga, responsive y movimiento reducido. **Cubre:** CA-01 a CA-19 y CA-23 a CA-25.
- [x] **T22 · Cerrar la documentación de la spec.** Registrar resultados reales, marcar la spec y el plan como implementados, dejar todas las tareas comprobadas y confirmar que `AGENTS.md` contiene únicamente instrucciones vigentes. **Cubre:** CA-20 a CA-25.

