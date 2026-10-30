Issue: #588

# Automatización del flujo de Git

Jimena necesita automatizar el flujo de Git de su aplicación desde Windows, PowerShell, VS Code y Codex, sin perder sus funcionalidades ni sus cambios locales.

## Comportamiento y aceptación

1. Al pedir pensar, registrar, empezar, guardar o revisar una tarea, el agente reconoce un único momento y delega su ejecución a un subagente real cuando esté disponible. Si hay ambigüedad, pregunta antes de actuar. Si no puede delegar, informa de la limitación antes de continuar; no presenta una simulación como subagente.
2. La tarea queda registrada y asignada a Jimena antes de preparar su especificación. La especificación identifica la issue. Se presentan especificación y plan para revisión humana y se detiene el trabajo. Solo tras aprobación se redactan las tareas y se vuelve a parar. La implementación exige autorización posterior.
3. El flujo permite actualizar la base mediante avance rápido, crear o recuperar la rama de trabajo conservando su contenido, guardar solo los archivos indicados, publicar la rama y preparar una revisión en borrador contra staging. Cada acción respeta el alcance autorizado y devuelve un resultado verificable.
4. El orquestador vincula la issue con `Closes #N`, conserva Development y comprueba ambos por separado. La base se mantiene en staging; la palabra de cierre solo se interpreta si la PR apunta a la rama predeterminada. No se cierra la issue manualmente ni se promete cierre al integrar en staging cuando esta no sea la predeterminada. La persona indica quién revisa y no se integra sin indicación.
5. Los comandos funcionan en PowerShell sin depender de Bash, Homebrew o Cursor. Admiten rutas con espacios y se pueden invocar desde la raíz del repositorio o desde la aplicación.
6. Ante conflictos, divergencias, credenciales inválidas, herramientas ausentes o cambios que impidan avanzar, el flujo informa y se detiene. No descarta archivos, oculta cambios automáticamente ni fuerza publicaciones.
7. Esta entrega se realiza exclusivamente en `jimena-duran-291020262`. La restricción corresponde únicamente a esta entrega: la automatización permite crear y usar otras ramas en futuras tareas, sin fijar este nombre permanentemente en los scripts. No hace commit, push ni abre una revisión durante la preparación o las pruebas de esta entrega sin indicación de Jimena.
8. La gestión de usuarios y sus clientes existentes mantienen su comportamiento. La documentación explica las capacidades disponibles de Codex y diferencia las comprobaciones ejecutadas de las pendientes.

## Fuera de alcance

Reorganizar la aplicación bajo src, incorporar Socket, instalar paquetes o cambiar sus versiones, migrar la base de datos, modificar las reglas de negocio y publicar cambios sin autorización. Las instrucciones de Socket que ya existen no se amplían.

## Revisión

Spec, plan y tareas T01–T23 aprobados por Jimena. Implementación y comprobaciones realizadas en la rama indicada; los resultados y límites están en [verification.md](verification.md). El 30 de octubre de 2026 Jimena autorizó el commit selectivo, push y actualización de la PR #600 existente, manteniéndola en draft y con base staging, sin merge ni cambios de revisores.
