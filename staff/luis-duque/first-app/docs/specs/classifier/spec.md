# Clasificador de género por nombre

Se leen los nombres que ya están guardados, de cualquier tipo y tal como están escritos. No se pide ningún nombre nuevo y no se modifican los datos. De cada registro se toma solo el nombre.

Se estima el género preguntando a Ollama, que ya está instalado en el equipo. No se llama a ninguna inteligencia artificial por internet. A cada nombre se le hace la misma pregunta y se espera una sola respuesta, sin explicación: hombre, mujer o no definido.

Si no hay nombres, el recuento queda en cero.

Si hay nombres, se envían de seis en seis, en el orden en que están guardados. Si al final quedan menos de seis, se envían los que haya. No se salta ninguno.

Si el nombre se usa de forma habitual para hombre, la respuesta es hombre. Si se usa para mujer, la respuesta es mujer. Si puede ser para cualquiera de los dos, o si Ollama contesta otra cosa, la respuesta es no definido. Cada respuesta se suma al recuento. En la terminal se ve así. Con Javier, si se partía de cero, sale: el nombre es javier {hombres 1, mujeres 0, sin definir 0}.

Si Ollama no contesta, se detiene el recorrido y no se inventan géneros.

Cuando ya no quedan nombres, se devuelve solo el recuento completo: cuántos son hombre, cuántos son mujer y cuántos son no definido.
