# Plan técnico 008 · Flujo de trabajo compartido

> Estado: **Implementado, pendiente de aprobación final** (2026-10-31) · Spec: [spec.md](spec.md), aprobada el 2026-10-31 · Issue: #692 · Pull request: #693

Este plan concreta la incorporación del flujo compartido del curso. La spec conserva sus requisitos. Las tareas se redactarán después de aprobar este documento y la implementación comenzará después de aprobar las tareas.

---

## 1. Arquitectura y alcance

El flujo de desarrollo se incorpora como instrucciones, plantillas y operaciones de Git independientes del código que registra la asistencia. Sus recursos quedan dentro de AsistenciApp, junto a sus documentos de trabajo.

La fuente es `exercises/git-workflow-agent-template/`, relativa a la raíz del repositorio. Antes de copiar se comprobará que coincide con la versión compartida vigente. Se incorporará el conjunto completo conservando la estructura y los permisos de los scripts.

| Destino relativo a AsistenciApp | Archivos | Responsabilidad |
| --- | --- | --- |
| `agents/` | 7 | Coordinar el flujo, preparar tareas, crear issues, ramas, commits y PR, y publicar cambios. |
| `skills/` | 15 | Describir las operaciones, sus argumentos, límites y tratamiento de errores. |
| `tools/` | 7 | Ejecutar las operaciones de terminal. |
| `templates/issues/` | 6 | Preparar issues por tipo de tarea. |
| `templates/pull-request/` | 6 | Preparar PR por tipo de tarea. |
| `MCPS/github-mcp-server/mcp.txt` | 1 | Documentar la conexión remota y el header de MCP. |

El total esperado es de 42 archivos. La comparación final detectará archivos ausentes, adicionales o modificados fuera de las adaptaciones locales previstas.

No cambian `app.py`, `asistencia/`, `static/`, `tests/`, `requirements.txt`, `pytest.ini`, los datos ni la constitución. Las especificaciones anteriores se conservan.

---

## 2. Recursos y rutas (CA-01, CA-02, CA-03, CA-08)

### Agentes y operaciones

Se incorporan los agentes `git-workflow-agent`, `help-me-to-think`, `create-issue`, `create-branch`, `create-commit`, `launch-push` y `create-pr`. Sus responsabilidades y las quince skills se mantienen como en la fuente compartida.

Las operaciones de terminal siguen ejecutándose desde la raíz del repositorio. Se obtiene la ruta real de AsistenciApp respecto de esa raíz y se utiliza para adaptar únicamente el comando de estas siete skills:

- `check-status`.
- `pull-changes`.
- `create-branch`.
- `create-branch-from-staging`.
- `create-empty-commit`.
- `commit-changes`.
- `launch-push`.

Los argumentos que nombran archivos siguen siendo relativos a la raíz del repositorio, como requieren los scripts. Los ejemplos y explicaciones propios de la aplicación utilizan rutas relativas a AsistenciApp; las rutas ejecutables mantienen los segmentos reales necesarios para encontrarlas desde la raíz.

Los siete scripts se copian sin cambiar su contenido y con permiso de ejecución. No se instalan herramientas adicionales ni se ejecutan los comandos de instalación que figuran como referencia en las skills de entrevista.

### Plantillas

Se incorporan las seis parejas de plantillas para `feat`, `fix`, `docs`, `refactor`, `test` y `chore`. No se añaden las dos plantillas básicas retiradas de la fuente.

La forma del título vive en el comentario de cada plantilla: inglés, menos de 72 caracteres y comienzo con un verbo. Los agentes y las skills remiten a esa regla, sin repetirla ni acortar títulos por su cuenta.

El tipo de rama sigue la plantilla correspondiente o la más cercana. Los dos scripts de creación de ramas conservan la versión compartida, que ya no valida una lista fija de tipos.

---

## 3. Relación entre issue, rama y PR (CA-01, CA-04)

El flujo prepara una issue asignada a la cuenta autenticada, una rama propia desde la base compartida y una PR en borrador hacia la base de integración. Se conserva la separación de responsabilidades del template: `create-pr` crea la PR y el orquestador llama a `link-pr-to-issue` para enlazarla.

La PR contiene una única línea `Closes #N` y la asociación con la issue en Development. La documentación explica que el cierre automático se produce al fusionar en la rama por defecto del repositorio. Esa rama se consulta cuando se comprueba el enlace; no se presupone que sea una concreta.

La issue permanece abierta mientras el trabajo está en curso. No se fusiona la PR, no se cierra la issue a mano y no se solicita revisión a personas que no se hayan indicado. La PR de esta tarea conserva su estado de borrador durante las fases pendientes.

