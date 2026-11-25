---
description: Contrato de arquitectura en capas, independiente del lenguaje y del framework. Aplicar al crear, modificar o revisar código. Respeta siempre la estructura de carpetas del proyecto mediante su mapa de capas.
applyTo: "**"
---

# Arquitectura en capas · Instrucciones para agentes (v1.2)

## Cómo leer este documento

- **DEBE / NO DEBE:** obligatorio. Incumplirlo es un defecto que se corrige antes de integrar.
- **DEBERÍA / NO DEBERÍA:** recomendado. Solo se admite una desviación si el motivo se documenta (comentario o ADR).
- **PUEDE:** opcional.
- Cada regla tiene un ID `R-ÁREA-NN`, definido una sola vez en este documento. Cítalo al revisar, al justificar decisiones y en los commits.
- Los ejemplos de código usan TypeScript como notación. `HttpRequest`, `HttpResponse`, `Database`, `schema`, `validate` y similares son marcadores: sustitúyelos por lo que ya use el proyecto.
- Las etiquetas `[capa · módulo]` de los ejemplos indican el rol, no una ruta. La ruta la decide el mapa de capas del proyecto.
- Prioridad cuando haya conflicto: petición explícita de la persona > mapa de capas del proyecto > convenciones impuestas por el framework > esta guía > ejemplos de esta guía. Si la petición obliga a incumplir una regla DEBE, aplica R-AGT-05.

---

## 1. Protocolo de ejecución

Sigue estos pasos en orden en cada tarea que cree o modifique código:

1. **Leer el mapa de capas.** Búscalo en `AGENTS.md`, `CLAUDE.md`, el README o los archivos de instrucciones del proyecto. Si no existe, infiérelo (sección 3.2).
2. **Inspeccionar el entorno.** Lee el árbol de archivos y los archivos vecinos de la capa en la que vas a trabajar. Anota sus convenciones: nombres, sufijos, extensión, forma de exportar y ubicación de las pruebas.
3. **Clasificar.** Determina la capa de cada pieza nueva con la tabla de la sección 2.3.
4. **Ubicar.** Coloca cada pieza donde el mapa indique para su capa. No crees estructura nueva.
5. **Implementar.** Sigue la receta de la sección 9.1, de dentro hacia fuera.
6. **Verificar.** Comprueba la lista de la sección 9.2 antes de dar la tarea por terminada.
7. **Informar.** Si te has desviado de alguna regla DEBERÍA, indica el ID y el motivo.

- **R-AGT-01** — Antes de crear o modificar archivos, el agente DEBE leer el mapa de capas del proyecto. Si no existe, DEBE inferirlo del árbol existente (sección 3.2), dejar constancia de la inferencia y, si el flujo es interactivo, confirmarla antes de generar código.
- **R-AGT-02** — El agente NO DEBE mover, renombrar ni reorganizar archivos o carpetas existentes, ni crear una estructura paralela a la del proyecto, salvo que se le pida de forma explícita.
- **R-AGT-03** — Todo archivo nuevo DEBE ubicarse donde el mapa de capas indique para su capa y DEBE imitar a los archivos vecinos de esa capa: convención de nombres, mayúsculas y minúsculas, extensión, forma de exportar y ubicación de las pruebas.
- **R-AGT-04** — El agente NO DEBE añadir frameworks ni librerías nuevos para cumplir esta guía cuando el proyecto ya cubre esa necesidad (validación, inyección de dependencias, acceso a datos, logs). Si falta una capacidad, DEBE proponerla antes de añadirla.
- **R-AGT-05** — Si una petición obliga a incumplir una regla DEBE, el agente DEBE señalarlo y proponer una alternativa antes de generar el código.
- **R-AGT-06** — Al revisar código, el agente DEBE citar las reglas incumplidas por su identificador.
- **R-AGT-07** — Cuando el framework imponga la ubicación o la forma de un archivo, el agente DEBE respetar esa imposición y aplicar la regla R-EST-08.

---

## 2. Modelo

### 2.1 Capas

Modelo canónico (variante invertida): `presentación → aplicación → dominio ← infraestructura`. Shared es transversal. La raíz de composición conecta todo.

| Capa | Responsabilidad | Contiene | No contiene |
|---|---|---|---|
| Presentación | Traducir entre el exterior y los casos de uso: recibir la entrada, validar su forma, mapearla a comando o consulta, invocar un caso de uso y mapear el resultado o el error al protocolo. | Controladores, *handlers*, *resolvers*, comandos CLI, pantallas, componentes de UI, *view-models*, consumidores de colas, esquemas de entrada, DTO de petición y respuesta, *presenters*, manejador global de errores. | Reglas de negocio, acceso a datos, llamadas directas a servicios externos, transacciones. |
| Aplicación | Orquestar cada caso de uso: cargar, delegar las reglas en el dominio, persistir, coordinar efectos y delimitar la transacción. | Casos de uso, comandos, consultas, DTO de salida, puertos técnicos (correo, reloj, unidad de trabajo, catálogos externos), autorización. | Reglas de negocio, SQL, HTTP, detalles del framework, formato de presentación. |
| Dominio | Representar los conceptos del negocio y hacer cumplir sus reglas e invariantes. | Entidades, value objects, agregados, servicios de dominio, políticas y cálculos puros, eventos de dominio, errores de dominio, interfaces de repositorio. | Cualquier E/S, frameworks, anotaciones ORM, serialización, reloj del sistema, aleatoriedad. |
| Infraestructura | Implementar las interfaces del dominio y de la aplicación con tecnologías concretas. | Repositorios concretos, modelos de persistencia, mapeos ORM, migraciones, clientes externos, adaptadores de correo, colas, ficheros y caché, reintentos y *timeouts*. | Reglas de negocio, orquestación. |
| Shared | Piezas genéricas y estables sin negocio. | Jerarquía de errores, `Result`, identificadores tipados, interfaces `Logger` y `Clock`, utilidades puras, esquema de configuración. | Lógica de negocio, E/S, imports de otras capas. |
| Platform | Infraestructura técnica común a todos los módulos. | Servidor, conexión y *pool* de base de datos, implementación de la unidad de trabajo y del logger, manejador global de errores. | Reglas de negocio. |
| Raíz de composición | Crear las implementaciones concretas y conectarlas. No es una capa. | Punto de entrada o arranque del framework, contenedor de inyección. | Lógica. |

### 2.2 Matriz de imports permitidos

Fila = quien importa. Columna = lo importado.

