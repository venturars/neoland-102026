# Capas de la aplicación dentro de src

Issue: [#663](https://github.com/venturars/neoland-102026/issues/663).

> Estado: autorizado anticipadamente el 2026-10-30. Diego pidió completar la tarea sin pausas; no se atribuye una revisión individual de cada documento.

## Objetivo

Quien abre first-app encuentra juntos los clientes, los datos, las consultas y las operaciones dentro de `src/`. El cambio conserva las funciones y los resultados actuales.

## Criterios de aceptación

- **CA-01:** las cuatro partes están dentro de `src/`, sin una segunda copia de las capas en la raíz.
- **CA-02:** los comandos existentes de terminal y el arranque de Jupyter abren los mismos ejemplos y ejecutan las mismas operaciones desde first-app.
- **CA-03:** los nueve notebooks encuentran la aplicación, conservan enlaces válidos y se entregan sin salidas ni contadores de ejecución.
- **CA-04:** las operaciones, las consultas, el esquema y los datos existentes se conservan; la base personal se traslada sin modificar sus bytes.
- **CA-05:** la documentación activa refleja las ubicaciones nuevas y distingue comprobaciones reales de simulaciones y plataformas pendientes.

## Fuera de alcance

No se añaden funciones, dependencias ni una suite de pruebas. No se cambian mensajes, esquema, reglas de negocio ni contratos de las operaciones. La automatización Git y Socket tienen su documentación propia en esta misma entrega.
