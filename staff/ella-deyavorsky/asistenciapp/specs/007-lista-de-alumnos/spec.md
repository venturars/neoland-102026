# Spec 007 · Listas de grupo para pasar lista

> Estado: **Aprobada v1.1 (2026-10-27)** · Creada: 2026-10-27 · Issue relacionada: #539

---

## 1. Problema

Hoy cada alumno escribe su nombre a mano al registrarse. Eso trae tres problemas:

- **Erratas y variantes.** La misma persona aparece como «Ella» un día y como «Ella G.» otro, y las listas no se pueden comparar entre clases.
- **Nombres falsos.** Cualquiera con el enlace puede apuntar un nombre inventado; el profesor solo puede quitarlo después.
- **No se sabe quién faltó.** La app solo dice quién vino. Para saber quién no vino, el profesor compara a mano con su propia lista.

**Solución en una frase.** El profesor crea un grupo con la lista de sus alumnos (una sola vez). Al pasar lista elige el grupo, comparte enlace y código como hasta ahora, y los alumnos eligen su nombre en la lista en vez de escribirlo. Al terminar, el profesor recibe una tabla con quién vino, quién faltó y quién es nuevo.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Preparar la lista de cada grupo una vez y saber, en cada clase, quién vino, quién faltó y quién es nuevo. |
| **Alumno de la lista** | Encontrar su nombre rápido y registrarse en menos de 30 segundos (constitución P2). |
| **Alumno que no está en la lista** | Poder registrarse igualmente, aunque quede sin verificar. |
| **Persona de fuera de la clase** | (Usuario no deseado.) No debe ver los nombres del grupo ni apuntar nombres inventados como si fueran de la lista. |
| **Persona que trabaja en esta carpeta** | Guardar lo mínimo de cada alumno, posiblemente menores, y sin cambiar cómo funcionan las sesiones de hoy. |

---

## 3. Conceptos

- **Grupo:** conjunto de alumnos con un nombre (ej. «SDD 2º A») y una lista de nombres. Se puede editar, archivar y borrar. «Clase» sigue significando, como hoy, cada vez que se pasa lista.
- **Sesión con grupo:** sesión asociada a un grupo. Al abrirla se guarda una copia fija de la lista de ese momento.
- **Sesión rápida:** sesión sin grupo. Funciona exactamente como hoy (el alumno escribe su nombre). No se modifica ni se migra.
- **Estado de un alumno en una sesión:**
  - **presente:** estaba en la lista y se registró.
  - **ausente:** estaba en la lista y no se registró.
  - **nuevo:** no estaba en la lista; se añadió él mismo (sin verificar).

---

## 4. Historias de usuario

- **HU-01**: Como profesor, quiero crear varios grupos con la lista de sus alumnos, a mano o subiendo un CSV, para no escribirlos en cada clase.
- **HU-02**: Como profesor, quiero editar, archivar y borrar grupos, para mantenerlos al día sin perder las listas de asistencia pasadas.
- **HU-03**: Como profesor, quiero elegir al abrir una asistencia si es de un grupo o una sesión rápida como la de hoy.
- **HU-04**: Como alumno, quiero buscar y elegir mi nombre en la lista de mi grupo en vez de escribirlo, para no equivocarme.
- **HU-05**: Como alumno que no está en la lista, quiero poder añadirme, para que conste que vine.
- **HU-06**: Como profesor, quiero ver durante la clase cuántos han venido de los que hay en la lista, y al terminar decidir qué hago con los nuevos.
- **HU-07**: Como profesor, quiero descargar una sola tabla con quién vino, quién faltó y quién es nuevo.
- **HU-08**: Como persona que trabaja aquí, quiero que la lista de un grupo no la vean los alumnos ni nadie de fuera sin un código válido (el profesor la ve en su panel), y que las sesiones de hoy sigan como están.

---

## 5. Requisitos funcionales

### 5.1 Gestión de grupos (profesor) · HU-01, HU-02

- **RF-1** Crear un grupo con un nombre y una lista de alumnos. Dos formas de introducirlos, combinables:
  - a) Manual: añadir alumnos uno a uno, o pegar texto con un nombre por línea.
  - b) CSV: subir un archivo (una columna con el nombre; la primera fila puede ser cabecera). Se acepta separado por `;` (Excel en español) o por `,` (Google Sheets y otros), y en UTF-8 con o sin BOM, para que los acentos se lean bien.
