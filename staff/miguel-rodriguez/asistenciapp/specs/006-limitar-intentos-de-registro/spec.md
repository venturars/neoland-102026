# Spec 006 · Limitar intentos automatizados de registro

Estado: creada el 2026-10-23; ejecución completa autorizada por Miguel el 2026-10-24. Revisión interna del spec completada; plan e implementación dentro de la delegación expresa de terminar las tareas de clase.

Tarea: [issue #300](https://github.com/venturars/neoland-102026/issues/300). Parte de la reorganización 005, publicada en [PR #284](https://github.com/venturars/neoland-102026/pull/284). Esta tarea tendrá su propia PR y su destino final será staging.

## Problema

Una persona puede probar automáticamente muchos códigos y conseguir registrar una asistencia sin conocer el código mostrado en clase. El código rotatorio por sí solo no frena esa repetición.

El profesor necesita limitar los intentos de registro de cada dirección pública de origen y bloquear las que excedan los máximos. El código seguirá teniendo cuatro cifras y el resto del uso de la aplicación conservará su funcionamiento.

## Usuarios

- El profesor, que necesita una lista de asistencia fiable.
- El alumnado, que debe poder registrarse dentro de los límites y entender si su dirección está bloqueada.
- Miguel, que mantiene esta copia y aprueba los cambios de sus reglas y de su tratamiento de datos.

## Historias de usuario

- **HU-01:** Como profesor, quiero limitar los intentos de registro de una misma dirección para frenar las pruebas automatizadas de códigos.
- **HU-02:** Como profesor, quiero que una dirección que supera un máximo quede bloqueada permanentemente para el registro.
- **HU-03:** Como alumno, quiero que abrir la aplicación y consultar sus páginas no consuma intentos de registro.
- **HU-04:** Como responsable, quiero conservar solo los datos necesarios para contar intentos recientes y mantener el bloqueo, sin ampliar los datos de asistencia del alumnado.

## Criterios de aceptación

- **CA-01 · Segundo:** Dada una dirección no bloqueada, cuando intenta registrarse, entonces puede realizar hasta cinco intentos en el último segundo; el sexto supera el límite y no registra asistencia.
- **CA-02 · Minuto:** Dada una dirección no bloqueada que respeta el máximo por segundo, cuando intenta registrarse, entonces puede realizar hasta veinte intentos en el último minuto; el vigesimoprimero supera el límite y no registra asistencia.
- **CA-03 · Ambos máximos:** Dados ambos límites, cuando se supera cualquiera, entonces se bloquea esa dirección aunque el otro máximo todavía no se haya alcanzado.
- **CA-04 · Qué cuenta:** Dado un intento de registrarse, cuando llega desde una dirección identificada, entonces cuenta con independencia de que el nombre o el código sean válidos, de que la clase exista o esté cerrada, o de que el registro sea nuevo o repetido. Abrir páginas, consultar clases, consultar la lista, crear o cerrar una clase, quitar registros y exportar no consumen intentos.
- **CA-05 · Alcance por origen:** Dada una misma dirección pública, cuando intenta registrarse con distintos nombres o en distintas clases, entonces comparte los mismos contadores y bloqueo. Otra dirección conserva sus propios contadores y estado. El alumnado no puede elegir ni sustituir la dirección contabilizada mediante campos del formulario ni otros datos que envíe por su cuenta. La dirección debe corresponder al origen determinado de forma fiable por la aplicación, también cuando se accede mediante el túnel. En el uso directo local se contabiliza la dirección de la conexión local, sin presentarla como dirección pública de Internet.
- **CA-06 · Bloqueo permanente:** Dada una dirección que ha superado un límite, cuando vuelve a intentar registrarse, incluso pasado un minuto, en otra clase o después de reiniciar la aplicación, entonces sigue bloqueada y no crea ni modifica asistencias. El bloqueo no caduca automáticamente.
- **CA-07 · Información visible:** Dado un intento que causa un bloqueo o procede de una dirección ya bloqueada, cuando se responde, entonces se muestra un mensaje claro en español indicando que esa dirección está bloqueada para registrar asistencia. No se comunica un tiempo de espera como si el bloqueo fuese temporal.
- **CA-08 · Ventanas de tiempo:** Dados los intentos de una dirección no bloqueada, cuando un intento cumple un segundo deja de contar para el límite por segundo, y cuando cumple sesenta segundos deja de contar para el límite por minuto. No se reinicia el contador por cambiar el segundo o minuto del reloj: se considera el intervalo inmediatamente anterior al intento actual.
- **CA-09 · Datos temporales:** Dados los datos usados para contar intentos, cuando llega un nuevo intento de registro, entonces se eliminan, antes de evaluar ese intento, todos los registros temporales de intentos con antigüedad igual o superior a sesenta segundos, de cualquier dirección. No basta con excluirlos del recuento: tras atender el intento no deben seguir almacenados. Si no llegan nuevos intentos, la limpieza se realiza al llegar el siguiente; no se exige una eliminación en segundo plano durante la inactividad. Los datos mínimos del bloqueo permanente se conservan separados y no se eliminan con esta limpieza.
- **CA-10 · Conservación:** Dada una dirección no bloqueada que respeta los límites, cuando utiliza la aplicación, entonces se mantienen los códigos de cuatro cifras, su rotación, la validación y los resultados actuales de asistencia. Se conservan los registros existentes, sus fechas, el acceso del profesor y la exportación. Las operaciones distintas del registro siguen funcionando también desde una dirección bloqueada.
- **CA-11 · Reglas y privacidad:** Dada la constitución actual, cuando se prepare esta protección, entonces se propone y aprueba antes de implementarla una enmienda que permita recordar la dirección pública exclusivamente para contar intentos y mantener los bloqueos, y que convierta la protección contra intentos automatizados en requisito. Los datos de asistencia siguen siendo nombre y hora; no se añaden otros identificadores ni se mezclan las direcciones con la lista de asistencia.

- **CA-12 · Origen no determinable:** Dado un intento cuyo origen no puede identificarse de forma fiable, cuando se intenta registrar asistencia, entonces se rechaza sin guardar ni modificar una asistencia y se muestra un mensaje claro en español indicando que no se ha podido identificar el origen. No se permite eludir los límites por falta de dirección ni se inventa una dirección o se bloquea otra como sustituta. Las consultas y demás operaciones mantienen su funcionamiento.

## Decisiones de alcance

- Los máximos incluyen todos los intentos de registro y se comparten entre clases por dirección pública, no por nombre ni por navegador.
- Los intervalos son móviles: en un instante dado cuentan los intentos con antigüedad menor de un segundo o de sesenta segundos, respectivamente. El intento actual se incluye al comprobar el máximo.
- La limpieza se activa con los intentos de registro y abarca los datos temporales caducados de todas las direcciones, incluidas las que ya no vuelven a intentar registrarse. Se comprueba con intentos de varias direcciones: al atender otro intento, los registros de sesenta segundos o más han desaparecido, los recientes permanecen y los bloqueos siguen vigentes.
- Si no puede determinarse un origen fiable, se rechaza el registro con un mensaje explicativo; no se acepta sin control ni se atribuye a otra dirección.
- Permanencia significa que el bloqueo sobrevive al paso del tiempo y al reinicio de la aplicación. Esta tarea no incluye un panel ni una operación de desbloqueo.
- Personas que comparten una dirección pública comparten los límites y el bloqueo; esta protección distingue direcciones, no personas. Tampoco garantiza identificar a una misma persona si cambia su dirección pública.

## Relación con la constitución

P4 prohíbe guardar direcciones IP y §6 deja fuera la protección contra scripts. La tarea requiere cambiar ambas reglas; esta spec propone ese cambio, sin aplicarlo. El plan deberá concretar una enmienda mayor, partiendo de nuestra versión 2.4, y mantener los demás principios y su historial. La aprobación del spec no sustituye la aprobación del plan, las tareas ni la enmienda concreta.

## Fuera de alcance

Cambiar la longitud o dificultad del código, añadir cuentas, pedir datos personales nuevos al alumnado, otros métodos de registro, rediseñar pantallas, nuevas exportaciones, bloquear consultas o el panel del profesor, desbloqueo automático o manual, perseguir a una persona a través de distintas direcciones y cambios en otras aplicaciones. No se reescriben specs 001–005.

## Preguntas abiertas

No quedan decisiones de comportamiento abiertas en este borrador. El plan deberá concretar y verificar cómo se determina el origen fiable en los modos local y con túnel, sin confiar en una dirección elegida por el alumno. No se promete que una dirección pública sea estática o imposible de cambiar. Si los modos actuales no permiten cumplir estos criterios, se revisará la spec antes de implementar.

Los umbrales, la permanencia, la exclusión de consultas y la eliminación de intentos antiguos proceden de la tarea de clase y de la issue #300. Las decisiones propuestas concretan sus límites para revisión; cualquier desacuerdo se corrige en esta fase antes del plan.


## Autorización de ejecución · 2026-10-24

Miguel pidió completar todo lo pendiente antes de la mejora propia y solicitar también revisión a sergiocortessat. Esta autorización posterior permite continuar las fases de 006 con revisión interna y evidencia, sin atribuirle aprobaciones individuales que no ha realizado. La revisión de compañeros y las condiciones de merge siguen vigentes.
