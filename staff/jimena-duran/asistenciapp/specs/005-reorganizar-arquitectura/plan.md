# Plan 005 · Reorganización de la copia de Jimena

Issue #244. Implementación autorizada y verificada localmente.

## Arquitectura propuesta

- asistencia/domain/: codes.py y names.py existentes; session.py nuevo para
  validar existencia, estado abierto y validez del código. Sin Flask ni sqlite3.
- asistencia/usecases/attendance.py: acciones de preparar la aplicación, abrir,
  consultar, registrar, cerrar, eliminar y exportar. Coordina reglas y persistencia.
- asistencia/storage/sqlite.py: persistencia actual, con apertura y cierre explícito
  de conexión dentro de cada operación. Conservar esquema, consultas y transacciones.
- app.py: HTTP, autenticación del profesor, serialización y arranque; sin conexión
  directa ni importaciones de almacenamiento. Conserva create_app, port_in_use y CLI.
- asistencia/export.py y tunnel.py: se mantienen como formato de salida y túnel.
- static/: intacta. Añadir __init__.py en los tres paquetes nuevos.

No copiar la implementación de referencia: usar el código actual de Jimena como
punto de partida. La referencia aporta la distribución de responsabilidades.
No se añaden interfaces de almacén, repositorios genéricos, PostgreSQL,
SQLAlchemy, Alembic, dependencias ni una segunda aplicación de consola.

## Contratos y comportamiento

Mantener create_app(db_path, token, now) y el reloj inyectable de las pruebas.
Pasar db_path y el instante necesario a las acciones explícitamente.
prepare devuelve el token; las acciones devuelven datos, no respuestas Flask.
Las decisiones de negocio producen errores concretos para sesión inexistente,
cerrada, nombre inválido y código inválido. HTTP conserva estados 404, 409,
400 y 422 y sus textos actuales. Conservar también duplicados, autenticación,
fechas, orden de listados, CSV y eliminación de registros.
Mantener el mismo archivo data/asistencia.db y esquema sin migraciones.

## Documentos

Mover CONSTITUTION.md a docs/CONSTITUTION.md y enmendar versión 2.2 a 2.3:
solo organización, referencias y registro de la enmienda. Conservar principios.
Renombrar AGENT.md a AGENTS.md; actualizar lectura, árbol, enlaces y seguimiento.
Añadir docs/ARCHITECTURE.md y la guía de escritura: tipos en funciones públicas,
resumen de módulo, :param, :return, :rtype y Usage:: cuando se llama desde fuera.
README: cambiar únicamente enlaces a constitución y guía.
No reescribir documentos SDD cerrados 001–004.

## Pruebas y compatibilidad de comprobaciones anteriores

Crear tests/test_architecture.py antes de reorganizar. Comprobar imports mediante
AST para evitar falsos positivos por comentarios. Verificar límites entre capas,
existencia de documentos, enlaces, versión 2.3 y guía de escritura.
Actualizar imports de tests de codes/names a domain sin cambiar sus aserciones.
Actualizar test_sdd_rules.py para las nuevas rutas documentales y versión 2.3,
conservando las puertas SDD y hashes de la 001 anonimizados en la 004.
Actualizar test_readme_environment.py para que su comparación permita solo los
dos cambios de enlace nuevos, además de los cambios ya autorizados por 003–004.
Extender test_personal_references.py a docs/ sin relajar las reglas de la 004.

Ejecutar primero pruebas nuevas para evidenciar fallos previstos; tras el cambio,
ejecutar suite completa. Verificar API con las pruebas existentes y añadir casos
solo si las nuevas acciones dejan contratos relevantes sin cobertura.
Comparar hashes de static/ y specs 001–004 antes y después; revisar diff contra
jimena-duran-221020265. No ejecutar túneles ni scripts de demostración.

## Comprobación de la constitución

P1: plataforma independiente. P2: módulos mínimos, un almacén. P3: Flask y pytest
existentes. P4: mismos datos locales. P5: static intacta. P6: documentos y errores
en español. §5: CA-01–CA-09 cubiertos por pruebas documentales, de arquitectura
y API. §6: no relajar validación, caducidad, duplicados o cierre de sesiones.
La enmienda 2.3 adapta referencias de arquitectura sin cambiar principios.

## Git y ejecución

Rama jimena-duran-221020266; PR sobre jimena-duran-221020265 (004), en draft.
No implementar hasta presentar a Jimena este trabajo preparado y recibir su
indicación de ejecutar. No commit ni push de implementación sin autorización.
## Resultado local

Jimena autorizó ejecutar la 005. Implementada y verificada: 108 pruebas pasan.
Static y specs 001–004 intactos por hash. Sin commit ni push de implementación.
