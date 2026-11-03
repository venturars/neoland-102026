# Tareas del cliente web vanilla

Issue: #778. Desglose documental preparado para revisión. Todo el trabajo de implementación sigue pendiente y requiere que Diego lo solicite. Primero debe completarse el bloque de notas.

- [ ] **W-T01:** Preparar una copia temporal con dos usuarios, notas de ambos y casos vacíos, usando el inicializador explícito ya comprobado. W-01, W-05, W-10.
- [ ] **W-T02:** Implementar lectura JSON limitada en bytes, salida JSON y traducción de errores, sin trasladar reglas de negocio a HTTP. W-03, W-06 a W-10.
- [ ] **W-T03:** Implementar rutas de usuarios llamando a logic; validar formato completo de los IDs, métodos y cuerpos. W-01 a W-04, W-09.
- [ ] **W-T04:** Implementar rutas anidadas de notas, conservando los dos IDs en cada llamada a logic. W-05 a W-10.
- [ ] **W-T05:** Implementar mapa de archivos públicos y dispatcher; rechazar rutas y métodos no admitidos. W-01, W-10.
- [ ] **W-T06:** Implementar arranque local, configuración PORT y cierre; documentar preparación explícita y comando de ejecución solo en la constitución. W-01, W-12.
- [ ] **W-T07:** Crear HTML semántico de las cinco pantallas y CSS adaptable con labels, foco y mensajes accesibles. W-01 a W-08, W-11.
- [ ] **W-T08:** Implementar acceso API, estado en memoria, cambio de pantalla y foco; restaurar botones al terminar y conservar formularios ante error. W-09, W-11, W-12.
- [ ] **W-T09:** Implementar lista/selección de usuario y menú con sus tres destinos y estado sin usuarios. W-01, W-02, W-09, W-12.
- [ ] **W-T10:** Implementar edición del usuario y borrado confirmado, incluyendo advertencia sobre notas; refrescar datos y estado. W-03, W-04, W-09.
- [ ] **W-T11:** Implementar listado vacío, carga de nota, creación, edición, vuelta sin guardar y borrado confirmado; renderizar siempre texto plano. W-05 a W-10.
- [ ] **W-T12:** Verificar API en copia aislada: respuestas y errores del plan, IDs mezclados, persistencia y cascada, cancelaciones, archivos privados y conservación de otros usuarios. W-01 a W-10, W-12.
- [ ] **W-T13:** Recorrer la interfaz en navegador real a ancho normal y 390 px, con teclado, Unicode, errores de red, recarga y estados pendientes. W-01 a W-12.
- [ ] **W-T14:** Revisar sintaxis, UTF-8, comentarios breves, enlaces y alcance; actualizar arquitectura, árbol, errores y registro factual. Cerrar procesos propios y verificar puerto libre. W-01 a W-12.

## Estado de esta entrega documental

No se han añadido rutas, módulos HTTP, HTML, CSS ni JavaScript web. Las comprobaciones anteriores son pasos previstos y no resultados obtenidos. No se atribuye a Diego una revisión individual de los documentos que todavía no ha realizado.
