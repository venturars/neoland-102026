# Spec 007 · App de escritorio para el profesor

> Estado: **Borrador** v0.1 (2026-11-04) · Creada: 2026-11-04 · Issue: #919

---

## 1. Problema

Hoy AsistenciApp solo la puede usar quien sabe preparar un entorno de programación: instalar Python, crear un entorno, instalar dependencias y arrancarla desde una terminal con opciones. Además, para el modo automático de Meet, cada profesor tiene que crear su propio proyecto en Google Cloud (unos 15 minutos, README §4.1).

En la práctica, la app **solo funciona en el ordenador de Victor**. Otros compañeros del bootcamp que quieran pasar lista en sus clases no pueden usarla sin repetir toda esa preparación.

Queremos que **cualquier profesor** pueda **descargar la app, abrirla con doble clic y pasar lista**, en macOS o en Windows, sin terminal y sin preparar nada en Google.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** (quien instala y arranca su propia copia; ver `GLOSSARY.md`) | Instalar la app como cualquier otro programa, abrirla y pasar lista por código o con Meet, sin escribir comandos. |
| **Alumno** | Lo mismo que hoy: registrarse desde el navegador o el móvil con el enlace, sin instalar nada. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero **descargar AsistenciApp e instalarla con doble clic** en mi Mac o mi PC con Windows, sin instalar nada más ni usar la terminal.
- **HU-02**: Como profesor, quiero **que mis clases sigan ahí** cuando cierro la app, la vuelvo a abrir o instalo una versión nueva.
- **HU-03**: Como profesor, quiero **abrir una clase online desde el panel** para que mis alumnos se registren desde casa, sin arrancar nada aparte.
- **HU-04**: Como profesor, quiero **no cortar sin querer una clase en curso** al cerrar la app.
- **HU-05**: Como profesor, quiero **pasar lista con Meet sin preparar nada en Google**: solo iniciar sesión con mi cuenta.
- **HU-06**: Como profesor, quiero **descargar la lista** de una clase igual que hoy.
- **HU-07**: Como profesor, quiero **saber qué versión tengo** y dónde conseguir la última.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Instalar y abrir (HU-01, HU-07)
- **CA-01**: **Dado** un Mac con chip de Apple o un PC con Windows sin nada preparado, **cuando** el profesor descarga la app y la abre, **entonces** ve su panel de profesor en una ventana propia, sin instalar nada más ni escribir ningún comando.
- **CA-02**: **Dado** el primer arranque, **cuando** el sistema avisa de que la app es de un desarrollador no identificado, **entonces** la página de descarga explica paso a paso cómo abrirla igualmente en macOS y en Windows.
- **CA-03**: **Dado** la app ya abierta, **cuando** el profesor la abre otra vez, **entonces** ve "AsistenciApp ya está abierta" y no se abre una segunda copia.
- **CA-04**: **Dado** el panel, **entonces** muestra la versión de la app, y la página de descarga lista las versiones publicadas.

### Mis datos (HU-02)
- **CA-05**: **Dado** un profesor con clases anteriores, **cuando** cierra la app y la vuelve a abrir, o instala una versión nueva, **entonces** sus clases, listas y permiso de Google siguen ahí.
- **CA-06**: **Dado** cualquier clase, **entonces** sus datos se guardan solo en el ordenador del profesor (constitución P4), igual que hoy.

### Clase online (HU-03)
- **CA-07**: **Dado** el panel, **cuando** el profesor activa **"Clase online"**, **entonces** en menos de 1 minuto el enlace de alumnos funciona desde cualquier red (p. ej. un móvil con datos), sin que el profesor arranque nada aparte.
- **CA-08**: **Dado** que no se puede abrir la clase online (p. ej. sin internet), **entonces** el profesor ve un mensaje claro que dice qué hacer, y el panel sigue funcionando en su ordenador.
- **CA-09**: **Dado** "Clase online" desactivada, **entonces** el panel avisa de que los alumnos no pueden entrar desde fuera de este ordenador.