- **RF-2** Antes de guardar, mostrar una vista previa con el número de alumnos detectados y los problemas encontrados (duplicados, líneas vacías).
- **RF-3** Editar un grupo: añadir, renombrar y quitar alumnos, y cambiar el nombre del grupo.
- **RF-4** Crear varios grupos. Listado de grupos en el panel del profesor.
- **RF-5** Archivar un grupo: deja de aparecer en el listado principal y no se puede usar para abrir sesiones nuevas, pero conserva todas sus sesiones. Se puede restaurar. Se puede archivar aunque tenga una sesión abierta: esa sesión sigue funcionando hasta que se cierre.
- **RF-6** Borrar un grupo: solo si no tiene sesiones abiertas. Pide confirmación explícita. Las sesiones cerradas de ese grupo se conservan (ver RF-23). Si tiene una sesión abierta, la app lo explica y ofrece archivar o cerrar la sesión primero.
- **RF-7** No se permiten dos alumnos con el mismo nombre en un grupo. La comparación ignora mayúsculas, acentos y espacios sobrantes («maria garcia» = «María García»). Si el profesor introduce un duplicado, la app lo rechaza y le pide diferenciarlo (ej. «María García B.»). En importaciones, los duplicados se marcan en la vista previa y hay que resolverlos antes de guardar.
- **Límites:** máximo 200 alumnos por grupo (también al añadir un nuevo desde una sesión, RF-20); nombres de hasta 60 caracteres, el mismo límite que hoy (spec 001, CA-08), para las listas y para las sesiones rápidas.

### 5.2 Abrir una sesión (profesor) · HU-03

- **RF-8** Al abrir una asistencia, el profesor elige entre un grupo o sesión rápida.
- **RF-8b** Un grupo se puede guardar sin alumnos (o quedarse sin ellos al quitarlos), para rellenarlo más tarde. Pero no se puede abrir una sesión con un grupo de 0 alumnos: la app dice «Este grupo todavía no tiene alumnos» y ofrece añadirlos o abrir una sesión rápida.
- **RF-9** Al abrir una sesión con grupo se guarda una copia fija de la lista. Cambios posteriores en el grupo no afectan a la sesión ya abierta ni a las pasadas. Única excepción: cuando el profesor elige «Añadir al grupo» para un nuevo y el grupo ya tiene un alumno con el mismo nombre normalizado (RF-20), ese alumno se añade a la copia de esa sesión, para que pueda contar como presente en ella. Ningún otro cambio modifica la copia.
- **RF-10** Enlace y código rotatorio funcionan como hoy. No cambia la mecánica del código.

### 5.3 Registro del alumno (sesión con grupo) · HU-04, HU-05, HU-08

- **RF-11** La página del alumno pide primero el código. La lista de nombres solo se muestra después de validar el código. Abrir el enlace sin código válido no revela ningún nombre.
  - Validar el código cuenta como **un** intento para el límite por IP (spec 006).
  - Tras validarlo, el alumno tiene **2 minutos** para elegir su nombre y registrarse sin volver a escribir el código y sin gastar otro intento. Pasado ese tiempo, tiene que escribir el código vigente otra vez.
  - Si los 2 minutos se acaban mientras elige o escribe su nombre, ve un mensaje claro («Ha pasado el tiempo: escribe el código que ves ahora en la pantalla del profesor») y, al volver a validar el código, conserva el nombre que había elegido o escrito.
- **RF-12** Tras validar el código, el alumno ve la lista del grupo con un buscador que filtra mientras escribe (sin distinguir acentos ni mayúsculas).
- **RF-13** Los nombres ya registrados aparecen atenuados y no seleccionables («ya registrado»). Así nadie puede registrar dos veces a la misma persona.
- **RF-14** Si el alumno no se encuentra, puede añadirse escribiendo su nombre. «Existente» incluye los nombres de la lista y los **nuevo** ya registrados en la misma sesión: si dos alumnos escriben «Ella G.», el segundo recibe el mismo aviso.
  - Si el nombre es igual (normalizado) a uno existente, se rechaza y se le pide diferenciarlo (ej. añadir inicial del apellido).
  - Si es muy parecido a uno existente, la app pregunta «¿Quisiste decir Ella García?» con opción de elegir el existente o continuar como nuevo.
