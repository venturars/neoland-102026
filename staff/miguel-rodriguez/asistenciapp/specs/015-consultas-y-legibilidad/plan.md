# Plan de consultas y legibilidad

Issue: #1033 · PR: #1035. Referencia: [spec](spec.md).
La autorización conjunta registrada en la spec permite esta entrega completa.
Base independiente: staging 16e940fa7c23799919b0859c7b343c30010e1612.

## Cambios

- `asistencia/storage/sqlite.py`: extraer sus 19 textos, incluido el esquema de
  once sentencias y la configuración de claves externas, a `queries/sqlite/`.
- `asistencia/storage/races.py`: extraer 31 textos distintos para 32 llamadas a
  `queries/races/`; cierre y limpieza reutilizan el mismo texto de revocación.
- Cada carga usa `Path(__file__)` y un nombre fijo, como el catálogo actual.
  Conservar `SCHEMA`, executescript y los textos originales byte a byte. Los
  parámetros enlazados, orden, conexiones y fronteras de commit no cambian.
- Aclarar estos dos módulos y `storage/roster.py`: connection, session_id,
  roster_key, operation_id y checkin_id; separar ejecución y lectura del cursor,
  conversiones y resultado. Conservar nombres de funciones y llamadas posicionales.
- Aclarar únicamente expresiones densas de `domain/codes.py`, `names.py`,
  `registration.py` y `roster.py`, con nombres concretos y decisiones equivalentes.
  Mantener el cortocircuito y el orden de las comparaciones de códigos y límites.
- `AGENTS.md`: estado de 015 en una subsección propia, separada de la inserción
  pendiente de 014. `docs/ARCHITECTURE.md`: árbol y responsabilidades del SQL ya
  separado. `specs/015-consultas-y-legibilidad/`: estos tres documentos.

No se añade un motor de consultas, repositorio, fábrica o helper por línea. Las
seis consultas existentes del catálogo conservan su contenido. Se conservan las
fronteras actuales: los casos de uso coordinan las transacciones de carrera;
sqlite.py mantiene sus contextos with connection y su comportamiento. El cierre
de conexiones, incluida la limpieza ante fallos, permanece en su lugar actual. La constitución, SQL guardado, API, dependencias y reglas no se enmiendan.

## Comprobación de la constitución

| Regla | Aplicación |
| --- | --- |
| P1 | Se mantienen las entradas actuales, sin dependencia de plataformas. |
| P2 | Archivos de texto fijos y funciones concretas, usando el patrón existente. |
| P3 y §3 | Biblioteca estándar y dependencias existentes; mismo stack y base local. |
| P4 | Bases desechables y datos sintéticos; ninguna lectura de la base del usuario. |
| P5 | Pantallas y accesibilidad permanecen iguales. |
| P6 | Documentación y comentarios en español; identificadores descriptivos. |
| §4 | Spec, plan y tareas se preparan antes del código, bajo autorización conjunta. |
| §5 | Pruebas enfocadas, suite completa y evidencia real por criterio. |
| §6 | Reservas, permisos, límites, tiempos y transacciones mantienen sus fronteras. |
| §7–§8 | Solo esta app; constitución e historial anteriores intactos. |

## Comprobación práctica

Antes de editar, fijar los textos anteriores de las consultas como referencia.
Comprobar después que cada uno se carga sin modificación y que no quedan
consultas embebidas en el almacenamiento. Probar ejecución desde otra carpeta,
inicialización repetible y operaciones con base anterior, utilizando los fixtures
existentes y bases temporales. Conservar los parámetros y orden observables.

Añadir pruebas de los límites de dominio modificados; ejecutar la suite Python
completa, incluidos almacenamiento, catálogo, compatibilidad, reservas, errores,
recuperación y concurrencia, y las 29 pruebas JavaScript existentes. Todo ocurre
en una copia desechable con el entorno ya instalado. Comparar los archivos
protegidos y revisar el diff completo; retirar temporales y comprobar puerto8000.
Los resultados concretos se registran en tasks.md antes de publicar.
