# Plantillas por tipo en el flujo de git

Issue: #686.

Quien construye esta app con IA deja la tarea escrita y abre la pull request con la forma del tipo: funcionalidad, arreglo, documentación, reordenación, prueba o mantenimiento.

Lo usa quien construye la app con IA.

Entra el tipo de la tarea. Sale el texto de la tarea con lo que hay que hacer y cómo probarlo, y el texto de la pull request con lo que ha cambiado y cómo probarlo. Si el tipo no tiene forma, se usa la más cercana. Al abrir el borrador, el número de la tarea no va en el texto. Al enlazar, el texto lleva Closes y el número, y la tarea queda cerrada.

Ejemplo: un mantenimiento. La tarea dice qué hay que hacer, qué sigue igual y cómo probarlo. La pull request, en borrador, resume ese mantenimiento y cómo probarlo. Al enlazar queda Closes y el número, y la tarea queda cerrada.

No hay un fallo de la lista «Errores». Si la tarea o la pull request salen con la forma única de antes, si el tipo se ignora cuando sí tiene forma, si el enlace no lleva Closes y el número, o si la tarea sigue abierta después de enlazar, el flujo no usa las plantillas nuevas.

Queda fuera cambiar las reglas de negocio, la base de datos, los clientes, los paquetes y los momentos del flujo. La descripción ya escrita del flujo solo cambia la frase del enlace.