- **RF-15** Un nombre añadido por el alumno queda con estado **nuevo** (sin verificar).
- **RF-16** Pantalla de confirmación clara tras registrarse: «✓ Estás dentro, {nombre} – {hora}».
- **RF-17** Cada alumno solo puede registrarse una vez por sesión desde un mismo navegador. Excepción: si el profesor libera o quita el registro hecho desde ese navegador (RF-19, RF-20), ese navegador puede volver a registrarse en esa sesión.

### 5.4 Durante y después de la sesión (profesor) · HU-06, HU-07

- **RF-18** La vista de la sesión muestra el contador «X de N presentes» y la lista de presentes y nuevos en tiempo casi real.
- **RF-19** El profesor puede liberar un nombre ya registrado (por si alguien se equivocó), que vuelve a estar disponible. Liberar un nombre también deja que el navegador que lo registró vuelva a registrarse (RF-17), para que el alumno elija el nombre correcto.
- **RF-20** Cerrar la sesión funciona como hoy. Los **nuevo** se quedan en esa sesión como «nuevo» hasta que el profesor decide sobre cada uno, al cerrar o después, desde la sesión cerrada:
  - **Añadir al grupo:** pasa a ser alumno de la lista para futuras sesiones.
  - **Dejar solo en esta sesión:** sigue como «nuevo» en esta sesión y no entra en el grupo.
  - **Descartar:** se quita su registro, como el botón Quitar de hoy.
  - Como se puede decidir después de cerrar, el grupo puede haber cambiado:
    - **Grupo archivado:** «Añadir al grupo» sigue disponible; el alumno aparece en el grupo cuando se restaura.
    - **Grupo borrado:** «Añadir al grupo» no se ofrece; solo «Dejar solo en esta sesión» o «Descartar».
    - **El grupo ya tiene un alumno con el mismo nombre normalizado** (RF-7): no se duplica. La app avisa «Ya está en el grupo» y une este registro a ese alumno, que pasa de nuevo a presente en esta sesión. Si ese alumno no estaba en la copia de esta sesión, se añade a ella (la excepción de RF-9).
    - **El grupo ya tiene 200 alumnos:** «Añadir al grupo» se rechaza con el mensaje «Este grupo ya tiene 200 alumnos». El profesor puede elegir «Dejar solo en esta sesión» o «Descartar».
- **RF-21** Descarga: un único archivo CSV, como hoy (se abre en Excel o Google Sheets), con una tabla y una columna «Estado» con los valores presente, ausente, nuevo. Incluye grupo y fecha/hora. La columna «Hora» tiene la hora de registro de cada presente y de cada nuevo; los ausentes no tienen hora. El formato no cambia respecto a hoy: separado por `;` y en UTF-8 con BOM, para que Excel en español muestre bien las columnas y los acentos. Como los nombres los pueden escribir los alumnos, toda celda que empiece por `=`, `+`, `-` o `@` se guarda con un apóstrofo delante, para que Excel no la ejecute como fórmula (como hoy).

### 5.5 Compatibilidad y datos · HU-08

- **RF-22** Las sesiones rápidas y todas las sesiones existentes siguen funcionando y descargándose como hoy. Único cambio: quitar un registro también libera ese navegador (RF-17), también en las sesiones rápidas. Hoy el README dice lo contrario y habrá que actualizarlo.
- **RF-23** Las sesiones pasadas con grupo guardan su copia de la lista y el nombre del grupo tal como estaba, incluso si el grupo se renombra, archiva o borra.
- **RF-24** Los grupos se guardan donde la app guarda hoy sus datos: solo en el ordenador del profesor. No pasan a otro ordenador; es aceptable. No hay inicio de sesión. De cada alumno solo se guarda lo que permite P4 (sección 7).

---

