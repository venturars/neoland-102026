# Arranque de Jupyter en Linux y Windows

Issue: #382.

La persona que prueba la aplicación abre sus notebooks con `pnpm jupyter`
desde la aplicación, tanto en Linux como en Windows.

La primera ejecución prepara Jupyter si hace falta. Las siguientes reutilizan
la instalación local. En ambos sistemas se abre la interfaz de Notebook y se
ven los nueve documentos existentes.

Ejemplo: una persona ejecuta el comando en PowerShell y otra en una terminal
Linux. Las dos pueden abrir el documento de listar usuarios.

Si falta Python 3, el arranque lo indica y termina con error. Si falla la
preparación o el arranque, se muestra el error y el comando termina con fallo.

La tarea cambia el arranque. Las acciones y resultados de los notebooks siguen
siendo los existentes.
