# Spec 005 · Reorganizar documentos y arquitectura

> Estado: **Implementada** (2026-10-23) · Creada: 2026-10-23 · Issue: #307

La versión 1.1 ya juntó la constitución y la arquitectura en `docs/` y separó un primer corte del código. Esta ampliación sustituye ese corte por la estructura de abajo. Sigue la misma issue, la misma rama y la misma pull request. El plan y las tareas de la 1.1 no cubren esta ampliación: se reescriben después de aprobar este texto.

---

## 1. Problema

Quien mantiene la aplicación encuentra las reglas, las acciones y el guardado repartidos en módulos que no dicen la dirección de las dependencias. Una ruta del navegador comprueba la clase antes de que la acción lo haga. Algunas acciones reciben una conexión ya abierta y devuelven un resultado con una palabra (`closed`, `bad_code`) en vez de un error con nombre.

La constitución y la arquitectura ya están en `docs/`. El manual todavía no pide tipos, parámetros, resultado ni errores en las funciones públicas. La arquitectura documentada nombra módulos que esta ampliación retira.

Pasar lista tiene que seguir igual: mismas direcciones, mismos datos visibles, mismos mensajes y las mismas pantallas. La base que ya existe no se borra ni se vuelve a crear.

Hay tres entradas mal formadas que hoy rompen con un error genérico del servidor. No se corrigen aquí. Quedan escritas para una spec de validación propia, y no se presentan como resueltas porque la suite actual pase.

La ampliación ya implementada deja cuatro huecos en las pruebas y en el manual. Un código fijo puede salir por azar y hacer fallar un test. La fecha de la exportación se da por buena con una comparación que casi siempre pasa. El análisis de dependencias no demuestra que vea un `from … import` con alias o una importación relativa. A `create_app`, a las acciones y a la exportación les faltan tipos. La tabla de estado no incluye la spec 003, aunque sus documentos ya dicen que está implementada.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien mantiene esta aplicación** | Ver cuatro responsabilidades con una dirección clara: reglas, acciones, almacenamiento y entrada del navegador. |
| **Quien lee las instrucciones** | Que el manual, la arquitectura y los enlaces coincidan con esa estructura, y que las funciones públicas se puedan leer. |
| **Profesor y alumno** | Seguir pasando lista como hasta ahora, con los datos que ya tenían. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que mantiene esta aplicación, quiero la estructura final de carpetas y módulos de esta spec, para saber dónde vive cada responsabilidad.
- **HU-02**: Como persona que mantiene esta aplicación, quiero que las reglas de clase, código y nombre se comprueben sin el servidor web y sin una base abierta, para poder usarlas desde las acciones.
- **HU-03**: Como persona que mantiene esta aplicación, quiero las acciones de profesor y alumno en un solo lugar que reciba la ruta de los datos y lance errores con nombre, para que la entrada del navegador solo traduzca.
- **HU-04**: Como persona que mantiene esta aplicación, quiero el almacenamiento detrás de la ruta del archivo, cerrando siempre la conexión, para no dejar reglas ni respuestas del navegador ahí.
- **HU-05**: Como persona que mantiene esta aplicación, quiero las rutas en el arranque de la aplicación, para que conviertan los errores en las respuestas que ya existen.
- **HU-06**: Como persona que lee el manual, quiero normas de escritura aplicadas al código público, para entender cada función sin adivinar.
- **HU-07**: Como persona que lee la arquitectura y las instrucciones, quiero que describan esta estructura y conserven el sentido de lo ya escrito, para no seguir un camino retirado.
- **HU-08**: Como profesor o alumno, quiero que pasar lista siga igual, para que la reorganización no cambie la clase ni borre la lista guardada.
- **HU-09**: Como persona que mantiene esta aplicación, quiero ver escritos los tres fallos de entrada mal formada, para corregirlos en otra spec y no darlos por buenos.
- **HU-10**: Como persona que mantiene esta aplicación, quiero pruebas que no fallen por azar y una comprobación de dependencias que vea las formas reales de importar, para fiarme del resultado.
- **HU-11**: Como persona que lee el código público y la tabla de estado, quiero los tipos que faltan y la spec 003 en esa tabla, con el resultado que ya dicen sus documentos.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Estructura (HU-01)

- **CA-01**: **Dado** esta ampliación, **cuando** se mira el proyecto, **entonces** la organización es esta y no queda otro módulo con las responsabilidades movidas:

```text
asistenciapp/
├── AGENTS.md
├── README.md
├── docs/
│   ├── CONSTITUTION.md
│   └── ARCHITECTURE.md
├── specs/
├── requirements.txt
├── pytest.ini
├── app.py
├── asistencia/
│   ├── __init__.py
│   ├── domain/
│   │   ├── __init__.py
│   │   ├── codes.py
│   │   ├── names.py
│   │   └── session.py
│   ├── usecases/
│   │   ├── __init__.py
│   │   └── attendance.py
│   ├── storage/
│   │   ├── __init__.py
│   │   └── sqlite.py
│   ├── export.py
│   └── tunnel.py
├── static/
├── tests/
└── data/
    └── asistencia.db
```

- **CA-02**: **Dado** `data/`, la base, el entorno virtual y las cachés, **cuando** se mira qué entra en git, **entonces** siguen excluidos. La base sigue en `data/asistencia.db`, calculada desde la aplicación y no desde la carpeta de la terminal. Al arrancar se crea la carpeta si falta. `storage/` no guarda datos.

### Reglas (HU-02)

- **CA-03**: **Dado** los códigos y los nombres, **cuando** se buscan, **entonces** viven en `asistencia/domain/codes.py` y `asistencia/domain/names.py`.
- **CA-04**: **Dado** `asistencia/domain/session.py`, **cuando** se usa, **entonces** puede decir si una clase existe, si sigue abierta y si el código presentado vale, sin el servidor web y sin una base abierta.
- **CA-05**: **Dado** una clase que no existe, una clase cerrada o un código que no vale, **cuando** las reglas fallan, **entonces** hay un error distinto para cada caso. Las acciones los usan y la entrada del navegador los convierte en las respuestas que ya existían.
- **CA-06**: **Dado** el dominio, **cuando** se miran sus importaciones, **entonces** no depende del servidor web, de la base, del almacenamiento ni de las acciones.
- **CA-07**: **Dado** el traslado, **cuando** se termina, **entonces** no existe `rules.py` ni una función que solo cambie el nombre de otra sin añadir una regla.

### Acciones (HU-03)

- **CA-08**: **Dado** `asistencia/usecases/attendance.py`, **cuando** se lee, **entonces** reúne estas acciones: preparar el almacenamiento y obtener el token del profesor; ver la información pública de una clase; registrar; listar clases; abrir una clase; ver el detalle del profesor; cerrar; eliminar un registro; preparar la exportación.
- **CA-09**: **Dado** cada acción, **cuando** se ejecuta, **entonces** coordina las reglas y el almacenamiento. Las comprobaciones van dentro de la acción. Registrar comprueba que la clase exista, que esté abierta, el nombre y el código, sin depender de que una ruta lo haya hecho antes.
- **CA-10**: **Dado** las acciones, **cuando** se miran, **entonces** no usan el servidor web, ni la petición, ni la respuesta, ni una conexión guardada entre peticiones. No reciben una conexión abierta. Reciben la ruta del almacenamiento y los datos necesarios. Devuelven datos o lanzan los errores de las reglas. El reloj se puede sustituir en la prueba. Un registro nuevo o repetido devuelve el registro y si se creó, no una palabra de resultado.
- **CA-11**: **Dado** el traslado, **cuando** ya no hay quien los importe, **entonces** no existen `teacher.py` ni `student.py`.

### Almacenamiento (HU-04)

- **CA-12**: **Dado** `asistencia/storage/sqlite.py`, **cuando** se usa, **entonces** abre y cierra conexiones, crea las tablas, lee y escribe el token, y opera clases y registros. Cada función pública recibe la ruta y cierra la conexión también si hay un fallo.
- **CA-13**: **Dado** el almacenamiento, **cuando** se mira, **entonces** las consultas siguen parametrizadas, las claves foráneas siguen activas y un mismo nombre normalizado no se repite en la misma clase. No valida nombres ni códigos, no decide reglas y no responde al navegador. El esquema no cambia. Una base ya existente no se borra ni se reinicia.
- **CA-14**: **Dado** el traslado, **cuando** se termina, **entonces** no existe `db.py`.

### Entrada y arranque (HU-05)