## 6. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01** (RF-1, RF-2): **Dado** el profesor en su panel, **cuando** crea un grupo pegando 25 nombres, uno por línea, **entonces** ve una vista previa con 25 alumnos y puede guardar el grupo.
- **CA-02** (RF-1, RF-2, RF-7): **Dado** un CSV con un nombre repetido (sin distinguir mayúsculas, acentos ni espacios), **cuando** el profesor lo sube, **entonces** la vista previa marca el duplicado y no deja guardar hasta resolverlo.
- **CA-03** (RF-11): **Dado** una sesión con grupo abierta, **cuando** alguien abre el enlace de alumnos sin escribir un código válido, **entonces** no ve ningún nombre del grupo.
- **CA-04** (RF-12, RF-13): **Dado** un alumno que ha validado el código, **cuando** escribe «mari», ve «María García» y se registra, **entonces** queda presente y ese nombre aparece atenuado y no seleccionable para los demás.
- **CA-05** (RF-14, RF-15): **Dado** un grupo con «Ella García», **cuando** un alumno que no está en la lista escribe «Ella G.», **entonces** la app le pregunta «¿Quisiste decir Ella García?»; si continúa, queda registrado como nuevo.
- **CA-06** (RF-20): **Dado** una sesión cerrada con un nuevo, **cuando** el profesor decide añadirlo al grupo, **entonces** aparece en la lista del grupo en la siguiente sesión.
- **CA-07** (RF-21): **Dado** una sesión con grupo, **cuando** el profesor descarga la lista, **entonces** obtiene un solo CSV con todos los alumnos de la copia de la lista y los nuevos, y una columna «Estado» con presente, ausente o nuevo.
- **CA-08** (RF-9, RF-23): **Dado** un grupo con sesiones pasadas, **cuando** el profesor renombra a un alumno, **entonces** las sesiones pasadas siguen mostrando el nombre que tenía.
- **CA-09** (RF-5, RF-6): **Dado** un grupo con una sesión abierta, **cuando** el profesor intenta borrarlo, **entonces** la app no lo deja, lo explica y le ofrece archivar o cerrar la sesión; **cuando** lo archiva, **entonces** se archiva y la sesión abierta sigue funcionando.
- **CA-10** (RF-22): **Dado** una sesión rápida, nueva o anterior a este cambio, **cuando** se usa o se descarga, **entonces** funciona igual que antes.
- **CA-11** (RF-11): **Dado** un alumno que ha validado el código, **cuando** tarda un minuto en encontrar su nombre y se registra, **entonces** no tiene que volver a escribir el código, y validar y registrarse cuenta como un solo intento para el límite por IP.
- **CA-12** (RF-20): **Dado** una sesión con un nuevo, **cuando** el profesor la cierra sin decidir, **entonces** se cierra como hoy, el nuevo sigue como «nuevo», y más tarde, desde la sesión cerrada, el profesor puede añadirlo al grupo, dejarlo solo en esa sesión o descartarlo.
- **CA-13** (RF-3, RF-4): **Dado** el profesor con dos grupos, **cuando** abre su panel, **entonces** ve los dos en el listado; **cuando** edita uno (añade, renombra y quita un alumno, y le cambia el nombre), **entonces** los cambios se guardan y se ven en la siguiente sesión con ese grupo.
- **CA-14** (RF-17, RF-19): **Dado** un alumno que se ha registrado por error con el nombre de otro, **cuando** intenta registrarse de nuevo desde el mismo navegador, **entonces** no puede; **cuando** el profesor libera ese nombre, **entonces** el nombre vuelve a estar disponible y ese navegador puede registrarse con el nombre correcto.
- **CA-15** (RF-14): **Dado** un alumno registrado como nuevo con «Ella G.», **cuando** otro alumno escribe «ella g.» en la misma sesión, **entonces** se rechaza como nombre igual y se le pide diferenciarlo.
- **CA-16** (RF-11): **Dado** un alumno que ha validado el código y está escribiendo su nombre, **cuando** pasan los 2 minutos, **entonces** ve un mensaje claro que le pide el código vigente y, tras escribirlo, conserva el nombre que había escrito.
- **CA-17** (RF-20): **Dado** una sesión cerrada con un nuevo, **cuando** el grupo está archivado, **entonces** el profesor puede añadirlo; **cuando** el grupo está borrado, **entonces** no se le ofrece añadirlo; **cuando** el grupo ya tiene un alumno con el mismo nombre normalizado, **entonces** la app avisa «Ya está en el grupo», no lo duplica, y ese alumno pasa a presente en esa sesión.
- **CA-18** (RF-1, RF-21): **Dado** un CSV de alumnos separado por `,` y otro por `;`, con acentos, **cuando** el profesor los sube, **entonces** los dos se leen bien; **y dado** un nuevo que se registró como «=SUMA(1)», **cuando** el profesor descarga la lista y la abre en Excel, **entonces** se ve como texto, no como fórmula.
- **CA-19** (RF-8b): **Dado** un grupo guardado sin alumnos, **cuando** el profesor intenta abrir una asistencia con él, **entonces** la app no la abre, dice «Este grupo todavía no tiene alumnos» y le ofrece añadirlos o abrir una sesión rápida.
- **CA-20** (RF-20, §5.1): **Dado** un grupo con 200 alumnos y una sesión con un nuevo, **cuando** el profesor elige «Añadir al grupo», **entonces** la app lo rechaza con «Este grupo ya tiene 200 alumnos», el grupo sigue con 200, y el profesor puede elegir «Dejar solo en esta sesión» o «Descartar».