| Desde \ Hacia | Presentación | Aplicación | Dominio | Infraestructura | Shared | Platform |
|---|---|---|---|---|---|---|
| Presentación | — | Sí | Solo tipos de solo lectura que la aplicación expone a propósito | **No** | Sí | Sí |
| Aplicación | **No** | — | Sí | **No** (solo a través de interfaces propias o del dominio) | Sí | **No** |
| Dominio | **No** | **No** | — | **No** | Sí | **No** |
| Infraestructura | **No** | Sí (para implementar puertos y usar sus tipos) | Sí | — | Sí | Sí |
| Shared | **No** | **No** | **No** | **No** | — | **No** |
| Platform | **No** | Sí (para implementar puertos) | **No** | **No** | Sí | — |
| Raíz de composición | Sí | Sí | Sí | Sí | Sí | Sí |

Entre módulos: solo se importa la API pública del otro módulo (R-EST-02).

- **R-GEN-01** — Las capas de presentación, aplicación, dominio e infraestructura DEBEN ser cerradas. La única excepción permitida es la de las consultas de solo lectura descritas en R-FLU-07.
- **R-GEN-02** — El código común (shared) es la única capa abierta: cualquier capa PUEDE usarlo.
- **R-GEN-04** — Las dependencias NO DEBEN formar ciclos, ni entre capas ni entre módulos.
- **R-FLU-01** — El flujo de llamadas DEBE ser presentación → aplicación → dominio. La aplicación llama a la infraestructura solo a través de interfaces.
- **R-FLU-02** — Una capa interior NO DEBE conocer el tipo concreto de una capa exterior. Los `import` solo DEBEN apuntar a las capas permitidas por la matriz de la sección 2.2.
- **R-FLU-08** — Las dependencias concretas DEBEN crearse y conectarse solo en la raíz de composición (o en el contenedor de inyección del framework). Las capas NO DEBEN instanciar sus propias dependencias.

### 2.3 Tabla de decisión de capa

Evalúa en orden. La primera respuesta afirmativa decide la capa. Después, el mapa de capas decide la ruta.

| # | ¿El código…? | Capa |
|---|---|---|
| 1 | …recibe entradas del exterior o produce la salida que ve el usuario o el cliente (HTTP, UI, CLI, mensajes entrantes)? | Presentación |
| 2 | …habla con algo externo para leer o escribir (base de datos, API, fichero, correo, cola, SDK)? | Infraestructura |
| 3 | …expresa una regla, un cálculo o una restricción del negocio que seguiría siendo cierta sin ordenador? | Dominio |
| 4 | …coordina los pasos de una operación (cargar, decidir, guardar, notificar) o define una transacción? | Aplicación |
| 5 | …es genérico, puro, sin negocio y útil en más de un módulo? | Shared |
| 6 | …crea instancias concretas y las conecta? | Raíz de composición |

Equivalencias por tipo de proyecto: en una API, la presentación son rutas y controladores; en una app móvil o un frontend, pantallas, componentes y *view-models*, y la aplicación incluye los almacenes de estado que orquestan; en una CLI, el análisis de argumentos y los códigos de salida; en un *worker*, el consumidor de colas o el planificador. MVC, MVP y MVVM son patrones internos de la presentación.

### 2.4 Variante e intensidad

Antes de aplicar la guía, decide:

1. ¿El sistema vivirá más de unos meses o lo mantendrá más de una persona? Si no → no uses capas formales.
2. ¿El núcleo son reglas sobre entidades? Si no → no uses esta guía. Alternativas: *pipelines* funcionales (ETL, compiladores), arquitectura dirigida por eventos (*streaming*), *Entity Component System* (juegos), dos capas *handler* + lógica pura (*serverless* de una sola responsabilidad), lo más simple que funcione (prototipos desechables).
3. ¿Hay reglas no triviales o más de una integración externa? Si es así → variante completa. Si no → variante ligera.
4. ¿Hay varios subdominios con poco en común? Si es así → primero módulos y después capas dentro de cada módulo, siempre dentro de la estructura que ya tenga el proyecto.

| Aspecto | Ligera | Completa |
|---|---|---|
| Capas | Presentación, servicios (aplicación + dominio), infraestructura | Las cuatro |
| Interfaces de repositorio | Opcionales | Obligatorias |
| Modelo de dominio | Tipos de datos + funciones de reglas | Entidades, value objects y agregados |
| DTO separados | Solo en la frontera exterior | En todas las fronteras |

Señales de mal uso: más del 20 % de las operaciones solo reenvían llamadas (*sinkhole*); añadir un campo obliga a tocar seis o más archivos sin lógica (lasaña); entidades sin comportamiento (modelo anémico); hay que saltarse capas a menudo; cada funcionalidad toca todas las capas de todos los módulos.

- **R-GEN-03** — Un proyecto nuevo DEBERÍA usar la variante invertida. Si usa la clásica (dominio → persistencia), DEBE documentarlo y aplicar el resto de reglas sustituyendo «interfaz de repositorio» por «repositorio concreto».
- **R-GEN-05** — La variante ligera DEBE mantener separadas, al menos, la presentación y la infraestructura, y DEBE aplicar íntegro el manejo de errores de la sección 5. El paso de la variante ligera a la completa PUEDE hacerse módulo a módulo.

### 2.5 Reglas por capa

**Presentación**

- **R-PRE-01** — La presentación DEBE validar la forma de la entrada (tipos, formatos, campos obligatorios, longitudes) antes de llamar a la aplicación.
- **R-PRE-02** — La presentación NO DEBE contener reglas de negocio. Una comprobación que solo tiene sentido si se conoce el negocio («un pedido confirmado no se puede editar») pertenece al dominio.
- **R-PRE-03** — Cada operación de presentación (endpoint, comando, acción de pantalla) DEBERÍA invocar exactamente un caso de uso.
- **R-PRE-04** — La presentación NO DEBE importar nada de infraestructura ni del dominio, salvo los tipos de solo lectura que la aplicación exponga a propósito.
- **R-PRE-05** — Los detalles del protocolo (códigos HTTP, cabeceras, códigos de salida de CLI, navegación de UI) DEBEN quedarse en la presentación.

**Aplicación**

- **R-APL-01** — Cada caso de uso DEBE representar una intención del usuario o del sistema y nombrarse con un verbo: `AddOrderLine`, `RegisterUser`, `CancelReservation`.
- **R-APL-02** — Un caso de uso DEBE recibir un único objeto de entrada inmutable (comando o consulta) y devolver un DTO o un `Result` con un DTO.
- **R-APL-03** — La aplicación DEBE acceder a la infraestructura solo a través de interfaces (puertos o repositorios), recibidas por inyección.
- **R-APL-04** — Un caso de uso NO DEBERÍA llamar a otro caso de uso. La lógica compartida se extrae a un servicio de dominio o a una función de aplicación reutilizable.
- **R-APL-05** — La transacción DEBE abrirse y cerrarse en la aplicación, una por caso de uso, mediante una unidad de trabajo.
- **R-APL-06** — La autorización («¿puede este usuario hacer esto?») DEBE comprobarse en la aplicación. La autenticación («¿quién es?») se resuelve en la presentación.

