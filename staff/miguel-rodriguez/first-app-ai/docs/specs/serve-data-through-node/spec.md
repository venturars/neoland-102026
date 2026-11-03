# Acceso compartido a los datos de contactos

Issue: [#822](https://github.com/venturars/neoland-102026/issues/822).
PR: [#823](https://github.com/venturars/neoland-102026/pull/823), draft hacia staging.
Estado: aprobada por Miguel el 2026-11-03.

## Propósito y usuarios

Miguel necesita preparar la aplicación para utilizar sus operaciones desde un
cliente de navegador, manteniendo los mismos contactos que Terminal y Jupyter.
El acceso a los datos se concentra en un servicio local que los clientes deben
poder esperar, sin cambiar las reglas de las operaciones existentes.

Esta entrega prepara ese acceso compartido; no desarrolla ni conecta la interfaz web.

## Entradas y resultados

Las operaciones conservan sus parámetros y entradas previstas, su orden de
validación y sus reglas actuales. Las llamadas afectadas pasan a ser asíncronas:
el resultado o el error se obtiene después de esperar su finalización.

Los contactos devueltos mantienen exactamente id, name, email, createdAt y
updatedAt. El listado y la búsqueda por nombre mantienen su orden y sus listas
vacías. El borrado sigue sin devolver datos. El clasificador mantiene sus tres
recuentos, sus requisitos locales y su tratamiento de la incertidumbre.
Los contratos detallados vigentes se consultan en la constitución y la guía de
[errores](../../ERRORS.md); no se redefinen aquí.

## Criterios de aceptación

- **CA-01 · Mismos datos:** dados contactos existentes, al arrancar y volver a
  arrancar el servicio local, siguen disponibles en su ubicación actual, con los
  mismos identificadores, valores y fechas. No se crean ejemplos ni otra copia
  de contactos para los clientes.
- **CA-02 · Inicialización explícita:** arrancar el servicio no crea la tabla
  de contactos. La preparación existente permite crearla por separado; repetir
  esa preparación conserva los registros.
- **CA-03 · Resultados esperados:** al completar creación, listado, búsquedas
  por ID/email/nombre, actualización o eliminación, sus parámetros y resultados
  esperados son los actuales. Los clientes esperan el resultado antes de
  mostrarlo o continuar; no imprimen promesas como resultados.
- **CA-04 · Reglas y errores conservados:** entradas inválidas, emails duplicados
  y usuarios inexistentes mantienen los mensajes y el orden de comprobación
  actuales. No se amplía la validación del correo ni de los tipos de entrada.
  Por ejemplo, actualizar un usuario inexistente sigue dando User not found
  antes de validar los campos nuevos.
- **CA-05 · Clientes conectados:** crear un contacto desde Terminal permite
  consultarlo desde Jupyter. Modificarlo desde Jupyter se refleja en Terminal.
  Listar y buscar conservan los registros y las fechas; actualizar o eliminar
  afecta únicamente al contacto solicitado, con las reglas temporales actuales.
- **CA-06 · Fallos del servicio:** si una operación no puede acceder a los datos,
  el cliente comunica el fallo previsto para esa operación, sin anunciar éxito
  ni dejar el rechazo asíncrono sin manejar. Se conserva la precedencia de
  validación y acceso; no todos los fallos deben alcanzar el servicio.
- **CA-07 · Clasificador:** espera la recuperación de contactos y conserva su
  comportamiento actual, incluido el caso vacío y los fallos de recuperación o
  del modelo. No devuelve recuentos parciales ni modifica datos.
- **CA-08 · Uso y documentación:** las instrucciones permiten arrancar y parar
  el servicio y utilizar Terminal/Jupyter. Los contratos documentan la espera
  asíncrona; las guías de datos, arquitectura e inventario describen el resultado
  real. La prueba con el modelo se distingue de las verificaciones sin él.

## Límites

Conservar la base, su ubicación, esquema, datos, dependencias y configuración del
clasificador. Sin paquetes nuevos, otras aplicaciones, interfaz web, API REST de
usuarios, nuevas reglas de correo, autenticación, despliegue público ni nuevas
operaciones de negocio. Las decisiones de implementación de #822 se concretarán
en el plan, usando #814 como referencia y sin copiar soluciones de compañeros.

## Revisión previa

Contrastada con #822, la constitución, las guías actuales y el encargo de clase.
El cambio a resultados asíncronos es intencional; conservar el comportamiento no
significa mantener llamadas síncronas. La constitución y las guías aún describen
el acceso anterior: su actualización limitada forma parte de CA-08 y deberá
precisarse y revisarse en el plan antes de modificar la implementación.

No hay preguntas abiertas de alcance. Revisión final aprobada por Miguel el 2026-11-03.
