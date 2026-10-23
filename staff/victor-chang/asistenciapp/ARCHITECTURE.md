# Arquitectura de AsistenciApp

> Versión 1.1 · Creada: 2026-10-23 · Se basa en la [CONSTITUTION.md](CONSTITUTION.md) v2.2 · Estado: **Aprobada por Victor (2026-10-23)**

Este documento es el **estándar de arquitectura, diseño y estilo** del proyecto. Se escribe como si todavía no existiera código: fija cómo se organiza y cómo se escribe **cualquier** feature, presente o futura. No describe ninguna implementación; si el código actual no lo cumple, el que se adapta es el código.

- La constitución dice *qué* principios se cumplen; este documento dice *cómo* se traducen al código. Si chocan, **gana la constitución**.
- El stack (Python, Flask, SQLite, HTML/CSS/JS sin frameworks, pytest) lo fija la constitución (§3); aquí solo se dice cómo se usa.
- Cada `plan.md` aplica estas reglas a su feature. Saltarse una exige **justificarlo por escrito** en ese plan: qué regla, por qué y hasta cuándo.
- Cambiar este documento sigue el proceso de la constitución (§8): cualquiera lo propone, Victor lo aprueba, y se anota en el historial.

**Cómo leer las reglas.** Cada regla tiene un identificador (`C2`, `E4`…) para citarla en planes, tareas y revisiones.
- **Debe / No debe**: obligatorio.
- **Debería**: recomendado. Se puede no cumplir si el `plan.md` explica por qué.

---

## 1. Principios de diseño

1. **Lo simple primero (P2).** La solución más simple que cumple la spec. La complejidad se justifica con un requisito real, nunca con un "por si acaso".
2. **Una responsabilidad por pieza.** Cada módulo y cada función tienen un único motivo para cambiar.
3. **Las reglas en el centro (P1).** Las reglas del negocio no dependen de la web, del almacenamiento ni de ninguna plataforma. Todo lo demás depende de ellas, y no al revés.
4. **Explícito mejor que implícito.** Lo que una pieza necesita se le pasa a la vista. Nada de estado global ni de "magia".
5. **Fallar pronto y con claridad.** Lo que llega de fuera se valida al entrar; los errores se explican en español y dicen qué hacer (constitución §5).
6. **Testable por diseño.** Si algo cuesta probar, el diseño está mal, no el test.
7. **Privacidad por diseño (P4).** Cada dato personal que entra necesita un motivo escrito en la spec, y ninguno sale sin él.

---

## 2. Capas (C)

| Capa | Responsabilidad | No puede |
| --- | --- | --- |
| **Dominio** | Las reglas del negocio y los tipos de datos que manejan. Código puro | Hacer E/S (red, disco, base de datos), leer el reloj, el entorno o la configuración |
| **Casos de uso** | Una acción completa de un usuario: carga los datos, aplica el dominio, guarda el resultado. Decide dónde empieza y acaba cada transacción | Conocer HTTP, JSON, ni ninguna plataforma |
| **Entrada** | Traducir entre el mundo exterior y los casos de uso: leer y validar lo que llega, llamar, responder | Decidir nada del negocio, ejecutar SQL |
| **Infraestructura** | Hablar con lo que está fuera: almacenamiento, programas y servicios externos, archivos generados | Importar casos de uso ni entradas |

**C1 · Las dependencias apuntan hacia el dominio.**

```
   Entrada  ──►  Casos de uso  ──►  Dominio
      │               │               ▲
      │               ▼               │
      └──(solo C5)─► Infraestructura ─┘ (usa sus tipos)
```

**C2 · La entrada es fina.** Un punto de entrada (ruta web, comando, mensaje de un bot) hace solo tres cosas: validar la forma de lo que llega (E1), llamar a **un** caso de uso y convertir el resultado o el error en una respuesta. Un `if` que decide algo del negocio no pertenece a la entrada.