**Dominio**

- **R-DOM-01** — El dominio NO DEBE importar código de presentación, aplicación ni infraestructura, ni tampoco frameworks o librerías de entrada y salida.
- **R-DOM-02** — Las invariantes de una entidad DEBEN protegerse dentro de la propia entidad: no puede existir una instancia en estado inválido.
- **R-DOM-03** — Las entidades NO DEBEN exponer *setters* públicos. El estado cambia solo mediante métodos con nombre de negocio (`confirm()`, `addLine()`).
- **R-DOM-04** — Los conceptos con reglas propias (dinero, email, cantidad, rango de fechas) DEBERÍAN modelarse como value objects en lugar de como primitivos.
- **R-DOM-05** — El dominio DEBE definir las interfaces de repositorio de sus agregados, expresadas en términos de dominio y no de tablas.

**Infraestructura**

- **R-INF-01** — Toda clase de infraestructura que se use desde capas interiores DEBE implementar una interfaz definida en el dominio o en la aplicación.
- **R-INF-02** — Los modelos de persistencia (filas, entidades ORM, documentos) NO DEBEN salir de la infraestructura. Se convierten a tipos de dominio con un *mapper*.
- **R-INF-03** — La infraestructura DEBE traducir las excepciones de las librerías externas a errores de la jerarquía común (sección 5), conservando la causa original.
- **R-INF-04** — Los reintentos, los *timeouts*, los *circuit breakers* y la caché DEBEN implementarse en infraestructura, de forma transparente para el resto.

**Shared**

- **R-SHR-01** — Shared NO DEBE importar de ninguna otra capa ni de ningún módulo del proyecto.
- **R-SHR-02** — Shared NO DEBE contener lógica de negocio. Si una utilidad solo la usa un módulo, vive en ese módulo.
- **R-SHR-03** — Shared NO DEBERÍA tener agrupaciones «cajón de sastre» (del tipo `utils` o `helpers`) sin un tema concreto. Cada agrupación tiene un propósito con nombre.
- **R-SHR-04** — La configuración DEBE leerse y validarse una sola vez, al arrancar, y entregarse a cada componente como un objeto tipado. Las capas interiores NO DEBEN leer variables de entorno directamente.

Contenido mínimo de shared (en la ruta que indique el mapa): jerarquía de errores, `Result` (si la política es `Result`), interfaz `Logger` y esquema de configuración que detiene el arranque si falta un valor obligatorio.

---

## 3. Estructura del proyecto

Las capas son roles lógicos, no nombres de carpeta. La estructura física (la del equipo, la que impone el framework o la del sistema de compilación) es del proyecto y se respeta. Una capa puede ocupar varias rutas y reconocerse por carpeta, paquete, proyecto de compilación o sufijo (`**/*.repository.*`). Cada archivo DEBE poder asignarse a una sola capa.

### 3.1 Mapa de capas

Es la tabla que conecta esta guía con el árbol real del proyecto. Vive en un archivo de instrucciones propio del proyecto (plantilla en el Anexo) y contiene:

1. La ruta o el *glob* de cada rol: presentación, aplicación, dominio, infraestructura, shared, platform, raíz de composición y pruebas.
2. Cómo se reconoce un módulo y cuál es su API pública.
3. Las rutas impuestas por el framework y su rol.
4. Las convenciones: nombres de archivo, unidades por archivo y ubicación de las pruebas.
5. Las decisiones: variante, organización (por módulo y capa, o solo por capa), política de errores (R-ERR-05) y estilo de los casos de uso (R-PAR-08).

### 3.2 Inferir el mapa cuando no existe

1. Recorre el árbol e identifica qué rutas ya cumplen cada rol (dónde están los controladores o las pantallas, dónde se accede a datos, dónde están las reglas).
2. Identifica las rutas que impone el framework y las convenciones de nombres que ya se usan.
3. Para un rol sin ubicación, propón la más coherente con lo existente (junto a piezas parecidas y con el mismo estilo de nombres). No crees niveles nuevos en la raíz del proyecto.
4. Registra el mapa inferido y, si el flujo es interactivo, confírmalo.
5. Solo si el proyecto está vacío y el framework no impone nada PUEDES usar una organización de referencia: por módulo y capa (`modules/<módulo>/{presentation,application,domain,infrastructure}` + `shared/` + `platform/`) o solo por capa (`{presentation,application,domain,infrastructure}/` + `shared/`).

### 3.3 Nombres

El patrón conceptual es fijo; la forma escrita (mayúsculas y minúsculas, separadores, sufijos y extensión) es la del proyecto. Si el proyecto ya usa otros sufijos para el mismo rol (por ejemplo, `Handler` o `Service`), se mantienen los suyos.

| Artefacto | Capa | Patrón | Ejemplo |
|---|---|---|---|
| Controlador / *handler* | Presentación | Concepto + rol | `OrderController` |
| Esquema de entrada | Presentación | Operación + `RequestSchema` | `AddLineRequestSchema` |
| Caso de uso | Aplicación | Verbo + objeto | `AddOrderLine` |
| Comando / consulta | Aplicación | Caso de uso + `Command` / `Query` | `AddOrderLineCommand` |
| DTO de salida | Aplicación | Sustantivo | `OrderSummary` |
| Puerto | Aplicación | Capacidad | `ProductCatalog`, `Clock` |
| Entidad / value object | Dominio | Sustantivo del negocio | `Order`, `Money` |
| Interfaz de repositorio | Dominio | Agregado + `Repository` | `OrderRepository` |
| Repositorio concreto | Infraestructura | Tecnología + interfaz | `SqlOrderRepository` |
| *Mapper* | Capa exterior de la frontera | `to` + destino, o origen + `Mapper` | `toOrderSummary`, `OrderMapper.toDomain` |
| Código de error | Dominio del módulo | `MÓDULO_MOTIVO` | `ORDER_NOT_FOUND` |

### 3.4 Reglas de estructura

