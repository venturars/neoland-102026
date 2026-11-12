# Tareas de formato y lint para first-app-ai

Estado: aprobadas por Miguel el 2026-10-27. Implementación completada y verificada; pendiente de revisión final de Miguel.
Spec: [spec.md](spec.md), aprobada el 2026-10-27.
Plan: [plan.md](plan.md), aprobado por Miguel el 2026-10-27 con aceptación de sus hallazgos Socket.
Tarea: [issue #496](https://github.com/venturars/neoland-102026/issues/496).
PR: [#497](https://github.com/venturars/neoland-102026/pull/497), en draft y dirigida a `staging`.

Rutas relativas a `staff/miguel-rodriguez/first-app-ai/`. Ejecutar en orden tras aprobar estas tareas; marcar cada casilla solo después de comprobar su resultado. La copia desechable se usa para instalar, formatear y probar antes de incorporar la entrega al proyecto de trabajo.

## Preparar el entorno y la referencia

- [x] T01 — Confirmar instrucciones y disponibilidad de herramientas.
  - Releer spec, plan, AGENTS y constitución. Confirmar la aprobación de estas tareas y la rama `496-chore-add-prettier-and-eslint`, sin cambiar bases de PR ni actualizar otras ramas.
  - Comprobar las versiones reales de Node y pnpm, usando el Node compatible previsto en el plan. Resolver primero el acceso de Corepack/pnpm; no declarar pnpm disponible solo porque existe su comando. No cambiar versiones del proyecto, perfiles del shell ni añadir `.nvmrc` o `packageManager`. Si hace falta instalar o cambiar herramientas, comunicarlo antes de hacerlo, como establece el plan.
  - Resultado: Node compatible y `pnpm --version` ejecutado correctamente, con sus versiones registradas. Si no es posible, declarar ese bloqueo y no continuar a la instalación.

- [x] T02 — Conservar la referencia y preparar una copia desechable.
  - Registrar inventario y contenido de los archivos propios versionados antes de modificarlos. Identificar los cambios locales previos y mantenerlos fuera de la entrega.
  - Crear una copia temporal con el código y documentos necesarios, sin bases de datos locales, `.venv`, `node_modules` ni cachés. No copiar ni abrir `staff/miguel-rodriguez/first-app/db/users.sqlite`, que pertenece a otro proyecto.
  - Resultado: copia independiente y referencia que permite comprobar cambios de formato y archivos protegidos sin tocar datos reales.

## Instalar las versiones aceptadas y cotejar la resolución

- [x] T03 — Instalar en la copia y comprobar las tres capas antes de ejecutar herramientas.
  - Ejecutar en la copia `pnpm add -D --save-exact prettier@3.9.10 eslint@10.13.0 @eslint/js@10.0.1`. Conservar `openai@7.39.0`, `cli-table3@0.6.5`, el comando `jupyter` y las demás declaraciones existentes. Dejar que pnpm genere el lockfile.
  - Reconstruir desde el lockfile las tres capas de cada raíz, incluyendo relaciones, optional y peer resueltos, y comparar sus pares nombre/versión con los 61 revisados en el plan. No exigir que todo el lockfile tenga 61 paquetes: la cuarta capa y posteriores quedan fuera de esta auditoría. Comprobar también que las dependencias preexistentes conservan sus resoluciones.
  - Resultado: resolución coincidente registrada. Si aparece o cambia cualquier paquete o versión dentro de las capas revisadas, consultar Socket para esas diferencias, actualizar el plan y esperar su aprobación antes de ejecutar Prettier/ESLint o continuar. No reutilizar la aceptación anterior para las diferencias ni editar el lockfile a mano.

## Configurar y comprobar los comandos en la copia

- [x] T04 — Añadir la configuración y los dos comandos previstos.
  - Crear `eslint.config.js` conforme al plan: reglas recomendadas de `@eslint/js`, módulos ESM, `console` y `process` de solo lectura y exclusión de instalaciones/entornos/cachés. El default export se limita a la interfaz de configuración de ESLint.
  - Añadir exactamente los scripts `format` y `lint` definidos en el plan, conservando `jupyter`. No añadir autofix, configuraciones de Prettier/EditorConfig, wrappers, plugins adicionales, hooks o CI.
  - Resultado: los patrones incluyen los doce JavaScript existentes y la nueva configuración. La configuración no apaga reglas recomendadas para ocultar fallos ni exige aplicar al código antiguo la separación de acciones.

- [x] T05 — Comprobar la preservación del código con Prettier.
  - Antes de sobrescribir el código, ejecutar `pnpm exec prettier` con `--no-config --no-editorconfig --debug-check` y todos los patrones del script aprobado, sin `--write`.
  - Resultado: salida 0 sin aviso de cambio de significado. Registrar el comando y su resultado. Si falla, investigar el fallo antes de aplicar formato; no cambiar lógica para hacerlo pasar.

- [x] T06 — Aplicar formato y comprobar su alcance e idempotencia.
  - Ejecutar `pnpm format` en la copia y revisar el diff de los doce archivos JavaScript existentes: solo formato, manteniendo lógica, mensajes, validaciones, orden y comentarios significativos. La nueva configuración también queda formateada.
  - Ejecutar `pnpm format` otra vez y comparar contenido antes/después de esa segunda ejecución. Comprobar que no se han formateado SQL, Python, notebooks, ejemplos de terminal, documentación o archivos generados.
  - Resultado: las dos ejecuciones terminan correctamente y la segunda no produce cambios nuevos; el formato estándar no exige refactorizar el código antiguo.

- [x] T07 — Ejecutar lint y demostrar que detecta fallos.
  - Ejecutar `pnpm lint` en la copia con la entrega válida: salida 0. No darlo por pasado si falla la configuración o no se analizan los archivos previstos.
  - Introducir temporalmente un error de sintaxis en un JavaScript propio cubierto y comprobar diagnóstico del archivo y salida distinta de 0. Restaurar su contenido válido y repetir lint con salida 0.
  - Hacer por separado la prueba de una variable no definida prevista en el plan; comprobar diagnóstico y salida distinta de 0, restaurar y repetir lint con salida 0. Confirmar que lint no ha reescrito los archivos.
  - Resultado: evidencias positivas y negativas de las reglas recomendadas y el parser, con los archivos restaurados. Si surge un error del código original que no pueda resolverse dentro del formato aprobado, detener ese punto y documentarlo para decisión; no desactivar reglas ni ampliar silenciosamente el alcance.

## Documentar e incorporar la entrega

- [x] T08 — Actualizar las instrucciones y guías afectadas.
  - AGENTS: exigir `pnpm format` y `pnpm lint` al terminar tareas. Conservar íntegro el procedimiento Socket y las reglas de aprobaciones, verificación y conflictos.
  - CONSTITUTIONS: añadir las tres dependencias de desarrollo exactas, conservando contratos y reglas de paquetes. STYLE: ajustar la referencia histórica al formateador y enlazar su uso, sin cambiar el estilo aprobado ni afirmar que lint lo acredita entero.
  - TREE y ARCHITECTURE: reflejar `eslint.config.js`, los documentos de esta feature y sus responsabilidades/comandos. Evitar duplicar contratos o listas de reglas en varias guías.
  - Resultado: documentación coherente con la entrega y con el mantenimiento de archivos exigido por la spec. No modificar README, specs históricas ni guías de otros proyectos.

- [x] T09 — Revisar la copia y el contenido protegido antes de incorporarlo.
  - Comparar inventario y contenido con T02. Las diferencias admitidas son las de la tabla «Archivos afectados» del plan: configuración nueva, manifiesto/lockfile, formato de JavaScript y documentos previstos.
  - Confirmar contenido idéntico de SQL, datos versionados si los hubiera, Python, notebooks, ejemplos `.txt`, README y specs históricas. No incluir ni comparar bases de datos locales excluidas de la referencia. Revisar que no hayan cambiado firmas públicas, mensajes, clasificador ni secuencias de validación.
  - Resultado: cambios delimitados y comprobados, sin archivos de pruebas negativas, wrappers o configuraciones adicionales.

- [x] T10 — Incorporar lo verificado y comprobar la entrega final.
  - Incorporar al proyecto de trabajo únicamente los archivos aprobados y verificados de la copia. No copiar bases, entornos o `node_modules`.
  - Con la disponibilidad de pnpm resuelta y la resolución ya cotejada en T03, ejecutar `pnpm install --frozen-lockfile` en el proyecto de trabajo para disponer de las herramientas aprobadas. Confirmar que manifiesto y lockfile no cambian; si hay diferencias en las capas revisadas, aplicar el mismo bloqueo y revisión de T03.
  - Ejecutar en la entrega final `pnpm format` y `pnpm lint`, comprobando salida 0. El formato no debe introducir cambios adicionales respecto a la copia verificada. Revisar el diff y enlaces locales y confirmar que árbol y arquitectura describen los archivos entregados.
  - Resultado: comandos ejecutables en el proyecto real, archivos protegidos intactos y ninguna prueba pendiente presentada como completada. No se arranca Jupyter ni se importan operaciones para realizar estos checks.

- [x] T11 — Registrar evidencia y retirar los temporales propios.
  - Anotar aquí comandos, versiones, salidas y resultados de las pruebas, comparación de capas y decisiones nuevas si las hubiera. Mantener la revisión Socket y su aceptación en el plan; no sustituirla por una afirmación general de seguridad.
  - Retirar únicamente la copia y referencias temporales creadas para esta ejecución una vez registrada la evidencia. No borrar datos locales ajenos. Revisar el estado final y que no se haya modificado nada fuera del alcance.
  - Resultado: comprobaciones de los cuatro puntos «Cómo probarlo» de la issue registradas y cada tarea marcada según lo realmente ejecutado. La revisión final de Miguel y los pasos de commit, push o revisión de compañeros no se dan por aprobados por completar la implementación.

## Evidencia y decisiones

- 2026-10-27: Miguel aprobó la spec y el plan y aceptó expresamente los hallazgos Socket documentados para esta propuesta, incluida la cobertura limitada de campañas.
- 2026-10-27: Miguel aprobó estas tareas en la conversación. Al registrar la aprobación no se había instalado ni ejecutado ninguno de los tres paquetes propuestos, ni implementado configuración o comandos.
- T01 resuelto: Node 24.12.0 y pnpm 10.33.0 ejecutados correctamente. Se conservan las aprobaciones y la rama previstas.
- No se autorizan aquí acciones nuevas de GitHub. #497 conserva `staging` como destino y sigue en draft; los pasos de Git y publicación se realizarán cuando Miguel los solicite.


### Ejecución — 2026-10-27

- Entorno de comprobación: Node `24.12.0`, pnpm `10.33.0`. Se usó el Node ya instalado y Corepack con selección explícita `pnpm@10.33.0` y `COREPACK_ENABLE_AUTO_PIN=0`. Corepack resolvió también el comando genérico a pnpm `12.15.0`; esa versión no generó esta entrega. No se añadieron `packageManager`, `.nvmrc` ni cambios de perfil.
- Referencia: 66 archivos propios versionados y los tres documentos de esta feature, sin bases, dependencias o entornos. La copia desechable tuvo 69 archivos de referencia; la entrega incorpora `eslint.config.js` y el árbol documenta 70 rutas propias.
- Instalación en la copia: `pnpm add -D --save-exact prettier@3.9.10 eslint@10.13.0 @eslint/js@10.0.1`, salida 0. Se cotejaron las 61 versiones y 71 relaciones de las tres capas con el plan: coincidencia completa. Las resoluciones de dependencias preexistentes no cambiaron. Los 87 paquetes instalados incluyen capas posteriores, fuera del alcance de esta revisión Socket.

Comprobaciones en la copia:

```sh
pnpm exec prettier --no-config --no-editorconfig --debug-check "db/**/*.js" "queries/**/*.js" "logic/**/*.js" "clients/jupyter/**/*.js" "scripts/**/*.js" "eslint.config.js"
pnpm format
pnpm format
pnpm lint
pnpm exec eslint . --format json
```

- Todos terminaron con salida 0. `--debug-check` se ejecutó antes de sobrescribir el código. La segunda pasada de formato conservó los mismos SHA-256. El informe JSON confirmó los trece JavaScript previstos, incluida la configuración.
- Se revisaron los doce JavaScript existentes contra la referencia: únicamente formato estándar; firmas, cadenas, prompt del clasificador, validaciones y orden conservados.
- Prueba negativa de sintaxis: añadir temporalmente `const = ;` a `clients/jupyter/run-operation.js` produjo salida 1 y un diagnóstico de parsing en ese archivo. Restaurado el contenido, lint volvió a salida 0.
- Prueba negativa de variable no definida: añadir temporalmente `neolandUndefinedProbe();` al mismo archivo produjo salida 1 y `no-undef`. Restaurado el contenido, lint volvió a salida 0. Lint no reescribió los archivos; ambas alteraciones se retiraron en la copia antes de incorporarla.
- Se conservaron idénticos los 47 archivos versionados protegidos fuera de los cambios previstos: SQL, Python, notebooks, ejemplos de terminal, README y specs históricas, entre otros. Los contratos y el procedimiento Socket tampoco cambiaron. Se comprobaron 35 enlaces locales de las guías, incluidos sus destinos y anclas.

Comprobaciones en el proyecto de trabajo:

```sh
CI=true pnpm install --frozen-lockfile
pnpm format
pnpm lint
```

- Los tres comandos terminaron con salida 0. El primer intento sin `CI=true` se detuvo con `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`: el `node_modules` anterior procedía de pnpm 11.25.0. Se repitió en modo no interactivo para recrear solo las dependencias generadas. No fue un cambio del manifiesto ni del lockfile.
- La instalación congelada conservó manifiesto y lockfile byte por byte. La pasada final de formato conservó los trece JavaScript idénticos a la copia verificada; lint terminó sin errores.
- No se ejecutaron operaciones de negocio, Jupyter ni Ollama. Estos resultados acreditan las herramientas de desarrollo y su alcance; no se presentan como pruebas funcionales de la aplicación.
- Se retiraron la copia y referencias temporales de esta ejecución después de registrar los resultados. La base local ajena de `first-app` no se abrió, copió, borró ni incorporó.
- Implementación lista para la revisión final de Miguel. No se hicieron commits, push, cambios de base de PR ni solicitudes de revisión.
