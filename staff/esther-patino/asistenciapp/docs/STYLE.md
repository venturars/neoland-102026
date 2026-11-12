# Cómo se escribe el código

Cada módulo abre con un texto breve que dice de qué va.

Cada función hace una acción y se lee de arriba abajo.

Cada función pública dice qué hace, qué recibe y qué devuelve:

```python
def code_for(secret: bytes, t: float) -> str:
    """Calcula el código de cuatro cifras de este instante.

    :param secret: secreto de la clase.
    :param t: instante, en segundos.
    :return: el código de cuatro cifras.
    """
```

`:param` es lo que recibe. `:return` es lo que devuelve.