- **R-EST-01** — El proyecto DEBERÍA declarar su mapa de capas (sección 3.1). Sea cual sea su organización, DEBE aplicarla de forma uniforme en todos sus módulos.
- **R-EST-02** — Un módulo NO DEBE importar archivos internos de otro módulo. Solo PUEDE usar lo que el otro expone en su API pública, normalmente casos de uso o DTO.
- **R-EST-03** — Cada caso de uso DEBERÍA vivir en su propia unidad (archivo, clase o función) e identificarse con el nombre del caso de uso, escrito según la convención de nombres del proyecto.
- **R-EST-04** — La estructura de carpetas, el árbol de archivos y las convenciones de nombres del proyecto DEBEN respetarse. Esta guía NO DEBE usarse como motivo para mover, renombrar o reorganizar archivos existentes, ni para crear carpetas con los nombres de los ejemplos.
- **R-EST-05** — Los nombres de dominio y de casos de uso DEBEN usar el vocabulario del negocio. Los nombres técnicos (`Sql`, `Http`, `Redis`) DEBEN aparecer solo en infraestructura y en platform.
- **R-EST-06** — El proyecto DEBERÍA verificar en integración continua las reglas R-GEN-04, R-DOM-01, R-PRE-04, R-SHR-01 y R-EST-02 con una herramienta automática de análisis de dependencias del ecosistema del proyecto, configurada con contratos de capas y de importaciones prohibidas sobre las rutas del mapa.
- **R-EST-07** — Cada archivo nuevo DEBE colocarse en la ubicación que el mapa de capas asigna a su capa. Si su capa no tiene ubicación en el mapa, se propone una (sección 3.2) antes de crearlo.
- **R-EST-08** — Cuando el framework imponga la ubicación o la forma de un archivo (rutas basadas en ficheros, pantallas, migraciones, configuración), esa imposición prevalece. El archivo se clasifica por su rol y DEBE mantenerse delgado: delega en la capa que corresponda en lugar de contener lógica de otras capas.

---

## 4. Flujo de una operación

### 4.1 Secuencia de escritura

```text
1  exterior      → presentación    carga útil sin tipar
2  presentación                    valida la forma (fase 1); si falla → ValidationError, fin
3  presentación  → aplicación      execute(comando inmutable)
4  aplicación                      abre la unidad de trabajo; autorización si aplica
5  aplicación    → infraestructura repo.findById(...) vía interfaz → entidad mapeada
6  aplicación    → dominio         entidad.metodoDeNegocio(...) → ok | DomainError
7  aplicación    → infraestructura servicios externos (solo si todo lo anterior pasó)
8  aplicación    → infraestructura repo.save(...) y confirmación de la transacción
9  aplicación                      mapea la entidad a DTO por lista blanca → Result<DTO, AppError>
10 presentación                    mapea el DTO o el error al protocolo
11 presentación  → exterior        200 / 4xx / 5xx
```

Ningún objeto cruza una frontera sin un mapeo explícito (pasos 2, 5, 9 y 10).

### 4.2 Fases y orden por coste

| Fase | Capa | Qué hace |
|---|---|---|
| 1. Validar los parámetros | Presentación | Tipos, obligatorios, formatos, rangos, longitudes. Sin E/S. |
| 2. Validar la lógica | Aplicación y dominio | 2a en memoria (comando, identidad) → 2b almacenamiento propio (existencia, estado) → 2c servicios externos → 2d escrituras. |
| 3. Sanear la respuesta | Aplicación (*mapper*) y presentación (*presenter*) | Lista blanca de campos, sin datos internos ni sensibles (*hashes*, *tokens*, costes, banderas técnicas, identificadores no públicos), fechas ISO 8601 con zona, importes en unidades mínimas o decimal en texto, una sola convención de nombres de campo, codificación según el destino, listados paginados. |

- **R-FLU-10** — Toda operación DEBE ejecutar sus comprobaciones en tres fases y en este orden: (1) validar los parámetros, (2) validar la lógica, (3) sanear la respuesta. Una fase NO DEBE empezar si la anterior ha fallado.
- **R-FLU-11** — Dentro de la validación de la lógica, las comprobaciones DEBERÍAN ordenarse de menor a mayor coste: en memoria, almacenamiento propio, servicios externos y, al final, escrituras. Si ese orden revelara información a quien no tiene permiso (por ejemplo, 404 frente a 403), la autorización DEBE ir primero.
- **R-FLU-12** — La respuesta DEBE construirse por lista blanca: el DTO de salida enumera explícitamente cada campo. NO DEBE serializarse una entidad, un modelo de persistencia ni un objeto completo.
- **R-FLU-13** — El escapado o la codificación de la salida (HTML, CSV, *shell*) DEBE hacerse en presentación, según el destino, y no al guardar los datos.
- **R-FLU-14** — La entrada NO DEBE corregirse en silencio para hacerla válida: se valida y, si no cumple, se rechaza. Solo PUEDEN aplicarse las normalizaciones declaradas en el esquema, como recortar espacios o pasar un email a minúsculas.

### 4.3 Objetos en cada frontera

| Frontera | Entra | Sale | Mapea |
|---|---|---|---|
| Exterior → Presentación | Carga útil sin tipar | DTO de petición validado | Presentación |
| Presentación → Aplicación | Comando o consulta inmutable (primitivos o identificadores) | `Result<DTO, AppError>` | Presentación (entrada), aplicación (salida) |
| Aplicación ↔ Dominio | Entidades, value objects | Entidades, value objects, errores de dominio | Aplicación |
| Aplicación ↔ Infraestructura | Tipos de dominio vía interfaces | Tipos de dominio | Infraestructura |
| Presentación → Exterior | DTO o `AppError` | Respuesta del protocolo | Presentación |

- **R-FLU-03** — Las entidades de dominio NO DEBERÍAN salir de la capa de aplicación. La presentación recibe DTO de salida.
- **R-FLU-04** — Los comandos, las consultas y los DTO DEBEN ser inmutables y contener solo datos, sin comportamiento.
- **R-FLU-05** — Cada *mapper* DEBE vivir en la capa exterior de la frontera que traduce y DEBE ser una función pura.

### 4.4 Transacciones, lecturas y eventos

- **R-FLU-06** — Si un caso de uso devuelve un error esperado, la unidad de trabajo DEBE descartar los cambios. Si lanza una excepción, DEBE revertirlos.
- **R-FLU-07** — Las consultas de solo lectura PUEDEN resolverse con un servicio de consulta (*query service*) definido como interfaz en la aplicación e implementado en infraestructura, que devuelve DTO directamente sin pasar por entidades de dominio. Las operaciones de escritura NO DEBEN usar este atajo.
- **R-FLU-09** — El dominio DEBE limitarse a registrar eventos. La publicación DEBE hacerla la aplicación, a través de un puerto, después de confirmar la transacción. Si la entrega tiene que estar garantizada, la infraestructura DEBERÍA usar el patrón *outbox*.

---

## 5. Errores

### 5.1 Taxonomía