**C3 · Una plataforma nueva es una entrada nueva (P1).** Cualquier fuente de datos o canal nuevo se añade como otra entrada (y, si hace falta, otra pieza de infraestructura) que llama a los **mismos casos de uso**. Las reglas no se duplican ni se adaptan a una plataforma.

**C4 · Un único punto de montaje.** La configuración se lee, y las piezas (almacenamiento, reloj, clientes externos) se crean y se conectan, en **un solo sitio**: la función de arranque (*composition root*). La aplicación se construye con una función fábrica que recibe todo eso **por parámetro**, para que los tests puedan montarla con piezas propias. Nada más en el código lee el entorno ni crea dependencias por su cuenta.

**C5 · Lecturas sin reglas.** Una consulta que solo lee y no aplica ninguna regla del negocio puede llamarse desde la entrada directamente a una función de consulta de la infraestructura, sin caso de uso intermedio. En cuanto la lectura decide algo (qué se muestra según un estado, un permiso, una fecha), pasa a ser un caso de uso.

---

## 3. Estructura del proyecto (O)

**O1 · Estructura fija desde el primer día.**

```
asistenciapp/
├── app.py                 # arranque: lee la configuración, monta las piezas y lanza (C4)
├── <paquete>/             # código de la aplicación (nombre en inglés)
│   ├── __init__.py
│   ├── config.py          # el tipo Config y su lectura del entorno (F5)
│   ├── domain/            # reglas y tipos (sin E/S)
│   ├── usecases/          # una acción de usuario por función
│   ├── entrypoints/       # web/ y, si llegan, otras entradas (cli, bots…)
│   └── infra/             # almacenamiento, programas externos, archivos generados
├── static/                # frontend (§9)
├── tests/
├── specs/NNN-nombre/      # spec.md, plan.md, tasks.md
├── data/                  # datos locales (no se sube a git)
└── requirements.txt
```

- Cada capa es un subpaquete **aunque tenga un solo módulo**: así dónde va cada pieza nunca es una decisión.
- Dentro de una capa, un módulo por concepto (`domain/<concepto>.py`, `infra/<recurso>.py`).
- Nunca más de **dos niveles** de carpetas dentro del paquete.

**O2 · Nombres que no tapan nada.** Ningún módulo se llama como uno de la biblioteca estándar ni de una dependencia (`csv`, `json`, `secrets`, `logging`, `flask`…).

---

## 4. Módulos, funciones y tipos (M)

**M1 · Un concepto por módulo.** Un archivo **debería** dividirse al pasar de **~300 líneas** o cuando cambia por motivos que no tienen que ver entre sí.

**M2 · Funciones cortas y con un propósito.** Una función **debería** dividirse si pasa de **~40 líneas**, anida más de **3 niveles** o hace varias cosas que se pueden describir por separado. Esto incluye las funciones fábrica: las rutas y los manejadores se registran desde funciones separadas, no se escriben todos dentro de una sola.

**M3 · Funciones antes que clases.** La forma por defecto es una función de módulo. Se usa una clase solo para un **tipo de datos** (M4), una **excepción** (E3) o cuando varias operaciones comparten **estado** de verdad.

**M4 · Los datos tienen forma conocida.** Lo que cruza de una capa a otra **debe** ser un tipo con campos con nombre (`dataclass`, preferiblemente `frozen=True`), no un diccionario ni una tupla suelta. Los diccionarios solo existen en los bordes: al leer de la base de datos y al construir una respuesta JSON.

**M5 · Dependencias por parámetro.** Lo que una función necesita (conexión, reloj, configuración, cliente externo) le llega como argumento.
- **No debe** haber variables globales con estado. Las constantes en `MAYÚSCULAS` sí se permiten.
- La **hora** llega siempre desde fuera, como un reloj inyectado (`Callable[[], datetime]` o similar). El dominio y los casos de uso **no deben** leer el reloj del sistema.

---

## 5. Datos y persistencia (D)

**D1 · Solo la infraestructura toca el almacenamiento.** Todo el SQL vive en `infra/`. Las funciones de almacenamiento convierten las filas en tipos del dominio (M4) antes de devolverlas.

