# Clasificador de género

## Qué se pide

Quien consulta los usuarios pide cuántos hay de cada género. El género lo decide la IA local [llama3.2](https://ollama.com/library/llama3.2): mira el nombre de cada usuario que ya existe y lo clasifica. No se guarda nada. Solo se muestra el conteo.

## Quién lo usa

Quien consulta los usuarios.

## Entrada

No hay entrada. Se clasifican todos los usuarios que ya están en el sistema. El género sale solo del nombre.

## Clasificación

- Cada usuario cuenta una vez. Dos usuarios con el mismo nombre cuentan los dos, en el mismo grupo.
- Ejemplo si los usuarios fueran Carmen, Elena, Javier, Pablo y Kim:
Carmen y Elena cuentan como mujer, Javier y Pablo como hombre, Kim cuenta en genderUndefined.

```json
{ "woman": 2, "man": 2, "genderUndefined": 1 }
```

## Salida

La salida es un solo objeto con tres números. El orden de las claves es woman, man y genderUndefined.

```json
{ "woman": 2, "man": 1, "genderUndefined": 1 }
```

Ejemplo: hay María, Pedro, Alex y Kim. La IA dice que María es mujer y Pedro es hombre, duda con Alex y no dice nada de Kim. El resultado es el objeto de arriba.

- Si no hay usuarios, la salida es `{ "woman": 0, "man": 0, "genderUndefined": 0 }`.
- Si no llega respuesta para 4 nombres, la salida es `{ "woman": 0, "man": 0, "genderUndefined": 4 }`. Falta de `choices` en la respuesta de la IA cuenta igual: esos nombres van a `genderUndefined`, sin error.
- En un mismo lote, cada nombre de la IA debe coincidir con el nombre completo enviado (una línea). Si en el lote están `Ada` y `Ada Lovelace`, clasificar solo `Ada` no cambia el conteo de `Ada Lovelace`.

## Fallo

Si no se puede conectar con Ollama, se ve el mensaje `"Could not classify the users"`. Si no se pueden leer los usuarios, se ve el mismo mensaje. Que un grupo de nombres no reciba respuesta no es este fallo.

## Fuera

- Guardar el género o el conteo.
- Crear, cambiar o borrar usuarios.
- Devolver el género de cada persona.
- Más grupos que woman, man y genderUndefined.
- Usar el email u otro dato.
- Usar un servicio de pago.