| `kind` | Significado | Esperado | Origen | Mecanismo | HTTP | UI | Log | Reintentar |
|---|---|---|---|---|---|---|---|---|
| `validation` | Forma de la entrada incorrecta | Sí | Presentación | `Result` / lanzado en el controlador | 400 | Marcar cada campo | `debug` | No |
| `unauthorized` | Sin identidad válida | Sí | Presentación | `Result` | 401 | Ir al inicio de sesión | `info` | Tras autenticarse |
| `forbidden` | Identidad sin permiso | Sí | Aplicación | `Result` | 403 | «No tienes permiso» | `warn` | No |
| `not_found` | El recurso no existe | Sí | Aplicación | `Result` | 404 | «No encontrado» y volver | `info` | No |
| `conflict` | Duplicado o modificación concurrente | Sí | Aplicación o infraestructura | `Result` (la infraestructura lo lanza y la aplicación lo captura si es parte de su contrato) | 409 | «Los datos han cambiado» y recargar | `info` | Tras recargar |
| `domain_rule` | Regla de negocio incumplida | Sí | Dominio | `Result` | 422 | Texto según el `code` | `info` | No |
| `infrastructure` | Falla una dependencia externa | No | Infraestructura | Excepción | 503 | «Servicio no disponible» | `error` | Sí, con espera |
| `unexpected` | *Bug* o situación imposible | No | Cualquiera | Excepción | 500 | «Ha ocurrido un error» + `requestId` | `error` | No |

La columna HTTP solo aplica si la presentación es HTTP. En HTTP, el formato es *Problem Details* (RFC 9457, `application/problem+json`) con las extensiones `code`, `requestId` y, en `validation`, `errors: [{ path, code, message }]`.

### 5.2 Qué hace cada capa

| Capa | Produce | Captura | Traduce |
|---|---|---|---|
| Dominio | `DomainError` en `Result` | Nada | Nada |
| Aplicación | `NotFoundError`, `ForbiddenError`, `ConflictError` en `Result`; propaga los `Result` del dominio | Solo las excepciones tipadas que formen parte de su contrato | Nada; deja subir las excepciones técnicas |
| Infraestructura | `InfrastructureError`, `ConflictError` (lanzados) | Todas las excepciones de librería | Excepción de librería → `AppError` con `cause` |
| Presentación | `ValidationError`, `UnauthorizedError` | Todo, en el manejador global | `AppError` → protocolo; cualquier otra cosa → `UnexpectedError` |

Si el framework ofrece un punto de enganche global para errores (*middleware*, filtro, interceptor), el manejador global se registra ahí.

### 5.3 Reglas de errores

- **R-ERR-01** — Todo error que cruce una frontera de capa DEBE ser una instancia de `AppError` (o de una subclase), con `kind` y `code`.
- **R-ERR-02** — Los `code` DEBEN ser estables, estar escritos en SCREAMING_SNAKE_CASE, llevar el prefijo del módulo (`ORDER_`, `USER_`) y estar definidos en un catálogo por módulo. Cambiar un código publicado es un cambio incompatible.
- **R-ERR-03** — Cuando se crea un error a partir de otro, DEBE conservarse el original en `cause`.
- **R-ERR-04** — `details` NO DEBE contener secretos, contraseñas, *tokens* ni datos personales sensibles.
- **R-ERR-05** — El proyecto DEBE aplicar una única política para los errores esperados en todos sus módulos. La política recomendada es `Result`. Si el lenguaje o el equipo prefieren excepciones tipadas, PUEDEN usarlas, siempre con la misma jerarquía `AppError` y documentando la decisión.
- **R-ERR-06** — Los errores de tipo `infrastructure` y `unexpected` DEBEN propagarse como excepciones, con cualquier política.
- **R-ERR-07** — NO DEBE devolverse `null`, `undefined`, `-1` ni `false` para indicar un error. `null` solo significa ausencia legítima (por ejemplo, `findById` sin resultado), y la capa que lo recibe decide si eso es un `not_found`.
- **R-ERR-08** — La traducción de los errores al protocolo y su registro en los logs DEBEN hacerse en un único manejador global de presentación. Las capas interiores NO DEBEN registrar un error y además relanzarlo, porque así se duplica en los logs.
- **R-ERR-09** — NO DEBE haber bloques `catch` vacíos ni bloques que lo capturen todo sin traducir ni relanzar.
- **R-ERR-10** — El dominio NO DEBE conocer códigos HTTP, códigos de salida ni textos de interfaz.
- **R-ERR-11** — Los textos que ve el usuario final DEBEN resolverse en presentación a partir del `code`, mediante un catálogo de mensajes o i18n. NO DEBEN depender del texto de `message`.
- **R-ERR-12** — Las respuestas de error de tipo `infrastructure` y `unexpected` NO DEBEN incluir trazas de pila, SQL, nombres de tablas, *hosts* ni mensajes de librerías. Solo un texto genérico y el `requestId`.
- **R-ERR-13** — La validación de forma DEBE acumular todos los errores de campo y devolverlos juntos, no solo el primero.
- **R-ERR-14** — Las reglas de negocio NO DEBEN reimplementarse en presentación. Si la interfaz las repite para dar una respuesta inmediata al usuario, el dominio sigue siendo la fuente de verdad y siempre vuelve a comprobarlas.
- **R-ERR-15** — Todo error registrado DEBE incluir el `requestId`, y el mismo identificador DEBE devolverse al cliente.
- **R-ERR-16** — Los logs NO DEBEN contener contraseñas, *tokens*, números de tarjeta ni datos personales sin enmascarar.

Trazabilidad: reutiliza el `requestId` si llega en una cabecera; si no, genéralo. Propágalo con el mecanismo de contexto del lenguaje o del entorno de ejecución, inclúyelo en cada línea de log y en cada llamada saliente. Los logs son JSON con `timestamp`, `level`, `requestId`, `kind`, `code` y `module`.

---

## 6. Paradigmas y firmas

**Núcleo funcional, cáscara imperativa.** Las decisiones (reglas, cálculos, validaciones, *mappers*) son funciones puras sobre datos inmutables. La coordinación y los efectos (E/S, recursos, dependencias) son objetos o funciones fábrica con dependencias inyectadas. Las entidades combinan estado encapsulado y funciones puras.

| Capa | Orientado a objetos | Funcional | Efectos |
|---|---|---|---|
| Presentación | Controladores y *view-models* con el caso de uso inyectado | Esquemas, *presenters*, formateo | Sí: E/S del protocolo |
| Aplicación | Caso de uso con dependencias en el constructor | Flujo con `Result`, *mappers*, comandos inmutables | Solo a través de puertos |
| Dominio | Entidades con invariantes | Value objects, políticas, cálculos, servicios sin estado | Ninguno |
| Infraestructura | Adaptadores que implementan interfaces | *Mappers* fila ↔ entidad | Sí |
| Shared | Jerarquía de errores | `Result`, utilidades puras | Ninguno |

