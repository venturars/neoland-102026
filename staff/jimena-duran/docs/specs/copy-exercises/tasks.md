# Tareas — copia fiel de AsistenciApp

Issue #231. Responsable: Jimena Durán.

- [x] T01 Confirmar alcance de copia literal sin adaptaciones.
  Resultado: spec actualizada; cambios 002–005 fuera de esta PR (CA-04).
- [x] T02 Inventariar origen y comprobar que el destino no existe.
  Resultado: 29 archivos físicos, todos versionados (CA-01).
- [x] T03 Copiar los archivos manteniendo sus rutas relativas.
  Resultado: aplicación original íntegra en la carpeta personal (CA-01, CA-04).
- [x] T04 Comparar los SHA256 de todos los archivos y el inventario.
  Resultado: 29 coincidencias, sin archivos adicionales en destino (CA-01, CA-02).
- [x] T05 Comprobar que el contenido del origen permanece igual.
  Resultado: hashes de origen anteriores y posteriores idénticos (CA-03).
- [x] T06 Revisar el alcance del cambio y documentar la verificación.
  Resultado: solo copia y SDD de incorporación, sin commit ni push (CA-03, CA-04).