**D2 · Consultas seguras.** Toda consulta **debe** usar parámetros (`?`). Nunca se construye SQL concatenando texto que venga de fuera.

**D3 · Transacciones en el caso de uso.** Toda escritura va dentro de una transacción, y la abre y la cierra el **caso de uso**: así lo que debe ocurrir junto ocurre junto. Las funciones de almacenamiento no confirman (`commit`) por su cuenta.

**D4 · Conexiones gestionadas por quien llama.** Las funciones de almacenamiento reciben una conexión abierta. Quien la abre la cierra, siempre con `with` (`contextlib.closing` en `sqlite3`, cuyo `with` no cierra) o con `try/finally`. En la web, una conexión por petición.

**D5 · El esquema se diseña antes de escribirlo.** Tablas, campos y restricciones se describen en el `plan.md`. Lo que **debe** cumplirse siempre (unicidad, no nulo, relaciones) se impone en la base de datos, no solo en el código. Un cambio a una tabla que ya tiene datos lleva su paso de migración, descrito en el plan.

**D6 · Fechas en UTC.** Las fechas se guardan y viajan en UTC, en ISO 8601. Solo se pasan a la hora local (de la configuración) al **mostrarlas** o **exportarlas**.

**D7 · Lo interno no sale tal cual.** Ningún tipo interno ni fila se devuelve hacia fuera directamente. Cada respuesta elige sus campos de forma explícita, para que un campo interno (un secreto, un dato personal) no pueda salir por descuido.

---

## 6. Fronteras e integraciones (F)

**F1 · El contrato se escribe antes que el código.** Cada ruta de la API (o comando, o mensaje) se define en el `plan.md` con lo que recibe, lo que devuelve, sus códigos de respuesta y sus errores.

**F2 · Un formato coherente.**
- La API recibe y devuelve JSON. Los campos van en `camelCase` hacia fuera y en `snake_case` dentro.
- Cada tipo tiene **una única** función que lo convierte a JSON (y, si entra, una que lo lee). Las rutas no montan respuestas a mano.

**F3 · Errores con el mismo formato siempre.** Toda respuesta de error de la API es JSON con la forma `{"error": "<mensaje>"}`, **incluidos** los errores inesperados, las rutas inexistentes y los métodos no permitidos. El cliente nunca recibe una página HTML de error.

**F4 · Lo externo, aislado y con límites.** Cada programa o servicio externo se usa desde **un único módulo** de `infra/`, que:
- pone siempre un **tiempo máximo** de espera;
- detecta **al momento** que el proceso termina o falla, sin esperar al tiempo máximo;
- libera lo que abrió (procesos, conexiones, hilos) tanto si va bien como si falla;
- traduce sus fallos a una excepción propia (E3).

**F5 · Configuración desde el entorno.** Lo que cambia según dónde se ejecuta (puerto, rutas de archivos, zona horaria, credenciales) se reúne en un tipo `Config` (`dataclass`) que se lee de variables de entorno en el arranque (C4), con valores por defecto razonables. Ningún secreto se escribe en el código ni se sube a git.

---

## 7. Errores, validación y registros (E)

**E1 · Validar la forma en la frontera.** La entrada comprueba todo lo que llega antes de usarlo:
- la **forma**: es un objeto y tiene los campos esperados;
- el **tipo**: texto es texto y número es número, **sin conversiones implícitas** (un número no se acepta donde se espera texto, ni al revés);
- el **formato**, con patrones explícitos y anclados (`fullmatch`). Para cifras se usa `[0-9]`, no `\d`, que acepta dígitos de cualquier alfabeto.

Lo que no cumple se rechaza con un error claro (`400`), nunca con un fallo interno.

**E2 · Validar el significado en el dominio.** Lo que depende de las reglas (un valor demasiado largo, algo caducado, un estado que no permite la acción) lo decide el dominio. El dominio recibe valores ya tipados y **comprueba igualmente sus propias reglas**, porque puede llamarlo cualquier entrada (C3).

