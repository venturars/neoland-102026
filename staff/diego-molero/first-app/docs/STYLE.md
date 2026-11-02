# Estilo y convenciones

Todo el código y los textos se guardan en UTF-8. La documentación y los comentarios están en español; los identificadores están en inglés, en camelCase, y los ficheros en kebab-case, salvo nombres establecidos de guías.

Se utilizan módulos ES, imports con extensión .js, exportaciones con nombre, comillas dobles, punto y coma, indentación de dos espacios y formato estándar de Prettier, sin configuración propia.

Una operación de logic vive en un fichero. Su cuerpo valida entradas, comprueba reglas, aplica la operación y estructura la salida. Las llamadas encadenadas se separan en variables con nombres claros. Las comprobaciones relacionadas pueden compartir una condición legible; los errores tienen su propio bloque if y throw.

Las funciones devuelven el dato directamente y los fallos usan Error ordinario. No se añaden clases, envoltorios de resultados, helpers genéricos ni abstracciones que oculten los pasos. Los valores fijos usan constantes en mayúsculas.

Los clientes de terminal importan, llaman y muestran. Los notebooks explican el ejemplo y llaman a la misma lógica, sin copiar reglas. Cada funcionalidad nueva incluye algún comentario corto que explique su finalidad.

Los archivos SQL usan parámetros con nombre. Los notebooks se guardan sin salidas de ejecución, contadores ni datos personales.