- **CA-15**: **Dado** `app.py`, **cuando** se lee, **entonces** crea la aplicación, registra las rutas, comprueba al profesor, lee la petición, llama a las acciones, convierte el resultado en la respuesta actual y traduce los errores de las reglas a los mismos códigos y mensajes. También arranca el puerto y el túnel.
- **CA-16**: **Dado** `app.py`, **cuando** se mira, **entonces** no abre conexiones, no las guarda entre peticiones, no consulta la base y no repite reglas. `create_app(db_path, token, now)` sigue siendo la función pública que usan los tests.
- **CA-17**: **Dado** una respuesta al navegador, **cuando** se compara con la de antes, **entonces** los nombres de los campos siguen igual. La conversión a esos nombres, y la dirección pública del alumno, ocurren en esta capa. Las acciones no conocen esa dirección ni ese formato.
- **CA-18**: **Dado** el traslado, **cuando** se termina, **entonces** no existe `asistencia/http.py`.

### Datos y exportación (HU-04, HU-08)

- **CA-19**: **Dado** `asistencia/export.py`, **cuando** prepara la descarga, **entonces** recibe filas ya cargadas y no abre la base. El formato, el orden, las tildes y la protección frente a fórmulas de hoja de cálculo siguen igual.

### Escritura (HU-06)

- **CA-20**: **Dado** el manual, **cuando** se lee, **entonces** pide, para el código público reorganizado: un módulo que diga su responsabilidad; una función con una tarea y un nombre concreto; tipos en parámetros y resultados; parámetros, resultado y errores documentados; un ejemplo breve cuando ayude; nada de comentarios que solo repitan la línea siguiente; nada de abreviaturas ambiguas, funciones que solo pasan la llamada, ni lógica duplicada; explicaciones y mensajes en español.
- **CA-21**: **Dado** el código público reorganizado, **cuando** se lee, **entonces** cumple esas normas. Los textos de documentación usan `:param`, `:return`, `:rtype`, `:raises` y `Usage::` donde correspondan. No se añaden clases, interfaces, herramientas ni dependencias nuevas.

### Documentación (HU-07)

- **CA-22**: **Dado** `docs/ARCHITECTURE.md`, **cuando** se lee, **entonces** explica el dominio, las acciones, el almacenamiento y la entrada del navegador, la dirección de las dependencias y el recorrido de un registro.
- **CA-23**: **Dado** `AGENTS.md`, **cuando** se lee, **entonces** el árbol, las normas de escritura y la tabla de estado coinciden con esta ampliación, y la búsqueda de specs sigue limitada a esta aplicación.
- **CA-24**: **Dado** el README y las instrucciones con enlaces activos, **cuando** se siguen, **entonces** llegan a su sitio. Lo ya escrito como antecedente conserva su significado.
- **CA-25**: **Dado** la constitución, **cuando** se compara con esta ampliación, **entonces** no se enmienda. Los principios, la privacidad y el comportamiento del producto no cambian. El stack sigue siendo el mismo y la base sigue en `data/`.

### Comportamiento (HU-08)

- **CA-26**: **Dado** las pruebas que ya existían, **cuando** se actualizan las importaciones afectadas, **entonces** siguen cubriendo un registro válido, uno duplicado, un código incorrecto o caducado, una clase inexistente, una clase cerrada, el permiso del profesor, eliminar un registro y la exportación.
- **CA-27**: **Dado** las pruebas de arquitectura, **cuando** se ejecutan, **entonces** comprueban las dependencias reales. Pueden usar el analizador sintáctico de la biblioteca estándar; no basta buscar palabras sueltas. Comprueban que el dominio no depende del servidor web ni del almacenamiento, que las acciones pueden ejecutarse sin una petición, que el almacenamiento no importa reglas ni el servidor web, que `app.py` no abre conexiones y que los errores de las reglas se traducen a las respuestas actuales.
- **CA-28**: **Dado** esta ampliación, **cuando** se termina, **entonces** las direcciones, los datos visibles, los mensajes, el esquema y las pantallas siguen igual. No se añade un límite por dirección de red ni otra función de la clase. No se añade una herramienta ni una dependencia.

### Lo que queda fuera (HU-09)

- **CA-29**: **Dado** estos tres fallos, **cuando** se termina esta ampliación, **entonces** están escritos como tarea aparte y no se dan por corregidos: un cuerpo que es una lista provoca un error genérico del servidor; un nombre enviado como número provoca un error genérico del servidor; un código con cifras de ancho completo, como `１２３４`, provoca un error genérico del servidor.

### Correcciones de la ampliación (HU-10, HU-11)

