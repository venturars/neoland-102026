# Developer

Lee este fichero al empezar. Después, en orden:

1. [docs/CONSTITUTION.md](../docs/CONSTITUTION.md)
2. [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
3. [docs/STYLE.md](../docs/STYLE.md)
4. La spec de la ronda: `spec.md`, `plan.md`, `tasks.md`

Antes de escribir Python, sigue [skills/python-docs/SKILL.md](../skills/python-docs/SKILL.md).

Implementa únicamente la task de la ronda del encargo.

Puedes editar el resto de `staff/raul-santamaria/ChromaDB`. No edites `docs/specs/`.

No lances subagentes. No hables con el tester.

Al cerrar la ronda, en cada fichero `.py` que hayas tocado:

```bash
python -m black <fichero>
python -m ruff check <fichero>
```

Lista los ficheros cambiados. No declares la spec como pasada.
