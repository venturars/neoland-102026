# Cliente Jupyter

Autora: Jimena Durán. Issue #379.

## Objetivo

Permitir que el CEO pruebe My First App sin escribir código, ejecutando
una celda por acción y leyendo una tabla con encabezados cian.

## Funcionalidades

Nueve notebooks: preparar usuarios, crear, listar, buscar por ID, correo
y nombre, actualizar, eliminar y contar por género. El recorrido utiliza
un usuario de demo; las consultas generales muestran los datos actuales.

## Criterios de aceptación

- Cada acción tiene un notebook con explicación breve y una celda ejecutable.
- Se reutilizan las operaciones actuales y se muestran resultados reales,
  listas vacías y mensajes de error existentes.
- Las escrituras del recorrido afectan solo al usuario de demo y sus cambios
  son visibles desde los demás notebooks; los usuarios anteriores se conservan.
- El recuento muestra sus tres categorías con Ollama y llama3.2 disponibles;
  si falla la clasificación, muestra el error sin inventar totales.
