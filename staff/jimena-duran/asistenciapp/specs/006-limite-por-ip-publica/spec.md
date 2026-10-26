# Spec 006 · Límite de intentos por IP

Responsable: Jimena Durán.
Estado: documentación preparada; pendiente de revisión y aprobación para implementar.
Fecha: 2026-10-23.
Referencias: [issue #260](https://github.com/venturars/neoland-102026/issues/260)
y [PR #261](https://github.com/venturars/neoland-102026/pull/261) del profesor.
Son referencias de alcance, no una issue propia ni una aprobación transferida.

## 1. Problema

Una persona puede probar códigos sin límite hasta acertar uno y registrar asistencia.
Jimena quiere alcanzar el comportamiento de la referencia antes de añadir mejoras.
El control debe frenar esos intentos sin alargar ni complicar el código de cuatro cifras.

## 2. Usuarios

- Profesora: necesita limitar los intentos y conservar los bloqueos al reiniciar.
- Alumnado: debe poder registrarse como antes cuando no supera los límites.
- Jimena Durán: aprueba el alcance, la excepción de privacidad y la implementación.

## 3. Historias de usuario

- HU-01: Como profesora quiero limitar cada IP a 5 intentos por segundo y 20 por minuto.
- HU-02: Como profesora quiero que superar un límite produzca un aviso y un bloqueo permanente.
- HU-03: Como profesora quiero que cambiar los datos enviados no cambie la dirección contada.
- HU-04: Como alumna quiero conservar el registro y el código de cuatro cifras actuales.
- HU-05: Como profesora quiero que las consultas y el panel no consuman intentos.
- HU-06: Como Jimena quiero permitir el uso mínimo de IPs para este control sin asociarlas a la asistencia.

## 4. Criterios de aceptación

- CA-01 (HU-01): Dada una dirección no bloqueada, cuando intenta registrar
  asistencia, entonces se permiten hasta 5 intentos en el último segundo y 20
  en el último minuto. Las ventanas son móviles e incluyen el intento actual
  y los situados exactamente a uno o sesenta segundos del actual.
- CA-02 (HU-04): Dado un registro válido dentro de ambos máximos, cuando se
  envía, entonces conserva su resultado, nombre y hora, incluidos los duplicados.
- CA-03 (HU-05): Dado cualquier uso distinto de intentar registrar asistencia,
  cuando se realiza, entonces no aumenta el recuento ni provoca bloqueo.
  Sí cuentan los intentos con código o nombre inválido, clase inexistente o cerrada.
- CA-04 (HU-02): Dada una dirección que alcanza el sexto intento en un segundo
  o el vigesimoprimero en un minuto, cuando se procesa ese intento, entonces
  se muestra «Esta dirección queda bloqueada por haber superado los intentos
  permitidos.», se añade a la blacklist y ese intento no registra asistencia.
- CA-05 (HU-02): Dada una dirección bloqueada, cuando vuelve a intentar registrar
  asistencia en cualquier clase, entonces recibe el aviso y no registra a nadie,
  aunque el código sea correcto. No se añaden nuevos intentos de esa dirección.
- CA-06 (HU-02): Dada una dirección bloqueada, cuando se cierra y vuelve a abrir
  la aplicación con el mismo archivo de datos, entonces sigue bloqueada. El
  bloqueo no caduca y esta versión no ofrece desbloqueo.
- CA-07 (HU-03): Dado un intento que declara otra IP en los datos enviados,
  cuando se identifica su origen, entonces se usa la dirección de la conexión
  recibida por el servidor. Detrás de un intermediario puede ser su dirección,
  compartida por varios alumnos, en lugar de la IP pública individual.
- CA-08 (HU-04): Dado el código de cuatro cifras, cuando se añade el control,
  entonces conserva longitud, cálculo, caducidad y facilidad de uso. Las demás
  funciones de asistencia conservan sus resultados salvo el nuevo bloqueo.
- CA-09 (HU-06): Dada la documentación de privacidad, cuando se actualiza,
  entonces permite guardar la IP solo para contar intentos y conservar bloqueos,
  separada del nombre y hora de asistencia, con almacenamiento local. La
  constitución registra la excepción en la versión 3.0; los máximos, el aviso
  y la duración se describen en esta spec y no se añaden a la constitución.

## 5. Fuera de alcance

- Identificar la IP individual detrás de intermediarios mediante mecanismos adicionales.
- Desbloquear direcciones, caducar bloqueos o distinguir personas con una IP compartida.
- Cambiar pantallas, el puzzle, dependencias o las funcionalidades restantes.
- Modificar specs 001–005, borrar datos anteriores o copiar el código del profesor.
- Ejecutar scripts de ataques, publicar una PR, hacer commit, push o merge.

## 6. Preguntas abiertas

Ninguna para este alcance. Jimena acepta la limitación de identificación del
intermediario para igualar la referencia. Su mejora requerirá otra spec.

## 7. Decisiones y aprobación

Jimena autorizó preparar spec, plan y tareas conjuntamente y aprobó las decisiones
de alcance: dirección de conexión, solo intentos de registro, ventanas móviles,
blacklist permanente y persistente, aviso de ban y separación de datos.
Esta autorización no permite implementar todavía. Los tres documentos se
presentan para revisión; falta la aprobación explícita para comenzar el código.

## Resultado local

Implementaci?n autorizada y verificada el 2026-10-23. Suite completa: 183 pruebas
pasan con LF y 183 con CRLF. Specs 001?005, static/ y codes.py coinciden con
los 23 hashes de la base registrados en integrity.json. Sin commit, push ni PR.
