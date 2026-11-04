# Tareas — cliente REST de usuarios

Issue: #849.

1. Fijar y revisar el commit indicado y los contratos de lógica existentes.
   Resultado: rutas, estados, respuestas y errores documentados sin ampliación.

2. Revisar Express 5.3.0 y tres capas con Socket antes de instalar.
   Resultado: resumen por versión y bloqueo si hay riesgos sin aceptar.

3. Preparar package.json y lockfile con las versiones fijadas.
   Conservar scripts y dependencias existentes. Instalar solo si pasa Socket.

4. Crear src/clients/http/app.js con el contenido exacto revisado.
   Resultado: cinco operaciones con await, ORIGIN 127.0.0.1:3001 y errores fijados.

5. Actualizar TREE y ARCHITECTURE con el nuevo cliente.
   Resultado: cliente → lógica → consultas → servidor SQL en 3000.

6. Preparar peticiones y guía Bruno en esta carpeta de spec.
   Resultado: cinco operaciones, preservación de campos y usuarios y errores.

7. Ejecutar sintaxis, formato, lint y diff; comprobar conservación.
   Resultado: evidencia de lo ejecutado y defectos corregidos si aparecen.

8. Comprobar operaciones y errores solo con SQLite y usuarios ficticios.
   Si instalación sigue bloqueada, ejecutar solo lógica y marcar HTTP pendiente.

9. Registrar resultados, límites y defectos de referencia por separado.
   Resultado: guía Windows y PR draft sin revisores ni merge.

10. Con la autorización final, publicar solo los archivos de esta entrega.
    Resultado: commit selectivo, push y descripción actualizada de la PR existente.