Son efectos secundarios: E/S (base de datos, ficheros, red, consola, colas), leer el reloj, generar valores aleatorios o identificadores, leer o modificar estado global mutable y leer variables de entorno. En el dominio, la hora y los identificadores entran como parámetro (`isExpiredAt(now)`, no `isExpired()` con `new Date()`) o a través de un puerto (`Clock`, `IdGenerator`).

- **R-PAR-01** — El dominio DEBE estar libre de efectos secundarios. La hora, los identificadores y los valores aleatorios DEBEN llegar como parámetros o a través de puertos inyectados.
- **R-PAR-02** — Los cálculos, las reglas sin estado, las validaciones y los mapeos DEBEN implementarse como funciones puras.
- **R-PAR-03** — Los value objects, comandos, consultas, DTO y eventos DEBEN ser inmutables. Una operación sobre ellos devuelve una instancia nueva.
- **R-PAR-04** — Las entidades PUEDEN tener estado mutable, pero ese estado solo DEBE cambiar a través de métodos que comprueben sus invariantes. Sus colecciones internas NO DEBEN exponerse de forma mutable.
- **R-PAR-05** — Los componentes con dependencias (controladores, casos de uso, repositorios, clientes) DEBEN recibirlas desde fuera: por constructor si son objetos, o como argumento de una función fábrica si son funciones. NO DEBEN usar *singletons* globales ni localizadores de servicios.
- **R-PAR-06** — La herencia DEBERÍA limitarse a la jerarquía de errores y a lo que exija el framework. Para reutilizar comportamiento se prefieren la composición o las funciones.
- **R-PAR-07** — El estado compartido mutable (cachés, *pools*, contadores) solo PUEDE existir en infraestructura o en platform, y DEBE ser seguro ante la concurrencia.
- **R-PAR-08** — Un proyecto DEBE elegir un estilo único para construir los casos de uso (clases o funciones fábrica) y aplicarlo en todos los módulos.

**RORO** (*Receive an Object, Return an Object*): la función recibe un único objeto con parámetros nombrados y, si produce varios valores, devuelve un objeto con nombre. `Result` ya es un objeto, así que `Result<DTO>` cumple RORO en la salida.

- **R-PAR-09** — Los casos de uso, los métodos de puertos con más de un parámetro y las fábricas de entidades y value objects con más de dos campos DEBEN seguir RORO: un único objeto de entrada, tipado e inmutable.
- **R-PAR-10** — Cualquier otra función DEBERÍA seguir RORO cuando tenga tres o más parámetros, algún parámetro booleano, parámetros opcionales o dos o más parámetros del mismo tipo.
- **R-PAR-11** — RORO NO DEBERÍA usarse en funciones puras de uno o dos parámetros con significado evidente, en *callbacks* de `map` / `filter` / `reduce` ni en código de rendimiento crítico.
- **R-PAR-12** — El objeto de entrada DEBE tener un tipo con nombre que distinga los campos obligatorios de los opcionales, y los valores por defecto DEBEN declararse en un único sitio (la firma o el esquema).
- **R-PAR-13** — Una función DEBERÍA devolver un objeto con nombre cuando produce más de un valor o cuando es previsible que su salida crezca. Si devuelve un único valor de significado evidente, PUEDE devolver un primitivo.

Equivalencias por lenguaje: dato inmutable = `Readonly<T>` / `@dataclass(frozen=True)` / `record` / `data class` con `val` / `struct` por valor. Puerto = `interface` / `Protocol`. `Result` = unión discriminada / `sealed class` / `(T, error)` en Go / `{:ok, v} | {:error, e}`. Sin clases: caso de uso = función fábrica que recibe las dependencias y devuelve la función `execute`.

---

## 7. Pruebas

| Capa | Tipo | Dobles | Verifica |
|---|---|---|---|
| Dominio | Unitarias puras (por propiedades si son cálculos) | Ninguno | Reglas, invariantes, errores de dominio |
| Aplicación | Unitarias de caso de uso | *Fakes* en memoria de los puertos | Orquestación, resultado, estado guardado, errores esperados, transacción |
| Infraestructura | Integración | Tecnología real en un contenedor o entorno efímero | Consultas, mapeos de ida y vuelta, traducción de errores |
| Presentación | Contrato o API | Caso de uso sustituido por un *stub* | Validación, códigos de estado, formato de respuesta y de error |
| Sistema | Extremo a extremo (pocas) | Ninguno | Flujos críticos |
| Arquitectura | Reglas de importación | — | Fronteras (R-EST-06) |

Usa el marco de pruebas que ya tenga el proyecto.

- **R-TST-01** — Toda regla de negocio del dominio DEBE tener al menos una prueba unitaria sin dobles.
- **R-TST-02** — Las pruebas de aplicación DEBERÍAN usar *fakes* en memoria que implementen las interfaces reales, en lugar de *mocks* que verifican llamadas internas.
- **R-TST-03** — Cada implementación de repositorio DEBE tener pruebas de integración contra la tecnología real, incluida la traducción de errores (R-INF-03).
- **R-TST-04** — Cada código de error esperado de un caso de uso DEBERÍA tener una prueba que lo provoque.
- **R-TST-05** — Las pruebas DEBERÍAN ubicarse según la convención del proyecto (junto al código o en un árbol paralelo). Si no hay convención, DEBERÍAN reproducir la estructura del código que prueban.

---

## 8. Plantillas de código

Patrones de referencia. Adáptalos al lenguaje, a las convenciones y a las librerías del proyecto; no los copies literalmente si el proyecto ya tiene un equivalente.

```typescript
// [shared] errores y Result
export type ErrorKind =
  | "validation" | "unauthorized" | "forbidden" | "not_found"
  | "conflict" | "domain_rule" | "infrastructure" | "unexpected";

export abstract class AppError extends Error {
  abstract readonly kind: ErrorKind;
  constructor(
    readonly code: string,                                     // estable, SCREAMING_SNAKE_CASE
    message: string,                                           // para desarrolladores y logs
    readonly details: Readonly<Record<string, unknown>> = {},  // sin secretos
    options?: { cause?: unknown },
  ) { super(message, options); this.name = new.target.name; }
}
export type FieldIssue = Readonly<{ path: string; code: string; message: string }>;
export class ValidationError extends AppError {
  readonly kind = "validation" as const;
  constructor(readonly fields: ReadonlyArray<FieldIssue>) {
    super("VALIDATION_FAILED", "La entrada no es válida", { fields });
  }
}
export class NotFoundError       extends AppError { readonly kind = "not_found" as const; }
export class ConflictError       extends AppError { readonly kind = "conflict" as const; }
export class DomainError         extends AppError { readonly kind = "domain_rule" as const; }
export class InfrastructureError extends AppError { readonly kind = "infrastructure" as const; }
// UnauthorizedError, ForbiddenError: mismo patrón.
export class UnexpectedError extends AppError {
  readonly kind = "unexpected" as const;
  constructor(cause: unknown) { super("UNEXPECTED", "Error inesperado", {}, { cause }); }
}

export type Result<T, E = AppError> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
export const ok  = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
```

