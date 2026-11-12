# Tareas 006 · Limitar los intentos de registro por dirección

> Estado: hechas el 2026-10-26. Spec v1.1 y plan 0.2. Issue #400.

- [x] **T01** · Regla en `asistencia/domain/attempts.py`: más de 5 en el segundo o más de 20 en el minuto, y el error con el mensaje único. Cubre CA-01 a CA-08.
- [x] **T02** · Tablas, anotación con poda y bloqueo en `asistencia/storage/sqlite.py`. Cubre CA-09 a CA-13 y CA-20.
- [x] **T03** · `check_in` anota el intento y bloquea antes de registrar. Cubre CA-02, CA-04 a CA-07 y CA-14 a CA-16.
- [x] **T04** · `app.py` elige la dirección y traduce el error a HTTP 429. Cubre CA-08, CA-17, CA-18 y CA-21.
- [x] **T05** · Enmienda 3.0, README, arquitectura, manual y pruebas de cada CA. Cubre CA-19 y CA-20.
