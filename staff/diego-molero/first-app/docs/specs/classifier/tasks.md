# Tareas — clasificador local

## Trabajo previo

- [x] Implementar el conteo de nombres con Ollama local y respuesta estructurada.
- [x] Integrar HTTP y conteo en el fichero del clasificador.
- [x] Preparar users-gender-count.txt y simplificarlo sin try/catch/finally.
- [x] Observar el resultado vacío y ejecutar el cliente con Ollama real en copia temporal.
- [x] Centrar las specs en clasificación, enlazando su dependencia de usuarios.

El almacenamiento y el registro transversal se conservan en
[las tareas de usuarios](../users/tasks.md).

## Registro del 20 de octubre de 2026

- El clasificador vacío devolvió los tres contadores a cero.
- Con Ollama real y llama3.2, Ada Lovelace, Mateo y Alex produjeron women: 1,
  men: 1, genderUndefined: 1, coincidiendo la suma con los tres usuarios.
- Tras simplificar el cliente, Ada Lovelace produjo women: 1, men: 0,
  genderUndefined: 0. Los ocho clientes de la app terminaron correctamente.
- Se eliminaron las copias temporales sin utilizar la base personal ni crear tests.
  Se revisaron sintaxis, UTF-8 y espacios finales.

Los recuentos corresponden al contrato anterior. Estos ejemplos no miden la
precisión general ni cubren todas las variantes. La revisión documental posterior
no volvió a ejecutar la app; su resultado está en [el registro de usuarios](../users/tasks.md).

## Iteración del 21 de octubre de 2026

- [x] Devolver directamente el recuento y mantener las excepciones ante fallos.
- [x] Centralizar la ejecución y actualizar los textos de las specs.
- [x] Comprobar el cliente y revisar coherencia, enlaces, sintaxis y UTF-8.

En la copia temporal, el cliente vacío devolvió los tres contadores a cero.
Con Ollama real y llama3.2, Ada Lovelace produjo directamente
{ women: 1, men: 0, genderUndefined: 0 }, sin indicador de éxito.
Se revisaron enlaces, sintaxis y UTF-8. Las comprobaciones de fallos de lotes
siguen pendientes; no se presentan como ejecutadas en esta iteración.

## Casos manuales adicionales

- [x] Procesar más de seis usuarios y usuarios con el mismo nombre.
- [x] Observar categorías desconocidas, JSON ilegible y lotes incompletos con
  respuestas controladas, distinguiéndolas de llamadas a IA real.
- [x] Observar un fallo después de un lote correcto sin devolver un recuento parcial.

## Iteración del 27 de octubre de 2026

Se comprobaron en copias temporales las respuestas controladas de dos lotes (6 y 2 nombres), nombres repetidos, JSON ilegible, categorías desconocidas, respuestas incompletas, fallo del segundo lote, HTTP fallido y configuración no local. Se distinguieron de la ejecución con Ollama real y llama3.2, realizada desde terminal y notebook. El resultado de los escenarios existentes coincide antes y después de reorganizar el código.
