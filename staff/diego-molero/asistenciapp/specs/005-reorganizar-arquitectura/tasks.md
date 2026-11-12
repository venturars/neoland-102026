# Tareas 005 · Organización de documentos y responsabilidades

> Estado: **Implementadas y comprobadas; entrega autorizada** · Fecha: 2026-10-23
>
> [Spec](spec.md) · [Plan](plan.md) · Issue #278

Se ejecutan en orden, marcando resultados reales. La autorización abarca implementación, pruebas, commits, push y solicitud de revisión; el merge queda pendiente.

- [x] **T01** · Añadir tests de documentos, imports, documentación pública y compatibilidad de datos; comprobar fallos iniciales de organización. CA-01 a CA-09.
- [x] **T02** · Mover la constitución a docs y enmendar a 2.3 solo organización, enlaces e historial. CA-01, CA-09.
- [x] **T03** · Crear el documento de arquitectura con responsabilidades y límites. CA-02.
- [x] **T04** · Renombrar y actualizar el manual, las reglas de escritura, el árbol y el seguimiento. CA-03, CA-08.
- [x] **T05** · Actualizar únicamente los enlaces vigentes del README. CA-08.
- [x] **T06** · Separar reglas de nombres, códigos y sesión en domain, documentando funciones. CA-04.
- [x] **T07** · Llevar SQLite a storage con cierre por operación y mismo esquema. CA-05, CA-07.
- [x] **T08** · Extraer las acciones de asistencia a usecases, conservando decisiones y resultados. CA-04 a CA-07.
- [x] **T09** · Adaptar app.py a las acciones, conservar contratos y ajustar imports de los tests existentes. CA-06, CA-07.
- [x] **T10** · Ejecutar suite completa, comparar esquema, principios, pantallas y specs anteriores con `fe2f7a2`; comprobar UTF-8, enlaces vigentes y diff. CA-01 a CA-09.
- [x] **T11** · Registrar resultados reales y estado del manual y de esta spec. Trazabilidad.

## Resultados

| Comprobación | Evidencia |
| --- | --- |
| Tests iniciales de organización | El agente comprobó 12 fallos esperados y una prueba de datos pospuesta en 0,42 s el 2026-10-23, antes de reorganizar. |
| Suite y compatibilidad | El agente obtuvo `93 passed in 1.51s` el 2026-10-23; Python 3.14.7 y pytest 9.1.1. La prueba de base anterior conserva token, datos, registro, exportación, cierre y eliminación. |
| Esquema, contratos, documentos y archivos conservados | CA-01 a CA-09 revisados; SQL exactamente idéntico. Se conservan 29 archivos de interfaz, historial y configuración, propósito, principios y reglas. README limitado a enlaces; imports y funciones públicas comprobados por AST; UTF-8, formato y enlaces activos correctos. |
| Entrega | Autorizada anticipadamente; revisión de compañeros y merge pendientes. |
