# Alinear la apertura de pull request

Issue: #913.

Quien trabaja en esta app abre la pull request como la plantilla actual
del ejercicio del flujo de git. Esa apertura deja la pull request con
base staging, en draft y asignada a quien está autenticado, en un solo
paso.

Lo usa quien construye la app con IA.

Entra el momento de empezar, con la issue ya escrita. Sale la pull
request abierta contra staging, en draft y asignada, sin un paso extra
de autor ni de draft. El orquestador confirma que cada paso ha salido
bien antes del siguiente. Si la pull request de esa rama ya existía,
el draft y la asignación se aplican sobre esa, no se abre otra.

Ejemplo: el alumno pide empezar. Tras la rama, el commit vacío y el
push, se abre una pull request en draft asignada a quien está
autenticado. No hay un paso posterior de pasar a draft ni de asignar
autor en esa apertura.

No hay un fallo de la lista «Errores». Si la apertura no deja draft y
autor a la vez, si el orquestador sigue pidiendo esos dos pasos al
crear, o si sigue al siguiente paso sin confirmar el anterior, el
flujo no está alineado.

Queda fuera cambiar las reglas de negocio, la base de datos, los
clientes, los paquetes, las plantillas por tipo ya alineadas, las
paradas de «Orden», el MCP de Socket, `AGENTS.md`,
`docs/CONSTITUTIONS.md`, `docs/TREE.md` y el contenido de otras specs
ya escritas.