```typescript
// [dominio · orders] catálogo de errores del módulo
export const OrderErrors = {
  notFound: (id: string) =>
    new NotFoundError("ORDER_NOT_FOUND", `El pedido ${id} no existe`, { orderId: id }),
  notEditable: (id: string) =>
    new DomainError("ORDER_NOT_EDITABLE", "Solo se pueden modificar pedidos en borrador", { orderId: id }),
} as const;

// [dominio · orders] entidad: invariantes dentro, sin setters, sin E/S
export class Order {
  private constructor(
    readonly id: OrderId, readonly currency: Currency,
    private _lines: readonly OrderLine[], private _status: OrderStatus, readonly version: number,
  ) {}
  static draft({ id, currency }: DraftOrderProps): Order { return new Order(id, currency, [], "draft", 0); }
  static restore(p: OrderProps): Order { return new Order(p.id, p.currency, p.lines, p.status, p.version); }

  get lines(): readonly OrderLine[] { return this._lines; }
  total(): Money { return orderTotal(this._lines, this.currency); }       // delega en una función pura

  ensureEditable(): Result<void, DomainError> {
    return this._status === "draft" ? ok(undefined) : err(OrderErrors.notEditable(this.id));
  }
  addLine(line: OrderLine): Result<void, DomainError> {
    const editable = this.ensureEditable();
    if (!editable.ok) return editable;
    this._lines = [...this._lines, line];                              // mutación controlada
    return ok(undefined);
  }
}
```

```typescript
// [aplicación · orders] caso de uso: comando → Result<DTO>, dependencias inyectadas, orden por coste
export type AddOrderLineCommand = Readonly<{ orderId: string; productId: string; quantity: number }>;
export type OrderSummary = Readonly<{ orderId: string; lineCount: number; totalCents: number; currency: string }>;

export class AddOrderLine {
  constructor(
    private readonly orders: OrderRepository,     // interfaz del dominio
    private readonly products: ProductCatalog,    // puerto de aplicación
    private readonly uow: UnitOfWork,             // confirma si ok; descarta si error o excepción
  ) {}

  execute(cmd: AddOrderLineCommand): Promise<Result<OrderSummary>> {
    return this.uow.run(async () => {
      const order = await this.orders.findById(OrderId(cmd.orderId));            // 2b
      if (!order) return err(OrderErrors.notFound(cmd.orderId));
      const editable = order.ensureEditable();                                   // 2b, antes de lo externo
      if (!editable.ok) return editable;
      const product = await this.products.findById(ProductId(cmd.productId));   // 2c
      if (!product) return err(ProductErrors.notFound(cmd.productId));
      const added = order.addLine({ productId: product.id, unitPrice: product.price, quantity: cmd.quantity });
      if (!added.ok) return added;
      await this.orders.save(order);                                             // 2d
      return ok(toOrderSummary(order));                                          // 3: lista blanca
    });
  }
}

export const toOrderSummary = (o: Order): OrderSummary => ({
  orderId: o.id, lineCount: o.lines.length, totalCents: o.total().cents, currency: o.currency,
});
```

```typescript
// [infraestructura · orders] repositorio: implementa la interfaz y traduce las excepciones
export class SqlOrderRepository implements OrderRepository {
  constructor(private readonly db: Database) {}

  async findById(id: OrderId): Promise<Order | null> {
    try {
      const row = await this.db.one<OrderRow>("SELECT * FROM orders WHERE id = $1", [id]);
      return row ? OrderMapper.toDomain(row) : null;                  // null = ausencia legítima
    } catch (e) {
      throw new InfrastructureError("DB_READ_FAILED", "No se pudo leer el pedido", { orderId: id }, { cause: e });
    }
  }

  async save(order: Order): Promise<void> {
    try {
      await this.db.upsert("orders", OrderMapper.toRow(order), { expectedVersion: order.version });
    } catch (e) {
      if (isVersionMismatch(e))
        throw new ConflictError("ORDER_STALE", "El pedido fue modificado", { orderId: order.id }, { cause: e });
      throw new InfrastructureError("DB_WRITE_FAILED", "No se pudo guardar el pedido", { orderId: order.id }, { cause: e });
    }
  }
}
```

