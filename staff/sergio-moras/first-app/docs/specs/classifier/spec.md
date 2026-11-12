# Spec: Clasificador de género

## Qué queremos conseguir
Poder saber, de un vistazo, cuántos usuarios de la base de datos parecen ser hombres, cuántos mujeres y cuántos no se pueden determinar.

## Cómo se usa
La persona ejecuta una única orden. El programa lee todos los usuarios guardados y muestra tres números:
- Hombres
- Mujeres
- Género no definido

Ejemplo de salida:
```
Men: 12
Women: 9
Undefined: 4
```

## Cómo decide
- Solo mira el nombre del usuario. No usa el email ni ningún otro dato.
- Si el sistema no está razonablemente seguro, el usuario cuenta como "género no definido". Es preferible no adivinar a equivocarse.
- Cada usuario cuenta en una sola de las tres categorías, así que los tres números suman siempre el total de usuarios.

## Reglas de negocio
- La clasificación usa inteligencia artificial.
- No puede tener coste: sin pagos por uso ni cuentas de pago. Funciona en el propio ordenador de la persona.
- El resultado solo se muestra. No se guarda y no modifica ni borra ningún dato de los usuarios.
- Si no hay usuarios, se muestran los tres números a cero.
- Si no se puede hacer la clasificación (por ejemplo, el sistema de IA no responde), se avisa con un mensaje y no se muestran números. Nunca se presenta como resultado real algo que no se ha podido calcular.

## Casos a cubrir
- Nombres claramente masculinos o femeninos.
- Nombres neutros o ambiguos (cuentan como no definido).
- Nombres que el sistema no reconoce (cuentan como no definido).
- Base de datos sin usuarios.

## Limitaciones conocidas
- El resultado es una estimación basada solo en el nombre, no una certeza. Un nombre ambiguo, como Andrea o Sam, puede acabar en hombres o en mujeres en lugar de en "no definido".
- En una prueba con 100 nombres acertó 99, y los 80 nombres claramente masculinos o femeninos los acertó todos. Es una muestra pequeña y de nombres sobre todo occidentales, así que no garantiza esa precisión con cualquier usuario.

## Fuera de alcance
- Guardar el género de cada usuario.
- Corregir a mano una clasificación.
- Mostrar qué usuario ha sido clasificado en cada grupo.

## Criterios de aceptación
- Al ejecutarlo se ven los tres números y suman el total de usuarios.
- Los datos de los usuarios quedan exactamente igual que antes.
- No hace falta pagar nada ni crear ninguna cuenta para usarlo.