---

## 7. Enmienda a la constitución 3.0 (P4)

Texto actual de P4: del alumno solo se guarda «el nombre que él mismo escribe».

La enmienda sube la constitución a la **versión 4.0**, porque contradice un principio (constitución §8). Solo cambia la primera regla de P4; las demás reglas de P4 (la IP solo en la lista negra y los contadores, los datos solo en local, el paso cifrado por el túnel) se quedan igual.

Texto propuesto para esa primera regla:

> **P4.** De cada alumno solo se guarda su nombre y, en cada sesión, la hora y el estado de su registro, y nada más. El nombre puede venir de dos orígenes: el que escribe el propio alumno, o el que introduce el profesor en la lista de un grupo antes de que el alumno se registre. Los nombres escritos por el alumno que no están en la lista se marcan como sin verificar. Los nombres se usan únicamente para pasar lista. El profesor puede borrar cualquier grupo que no tenga sesiones abiertas y quitar cualquier registro, y la lista de nombres de un grupo no es visible para los alumnos ni para nadie de fuera sin un código de sesión válido; el profesor la ve en su panel.

Consecuencias de la enmienda:

- La spec 001 excluyó la «lista previa de alumnos para detectar ausentes» por P4. Esta enmienda levanta esa exclusión.
- Por tratarse de nombres de personas, posiblemente menores, la enmienda fija finalidad (pasar lista), minimización (solo nombre) y control del profesor sobre el borrado.
- La enmienda solo la aprueba la persona que trabaja en esta carpeta. Esta spec no edita la constitución.

---

## 8. Fuera de alcance

- Inicio de sesión del profesor y sincronización entre dispositivos.
- Historial de asistencia por alumno y estadísticas.
- Geolocalización, QR y modo proyector.
- Migración o cambio de las sesiones rápidas existentes.
- Borrar sesiones enteras (se pueden quitar registros, como hoy).
- Impedir del todo que un alumno elija el nombre de un compañero que todavía no se ha registrado (como en la spec 001).

---

## 9. Preguntas abiertas

Ninguna. Decisiones de la persona que trabaja en esta carpeta (2026-10-27):