**E3 · Excepciones con nombre.**
- Todo fallo que un usuario puede provocar es una excepción propia, y todas heredan de **una base común** del proyecto (p. ej. `AppError`) definida en el dominio.
- Cada una lleva su **mensaje para el usuario** como constante de la clase (E5).
- Se documentan en la sección `Raises:` de la función que las lanza.
- Las excepciones estándar (`ValueError`, `KeyError`…) **no** se usan para errores de usuario: si una llega a la entrada, es un error inesperado.
- **Nunca** se distingue un error comparando el texto de su mensaje.

**E4 · La traducción a la plataforma, en un solo sitio por entrada.** Las capas interiores lanzan excepciones del proyecto. Cada entrada tiene **una única tabla** que las convierte a lo que entiende su plataforma (en la web, excepción → código HTTP), y esa tabla se documenta en el `plan.md`. Las rutas no tienen `try/except` propios para errores del negocio.

**E5 · Mensajes para personas.** Los mensajes que ve el usuario:
- están en español (P6) y dicen qué ha pasado **y qué hacer** (constitución §5);
- nunca muestran detalles internos (trazas, SQL, rutas de archivos, texto de una excepción estándar);
- se definen una sola vez como constantes.

**E6 · Nunca tragarse un error.**
- **Prohibido** `except: pass` y `except Exception: pass`.
- Toda excepción capturada se gestiona, se vuelve a lanzar o se registra.
- Los errores inesperados se registran con su traza (`logger.exception`) y el usuario recibe un mensaje genérico.
- Al convertir una excepción en otra se encadena con `raise … from exc`; `from None` solo cuando la original no aporta nada.

**E7 · Registros sin datos personales (P4).**
- Se usa `logging` de la biblioteca estándar, con un `logger` por módulo (`logging.getLogger(__name__)`). `print` solo para lo que el programa enseña a quien lo arranca.
- Los registros pueden incluir identificadores técnicos. **No deben** incluir datos personales, IPs, cabeceras, credenciales ni el contenido de las peticiones. Esto incluye el registro de accesos del servidor web.

---

## 8. Seguridad y privacidad (X)

Concretan la constitución (P4 y §6):

- **X1** · Los secretos (tokens, claves) se generan con `secrets`, nunca con `random`.
- **X2** · Los secretos se comparan en tiempo constante (`hmac.compare_digest`), como bytes o como texto ASCII ya validado (E1).
- **X3** · Las rutas privadas exigen su credencial y la comprobación se hace **en un único sitio**, no ruta a ruta. Las credenciales viajan en cabeceras, nunca en la ruta ni en los parámetros de la URL que llegan al servidor.
- **X4** · Lo que escribe un usuario se guarda tal cual y se **escapa al mostrarlo**, según dónde se muestre: como texto en el navegador (§9) y neutralizando fórmulas en los archivos que se abren con una hoja de cálculo.
- **X5** · Del usuario solo entra lo que la spec pide. Cada dato personal nuevo exige una enmienda de P4.
- **X6** · El servidor escucha solo en la máquina local salvo que un `plan.md` justifique otra cosa. El acceso desde fuera pasa por un canal cifrado (P4).

---

## 9. Frontend (U)

- **U1 · Sin frameworks ni compilación (P3).** HTML, CSS y JavaScript servidos tal cual desde `static/`. Una página HTML por pantalla, con su propio archivo JS.
- **U2 · Lo que llega se pinta como texto.** Todo dato del servidor o del usuario se inserta con `textContent` o creando nodos; **nunca** con `innerHTML` ni plantillas de texto.
- **U3 · Una sola forma de llamar a la API.** Cada archivo JS hace sus peticiones a través de una única función que envía y lee JSON y convierte las respuestas de error (`{"error": …}`) y los fallos de red en un mensaje para el usuario.
- **U4 · Accesible y usable en móvil (P5).** Funciona a ~400 px de ancho, HTML semántico, cada campo con su `<label>`, todo usable con teclado, contraste suficiente, y los mensajes de estado se anuncian (`aria-live`).
- **U5 · El frontend no decide reglas.** Puede validar para ayudar al usuario, pero el servidor vuelve a validarlo todo (constitución §6).

