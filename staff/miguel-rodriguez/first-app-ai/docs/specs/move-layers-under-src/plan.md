# Plan — capas de first-app-ai dentro de src

Issue: #646 · PR: #647.
Estado: aprobado por Miguel el 2026-10-30.
Referencia: [spec aprobada](spec.md).

## Enfoque

Trasladar juntas las cuatro carpetas, conservando sus relaciones. No modificar
las funciones de negocio, la conexión ni las consultas: sus imports entre carpetas
hermanas y sus rutas relativas al módulo siguen siendo válidos. No hay firmas,
SQL, esquema, mensajes de negocio ni dependencias nuevos.

Referencia de comportamiento: desarrollo `move-layers-under-src` de Ventura
(#579, implementación 8c5cd029). Adaptar su resultado a nuestra app, sin copiar
su arranque Jupyter: aquí se usa un lanzador JavaScript y un adaptador Python.

Las rutas siguientes son relativas a `staff/miguel-rodriguez/first-app-ai/`.

## Archivos y cambios — CA-01, CA-04, CA-05, CA-06

| Ruta actual | Resultado o cambio permitido |
| --- | --- |
| `db/` | Mover completa a `src/db/`, incluidos datos locales si existen. `connection.js` permanece idéntico. |
| `queries/` | Mover completa a `src/queries/`; `users.js` y los ocho SQL permanecen idénticos. |
| `logic/` | Mover completa a `src/logic/`; los ocho módulos permanecen idénticos. |
| `clients/` | Mover completa a `src/clients/`, manteniendo terminal y Jupyter. |
| `src/clients/terminal/*.txt` | En los nueve ejemplos, cambiar solo los imports desde la raíz: `./db`, `./queries` o `./logic` pasan a `./src/...`. Mantener comentarios, entradas y salida. |
| `src/clients/jupyter/client.py` | Ajustar la raíz y las tres rutas descritas abajo. Mantener JSON, argumentos, entorno, presentación y errores. |
| `src/clients/jupyter/run-operation.js` | Trasladar sin cambios: sus imports relativos siguen llegando a las capas hermanas. |
| `src/clients/jupyter/01-create-users-table.ipynb`, `07-update-user.ipynb`, `08-delete-user.ipynb` | Cambiar únicamente la ruta de la base en Markdown a `first-app-ai/src/db/users.sqlite`. Los nueve notebooks conservan celdas ejecutables, metadata, kernel y presentación. No guardar salidas de prueba. |
| `scripts/jupyter.js` | Cambiar solo el directorio de notebooks a `src/clients/jupyter`. Conservar preparación, kernel, entorno, autenticación y loopback. |
| `package.json` | Actualizar únicamente los cuatro patrones de capas de `format`; conservar sus opciones, cobertura de scripts/configuración y los demás campos. |
| `.gitignore` | Adaptar los patrones de SQLite y checkpoints a las nuevas rutas. Mantener las exclusiones anteriores para que residuos de una copia antigua no se incorporen accidentalmente. No cambiar las excepciones de agentes. |
| `README.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE.md` | Actualizar rutas actuales de las cuatro capas, datos y clientes; conservar sus reglas y responsabilidades. |
| `docs/TREE.md` | Mostrar las cuatro capas bajo src y los documentos de este desarrollo. No inventariar bases, instalaciones ni cachés como fuentes. |
| `tools/commit-changes.sh` | Corrección mínima del bloqueo de rutas antiguas cuyo directorio padre ya no existe; conservar archivos explícitos, confinamiento a la app e índice temporal. |
| `docs/specs/move-layers-under-src/` | Spec aprobada, este plan y tareas posteriores; evidencia de verificación en tasks. |

`AGENTS.md`, constitución, ERRORS, STYLE, lint, los otros cinco scripts Git y las skills/agentes Git,
plantillas y referencias MCP permanecen intactos. Mantener también lockfile,
requirements y specs históricas. Si una lectura posterior descubre otra referencia
vigente que impide cumplir la spec, revisar el plan antes de ampliar archivos.

## Rutas de clientes y herramientas — CA-02, CA-04, CA-06

En `client.py`, su ubicación final tiene un nivel más: la raíz de la aplicación
pasa de `resolvedPath.parents[2]` a `resolvedPath.parents[3]`. Mantener la
comprobación del package name `first-app-ai`. Las rutas desde esa raíz quedan:

- `src/db/connection.js`.
- `src/logic/list-users.js`.
- `src/clients/jupyter/run-operation.js`.

Node sigue ejecutándose con cwd en la raíz de esta copia, no en src. No añadir
búsqueda recursiva, compatibilidad con dos estructuras ni resolución genérica.
Los notebooks siguen importando su `client.py` vecino.

El comando format conserva esta cobertura y sus opciones actuales:

```json
"format": "prettier --no-config --no-editorconfig --write \"src/db/**/*.js\" \"src/queries/**/*.js\" \"src/logic/**/*.js\" \"src/clients/jupyter/**/*.js\" \"scripts/**/*.js\" \"eslint.config.js\""
```

`lint` permanece `eslint .`: ya cubre JavaScript recursivamente y excluye
instalaciones y cachés. Las nuevas exclusiones locales son `src/db/*.sqlite`,
`src/db/*.sqlite-*` y `src/clients/jupyter/.ipynb_checkpoints/`.

## Guardar traslados sin cambiar el flujo Git — CA-01, CA-06

El helper actual valida una ruta entrando en su directorio padre. Tras mover una
carpeta completa, ese directorio ya no existe y el commit falla antes de validar
que el archivo antiguo estaba en HEAD. Corregir únicamente esa validación antes
de usar el helper para guardar el traslado; no recrear carpetas antiguas.

Para cada ruta literal, recorrer sus padres hasta encontrar el primer ancestro
existente (o un enlace simbólico). Resolver ese ancestro físicamente y exigir que
permanezca dentro de la app. Si es un enlace roto o sale de la app, rechazar.
Después comprobar el tipo del objeto en HEAD: una ruta ausente solo se admite
si es un blob (archivo), nunca un tree (directorio). Mantener el rechazo de directorios, rutas externas, pathspecs y
ramas no permitidas, además del índice temporal y la conservación del índice ajeno.

Al guardar los movimientos, enumerar explícitamente ambas rutas de cada archivo
versionado, antigua y nueva. No incluir bases, cachés ni instalaciones. No cambiar
las responsabilidades de los subagentes, los pasos del flujo ni los permisos.

Una reproducción temporal del defecto falló sin crear commit. Se probó una copia
candidata del helper: 49 invocaciones aisladas pasaron, incluidas carpeta de origen
completa eliminada, índice ajeno preparado, ruta inexistente no versionada y ruta
anidada a través de un enlace externo. La prueba se hizo fuera del proyecto:
el helper real sigue intacto hasta aprobar el plan y las tareas de implementación.
La ejecución no reemplaza las comprobaciones posteriores sobre la entrega final.

## Datos y orden seguro — CA-01, CA-03

Antes de mover, registrar el estado Git, inventario y hashes de fuentes; comprobar
por metadatos las carpetas y archivos locales que existen, incluidos ignorados.
La lectura inicial no encontró src ni db/users.sqlite en esta app; volver a
comprobar al implementar porque el estado puede cambiar.

Detener servidores y kernels de esta app antes del traslado. Si un proceso sigue
usando la conexión, detenerlo de forma normal antes de mover SQLite; no borrar
sus archivos auxiliares. No abrir la base real para probar ni inicializarla.

Si existe src o alguno de los destinos, inspeccionar su identidad antes de mover;
no fusionar directorios ni sobrescribir archivos. Si existen bases en ambos lados,
detener la parte afectada y pedir una decisión. Mover las cuatro carpetas completas
solo con destinos libres. Así se conservan juntos datos y archivos locales
ignorados, sin incluirlos en Git ni dejar una segunda base activa. Si la base no
existe, no crear una para completar el traslado. No añadir un migrador ni cambios
al esquema. Las pruebas usan exclusivamente datos ficticios en copias temporales.

## Verificación — CA-01 a CA-06

Preparar copias desechables sin datos reales, credenciales, instalaciones ni
cachés. Reutilizar las dependencias exactas ya disponibles de manera que las
pruebas no escriban sobre la instalación original. Para Jupyter usar un entorno
local desechable con las versiones ya aprobadas de requirements; si no está
disponible, preparar esas versiones sin cambiar requirements. Registrar los
comandos y resultados; no sustituir una ejecución ausente por revisión estática.

1. **Antes y después:** en una copia anterior al traslado, inicializar tabla y
   crear contactos ficticios, incluidos dos nombres iguales con emails distintos.
   Cerrar conexiones, guardar el inventario y las filas completas, y aplicar el
   traslado a esa copia. Comparar filas y marcas de tiempo antes de ejecutar
   operaciones que escriben. Confirmar que las capas antiguas ya no existen y que
   conexión, consultas, SQL, lógica y runner conservan sus hashes por ruta relativa.
2. **Inicialización y operaciones:** en copias equivalentes antes/después,
   comprobar tabla sin inicializar, inicialización explícita/repetible, CRUD y
   búsquedas por ID, email y nombre. Comparar retornos y errores representativos de
   los contratos existentes. Las consultas no deben escribir; update conserva
   createdAt y delete elimina solo el elegido. No exigir igualdad de updatedAt
   entre ejecuciones distintas: comprobar sus reglas y el estado de cada copia.
   Desde un directorio temporal ajeno, importar por ruta absoluta consultas y
   conexión y confirmar acceso al SQL/base de esa copia, sin crear una base en cwd.
3. **Terminal:** ejecutar los nueve heredocs desde la raíz de la copia, con sus
   datos previos e IDs ficticios preparados. Solo sustituir en la ejecución las
   entradas de ejemplo que requieran esos datos; no alterar los ejemplos entregados.
4. **Clasificador:** comprobar tabla vacía sin llamar al modelo; con datos,
   usar una respuesta controlada mediante sustitución temporal de fetch solo en
   el proceso de pruebas. Comprobar petición, conteos y fallo de transporte sin
   modificar el módulo, usar el Ollama real ni afirmar clasificaciones reales.
   Aplicar la misma respuesta a ambas copias. La prueba del heredoc y notebook09
   con datos usa ese mismo control en el proceso Node hijo, retirado al terminar.
5. **Notebooks:** ejecutar cada documento en un kernel nuevo desde su nueva
   carpeta, con inicialización y contactos preparados explícitamente. Adaptar los
   IDs de prueba solo en memoria; comprobar las nueve celdas, tablas, mensajes de
   inicialización/borrado y errores, sin guardar outputs ni cambios de metadata.
   Comprobar que el adaptador ejecuta Node en la raíz correcta.
6. **Arranque:** ejecutar `pnpm jupyter` desde la raíz de la copia; verificar raíz
   `src/clients/jupyter`, lista de nueve documentos, kernel First app AI, loopback
   y autenticación, sin registrar el token. Detenerlo normalmente y comprobar que
   no quedan servidor/kernel temporales. No basta probar solo el adaptador Python.
7. **Herramientas y entrega:** ejecutar `pnpm format`, después `pnpm lint`, con
   Node compatible con node:sqlite. Confirmar patrones de cobertura, exclusión Git
   de bases/auxiliares/checkpoints y ausencia de datos en el diff. Revisar guías y
   enlaces; distinguir rutas actuales de las históricas, que no se reescriben.
   Comparar archivos protegidos e inventario con el inicial. Repetir la prueba del
   helper corregido para guardar un traslado completo y rechazar rutas externas,
   verificando que conserva el índice ajeno. Retirar temporales.

Las comprobaciones temporales pueden usar Node/Python y las herramientas ya
instaladas. No incorporar una suite permanente, servidor de mocks, dependencias
ni un ejecutor nuevo al proyecto. Registrar la respuesta controlada y sus límites
como evidencia de regresión; no presentarla como prueba del modelo real.

## Revisión del plan

El traslado conserva los módulos y limita los cambios ejecutables a rutas de
clientes, lanzador, formato y la validación mínima del helper de commits. DATABASE y tres textos de notebooks sí requieren
actualización en nuestra app, aunque la referencia de Ventura no los modificara.
La spec pide conservar el resultado, no copiar su estrategia de Jupyter.

No hay paquetes nuevos ni revisión Socket de dependencias que realizar en este
desarrollo. La implementación y las tareas esperan sus aprobaciones separadas.
Mantener #647 hacia staging, sin cambios de base ni solicitudes de revisión antes
de publicar el resultado final.

### Revisión del bloqueo — 2026-10-30

Miguel pidió corregir el problema detectado. Spec ajustada con la excepción
acotada; plan ampliado solo para ese helper y su prueba. No se ha modificado el
script real, trasladado capas, creado tareas ni publicado commits. El resto del
flujo Git queda protegido. Para el control del clasificador, usar un módulo
temporal precargado con NODE_OPTIONS=--import=RUTA en los procesos Node de prueba
y heredado por el hijo del adaptador; ese módulo y la variable se retiran al
terminar. No se cambian los clientes entregados ni se inicia un servicio de mocks.
