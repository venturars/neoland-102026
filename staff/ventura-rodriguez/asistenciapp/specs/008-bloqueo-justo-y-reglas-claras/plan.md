# Plan técnico 008 · Bloqueo justo y reglas claras

> Estado: **Implementado** (2026-10-30) · Spec: [spec.md](spec.md) v1.0 · Creado: 2026-10-30

Issue: #653.

Este documento explica **cómo** se cumple la spec. Cada decisión indica qué criterios de aceptación (`CA-xx`) cubre.

---

## 1. Visión general

- El freno cuenta solo los **códigos fallados**, después de comprobar que la clase existe, está abierta y el nombre vale.
- El bloqueo dura **10 minutos**. Los bloqueos caducados se borran.
- Con `--tunel`, la IP es la que Cloudflare escribe en `CF-Connecting-IP`.
- La constitución sube a 4.0. El orquestador de git, el manual y el README se aclaran.

No entra ninguna dependencia nueva de Python. La tabla `blocked_ips` no cambia de forma: no hace falta migrar `data/asistencia.db`.

---

## 2. Decisiones

### 2.1 Solo cuentan los códigos fallados (CA-01, CA-02)

`check_in` en `asistencia/usecases/attendance.py` queda en este orden:

1. Borrar los bloqueos caducados y mirar si la IP está bloqueada → `Banned`.
2. La clase existe y está abierta; el nombre vale.
3. Si el código vale, se guarda el registro. **No se anota ningún intento.**
4. Si no vale: se anota el intento, se cuentan el último segundo y el último minuto y, si se pasa (`over_limit`), se bloquea la IP → `Banned`. Si no, `InvalidCode`.

Los máximos (5 y 20) no cambian. Un nombre vacío o una clase cerrada no cuentan: no son probar códigos.

### 2.2 El bloqueo caduca a los 10 minutos (CA-03, CA-04, CA-07)

- `asistencia/domain/attempts.py` gana `BAN_SECONDS = 10 * 60`. El aviso dice cuánto dura y qué hacer.
- `storage.prune_blocked_ips(path, older_than)` borra los bloqueos con `blocked_at` anterior. Las horas son ISO UTC con el mismo formato, así que se comparan como texto.
- `storage.block_ip` vuelve a escribir la hora si la IP ya estaba (`ON CONFLICT DO UPDATE`).
- Un `127.0.0.1` bloqueado para siempre por la versión anterior se borra solo en el primer intento de registrarse.

### 2.3 La IP detrás del túnel (CA-05, CA-06)

- `create_app(..., tunnel=False)`. `main()` pasa `tunnel=args.tunel`.
- `client_ip(remote_addr, forwarded, tunnel)` en `app.py` (borde, porque lee HTTP): si hay túnel, la conexión llega de `127.0.0.1` o `::1` y `CF-Connecting-IP` es una IP válida (`ipaddress`), se usa esa. Si no, `request.remote_addr`.
- Cloudflare **sobrescribe** `CF-Connecting-IP` en cada petición que pasa por el túnel: un alumno no puede elegir otra. Sin túnel, la cabecera se ignora, como en la spec 006.
- Riesgo aceptado: con `--tunel`, un programa del propio ordenador del profesor podría poner esa cabecera. Ese programa ya puede leer `data/asistencia.db`, así que no abre nada nuevo.

### 2.4 Constitución 4.0 (CA-08, CA-09, CA-10)

Sube de 3.1 a **4.0** porque el §6 deja de decir que el freno contra scripts no es un requisito.

- **§6**: el freno existe, cuenta solo códigos fallados y caduca. Nunca puede impedir que la clase pase lista.
- **P4**: «IP pública estática» pasa a «la IP de quien intenta registrarse» (con el túnel, la que da Cloudflare). Se recuerda solo para contar los códigos fallados durante un minuto y para un bloqueo que caduca.
- **P3**: nombra las herramientas externas que no son de Python: `cloudflared` (spec 001) y `git`, `gh` y el MCP de GitHub (spec 007).
- **§3**: filas para el túnel, el flujo de git y los sistemas (macOS, Linux y Windows; los scripts de `tools/` piden bash, en Windows Git Bash).
- **§4.1**: entre los ficheros que piden spec están `agents/`, `skills/`, `tools/`, `templates/` y `MCPS/`.
- El historial gana la fila 4.0.

