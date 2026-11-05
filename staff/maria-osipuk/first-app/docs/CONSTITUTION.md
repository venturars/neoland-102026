# Constitución — First App

Esta constitución recoge el propósito, el alcance y los principios del proyecto. Los procedimientos, contratos concretos, comandos y rutas de implementación se mantienen en sus guías.

## 1. Propósito y alcance

First App es una aplicación educativa de gestión de usuarios. Su objetivo es aprender a separar responsabilidades y seguir el recorrido de los datos mediante código sencillo y comprensible.

Permite crear, buscar, listar, modificar y borrar usuarios, y realizar un recuento mediante clasificación local de nombres. Las operaciones se pueden utilizar desde terminal y Jupyter. El cliente web permite crear un usuario, seleccionar uno existente y modificar o borrar sus datos. El cliente REST permite crear, listar, ver, modificar y borrar usuarios por HTTP. El cliente Nest permite las mismas cinco operaciones por HTTP, con otra forma de construirlas. El cliente `node:http` permite esas cinco operaciones por HTTP sin framework y se documenta con cuadernos Jupyter propios. El cliente de escritorio permite crear, listar, ver, modificar y borrar usuarios desde una ventana propia. El cliente de Chrome permite crear, listar, ver, modificar y borrar usuarios desde una extensión, y muestra los errores en inglés. El cliente de VS Code permite crear, listar, ver, modificar y borrar usuarios desde una vista del editor. El recuento por género también se pide desde los clientes REST, Nest, de escritorio, de Chrome y de VS Code; los tres clientes con pantalla lo muestran en una pestaña, y el cliente web queda fuera porque su página no puede ejecutar el clasificador. Cada cliente es independiente de los demás.

La selección de usuario no acredita su identidad. La autenticación y la gestión de notas están fuera del alcance actual. Ampliar ese alcance requiere una tarea específica.

## 2. Principios de diseño

- Separar presentación, entrada de peticiones, reglas de negocio y acceso a datos.
- Mantener las reglas de negocio compartidas por los clientes; una interfaz nueva reutiliza las operaciones existentes.
- Favorecer código explícito, sencillo y apropiado para aprender. Evitar abstracciones y dependencias sin una necesidad concreta.
- Conservar los contratos existentes salvo cambio autorizado. Validar las entradas y devolver únicamente los datos necesarios.
- Mantener alineados el comportamiento y las guías vigentes, sin presentar trabajo planificado como si ya estuviera implementado.

## 3. Decisiones tecnológicas

El proyecto utiliza Node.js y SQLite, con datos almacenados localmente. SQLite queda detrás de un servidor de datos local, el único proceso que abre la base; las reglas de negocio y las consultas no dependen de Node, para que cualquier cliente, también el navegador, las use directamente. El cliente web usa HTML, CSS y JavaScript vanilla. El cliente REST usa Express. El cliente `node:http` usa solo el módulo `node:http` de Node, y sus cuadernos dibujan las tablas con `cli-table3` y `@colors/colors`. El cliente Nest usa Nest en JavaScript, sin TypeScript, y se compila con Babel porque Node no entiende sus decoradores. El cliente de escritorio usa Electron, con HTML, CSS y JavaScript vanilla; la lógica se ejecuta en su proceso principal. El cliente de Chrome es una extensión con HTML, CSS y JavaScript vanilla y una API propia con Fastify, porque una extensión no puede importar archivos de fuera de su carpeta. El cliente de VS Code es una extensión con HTML, CSS y JavaScript vanilla; la lógica se ejecuta en el proceso de la extensión. La clasificación de nombres utiliza un servicio local de modelos.

pnpm es el gestor de paquetes Node del proyecto. Las dependencias nuevas y los cambios de versión requieren una revisión de necesidad y seguridad antes de aprobar el plan. Las versiones, la configuración y el procedimiento de revisión se consultan en las guías técnicas.

## 4. Seguridad y datos

- Validar los datos antes de utilizarlos y no convertir entradas inválidas de forma silenciosa.
- No publicar secretos, credenciales ni bases de datos locales.
- Usar datos ficticios en ejemplos y pruebas; no borrar ni reemplazar la base real para comprobar un cambio.
- Presentar errores comprensibles sin exponer detalles internos del almacenamiento.
- No incorporar autenticación ni tratamiento de datos adicional sin una tarea que defina su alcance.

## 5. Gobierno del proyecto

Los cambios se definen y revisan mediante el SDD propio de esta aplicación. La issue y la PR permiten seguir el trabajo, pero no sustituyen esa revisión. El proceso y sus aprobaciones están en [AGENTS.md](../AGENTS.md).

Una modificación de estos principios o del alcance requiere aprobación explícita de la persona responsable. Las decisiones internas se documentan en la guía correspondiente, sin convertir cada cambio técnico en una enmienda constitucional.

## 6. Guías del proyecto

- [AGENTS.md](../AGENTS.md): proceso de trabajo, autorizaciones, paquetes y cierre.
- [ARCHITECTURE.md](ARCHITECTURE.md): responsabilidades y dependencias del código.
- [STYLE.md](STYLE.md): convenciones, funciones de negocio y comentarios educativos.
- [DATABASE.md](DATABASE.md): esquema, consultas y reglas de los campos.
- [ERRORS.md](ERRORS.md): tratamiento de errores.
- [TREE.md](TREE.md): organización de archivos.
- [README.md](../README.md): instalación, arranque y uso.