```typescript
// [presentación · orders] controlador delgado: valida la forma, invoca un caso de uso, presenta
export class OrderController {
  constructor(private readonly addOrderLine: AddOrderLine) {}

  async addLine(req: HttpRequest): Promise<HttpResponse> {
    const parsed = validate(AddLineRequestSchema, req.body);          // acumula todos los FieldIssue
    if (!parsed.ok) throw new ValidationError(parsed.error);
    const result = await this.addOrderLine.execute({ orderId: req.params.orderId, ...parsed.value });
    if (!result.ok) throw result.error;                               // lo traduce el manejador global
    return { status: 200, body: presentOrderSummary(result.value) };
  }
}

// [platform] manejador global: único punto de traducción y registro
const HTTP_STATUS: Record<ErrorKind, number> = {
  validation: 400, unauthorized: 401, forbidden: 403, not_found: 404,
  conflict: 409, domain_rule: 422, infrastructure: 503, unexpected: 500,
};

export function toProblemResponse(error: unknown, req: HttpRequest, logger: Logger): HttpResponse {
  const e = error instanceof AppError ? error : new UnexpectedError(error);
  const status = HTTP_STATUS[e.kind];
  const isServerError = status >= 500;
  logger[isServerError ? "error" : "info"]("request_failed", {
    requestId: req.id, kind: e.kind, code: e.code, path: req.path,
    ...(isServerError ? { cause: e.cause, stack: e.stack } : {}),
  });
  return {
    status,
    headers: { "content-type": "application/problem+json" },
    body: {
      type: `https://api.example.com/errors/${e.code.toLowerCase().replaceAll("_", "-")}`,
      title: TITLES[e.kind], status, instance: req.path, code: e.code, requestId: req.id,
      detail: isServerError ? "Error interno. Indica la referencia al soporte." : e.message,
      ...(e instanceof ValidationError ? { errors: e.fields } : {}),
    },
  };
}
```

---

## 9. Implementación y verificación

### 9.1 Receta para una funcionalidad

De dentro hacia fuera. Cada paso compila y tiene sus pruebas antes de pasar al siguiente. Cada archivo va donde diga el mapa e imita a sus vecinos.

1. **Dominio:** reglas nuevas como métodos de la entidad o funciones puras; códigos de error en el catálogo del módulo; pruebas unitarias sin dobles.
2. **Aplicación:** comando, DTO de salida y caso de uso (verbo + objeto). Un puerto nuevo si hace falta algo externo. Pruebas con *fakes*.
3. **Infraestructura:** implementación de los repositorios o puertos nuevos, con traducción de errores. Pruebas de integración.
4. **Presentación:** esquema de entrada, operación que invoca el caso de uso y *presenter*. Si el framework impone la ubicación, se respeta y se mantiene delgado.
5. **Composición:** conectar las piezas en la raíz de composición o en el contenedor de inyección del framework.

En un proyecto nuevo, antes del paso 1: decidir la variante, la organización, la política de errores y el estilo de los casos de uso (registrarlo en un ADR y en el mapa); declarar el mapa de capas; preparar shared y platform reutilizando lo que ofrezca el framework; configurar la verificación de fronteras en CI. Después del paso 5: `requestId`, logs estructurados y métricas por caso de uso y por `kind`.

### 9.2 Verificación final

Comprueba cada punto. Si falla, corrige o informa del ID.

| Comprobación | Reglas |
|---|---|
| Cada archivo nuevo está en la capa correcta y en la ruta que el mapa asigna a esa capa | R-EST-07, R-AGT-03 |
| No se ha movido, renombrado ni reorganizado nada existente sin petición explícita | R-EST-04, R-AGT-02 |
| Los archivos impuestos por el framework son delgados | R-EST-08 |
| Los imports cumplen la matriz de la sección 2.2; no hay ciclos ni imports de internos de otros módulos | R-FLU-02, R-GEN-04, R-EST-02, R-DOM-01, R-PRE-04, R-SHR-01 |
| Una operación de presentación → un caso de uso; comando inmutable → DTO o `Result` | R-PRE-03, R-APL-02 |
| Ninguna entidad ni modelo de persistencia sale de su capa; el DTO se construye por lista blanca | R-FLU-03, R-INF-02, R-FLU-12 |
| Transacción en la aplicación mediante la unidad de trabajo; dependencias creadas solo en la raíz | R-APL-05, R-FLU-08 |
| Orden: parámetros → lógica (de menor a mayor coste) → saneamiento | R-FLU-10, R-FLU-11 |
| Errores nuevos con `AppError` y un `code` catalogado; los esperados según la política, los técnicos lanzados | R-ERR-01, R-ERR-02, R-ERR-05, R-ERR-06 |
| La infraestructura traduce y conserva `cause`; no hay `catch` vacíos ni registros duplicados | R-INF-03, R-ERR-03, R-ERR-08, R-ERR-09 |
| La respuesta de error no expone detalles internos e incluye el `requestId` | R-ERR-12, R-ERR-15 |
| Dominio sin efectos; value objects, DTO y comandos inmutables; entidades sin *setters* | R-PAR-01, R-PAR-03, R-DOM-03 |
| RORO donde es obligatorio | R-PAR-09 |
| Pruebas para cada regla nueva y cada código de error esperado | R-TST-01, R-TST-04 |
| No se han añadido librerías que el proyecto ya cubría | R-AGT-04 |

---

## 10. Antipatrones

| Antipatrón | Síntoma | Corrección |
|---|---|---|
| Controlador gordo | Reglas, transacciones o consultas en el controlador | Caso de uso + dominio (R-PRE-02) |
| Modelo anémico | Entidades con solo *getters* y *setters*; los `if` del negocio en servicios | Reglas en la entidad o en funciones de dominio (R-DOM-02, R-DOM-03) |
| Fuga del ORM | Entidades ORM usadas como dominio o devueltas por la API | Modelo de persistencia separado + *mapper* (R-INF-02) |
| Repositorio genérico | Expone un constructor de consultas, SQL o filtros arbitrarios | Métodos con intención: `findPendingByCustomer` (R-DOM-05) |
| *Sinkhole* | Casos de uso que solo reenvían al repositorio | Variante ligera o servicio de consulta (R-FLU-07) |
| Lasaña | Abstracciones sin función | Cuatro capas como máximo; una interfaz solo si hay más de una implementación o hace falta para probar |
| Shared cajón de sastre | `utils` con lógica de negocio | Devolver el código al módulo (R-SHR-02, R-SHR-03) |
| Servicio dios | Un servicio con decenas de métodos | Un caso de uso por unidad (R-EST-03) |
| Configuración dispersa | Variables de entorno leídas por todo el código | Configuración validada al arrancar (R-SHR-04) |
| Dominio con reloj | `new Date()` o `uuid()` en las entidades | `Clock` o `IdGenerator`, o el valor como parámetro (R-PAR-01) |
| Log y relanzar | El mismo error repetido en los logs | Registrar solo en el manejador global (R-ERR-08) |
| Decidir por `message` | Lógica que depende del texto del error | Decidir por `code` (R-ERR-02, R-ERR-11) |
| 200 con `{"error": …}` o 500 para todo | Semántica del protocolo rota | Estado según el `kind` (sección 5.1) |
| Reestructuración por la guía | Carpetas movidas o renombradas para imitar los ejemplos | Mapa de capas sobre la estructura existente (R-EST-04, R-AGT-02) |
| Lógica en archivos del framework | Reglas o acceso a datos en un archivo de ruta o de pantalla | Mantenerlo delgado y delegar (R-EST-08) |

---

## Anexo. Plantilla del mapa de capas

Crea este archivo en el repositorio (por ejemplo, `AGENTS.md` o `.apm/instructions/mapa-de-capas.instructions.md`) con las rutas reales. La plantilla se adapta al proyecto, nunca al revés.

```markdown
---
description: Mapa de capas de este proyecto. Complementa la guía de arquitectura en capas.
applyTo: "**"
---

# Mapa de capas

Este proyecto sigue la guía «Arquitectura en capas». Estas rutas son la única
referencia válida para ubicar archivos.

| Rol | Ruta o glob | Notas |
|---|---|---|
| Presentación | | |
| Aplicación | | |
| Dominio | | |
| Infraestructura | | |
| Shared | | |
| Platform | | |
| Raíz de composición | | |
| Pruebas | | |

- Módulo: <cómo se reconoce> · API pública: <archivo o mecanismo>
- Impuesto por el framework: <ruta> → <rol> (<restricción>)
- Nombres de archivo: <convención> · Unidades por archivo: <una | varias>
- Variante: <ligera | completa> · Organización: <módulo+capa | solo capa>
- Errores esperados: <Result | excepciones tipadas> · Casos de uso: <clases | funciones fábrica>
- Verificación de fronteras: <herramienta y comando>
```
