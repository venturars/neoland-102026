Issue: #757

# Verificación del servidor SQL

Estado: comprobaciones locales completadas el 2026-11-03; pendiente revisión humana. Sin commit ni publicación. Todas las escrituras se ejecutaron sobre datos ficticios en una copia desechable.

Referencia: PR 814, head `5fc36f67f38c3e8404f6df325bf71b3aa3517a53`. Entorno: Windows, Node y PowerShell; dependencias y herramientas ya disponibles, sin instalación.

## Resultados

- Integración Node: 11 pruebas satisfactorias (prueba principal y diez subpruebas), en 36,8 s. Protocolo exec/get/all/run, esquema y tablas, normalización Unicode, validación y duplicados, búsquedas asíncronas ordenadas y exactas, fila ausente null, edición con campos omitidos, borrado y conservación de otros usuarios.
- Protocolo y mensajes: CORS/OPTIONS, rutas y métodos no previstos, JSON/SQL inválidos y errores de siete operaciones comprobados. No se exponen errores internos de SQL, rutas `/api/users` ni contenido HTML desde el servidor SQL.
- Servidor no disponible: una prueba satisfactoria en 1,59 s. Tras detener el servidor propio de una copia temporal, las siete operaciones de usuarios rechazan con sus mensajes exactos `Could not ...`, sin datos personales.
- Clientes terminal: contenido Node de ocho clientes ejecutado durante la integración; además, ocho archivos .txt completos ejecutados mediante PowerShell real con `-NoProfile -NonInteractive`. La prueba de wrappers pasó en 23,2 s con ocho marcadores `POWERSHELL_OK`.
- Jupyter: ocho notebooks ejecutados con kernel real mediante NBClient. Cada notebook lanzó su subprocess Node y accedió al mismo servidor/SQLite de la fixture; resultados y datos coincidentes al reejecutar listados.
- Sintaxis: 37 comprobaciones satisfactorias —19 módulos JavaScript, nueve contenidos Node de clientes terminal y nueve contenidos Node de notebooks—; JSON de notebooks y código Python válidos.
- Logic: las ocho funciones conservan sus reglas y resultados al descontar async/await y el nombre singular de búsqueda. La clasificación conserva await de findAll; no se ejecutó IA real.
- Formato: Prettier 3.9.10 comprobó satisfactoriamente db, queries y logic. ESLint terminó con código 0 usando la configuración equivalente `js.configs.recommended`, sobre esos mismos directorios y con herramientas ya instaladas.
- Conservación: datos personales no abiertos ni modificados; el checkout de trabajo no contiene users.sqlite. Referencias locales de las ramas 756, 758 y 764 conservadas. El servidor de ensayo se cerró y no quedó listener propio en el puerto 3000. Diff de espacios comprobado.

## Cobertura

| Criterio | Evidencia |
| --- | --- |
| CA-01 | Creación de tabla y listado de tablas; usuarios de control conservados. |
| CA-02 | Alta, normalización, duplicados, consultas por ID/correo/nombre y orden. |
| CA-03 | Edición, campos omitidos, borrado, usuario ausente y conservación de otros usuarios. |
| CA-04 | Contenido Node de ocho clientes terminal y ocho notebooks reales sobre la fixture común de integración; ocho wrappers PowerShell además comprobados en su propio ensayo aislado. |
| CA-05 | Protocolo inválido, errores de siete operaciones y servidor no disponible con mensajes exactos de catálogo, sin SQL interno. |
| CA-06 | Revisión estática y sintaxis de clasificación, conservación de reglas y await de findAll; sin ejecución de IA. |
| CA-07 | Fixture aislada, datos y referencias conservadas, nombres y extensiones, formato/lint y cierre de proceso propio. |

## Comandos y artefactos de comprobación

Desde la carpeta first-app del worktree:

```powershell
node --test E:/Users/987866/neoland-102026/.tmp/pr758-before-sql-20261103-d8a07de0/sql-verification.test.mjs
node --test E:/Users/987866/neoland-102026/.tmp/pr758-before-sql-20261103-d8a07de0/powershell-verification.test.mjs
node --test E:/Users/987866/neoland-102026/.tmp/pr758-before-sql-20261103-d8a07de0/offline-verification.test.mjs
& E:/Users/987866/neoland-102026/staff/jimena-duran/first-app/node_modules/.bin/prettier.cmd --check 'src/db/**/*.js' 'src/queries/**/*.js' 'src/logic/**/*.js'
& E:/Users/987866/neoland-102026/staff/jimena-duran/first-app/node_modules/.bin/eslint.cmd --no-config-lookup --config E:/Users/987866/neoland-102026/.tmp/pr758-before-sql-20261103-d8a07de0/eslint.config.mjs src/db src/queries src/logic
```

Los harnesses y la configuración de comprobación son artefactos temporales fuera del producto. La configuración temporal de ESLint importa las reglas recomendadas del paquete ya disponible; no se presenta este comando como una ejecución de `pnpm lint` de todo el checkout. El resultado registrado corresponde a db, queries y logic.

La integración utilizó la copia `E:/Users/987866/AppData/Local/Temp/pr758-sql-AVVxyr/staff/jimena-duran/first-app`, con servidor Node local y SQLite ficticio. Las pruebas no arrancan el servidor del checkout personal ni usan sus datos. El ensayo de wrappers PowerShell utiliza su propia fixture ficticia; no se confunde con la base común de terminal/Jupyter de la integración. Los resultados Jupyter proceden de ejecuciones reales, no de salidas guardadas.

## Límites

Se ejecutaron ocho clientes terminal y ocho notebooks; el noveno, de clasificación, se comprobó estáticamente y por sintaxis, sin llamadas de IA ni instalación de modelos o dependencias. La evidencia no valida disponibilidad o respuesta real de Ollama. No se ejecutó cliente del navegador: esta entrega es únicamente el servidor SQL y los clientes terminal/Jupyter. La revisión humana y cualquier publicación siguen pendientes.
