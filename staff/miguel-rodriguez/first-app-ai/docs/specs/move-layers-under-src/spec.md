# Capas de first-app-ai dentro de src

Issue: #646 · PR: #647.
Estado: aprobada por Miguel el 2026-10-30.

## Propósito

Quien desarrolla o prueba first-app-ai encuentra sus cuatro capas de aplicación
juntas dentro de `src/`, sin cambiar lo que hacen. La reorganización corresponde
al segundo punto de las prioridades de Ventura del 29 de octubre de 2026.

## Entrada y resultado

Entra la aplicación actual de `staff/miguel-rodriguez/first-app-ai`, con sus
clientes de terminal y Jupyter y los datos locales que pueda tener.

Al terminar, `db`, `clients`, `logic` y `queries` están dentro de `src` y dejan
de existir como carpetas de aplicación en la raíz. Conservan sus responsabilidades.
No quedan copias de las capas antiguas ni dos ubicaciones activas de datos.

Las operaciones conservan sus contratos, validaciones, orden de comprobaciones,
resultados y mensajes de error definidos en la constitución y las guías actuales.
Se conservan el SQL, el esquema y la inicialización explícita. La búsqueda por
nombre, el clasificador y las demás operaciones siguen funcionando con los mismos
requisitos y límites. No aparece una operación ni un error de negocio nuevo.

Una base local existente conserva todos sus registros, identificadores y marcas
de tiempo al pasar a la nueva ubicación. No se sustituye por una base vacía ni se
usa otra base inadvertidamente. Si no existe, la preparación habitual sigue siendo
necesaria; el traslado no inicializa datos por su cuenta. Un conflicto entre datos
locales en la ubicación anterior y la nueva debe resolverse antes de continuar,
sin sobrescribir ninguna de las dos bases.

## Uso de los clientes

Los nueve ejemplos de terminal siguen siendo copiables y ejecutables desde la
raíz de first-app-ai. Mantienen su preparación previa, entradas de ejemplo,
resultados y requisitos actuales.

Desde esa misma raíz, `pnpm jupyter` abre los nueve notebooks en su nueva
ubicación. Se conserva el kernel **First app AI**, la presentación de los
resultados, el tratamiento de errores y la forma de detener el servidor. El
servidor conserva su acceso local y autenticación actuales.

Cada notebook funciona tras reiniciar su kernel, sin depender de variables de
otro notebook. Se mantienen las dependencias explícitas de datos: inicializar
antes de operar y preparar un contacto cuando el ejemplo lo necesita. Los
requisitos actuales del clasificador se mantienen.

## Documentación y comprobaciones

Las guías vigentes describen la organización y el uso resultantes. El árbol y
la arquitectura reflejan las nuevas ubicaciones y conservan las responsabilidades
existentes. Las instrucciones actuales de datos, terminal y Jupyter permiten
seguir trabajando sin recurrir a rutas obsoletas. Las specs históricas conservan
su contenido como registro de los desarrollos anteriores.

`pnpm format` y `pnpm lint` siguen funcionando desde la raíz y conservan su
cobertura actual después del traslado. Las bases locales, checkpoints y demás
archivos generados que ya se excluyen de Git continúan excluidos en sus nuevas
ubicaciones.

## Criterios de aceptación

- **CA-01:** Las cuatro capas están bajo `src`, sin sus carpetas antiguas en la
  raíz ni duplicados activos. El SQL, el esquema y las responsabilidades no cambian.
- **CA-02:** Con las mismas entradas y preparación, las operaciones conservan
  resultados, errores, validaciones y efectos sobre los datos. Las consultas
  mantienen su funcionamiento independiente del directorio de ejecución.
- **CA-03:** Una base ficticia preexistente conserva registros, IDs y fechas al
  reorganizarla. Las comprobaciones se realizan en una copia desechable; los datos
  reales no se usan para probar. La aplicación sigue requiriendo su inicialización
  explícita cuando corresponde.
- **CA-04:** Los nueve ejemplos de terminal funcionan desde la raíz y los nueve
  notebooks funcionan individualmente tras reiniciar el kernel, con sus datos
  previos explícitos. `pnpm jupyter` abre la nueva ubicación con el mismo kernel,
  presentación, acceso y parada.
- **CA-05:** Las guías vigentes, árbol y arquitectura corresponden a la estructura
  final. Las specs históricas permanecen intactas.
- **CA-06:** Formato y lint pasan con su cobertura actual, los archivos generados
  siguen ignorados y las dependencias y Socket no cambian. El flujo Git conserva sus pasos y
  permisos; solo se admite corregir la validación de archivos trasladados para
  poder guardar este cambio.

## Ejemplo

En una copia desechable se prepara la tabla y se crea Ada con un email ficticio.
Después de reorganizar la aplicación, listar o buscar ese contacto devuelve sus
mismos cinco campos, con el mismo ID y las mismas fechas. El ejemplo de terminal
y su notebook muestran el resultado con la presentación que ya tenían.

## Fuera de alcance

- Añadir funcionalidades, validaciones, tablas o mensajes de error.
- Refactorizar la lógica de negocio o cambiar el comportamiento del clasificador.
- Añadir o actualizar dependencias, migrar el esquema o crear un migrador de datos.
- Cambiar Socket, credenciales o los pasos y permisos del flujo Git. Se permite
  únicamente corregir el guardado de archivos trasladados cuya carpeta anterior
  dejó de existir.
- Cambiar otras aplicaciones, configuración compartida o specs históricas.

## Ajuste solicitado por Miguel — 2026-10-30

Tras revisar el plan, Miguel pidió corregir el bloqueo del script de commits ante
un traslado que elimina la carpeta de origen. La excepción anterior permite
resolver ese defecto sin cambiar el flujo ni ampliar permisos. El plan y sus
tareas conservan sus aprobaciones separadas antes de implementar.
