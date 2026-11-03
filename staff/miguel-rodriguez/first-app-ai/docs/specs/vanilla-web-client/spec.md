# Tres pantallas vanilla de contactos

Issue: #760. Corrección de alcance solicitada por Miguel el 2026-11-03.
Sustituye el alcance conectado a SQLite de la entrega anterior.

## Propósito y comportamiento

Abrir el HTML directamente y recorrer tres pantallas con HTML, CSS y JavaScript
vanilla, sin API, cliente HTTP ni servidor.

- Elegir un contacto por su ID de una lista sin contraseña.
- Ver el contacto elegido y las opciones Volver, Modificar e Ir a notas.
- Modificar nombre/email, volver sin guardar o eliminar con confirmación.
- Notas permanece visible y deshabilitado; no se implementa su funcionalidad.

## Datos y aceptación

La interfaz usa tres contactos ficticios identificados como ejemplos. Guarda las
ediciones y borrados en este navegador, conservándolos al recargar cuando el
almacenamiento está disponible. No importa contactos de SQLite ni cambia los
clientes de Terminal/Jupyter. No se presenta como una conexión a la base real.

Se puede cancelar la edición o el borrado, rechazar nombre vacío, email inválido
o duplicado y volver a la lista. Borrar todos conserva la lista vacía al recargar.
Restablecer ejemplos pide confirmación. Si el navegador impide guardar, la interfaz
sigue funcionando en memoria y avisa. Usa texto para mostrar los datos, admite
teclado y móvil y carga estilos y comportamiento desde rutas relativas.

## Exclusiones

API, HTTP, servidor, sincronización con SQLite, cuentas, contraseñas, notas,
creación de contactos, despliegue y dependencias nuevas.

## Revisión de alcance

Miguel pide limitar esta corrección al ejercicio de las tres pantallas de la
semana anterior, excluyendo expresamente API y HTTP. El almacenamiento del
navegador es una decisión local de implementación, no una instrucción atribuida a
Ventura. La versión anterior implementó una conexión fuera del alcance actual.
