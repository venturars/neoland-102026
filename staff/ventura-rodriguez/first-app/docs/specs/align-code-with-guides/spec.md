# Alinear el código con las guías

Issue: #412.

Quien construye la app ve en el código la misma forma que en las
guías. El funcionamiento no cambia.

Lo usa quien escribe un desarrollo y quien comprueba que el código
cabe en las guías.

Entra el código de ahora. No entra ningún dato nuevo.

Sale el mismo resultado para cada cosa que la app ya hace. Crear,
cambiar, borrar, listar, buscar y contar por género devuelven lo
mismo y fallan con los mismos mensajes. Cada línea deja una sola
acción en un nombre. Una llamada y una comprobación no comparten
línea. Un fallo de la lista se comprueba con una condición, y el
aviso va en su propia línea.

Ejemplo: se crea un usuario con nombre Ada y email ada@example.com.
Sale el mismo usuario que ahora. El email queda en minúsculas. El
código que lo hace no junta leer el nombre y recortarlo en la misma
línea.

No hay un fallo nuevo de la lista «Errores». Si un resultado cambia,
si un mensaje cambia, o si una línea sigue con dos acciones, el
desarrollo no está hecho.

Queda fuera una funcionalidad nueva, un mensaje nuevo, cambiar el
SQL, un paquete nuevo y cambiar las guías.