---

## 10. Estilo de código (S)

**S1 · Nombres (PEP 8).** `snake_case` para módulos, funciones y variables; `PascalCase` para clases; `MAYÚSCULAS` para constantes. Nombres descriptivos y sin abreviaturas que oculten el significado. Identificadores en **inglés**; comentarios, docstrings y mensajes en **español** (P6).

**S2 · Tipos.**
- Toda función o método de módulo o de clase **debe** llevar anotaciones de tipo en sus parámetros y en el retorno (incluido `-> None`). Las funciones anidadas **deberían** llevarlas.
- Sintaxis moderna: `str | None`, `list[Item]`, `Callable[[], datetime]` (de `collections.abc`).
- Las colecciones indican el tipo de sus elementos (`list[Item]`, `dict[str, int]`, nunca `list` o `dict` a secas).

**S3 · Docstrings en español.**
- Todo módulo, clase y función pública tiene docstring. Una línea basta para lo simple; si hay parámetros no evidentes, valor de retorno o excepciones, se añaden `Args:`, `Returns:` y `Raises:`.
- El docstring de cada módulo cita la spec y la parte del plan que implementa (`spec 001 · plan §2.1 · CA-05`), para seguir el rastro spec → código.

**S4 · Comentarios que explican el porqué.** El código dice *qué* hace; un comentario explica *por qué* se hace así cuando no es evidente (una limitación externa, un error que se evita). No se deja código comentado.

**S5 · Imports.** Tres grupos separados por una línea en blanco: biblioteca estándar, terceros, proyecto. Siempre absolutos (`from <paquete>.domain import x`), nunca relativos.

**S6 · Formato.** Líneas de **120 caracteres** como máximo, comillas dobles, y cuando una llamada o definición no cabe en una línea, un argumento por línea con coma final.

**S7 · Recursos con `with`.** Archivos, conexiones, sockets, procesos y bloqueos se abren con `with` (o `try/finally`) para que se liberen aunque haya un error.

---

## 11. Tests (T)

**T1 · Cada criterio de aceptación tiene su test** (constitución §5), marcado con su identificador (`# CA-05`). Siempre que se pueda, el test se escribe primero y se ve fallar.

**T2 · Cada capa se prueba en su nivel.**

| Capa | Cómo se prueba |
| --- | --- |
| Dominio | Funciones puras, sin base de datos ni web. La mayoría de los tests van aquí |
| Casos de uso | Con una base de datos **real** y temporal, y un reloj controlado por el test |
| Entrada | Con el cliente de pruebas del framework, sin levantar un servidor: contrato, códigos de respuesta y formato de error |
| Infraestructura | Almacenamiento con una base de datos temporal; programas externos con uno falso |

**T3 · Los caminos de error también se prueban.** Para cada dato que entra desde fuera, al menos un test con algo **vacío**, algo del **tipo equivocado** y algo con **formato raro** (otros alfabetos, demasiado largo). Y un test que compruebe que un error inesperado responde con el formato de F3.

**T4 · Simular solo lo externo.** Solo se sustituyen programas y servicios de fuera del sistema. Nuestras funciones no se simulan, salvo para provocar a propósito un error inesperado. El tiempo se controla con un reloj falso, nunca con esperas reales.

**T5 · Tests independientes y rápidos.** Cada test prepara sus datos y no depende del orden ni de la red. La batería completa **debería** tardar segundos.

**T6 · Dónde va cada test.** `tests/test_<módulo>.py` para dominio, casos de uso e infraestructura; `tests/test_web_<área>.py` para la entrada web, agrupando por recurso. Lo compartido (aplicación de prueba, reloj falso) vive en `tests/conftest.py`.

---

## 12. Cuándo se permite más complejidad

Patrones que el proyecto **no** usa de entrada (P2, P3), y la condición para adoptarlos. Adoptar uno exige justificarlo en un `plan.md` señalando que se cumple su condición.