- **CA-30**: **Dado** la prueba que rechaza un código, **cuando** se ejecuta muchas veces, **entonces** no usa un código de cuatro dígitos que el generador pueda producir. El valor es inválido siempre, sin cambiar cómo se generan ni cómo se aceptan los códigos.
- **CA-31**: **Dado** la prueba de caducidad, **cuando** se ejecuta, **entonces** el secreto y el reloj están elegidos para que el código de una ventana no coincida por azar con el de otra. La generación y la aceptación de códigos no se modifican para que el test pase.
- **CA-32**: **Dado** la hora de apertura que devuelve la exportación, **cuando** se compara con el reloj de la prueba, **entonces** es la fecha y la hora que la acción define para ese reloj. Una fecha distinta o un texto cualquiera hace fallar la prueba.
- **CA-33**: **Dado** el análisis de dependencias, **cuando** mira un archivo, **entonces** usa el analizador sintáctico de la biblioteca estándar y ve importaciones directas, importaciones con `from`, alias e importaciones relativas. `from asistencia import storage` cuenta como dependencia del almacenamiento. Hay pruebas pequeñas del propio detector para esas variantes. No se añade una dependencia externa. Siguen las mismas restricciones entre dominio, acciones, almacenamiento y entrada.
- **CA-34**: **Dado** `create_app`, las funciones públicas de `usecases/attendance.py` y `export.to_csv`, **cuando** se leen, **entonces** los parámetros y los resultados que aún no tenían tipo lo tienen. Entran la ruta, el token, el reloj invocable, las filas del CSV y la zona horaria. Los tipos son los de Python y su biblioteca estándar. Las llamadas y los tests actuales siguen valiendo. Los docstrings coinciden con esos tipos y con el comportamiento real.
- **CA-35**: **Dado** la tabla de estado de `AGENTS.md`, **cuando** se lee, **entonces** incluye las specs 001, 002, 003, 004 y 005. La fila de `003-aclarar-instrucciones-arranque` dice lo que ya dicen sus documentos: implementada el 2026-10-23, con T01–T03 hechas en el README, sin cambio de requisitos. No se inventa otra aprobación ni otra comprobación.

---

## 5. Fuera de alcance

- Cambiar cómo se pasa lista, las pantallas, las direcciones, los mensajes o el esquema.
- Borrar o reiniciar una base que ya existe.
- Corregir los tres fallos de CA-29. Su corrección es otra spec.
- Añadir un límite por dirección de red u otra función de la clase.
- Enmendar la constitución, o cambiar la privacidad.
- Añadir una clase, una interfaz, una herramienta o una dependencia que esta aplicación no necesite.
- Tocar archivos fuera de `staff/maria-osipuk/asistenciapp/`.
- Cambiar la estructura de carpetas, las rutas, los JSON, las pantallas, el esquema o la ubicación de la base.
- Cambiar `.gitignore`.
- Cambiar la generación o la aceptación de códigos para acomodar un test.

---

## 6. Preguntas abiertas

Ninguna. Las correcciones de pruebas, tipos y tabla de estado quedaron pedidas el 2026-10-23 sobre la misma issue #307. La fila de la spec 003 solo puede repetir «implementada el 2026-10-23» y «T01–T03 hechas en el README, sin cambio de requisitos».

No se propone enmienda de la constitución. La versión 2.2 no nombra los módulos que se retiran, deja la base en `data/` y no cambia los principios ni la privacidad.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-23 | Borrador inicial | Issue #307. A la espera del ok antes del plan |
| 1.0 | 2026-10-23 | Aprobada | Ok para pasar al plan |
| 1.1 | 2026-10-23 | Implementada | T01–T12 hechas; 87 tests pasan. Constitución y arquitectura en `docs/`. Primer corte en `rules.py`, `teacher.py`, `student.py`, `db.py` y `http.py` |
| 1.2 | 2026-10-23 | Borrador de ampliación | La estructura pasa a dominio, acciones, almacenamiento y entrada en `app.py`. A la espera del ok antes de reescribir el plan |
| 1.3 | 2026-10-23 | Ampliación aprobada | Ok para reescribir el plan. La 1.1 sigue hecha; este plan nuevo no la deshace |
| 1.4 | 2026-10-23 | Implementada | T01–T12 hechas; 89 tests pasan. Tres fallos de validación quedan escritos y sin corregir |
| 1.5 | 2026-10-23 | Borrador de correcciones | CA-30 a CA-35: pruebas sin azar, fecha de exportación, detector de importaciones, tipos que faltan y fila de la spec 003. A la espera del ok antes del plan |
| 1.6 | 2026-10-23 | Correcciones implementadas | Pedido directo de implementar CA-30 a CA-35. La arquitectura no cambia |
