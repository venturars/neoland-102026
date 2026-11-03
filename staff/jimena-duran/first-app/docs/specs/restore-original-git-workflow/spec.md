Issue: #759

# Restaurar el flujo de Git original

Estado: spec y plan aprobados conjuntamente. T01–T10 aprobados; T01–T10 implementados y comprobados; resultados en [verification.md](verification.md), con T08 limitado a ensayos desechables con remoto local. T10 y publicación selectiva autorizados; sin revisores ni merge.

## Necesidad y usuarios

La persona responsable necesita que first-app incorpore el flujo de referencia original, reconocible y comprobable, en lugar de herramientas e instrucciones reescritas. El agente debe adaptar únicamente su ubicación y referencias al proyecto.

## Comportamiento y aceptación

1. La integración conserva las herramientas originales, sus nombres, contenido y comportamiento. Se retiran los sustitutos y ensayos propios, sin introducir traducciones, helpers, controles o mejoras.
2. Los agentes, skills, plantillas y referencia de conexión proceden de la misma fuente fijada. Las únicas adaptaciones operativas son las rutas de siete comandos y la referencia del orquestador a las instrucciones locales.
3. Se conserva el SDD de first-app: spec y plan juntos para revisión; después tareas para otra revisión; implementación solo autorizada. Por ejemplo, pedir preparar un cambio devuelve ambos documentos y se detiene antes de tareas. La indicación del flujo original de continuar automáticamente no prevalece sobre esas pausas.
4. Las plantillas actuales se conservan si coinciden; se mantiene su selección por tipo y la alternativa original, sin reglas adicionales.
5. La integración conserva lógica, clientes, datos, dependencias, configuración personal, documentos históricos y trabajos independientes. No instala herramientas ni ejecuta instrucciones de configuración de las referencias.
6. Los problemas identificados también en la fuente se presentan como límites, sin corregirlos localmente ni afirmar que están resueltos.
7. La revisión distingue comparación, ejecución real y evidencias anteriores. Los resultados de los sustitutos retirados no acreditan los originales.

## Fuera de alcance

Funcionalidades, clientes, autenticación, almacenamiento, dependencias, configuración personal, cambios en otras entregas y modificaciones del SDD. No se reescriben documentos históricos.

## Pausa

T01–T09 autorizados, incluidos commits y push exclusivamente en ensayos desechables con remoto local. T10 y publicación selectiva autorizados. Al terminar se presentan resultados y límites; commit selectivo, push y PR draft contra staging autorizados para esta entrega; sin revisores ni merge.