`tests/test_architecture.py` (CA-09 de la spec 005) busca `Versión 3.0` e `IP pública estática`. Pasa a buscar `Versión 4.0` y la nueva frase.

### 2.5 El agente se para al acabar el momento (CA-11)

En `agents/git-workflow-agent.md`, «Llama y continúa. No espera un sí» pasa a: dentro del momento elegido, encadena sus pasos sin esperar un sí; al acabar el último, se para. Cada acción dice a qué momento pertenece. `AGENTS.md` §2 lo repite en una línea.

### 2.6 Comandos para cada sistema (CA-12, CA-13)

- `README.md` y `AGENTS.md` §4–§5 dan los comandos de macOS/Linux y de Windows (PowerShell): crear y activar el entorno, instalar cloudflared, cambiar de puerto y parar la app.
- Se mantienen las dos líneas `cd staff/<usuario>/asistenciapp` del README (spec 004).
- `asistencia/tunnel.py` gana `install_hint(platform)`: `brew install cloudflared` en macOS, `winget install --id Cloudflare.cloudflared` en Windows, y la página de descargas de cloudflared en Linux. El aviso de «No se encontró cloudflared» la usa.

---

## 3. Comprobación de la constitución

| Regla | Cómo la cumple |
| --- | --- |
| P1 | El túnel sigue siendo una forma de llegar; el registro no depende de él |
| P2 | Sin interfaces nuevas ni tablas nuevas. Una constante, dos funciones pequeñas y una cabecera |
| P3 | Sin dependencias nuevas. `ipaddress` y `sys` son de la biblioteca estándar |
| P4 (4.0) | La IP sigue fuera del registro del alumno. Ahora se borra antes: intentos al minuto, bloqueos a los 10 minutos |
| P5 | Las pantallas no cambian |
| P6 | Avisos, documentos y specs en español |
| §5 | Cada CA tiene un test o una comprobación manual (§4) |
| §6 (4.0) | El código sigue caducando. El freno ya no puede bloquear a la clase |
| §7 | Solo se edita `staff/ventura-rodriguez/asistenciapp/` |

---

## 4. Comprobación

| Criterio | Test o paso |
| --- | --- |
| CA-01 | `test_correct_codes_never_count` |
| CA-02 | `test_five_bad_codes_in_one_second_are_not_a_ban_and_the_sixth_is`, `test_the_twenty_first_attempt_in_a_minute_bans` |
| CA-03 | `test_the_block_expires_after_ten_minutes`, `test_the_block_survives_opening_the_app_again` |
| CA-04 | `BAN` en `tests/test_rate_limit.py` |
| CA-05 | `test_behind_the_tunnel_each_student_has_their_own_ip` |
| CA-06 | `test_a_different_ip_in_the_body_or_headers_does_not_change_the_block`, `test_client_ip_*` |
| CA-07 | `test_an_expired_block_is_pruned`, `test_an_old_permanent_block_is_lifted` |
| CA-08 – CA-10 | `test_constitution_names_the_new_folders` y lectura de `docs/CONSTITUTION.md` |
| CA-11 | Lectura de `agents/git-workflow-agent.md` |
| CA-12 | Lectura de `README.md` y `AGENTS.md` en macOS, Linux y Windows |
| CA-13 | `test_install_hint_*` |

---

## 5. Decisiones tomadas

1. **10 minutos** (2026-10-30): basta para frenar a un script (con 20 fallos por minuto, 10 000 códigos y un código que cambia cada 30 s) y no deja sin clase a nadie.
2. **La IP del túnel es `CF-Connecting-IP`** (2026-10-30): cambia la decisión 1 del plan 006. Cloudflare la escribe y el alumno no la elige; fiarse solo de `127.0.0.1` bloqueaba a la clase entera.
3. **Sin botón para quitar un bloqueo** (2026-10-30): con la caducidad ya no hace falta. Queda fuera de alcance.
