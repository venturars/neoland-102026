# Spec 006 · Control de acceso por IP

> Estado: **Aprobada** · Creada: 2026-10-24 · Aprobada: 2026-10-24 · Enmendada: 2026-10-24 · Issue: #326

---

## 1. Problema

Desde una misma IP se pueden hacer llamadas ilimitadas y sin control para pasar lista, hasta acertar la combinación y apuntarse en la clase como que se ha pasado lista.

Quien trabaja en el proyecto quiere un control de acceso por IP en esas llamadas. El código de la clase no se complica: sigue igual (constitución 3.0, §6).

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Profesor** | Que nadie se apunte a base de probar combinaciones sin límite, y que la lista siga siendo de quien ha pasado lista de verdad. |
| **Alumno** | Pasar lista con normalidad cuando su IP está dentro del límite. |
| **Quien prueba combinaciones** | Recibir un aviso de ban y quedar en la blacklist si supera el límite. |

## 3. Historias de usuario

- **HU-01**: Como alumno, quiero pasar lista cuando mi IP no ha superado el límite, para registrarme igual que hasta ahora.
- **HU-02**: Como profesor, quiero que una IP solo pueda conectarse 5 veces por segundo y 20 veces por minuto para pasar lista, para que no haya llamadas ilimitadas.
- **HU-03**: Como profesor, quiero que una IP que hace más conexiones de las permitidas reciba un aviso de ban y entre en la blacklist, que esa blacklist se guarde siempre y que nadie pueda quitarla ni cambiarla, para que el ataque se corte y no se olvide.
- **HU-04**: Como profesor, quiero que la IP que cuenta sea la IP pública estática de quien llama, para que cambiar la IP en lo que envía no evite el límite ni el ban.
- **HU-05**: Como profesor, quiero que el código de la clase siga igual, para no hacer el puzzle más difícil.
- **HU-06**: Como profesor, quiero que la lista de asistencia siga mostrando solo el nombre y la hora, para que la IP no forme parte de esa lista.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

Cuentan todas las llamadas para pasar lista desde esa IP, sea cual sea el nombre que se escriba y sea cual sea el código que se envíe. El límite es de la IP, no de una clase ni de un nombre.

### Dentro del límite (HU-01, HU-02)

- **CA-01**: **Dado** una IP que en ese segundo lleva menos de 5 llamadas para pasar lista y en ese minuto lleva menos de 20, **cuando** envía su nombre y el código vigente, **entonces** queda registrada como hasta ahora.
- **CA-02**: **Dado** una IP que en ese segundo lleva menos de 5 llamadas y en ese minuto lleva menos de 20, **cuando** envía un código que no es el vigente, **entonces** ve el aviso de código no válido que ya existe, no queda registrada, y esa llamada sí cuenta para el límite.

### Ataque y blacklist (HU-02, HU-03)

- **CA-03**: **Dado** una IP que en ese segundo ya se ha conectado 5 veces para pasar lista, **cuando** se conecta otra vez, **entonces** ve «No puedes pasar lista: tu acceso está bloqueado.», no queda registrada y su IP pública estática entra en la blacklist.
- **CA-04**: **Dado** una IP que en ese minuto ya se ha conectado 20 veces para pasar lista, **cuando** se conecta otra vez, **entonces** ve «No puedes pasar lista: tu acceso está bloqueado.», no queda registrada y su IP pública estática entra en la blacklist.
- **CA-05**: **Dado** una IP que ya está en la blacklist, **cuando** intenta pasar lista, aunque envíe el código vigente, **entonces** ve «No puedes pasar lista: tu acceso está bloqueado.» y no queda registrada.
- **CA-09**: **Dado** una IP en la blacklist, **cuando** pasa el tiempo, se cierra la clase o se vuelve a usar la asistencia, **entonces** esa IP sigue en la blacklist. La blacklist se guarda siempre.
- **CA-10**: **Dado** una IP en la blacklist, **cuando** cualquiera —el profesor, el gestor o quien llama— intenta quitarla o cambiarla, **entonces** no hay forma de hacerlo y esa IP sigue igual.

### IP pública estática (HU-04)

- **CA-06**: **Dado** alguien que en lo que envía para pasar lista indica una IP distinta de la suya, **cuando** se cuentan las llamadas o se aplica el ban, **entonces** la IP que cuenta es su IP pública estática. La IP que ha indicado no evita el límite ni el ban, y no es la que entra en la blacklist.

### El código no cambia (HU-05)

- **CA-07**: **Dado** este control de acceso, **cuando** el profesor abre la asistencia, **entonces** el código sigue siendo de 4 cifras y sigue cambiando como en la spec 001. El puzzle no es más difícil.

### La lista no guarda la IP (HU-06)

- **CA-08**: **Dado** un alumno registrado, **cuando** el profesor ve la lista o la descarga, **entonces** aparecen el nombre y la hora, y no aparece la IP.

## 5. Fuera de alcance

- Hacer el código más largo, más difícil o que tarde más en cambiar.
- Contar o limitar otras acciones del profesor: abrir la asistencia, ver la lista, quitar un registro o descargarla.
- Guardar la IP en la lista de asistencia.
- Distinguir a varias personas que comparten la misma IP pública estática.
- El plan y las tareas. Son las fases siguientes.

## 6. Preguntas abiertas

| # | Pregunta | Decisión |
| --- | --- | --- |
| P1 | ¿Cuánto tiempo permanece una IP en la blacklist? | Se guarda siempre. El tiempo no la borra (CA-09). |
| P2 | ¿Quién puede quitar una IP de la blacklist? | Nadie. No se quita ni se modifica (CA-10). |
| P3 | ¿Qué dice el aviso de ban y qué indica que hay que hacer? | «No puedes pasar lista: tu acceso está bloqueado.» No hay paso siguiente: nadie puede levantar el bloqueo (CA-03, CA-04, CA-05). |
