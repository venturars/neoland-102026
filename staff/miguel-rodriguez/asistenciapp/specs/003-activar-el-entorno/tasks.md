# Tareas 003 · Activar el entorno y arrancar la aplicación

Estado: tareas aprobadas por Miguel el 2026-10-22. Implementación verificada; revisión final aprobada por Miguel el 2026-10-22.

Referencias: [spec aprobada](spec.md), [plan aprobado](plan.md), [constitución 2.3](../../CONSTITUTION.md) y [manual](../../AGENT.md). Issue #223, PR #224.

- [x] **T01 · Capturar la referencia previa.** Fuera del proyecto, guardar el README original y el inventario SHA-256 protegido definido en el plan. Comprobar el intérprete y las dependencias del `.venv` existente sin instalar nada.
  Resultado: referencia disponible y versiones identificadas antes de editar. Cubre CA-04.

- [x] **T02 · Separar los dos pasos en README.md.** Renombrar la sección 2 a «Activar el entorno» e insertar «3. Arrancar la app» antes de la tabla de ejecución, con la separación habitual. Mantener cada bloque y explicación en su sección según el plan.
  Resultado: activación primero y arranque después, sin cambiar comandos ni rutas. Cubre CA-01, CA-02.

- [x] **T03 · Ajustar la numeración en README.md.** Renumerar las secciones posteriores del 4 al 8 y cambiar únicamente la remisión del puerto ocupado de sección 4 a sección 5.
  Resultado: numeración consecutiva y referencia correcta a «Cerrar la app». Cubre CA-03, CA-04.

- [x] **T04 · Verificar el documento.** Aplicar la matriz del plan y revisar el diff completo contra la captura. Comprobar bloques de comandos idénticos y que deshacer solo los cambios autorizados recupera el README original byte a byte.
  Resultado: registrar en este archivo procedimiento y evidencia separados para CA-01–CA-04; ningún otro texto alterado. Cubre CA-01–CA-04.

- [x] **T05 · Ejecutar la suite existente.** En una copia desechable, utilizar el intérprete del `.venv` local y ejecutar pytest sin modificar tests, instalar paquetes, arrancar la app ni abrir túneles.
  Resultado: registrar comando, versiones y resultado real de esta ejecución, distinguiendo cualquier bloqueo. Cubre la conservación de comportamiento de CA-04 y constitución §5.

- [x] **T06 · Comprobar conservación y retirar temporales.** Comparar inventario protegido antes y después, eliminar copia y capturas temporales y conservar el `.venv` local.
  Resultado: código, estáticos, tests, requisitos, configuración, datos y documentos 001–002 idénticos; temporales eliminados. Cubre CA-04.

- [x] **T07 · Registrar el cierre de 003.** Anotar resultados, comandos, versiones y bloqueos aquí y actualizar el estado de 003 en sus documentos y en la tabla de AGENT.md, sin cambiar sus reglas.
  Resultado: estado fiel a lo ejecutado, pendiente de revisión final de Miguel; no declarar verificado lo que no se haya comprobado. Cubre CA-01–CA-04.

Git, commits y publicaciones los ejecuta Miguel. Los cambios de 004 y 005 quedan fuera de esta tarea.

## Resultados · 2026-10-22

- **CA-01:** la sección 2 es «Activar el entorno» y contiene el bloque de cada terminal nueva, antes del arranque. Verificado mediante lectura y delimitación de secciones.
- **CA-02:** la sección 3 es «Arrancar la app»; conserva ambas opciones de ejecución y sus explicaciones del panel, enlace privado y disponibilidad. No contiene el bloque de activación.
- **CA-03:** comprobación de encabezados: numeración consecutiva 1–8; la tabla de problemas frecuentes remite a sección 5 y esta corresponde a «Cerrar la app».
- **CA-04:** todos los bloques delimitados por triple acento grave coinciden con el original. Al deshacer exclusivamente los títulos, el separador añadido y la remisión autorizada, el README original se recupera byte a byte. Revisado el diff completo: sin cambios adicionales. Los 29 archivos protegidos tienen rutas y SHA-256 idénticos, incluidos documentos 001–002. No se creó una carpeta de datos en el proyecto.

Comandos y herramientas: script temporal con `python3`, biblioteca estándar (`hashlib`, `json`, `re`, `difflib`, `shutil`, `tempfile`, `subprocess`) para captura, comprobaciones y copia. En la copia desechable se ejecutó el intérprete absoluto del `.venv` local con `-m pytest -q -p no:cacheprovider`, y `PYTHONDONTWRITEBYTECODE=1`: **77 pruebas pasaron en 0,24 s**. Se permitió el socket local efímero requerido por la prueba de puerto. Esta es una ejecución nueva para 003.

Versiones comprobadas: Python 3.14.8, Flask 3.1.3, pytest 9.1.1. Sin instalaciones ni cambios de dependencias. No se arrancó la aplicación ni un túnel. Sin bloqueos observados. Copia, bases de prueba y capturas temporales eliminadas; `.venv` local conservado. Sin comandos Git. La revisión final fue aprobada por Miguel el 2026-10-22; 004 y 005 no se iniciaron.