| Patrón | Por qué no de entrada | Se adopta cuando… |
| --- | --- | --- |
| Interfaces (`Protocol`, clases abstractas) entre capas | Con una sola implementación, la interfaz no aporta nada | Hay una **segunda implementación real** |
| Clases repositorio o de servicio | Una clase sin estado es una función con más ceremonia (M3) | Varias operaciones comparten **estado** (p. ej. un cliente con sesión abierta) |
| Puertos y adaptadores completos, DTO en cada frontera, contenedor de dependencias | Multiplica los archivos sin resolver un problema real | Hay a la vez **varias entradas y varios almacenamientos** reales |
| Estructura `src/` y `__all__` | Pensados para bibliotecas que otros instalan | Otro proyecto necesita **importar** este paquete |
| ORM, Pydantic u otra biblioteca de validación o configuración | Dependencia nueva (P3) | La solución con la biblioteca estándar ya no basta, y el plan lo demuestra |
| Código asíncrono | Complejidad sin necesidad | Una integración lo **exige** (una biblioteca que solo funciona con `async`) |
| Framework o compilación en el frontend | Prohibido por P3 y §3 | Solo con enmienda de la constitución |

**Nunca, salvo enmienda de la constitución:** registrar datos personales para depurar (P4) ni escribir documentación en otro idioma (P6).

**Herramientas de desarrollo.** Según P3, las herramientas que solo se usan al desarrollar (p. ej. ruff para formato y estilo, mypy para tipos) no cuentan como dependencias ni necesitan justificarse en un `plan.md`. Si se adoptan, su configuración **debe** aplicar las reglas de este documento (S1, S2, S5, S6), no otras.

---

## 13. Lista de comprobación para revisar código

- [ ] ¿Cada pieza está en su capa y las dependencias apuntan hacia el dominio? (C1, O1)
- [ ] ¿El dominio está libre de E/S, reloj y configuración? (C1, M5)
- [ ] ¿Cada punto de entrada solo valida, llama a un caso de uso (o a una lectura sin reglas) y responde? (C2, C5)
- [ ] ¿La configuración y las piezas se montan en un único sitio? (C4, F5)
- [ ] ¿Módulos y funciones respetan los límites de tamaño? (M1, M2)
- [ ] ¿Los datos entre capas son tipos con nombre? (M4)
- [ ] ¿Todo el SQL está en `infra/`, con parámetros, y las transacciones las abre el caso de uso? (D1–D4)
- [ ] ¿Cada respuesta elige sus campos y se convierte en una única función? (D7, F2)
- [ ] ¿Se validan forma, tipo y formato de todo lo que entra, sin conversiones implícitas? (E1)
- [ ] ¿Los errores de usuario son excepciones del proyecto, traducidas en una única tabla por entrada? (E3, E4)
- [ ] ¿Todos los errores son JSON, en español y dicen qué hacer? (F3, E5)
- [ ] ¿Los registros están libres de datos personales? (E7)
- [ ] ¿Los datos se pintan como texto en el navegador? (U2, X4)
- [ ] ¿Las funciones tienen tipos y docstring con su rastro a la spec? (S2, S3)
- [ ] ¿Hay tests de los criterios y de los caminos de error, y solo se simula lo externo? (T1, T3, T4)
- [ ] ¿Se ha añadido alguna abstracción o dependencia sin cumplir su condición? (§12)
- [ ] ¿`pytest` está en verde?

---

## 14. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-23 | Versión inicial, aprobada por Victor | Fijar un estándar de arquitectura independiente de la implementación, como si se escribiera antes del código. Sustituye a un borrador no aprobado que estaba demasiado ligado al código actual. El código existente se adaptará en una feature aparte |
| 1.1 | 2026-10-23 | §12: la regla de las herramientas de desarrollo pasa a la constitución (P3, v2.2); aquí solo queda cómo se configuran | Que la regla viva donde se decide sobre dependencias y no haya contradicción entre documentos |