### Cerrar la app (HU-04)
- **CA-10**: **Dado** una clase online activa, **cuando** el profesor cierra la ventana, **entonces** se le pide confirmar: "Los alumnos no podrán registrarse. ¿Cerrar igualmente?". Si cancela, no cambia nada.
- **CA-11**: **Dado** que no hay clase online activa, **cuando** cierra la ventana, **entonces** la app se cierra sin preguntar.
- **CA-12**: **Dado** que la app se cierra, **entonces** el enlace de alumnos deja de funcionar y no queda nada de la app en marcha en el ordenador.
- **CA-13**: **Dado** una asistencia abierta al cerrar la app, **cuando** se vuelve a abrir, **entonces** la asistencia sigue abierta y se puede continuar.

### Meet sin preparación (HU-05)
- **CA-14**: **Dado** un profesor que nunca ha preparado nada en Google, **cuando** toma la asistencia de Meet por primera vez, **entonces** solo tiene que iniciar sesión con su cuenta de Google en el navegador y dar permiso; después, la toma continúa como en la spec 004 (CA-11).
- **CA-15**: **Dado** el aviso de Google de que la app no está verificada, **entonces** la página de descarga explica cómo continuar, y tras aceptar **el permiso no caduca cada semana** (sustituye a CA-12 de la spec 004 en la app de escritorio).
- **CA-16**: **Dado** que la app ya no admite más profesores nuevos en Google (tope de la plataforma), **entonces** el profesor ve un mensaje claro y puede usar su propia llave de Google como alternativa; el modo *código* sigue funcionando.

### Descargar la lista (HU-06)
- **CA-17**: **Dado** una clase, **cuando** el profesor pulsa **Descargar lista**, **entonces** elige dónde guardar el archivo y obtiene la misma lista que hoy (columnas *Nombre* y *Hora*).

### Sin romper lo que hay
- **CA-18**: **Dado** quien desarrolla la app, **cuando** la arranca desde el código como hoy (README §2, con o sin opciones), **entonces** funciona igual que antes y sus datos siguen en la carpeta del proyecto.

---

## 5. Requisitos no funcionales

- Funciona en **macOS 14 o posterior con chip de Apple** y en **Windows 10/11 de 64 bits**.
- Desde el doble clic hasta ver el panel: **menos de 10 segundos**.
- La descarga ocupa **menos de 100 MB**.
- Sin cuentas de pago: ni de desarrollador de Apple ni de Google Workspace.

---

## 6. Fuera de alcance (en esta spec)

- Actualizaciones automáticas: el profesor descarga cada versión nueva a mano (CA-04).
- Firma de Apple o de Windows para evitar los avisos del primer arranque (CA-02).
- Macs con procesador Intel y Linux.
- Pasar lista desde el **móvil del profesor**: exigiría un servidor siempre encendido fuera de su ordenador (otra spec).
- Que la app funcione con el ordenador del profesor apagado: cada copia funciona mientras su profesor da clase.
- Una dirección fija para el enlace de alumnos: sigue cambiando cada vez que se abre una clase online.
- Verificar la app ante Google para quitar el aviso de CA-15.

---

## 7. Preguntas abiertas

Resueltas el 2026-11-04 con Victor en una sesión de preguntas (*grilling*) antes de escribir esta spec.

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | ¿"No depender de este ordenador" quiere decir no depender del de Victor, o de ninguno? | **Del de Victor.** Cada profesor instala su copia y la app funciona mientras él da clase. Los datos siguen en local (P4 sin cambios). |
| P2 | ¿Quiénes son los "otros alumnos" que la usarán? | Compañeros que la usan **como profesor**. *Alumno* sigue siendo solo quien se registra (`GLOSSARY.md`). |
| P3 | ¿Los alumnos instalan algo? | **No.** Siguen usando el navegador (P2, P5). |
| P4 | ¿Se puede exigir preparar el entorno? | **No.** Doble clic y listo. Sin firma de pago: basta con el aviso del primer arranque. |
| P5 | ¿Cómo usan Meet otros profesores sin crear su proyecto en Google? | Con **una llave compartida** incluida en la app, publicada sin verificar: aviso de Google, tope de 100 profesores en toda la vida del proyecto y sin caducidad semanal. "Usar tu propia llave" queda como alternativa (CA-16). |
| P6 | ¿Hay actualizaciones automáticas? | **No en la v1.** |

---

## 8. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-11-04 | Borrador inicial con P1–P6 resueltas | Issue #919: que cualquier profesor pueda usar AsistenciApp en macOS o Windows sin preparar nada |
