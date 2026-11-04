# Abrir la pull request en un paso

Issue: #910.

Quien trabaja en esta app abre la pull request como la plantilla
del curso. Sale con base staging, en borrador y asignada a quien
está autenticado. Eso ocurre en una sola vez.

Lo usa quien construye la app con IA.

Entra una tarea ya escrita y una rama ya subida. Sale una pull
request. La base es staging. Está en borrador. La persona asignada
es quien está autenticado. El cuerpo sigue la plantilla del tipo y
la sección de la issue queda vacía.

Si esa pull request ya existe, se actualiza el cuerpo, la
asignación y el borrador. Se conserva el enlace con la tarea. No
se abre otra. Si ya estaba en borrador, sigue en borrador.

Ejemplo: se pide un cambio de tipo feat y la rama ya está en el
remoto. La pull request queda contra staging, en borrador y
asignada a quien está autenticado. La sección de la issue del
cuerpo está vacía.

Antes de pasar al paso siguiente, se confirma que este ha salido
bien. Si no sale, se dice el error y no se inventa el enlace. No
se sigue hasta resolverlo.

Aunque el flujo de git no pare, en esta app hay dos paradas. La
primera es antes de crear las tareas: una persona revisa la spec
y el plan. La segunda es al crear las tareas.

No hay un fallo de la lista «Errores». Si la pull request se abre
sin borrador, si no queda asignada, si se abre una segunda para
la misma rama, o si se inventa el enlace, la apertura no está
actualizada.

Queda fuera el resto del flujo que ya coincide con la plantilla,
las reglas de negocio, la base de datos, los clientes, los
paquetes y el MCP de Socket.
