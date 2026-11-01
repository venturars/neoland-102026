# Formato, lint y Jupyter en Linux y Windows

Issue: #641

Quien termina una tarea formatea el código con Prettier y lo revisa con ESLint. Y abre Jupyter con el mismo comando en Linux y en Windows.

Lo usa quien construye la app con IA, en cualquiera de los dos sistemas.

Entra el código JavaScript de la app. El comando de formato se llama `format`. El de revisión se llama `lint`. El de Jupyter sigue siendo `jupyter`.

`format` deja el JavaScript de `src/db/`, `src/queries/` y `src/logic/` en el formato estándar de Prettier, sin configuración propia. `lint` muestra los errores de código con las reglas recomendadas de ESLint. Si no hay errores, no muestra ninguno.

`jupyter` abre los notebooks de `src/clients/jupyter`. La primera vez crea `.venv` e instala `notebook==7.6.3`. Las siguientes reutiliza `.venv` sin reinstalar.

Ejemplo: en Linux, sin `.venv`, `pnpm jupyter` crea `.venv`, instala `notebook` y abre Jupyter con los notebooks. Una segunda vez abre Jupyter sin instalar nada.

Si no hay Python 3, se ve `Python 3 is required to start Jupyter.` y el comando termina con error.

Si falla crear `.venv` o instalar `notebook`, el comando termina con el error de ese paso.

Queda fuera cambiar la lógica de la app, formatear el código que ya existe, dar a Prettier una configuración propia, cambiar la versión de `notebook` y abrir Jupyter en macOS.
