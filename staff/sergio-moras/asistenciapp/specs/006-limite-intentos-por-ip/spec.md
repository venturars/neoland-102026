# Spec 006 · Límite de intentos de registro por IP

> Estado: **Implementada** (2026-11-01) · Creada: 2026-11-01 · Aprobada: 2026-11-01 · Issue: #728

---

## 1. Problema

El código de asistencia tiene 4 cifras: 10.000 combinaciones. A mano nadie las prueba todas en 30 segundos, pero un script sí. La demo `asistencia/hack-etico.sh` de esta carpeta lo demuestra: lanza intentos en paralelo hasta acertar y deja registrado a alguien que no está en clase.

Hoy la app acepta todos los intentos que lleguen. La constitución (§6, v1.1) decidió en su momento no protegerse de scripts, y además prohíbe guardar IPs (P4), así que no hay forma de saber que los intentos vienen del mismo sitio.

Hay una dificultad añadida: en clase online los alumnos entran por el túnel, y la app ve todas esas conexiones como si vinieran del propio ordenador del profesor. Si se contara esa dirección, todos los alumnos compartirían el mismo límite.

---

## 2. Usuarios

| Usuario | Necesidad |
| --- | --- |
| **Profesor** | Que la lista refleje solo a quien está en clase, aunque alguien use un script. |
| **Alumno** | Registrarse escribiendo el código a mano como siempre, sin notar el límite. |
| **Quien intenta abusar** | (Usuario a frenar.) No debe poder probar códigos sin control ni esquivar el límite cambiando lo que envía. |

---

## 3. Historias de usuario

- **HU-01**: Como profesor, quiero que una misma conexión no pueda probar códigos sin límite, para que nadie se registre adivinándolo con un script.
- **HU-02**: Como profesor, quiero que quien se pase del límite quede bloqueado de forma duradera, para que no vuelva a intentarlo en cuanto pase un minuto.
- **HU-03**: Como alumno, quiero registrarme a mano igual que antes, para que la protección no me moleste.
- **HU-04**: Como alumno que entra desde casa por el túnel, quiero que mis intentos no se sumen a los de mis compañeros, para no quedar bloqueado por culpa de otros.
- **HU-05**: Como profesor, quiero que la app solo guarde de cada conexión lo imprescindible para el bloqueo, para seguir respetando la privacidad del alumnado.

---

## 4. Criterios de aceptación

### El límite (HU-01)

- **CA-01**: **Dado** una conexión, **cuando** hace su 6.º intento de registrarse dentro del mismo segundo, **entonces** se rechaza con el aviso de bloqueo.
- **CA-02**: **Dado** una conexión, **cuando** hace su 21.º intento de registrarse dentro del mismo minuto, **entonces** se rechaza con el aviso de bloqueo.
- **CA-03**: **Dado** una conexión, **cuando** consulta la clase, abre una página o usa el panel del profesor, **entonces** eso no cuenta como intento.
- **CA-04**: **Dado** una conexión por debajo de los dos límites, **cuando** intenta registrarse, **entonces** el resultado es el mismo que antes de este cambio (registro, código no válido, clase cerrada…), y cada intento cuenta tanto si acierta como si no.

### El bloqueo (HU-02)

- **CA-05**: **Dado** una conexión que ha superado un límite, **cuando** vuelve a intentar registrarse en cualquier clase, **entonces** recibe el aviso de bloqueo sin que se compruebe su código.
- **CA-06**: **Dado** una conexión bloqueada, **cuando** pasa el tiempo o la app se reinicia, **entonces** sigue bloqueada.
- **CA-07**: **Dado** el aviso de bloqueo, **cuando** lo ve el alumno, **entonces** está en español y dice que esa conexión ha quedado bloqueada por demasiados intentos y que hable con el profesor.

### Qué conexión se cuenta (HU-04)

- **CA-08**: **Dado** alumnos que entran por el túnel desde casas distintas, **cuando** intentan registrarse, **entonces** cada uno cuenta con su propia dirección pública, no con la del ordenador del profesor.
- **CA-09**: **Dado** un intento que trae datos inventados para aparentar otra dirección, **cuando** se cuenta, **entonces** se usa la dirección real y no la inventada.

### Lo que no cambia (HU-03, HU-05)

- **CA-10**: **Dado** el código de asistencia, **cuando** se aplica este cambio, **entonces** sigue siendo de 4 cifras y cambiando cada 30 segundos.
- **CA-11**: **Dado** un registro de asistencia, **cuando** se guarda, **entonces** sigue teniendo solo el nombre y la hora; la dirección de la conexión no se guarda junto a él ni aparece en la lista ni en el CSV.
- **CA-12**: **Dado** la constitución, **cuando** se lee P4 y §6, **entonces** permiten guardar la dirección de la conexión solo para contar intentos y para la lista de bloqueo, y piden protegerse de intentos automáticos con este límite.

### La demo (HU-01)

- **CA-13**: **Dado** `asistencia/hack-etico.sh` lanzado contra la app, **cuando** prueba códigos en paralelo, **entonces** queda bloqueado antes de recorrer el rango.

---

## 5. Fuera de alcance

- Complicar el código (más cifras, letras, captchas).
- Pantalla o botón para gestionar la lista de bloqueo.
- Limitar otras partes de la app.

---

## 6. Decisiones y riesgo aceptado

- **Se cuentan todos los intentos de registrarse**, aciertes o no, como pide la issue.
- **El bloqueo es para siempre.** No hay pantalla para quitarlo; si hiciera falta, se borra a mano de la base de datos.
- **Riesgo aceptado: conexión compartida.** Quien sale a internet por la misma conexión (por ejemplo, 10 alumnos en la wifi del aula) comparte el límite y el bloqueo. Si 6 de ellos envían el código en el mismo segundo, esa conexión queda bloqueada para todos. Distinguir personas dentro de una misma conexión necesitaría un dato que el alumno puede cambiar, y la issue lo prohíbe. Es la misma decisión que el resto de la clase.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 0.1 | 2026-11-01 | Borrador |
| 1.0 | 2026-11-01 | Aprobada: se cuentan todos los intentos, bloqueo para siempre y conexión compartida como riesgo aceptado |
| 1.1 | 2026-11-01 | Implementada: T01–T09, 125 tests en verde; `hack-etico.sh` bloqueado desde el 6.º intento (5 × 422, 46 × 429, ningún registro) |