- **Cómo se crea la lista:** a mano (uno a uno o pegando un nombre por línea) o con un CSV, combinables.
- **Alumnos que no están:** se añaden ellos mismos como «nuevo»; el profesor decide qué hacer con ellos.
- **Nombres parecidos o iguales:** «¿Quisiste decir…?» si es parecido; rechazo si es igual. Vale para alumno y profesor.
- **Nombres ya registrados:** atenuados y no seleccionables; el profesor puede liberarlos.
- **Lista oculta sin código:** los alumnos y la gente de fuera solo ven los nombres tras validar el código de 4 dígitos; el profesor los ve en su panel.
- **Copia fija al abrir:** renombrar o borrar en el grupo no cambia sesiones pasadas.
- **Sesión rápida:** exactamente como hoy.
- **Grupos:** editables, archivables (también con una sesión abierta, que sigue funcionando) y borrables solo sin sesiones abiertas.
- **Descarga:** un solo CSV, como hoy, con la columna «Estado».
- **Almacenamiento:** donde la app guarda hoy sus datos, solo en el ordenador del profesor; que no pase a otro ordenador es aceptable.
- **Límite de nombre:** 60 caracteres para todo.
- **Enmienda:** versión 4.0; solo cambia la primera regla de P4, nombra la hora y el estado, y dice que se pueden borrar grupos sin sesiones abiertas y quitar registros, no sesiones enteras.
- **Validar el código:** cuenta como un intento y da 2 minutos para registrarse sin volver a escribirlo.
- **Textos:** RF-13 promete solo evitar registrar dos veces a la misma persona; RF-17 dice «navegador».
- **Palabra:** «grupo» para el conjunto de alumnos; «clase» no cambia.
- **Nuevos al cerrar:** cerrar funciona como hoy; se decide al cerrar o después; descartar quita el registro.
- **Formato:** la spec sigue el `AGENTS.md` de la app (§2.1). El modelo de datos de la v0.2 recibida pasa al `plan.md`.
- **Liberar o quitar un registro** también libera ese navegador para esa sesión, incluidas las sesiones rápidas (cambia lo que dice hoy el README).
- **Nuevos al decidir tarde:** grupo archivado, se puede añadir; grupo borrado, no; nombre ya en el grupo, se une a ese alumno.
- **CSV:** la importación acepta `;` y `,`, en UTF-8 con o sin BOM; la descarga sigue como hoy (`;`, UTF-8 con BOM, apóstrofo ante `=`, `+`, `-`, `@`).
- **Nombres repetidos entre nuevos:** cuentan como existentes para RF-14.
- **Tiempo agotado al registrarse:** mensaje claro y se conserva el nombre.
- **Grupo vacío:** se puede guardar sin alumnos, pero no se puede abrir una sesión con él.
- **Límite de 200 al añadir un nuevo (2026-10-27):** si «Añadir al grupo» haría pasar el grupo de 200 alumnos, se rechaza con «Este grupo ya tiene 200 alumnos»; quedan «Dejar solo en esta sesión» y «Descartar».
- **Hora en la descarga (2026-10-27):** la columna «Hora» tiene la hora de registro de cada presente y de cada nuevo; los ausentes no tienen hora.
- **Cambios respecto a v0.1:** renombrar a un alumno ya no cambia las sesiones pasadas, y borrar un grupo con sesiones cerradas ya se puede.

---

## 10. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-27 | Borrador inicial con cursos | La issue #539 pide una lista de alumnos. La constitución §4 exige un spec aprobado antes de tocar cualquier fichero. |
| 0.2 | 2026-10-27 | Sustituye a v0.1: grupos con alta manual o CSV, archivar, copia fija de la lista por sesión, lista oculta hasta validar el código, alumnos «nuevo», columna «Estado», enmienda 4.0 de P4. Adaptada al formato del `AGENTS.md` (usuarios, historias, CA-01 a CA-12) | Nueva redacción de la persona que trabaja en esta carpeta y respuestas a los puntos abiertos |
| 0.3 | 2026-10-27 | Liberar un nombre libera el navegador (RF-17, RF-19, RF-22); casos de RF-20 al decidir tarde; formato y seguridad del CSV (RF-1, RF-21); nuevos repetidos (RF-14); tiempo agotado (RF-11); grupo vacío (RF-8b); CA-13 a CA-19 | Revisión de la spec |
| 1.0 | 2026-10-27 | Aprobada | Ok de la persona que trabaja en esta carpeta |
| 1.1 | 2026-10-27 | Excepción de la copia fija al unir un nuevo con un alumno del grupo (RF-9, RF-20); el texto de P4 dice que el profesor ve la lista en su panel (§7, HU-08, §9); límite de 200 al añadir un nuevo (§5.1, RF-20, CA-20); la «Hora» del CSV incluye a los nuevos (RF-21) | Revisión del plan: la spec no cubría esos casos |
