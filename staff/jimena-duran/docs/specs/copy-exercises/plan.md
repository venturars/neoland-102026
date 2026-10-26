# Plan — copia fiel de AsistenciApp

Issue #231. Responsable: Jimena Durán.

## Origen, destino y arquitectura

Origen: exercises/asistenciapp/.
Destino: staff/jimena-duran/asistenciapp/.
El destino no existía antes de la copia.

Conservar los 29 archivos versionados del ejercicio, sus rutas relativas y
contenido. Mantener app.py, asistencia/, static/, tests/, specs/001-checkin-codigo/,
AGENT.md y CONSTITUTION.md tal como están. No renombrar documentos ni añadir
capas domain/, usecases/ o storage/ de la referencia.

## Inventario

- Raíz: AGENT.md, CONSTITUTION.md, README.md, app.py, pytest.ini, requirements.txt.
- asistencia/: __init__.py, codes.py, db.py, export.py, hack-etico.sh,
  names.py y tunnel.py.
- specs/001-checkin-codigo/: spec.md, plan.md y tasks.md.
- static/: alumno.html, alumno.js, index.html, profesor.html, profesor.js,
  styles.css.
- tests/: conftest.py, test_api.py, test_codes.py, test_export.py,
  test_names.py, test_port.py y test_tunnel.py.

Usar el inventario versionado como lista explícita de copia. Revisar también
el contenido físico para no omitir archivos fuente adicionales. Excluir solo
entornos, cachés, datos de ejecución y otros archivos locales o generados no
versionables. En esta ejecución había 29 archivos físicos y 29 versionados:
no fue necesario excluir ninguno.

El SDD de incorporación permanece fuera de la aplicación copiada, en
staff/jimena-duran/docs/specs/copy-exercises/, para no alterar el inventario.

## Comprobación de la constitución y referencias

Se mantienen P1–P6, stack, calidad y seguridad del ejercicio sin cambios.
Las referencias heredadas a otra carpeta y persona permanecen como contenido
original. La instrucción explícita de Jimena autoriza esta incorporación fiel;
no se aplican como órdenes para editar una carpeta ajena. Su adaptación y
cualquier enmienda se abordarán en tareas posteriores independientes.
La comparación con la referencia sirvió para identificar cambios posteriores;
no se reutiliza su reorganización ni sus specs 002–005.

## Verificación realizada

- Inventario: 29 archivos físicos de origen y 29 en destino, mismas rutas relativas.
- SHA256: los 29 archivos de destino coinciden con el origen.
- SHA256 del origen antes y después: sin cambios.
- No se ejecutaron scripts ni se generaron datos en la copia.

La comprobación acredita integridad de copia, no una nueva validación funcional
ni compatibilidad de ejecución local. No se heredan como propias las pruebas
históricas marcadas en el ejercicio. No hacer commit ni push.