---

## 4. Integración con las instrucciones locales (CA-05, CA-06, CA-07, CA-08)

### `AGENTS.md`

Se sustituye el apartado del flujo Git que remite a recursos ausentes por una referencia al orquestador local y a los recursos incorporados. Se conserva la jerarquía de fuentes: constitución, arquitectura, manual de trabajo y especificación local aprobada.

Se mantiene expresamente el orden spec, aprobación, plan, aprobación, tareas, aprobación e implementación. El flujo Git organiza sus operaciones sin sustituir esas aprobaciones. Las indicaciones del template para continuar una operación autorizada no permiten avanzar a otra fase del SDD que siga pendiente.

La búsqueda de especificaciones sigue limitada a `specs/` de esta aplicación. Se conservan las reglas de implementación, los criterios educativos del código y las comprobaciones de cierre. Las instrucciones usan roles generales; las rutas técnicas necesarias se mantienen correctas.

### `docs/ARCHITECTURE.md`

Se añade una sección breve sobre los recursos del flujo de desarrollo con las cinco carpetas nuevas y sus responsabilidades. Se explica que acompañan al trabajo del repositorio y que el recorrido de una petición de asistencia sigue siendo navegador, entrada, caso de uso, dominio y almacenamiento.

Se conservan las responsabilidades existentes y la sección de incidencias pendientes de otra spec. No se añade un documento de árbol independiente.

### `README.md`

Se añade una sección de desarrollo con enlaces al manual, al orquestador, a las plantillas y a la guía MCP. Se indica dónde están los scripts y desde qué contexto se ejecutan, y se recuerda el orden de aprobaciones de esta aplicación.

Los comandos de preparación, arranque, uso y cierre de la asistencia se conservan. Se revisan los enlaces nuevos y las referencias al flujo que se sustituyan, sin reescribir documentos históricos.

---

## 5. MCP y configuración externa (CA-03, CA-09)

Se incorpora la guía compartida con `X-MCP-Features: mcp_apps_disable_form_deferral` y el ejemplo de `Authorization` que usa el marcador `TU_GITHUB_PAT`. La configuración real y las credenciales permanecen fuera de los cambios de esta tarea.

Las skills `create-issue`, `create-pr-base-staging` y `assign-reviewers` se copian en su versión actual, sin la prohibición antigua de utilizar `gh` o `tools/`. Se conservan los límites específicos de cada operación, como la separación entre actualizar el cuerpo de la PR y crear el enlace Development.

Copiar estas instrucciones no ejecuta la configuración de MCP ni modifica `mcp.json`. Si no se utiliza una conexión local de Cursor durante la verificación, se registrará expresamente como no comprobada. Las consultas de metadatos de GitHub no se presentarán como una prueba de esa conexión.

---

## 6. Datos, contratos y dependencias (CA-10)

No se crean ni modifican tablas, campos, archivos de datos, rutas HTTP ni contratos de entrada o salida. Tampoco se cambia el registro por navegador, el límite de intentos, la lista de bloqueo ni el acceso del profesor.

Las dependencias de la aplicación siguen siendo Flask y pytest. El flujo utiliza los comandos de Git, Bash y las conexiones de GitHub ya disponibles; esta tarea no instala paquetes, extensiones ni servicios. Los fallos de validación documentados continúan fuera de alcance.

---

## 7. Verificación y trazabilidad

Las comprobaciones automáticas se ejecutan sobre los archivos instalados y el estado real de la tarea. Los resultados y las limitaciones se registrarán en `tasks.md` durante la implementación, sin crear nuevas tareas remotas para demostrar el flujo.

