Issue: #601

# Resultado de la reorganización

T01–T18 implementadas y verificadas en `601-refactor-move-app-folders-under-src`. HEAD permanece en `e7e51b11fe90b748a2cc18ae7669783905e48a34`: no hubo commit, push, PR ni merge y el índice sigue vacío.

Al comenzar se comprobó que #600 seguía abierta en draft, sin integrar. Esta rama conserva su implementación y depende de ella; no se añadieron estos cambios a su rama ni a su PR.

## Cambios realizados

- Se trasladaron 37 archivos de las cuatro capas a `src/db/`, `src/clients/`, `src/logic/` y `src/queries/`. Las carpetas antiguas ya no existen en la raíz.
- Los nueve ejemplos de terminal conservan su contenido y formato PowerShell; únicamente cambian sus imports a `./src/...`, ejecutándose desde first-app.
- Los diez módulos JS, ocho archivos SQL, nueve notebooks y SQLite conservan sus hashes originales: 28 archivos sin cambios de contenido. La búsqueda ascendente de `logic/` de los notebooks ahora encuentra `src/` sin reescribir sus celdas.
- `package.json` cambia únicamente los tres patrones de `format` para anteponer `src/`. `lint`, dependencias y lockfile permanecen iguales.
- Las referencias vigentes de AGENTS, TREE, ARCHITECTURE, DATABASE, STYLE, ERRORS, JUPYTER y GIT-AUTOMATION reflejan la nueva ubicación. No se reescribieron las specs históricas.
- La automatización, configuración, node_modules y documentación permanecen fuera de src. No hay nuevos paquetes, versiones, entornos o integración de Socket.

## Conservación de SQLite y cambios locales

Antes del traslado, SQLite permitió abrir un FileStream exclusivo de solo lectura; no se detectó un bloqueo activo. No había archivos auxiliares presentes. Se creó una copia local y un inventario de los 37 archivos antes de moverlos:

```text
C:/windows/TEMP/jimena-src-backup-4f113527b40b4142bca2ddb716482386/users.sqlite
C:/windows/TEMP/jimena-src-backup-4f113527b40b4142bca2ddb716482386/inventory.json
```

Las rutas absolutas de origen y destino se comprobaron dentro de first-app antes de usar Move-Item; no se sobrescribieron destinos existentes. La base personal se trasladó a `src/db/users.sqlite` sin abrirla desde la aplicación ni usarla para las pruebas.

SHA256 antes y después del traslado y de la verificación:

```text
67AABFF0965C26E122D924C604C48D9FC9C59EF30B89629C0D5A3F08631626FF
```

`git check-ignore -v` confirmó que SQLite, WAL, SHM y journal siguen excluidos bajo src por las reglas existentes. De los 37 archivos trasladados, Git ve 36 archivos de código/clientes: la base no aparece en el índice ni como archivo por añadir. No se cambiaron reglas ignore para ocultar otros archivos.

Se comprobaron 143 archivos protegidos mediante hashes: automatización de Git, specs históricas, lockfile y configuración, y los 79 archivos visibles sin seguimiento de ChromaDB. Todos mantienen sus bytes; ChromaDB sigue sin seguimiento y no se movió ni incorporó a esta entrega.

## Verificaciones de esta entrega

| Área | Resultado |
| --- | --- |
| Estructura e imports | Las cuatro capas están bajo src y la infraestructura sigue en la raíz. Los imports relativos entre módulos continúan válidos. Los nueve clientes solo difieren en el prefijo del import. |
| Funciones | Pasaron crear, consultar por ID/correo/nombre, listar, actualizar y borrar, normalización, validaciones, duplicados, usuarios ausentes y errores de SQLite. |
| Clasificador real | Ollama ya tenía `llama3.2:latest`; caso vacío y llamada con tres usuarios pasaron. Resultado de la llamada: `{women: 2, men: 1, genderUndefined: 0}`. |
| Terminal | 9/9 clientes PowerShell ejecutados desde la raíz de la copia con datos desechables. |
| Jupyter | 9/9 notebooks ejecutados desde `src/clients/jupyter` mediante nbclient y kernel `python3`, sin celdas fallidas. |
| Formato | `pnpm format` terminó con código 0 usando los patrones src. Solo normalizó finales de línea en diez JS; tras comprobar igualdad de contenido se restauraron sus bytes originales, sin reset/restore. |
| Lint | `pnpm lint` terminó con código 0. |
| Alcance final | SQLite excluida, índice vacío, historial de Git conservado, automatización y specs históricas intactas; sin cambios de reglas de negocio, SQL, dependencias o versiones. |

La copia de pruebas se creó en una ruta Windows con espacios, sin copiar la base personal ni sus auxiliares; utilizó su propia SQLite desechable y las instalaciones existentes. Se reutilizó node_modules mediante una junction, retirada sin recursión antes de eliminar la copia temporal tras validar su ruta. El node_modules original quedó intacto.

## Comandos y herramientas usados

Desde first-app se ejecutaron:

```powershell
node 'E:/Users/987866/AppData/Local/Temp/jimena-corepack/v1/pnpm/10.33.0/bin/pnpm.cjs' format
node 'E:/Users/987866/AppData/Local/Temp/jimena-corepack/v1/pnpm/10.33.0/bin/pnpm.cjs' lint
```

Las funciones y los ejemplos se ejecutaron con Node v24.22.0 y Windows PowerShell 5.1. Para los scripts se usó `-NoProfile -ExecutionPolicy Bypass` solo en el proceso de prueba, sin cambiar la política global. Los notebooks usaron nbclient desde el Python existente en `E:/Users/987866/AppData/Local/Programs/Python/Python313/python.exe`. No hubo instalaciones ni descargas.

Se revisaron hashes, `git check-ignore`, `git diff --check`, índice y estado local. Antes de preparar un commit, Git muestra las rutas antiguas eliminadas y src sin seguimiento porque todavía no se han preparado los traslados; no significa que se hayan perdido los archivos.

## Límites y siguiente paso

- Jupyter emitió avisos de permisos de IPython/ZMQ sin errores de celda. No se probó su interfaz gráfica ni se inició un servidor para navegación; sí se ejecutaron los nueve notebooks reales desde su nueva ubicación.
- No se repitieron las suites de Git: su código no cambió y se verificó su conservación mediante hashes. Los resultados de aplicación de esta entrega son nuevos; no se atribuyeron pruebas históricas a la reorganización.
- La copia de seguridad local se conserva para revisión. No se ejecutaron operaciones de escritura ni consultas de la aplicación sobre la base personal.
- La publicación sigue pendiente de autorización. Antes de publicarla habrá que revisar de nuevo la dependencia #600 y la base correspondiente; no se realizó esa integración ni se modificó su PR.