| Criterio | Comprobación prevista |
| --- | --- |
| CA-01 | Consultar los metadatos de la issue y la PR: asignación, estado abierto, borrador, base y relación. Comprobar la apertura de la rama y el commit vacío mediante Git. |
| CA-02 | Comparar las doce plantillas con la fuente. Comprobar que la forma del título vive en ellas y que agentes y skills remiten al tipo correspondiente. Revisar que ambos scripts carecen de la validación antigua de tipos. |
| CA-03 | Comparar automáticamente el inventario completo: 35 archivos idénticos y siete skills con el único ajuste del comando. Resolver las referencias internas a agentes, skills, plantillas y scripts. Comprobar sintaxis Bash y permisos de los siete scripts. |
| CA-04 | Consultar la asociación Development y comprobar una única línea `Closes #N`, la issue abierta y la rama por defecto vigente. No ejecutar una fusión ni un cierre para verificarlo. |
| CA-05 | Comprobar las tres aprobaciones separadas en las instrucciones y los estados de los documentos locales. Verificar que ninguna instrucción nueva sustituye el SDD por la redacción conjunta de las tres fases. |
| CA-06 | Comprobar que la constitución no cambia, que la jerarquía de fuentes se conserva y que las aprobaciones solo cubren la fase y aplicación correspondientes. |
| CA-07 | Resolver los enlaces locales nuevos del README y la arquitectura. Buscar y eliminar las referencias obsoletas del apartado Git de `AGENTS.md`. |
| CA-08 | Revisar la redacción general de los documentos nuevos o modificados, las rutas de las siete operaciones y la ausencia de apartados de punto de partida ligados a ramas o commits concretos. Los segmentos necesarios de una ruta ejecutable se comprueban como rutas. |
| CA-09 | Comparar la guía MCP con la fuente, comprobar el marcador del ejemplo y verificar que no se han modificado configuraciones externas ni añadido credenciales. Registrar por separado las conexiones que no se hayan probado. |
| CA-10 | Comprobar que los archivos del producto, sus dependencias y la constitución no cambian. Ejecutar la suite completa con pytest y revisar `git diff --check`. |

### Ejecución de comprobaciones

1. Comprobar el inventario y el contenido de los 42 archivos, normalizando solo el prefijo del comando de las siete skills adaptadas. La comparación de scripts incluye los permisos ejecutables.
2. Ejecutar `bash -n` en los siete scripts y `check-status.sh` desde la raíz del repositorio. Comprobar argumentos inválidos de los scripts de ramas que se rechacen antes de cualquier acceso remoto.
3. Resolver las referencias locales y revisar las siete filas de la comparación: plantillas, títulos, tipos, enlace de PR, header MCP, prohibiciones antiguas y rutas.
4. Consultar la issue y la PR existentes para comprobar la asignación y el enlace. Mantener el borrador y las casillas pendientes hasta que sus condiciones se hayan cumplido.
5. Ejecutar pytest con el entorno virtual existente desde la carpeta de AsistenciApp. Utilizar los datos temporales de los tests, sin arrancar una clase ni abrir un túnel para esta actualización.
6. Revisar los archivos cambiados y registrar resultados concretos. No atribuir a pytest una comprobación de la configuración MCP o de los fallos de validación que la suite no cubre.

No se añade una suite que reproduzca el contenido del template. La comparación de integridad, las comprobaciones de rutas y scripts y las pruebas existentes cubren esta incorporación sin modificar los tests del producto.

---

## 8. Comprobación de la constitución (v3.0)

| Regla | Cumplimiento previsto |
| --- | --- |
| P1 · Independiente de la plataforma | El registro de asistencia y sus integraciones no cambian. |
| P2 · Simplicidad | Se reutiliza el flujo compartido completo y solo se adaptan sus rutas; no se añaden capas al producto ni mecanismos nuevos de configuración. |
| P3 · Dependencias mínimas | No se añaden dependencias ni instalaciones. Flask y pytest siguen en `requirements.txt`. |
| P4 · Privacidad mínima | Los datos de asistencia y el control de intentos permanecen intactos. No se publican credenciales ni se modifican datos reales. |
| P5 · Accesible y usable en móvil | No se modifica la interfaz. |
| P6 · Español | Las instrucciones y los documentos se redactan en español; se conservan los identificadores y formatos técnicos del flujo compartido. |
| §4 · SDD | Se conserva una aprobación explícita entre spec, plan, tareas e implementación. Las tareas se redactan después de aprobar el plan. |
| §5 · Calidad | La tabla del apartado 7 asigna una comprobación a cada CA. Se registran los resultados automáticos y la revisión documental; pytest debe pasar antes del cierre. |
| §6 · Seguridad | No se modifican la caducidad de códigos, el registro único, el cierre de sesiones, la validación de entradas ni el acceso del profesor. |
| §7 · Alcance | Todos los cambios del repositorio quedan dentro de AsistenciApp. La fuente compartida y las demás aplicaciones no se editan. |
| §8 · Enmiendas | No se propone ni se aplica una enmienda a la constitución. |

---

## 9. Estado de la fase

- Spec, plan y tareas aprobados por separado el 2026-10-31.
- Implementación completada y comprobada: 42 recursos incorporados y tres documentos de trabajo actualizados.
- La suite completa aprueba 112 pruebas; las comprobaciones de scripts, referencias y enlaces están registradas en `tasks.md`.
- El trabajo de implementación está publicado en la PR existente. La constitución, los archivos del producto y las especificaciones anteriores conservan su contenido.
- Aprobación final pendiente; la PR permanece en borrador.
