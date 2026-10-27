# Arquitectura de AsistenciApp

Este documento dice cómo se organiza el código de esta app. La idea sale de separar tres cosas: las reglas, las acciones y la forma de llegar a ellas. Solo está lo que hace falta para pasar lista.

## Árbol

```
asistenciapp/
├── docs/
│   ├── CONSTITUTION.md
│   └── ARCHITECTURE.md
├── AGENTS.md
├── app.py                      # navegador: petición y respuesta
└── asistencia/
    ├── domain/                 # reglas
    │   ├── access.py           # límite de llamadas por IP
    │   ├── codes.py
    │   └── names.py
    ├── actions/
    │   └── attendance.py       # acciones de pasar lista
    └── infra/
        ├── db.py               # SQLite
        ├── export.py           # CSV
        └── tunnel.py           # túnel
```

`app.py` recibe la petición del navegador, llama a una acción y devuelve la respuesta. Elige el estado HTTP, el JSON, la página y la dirección del alumno.

`asistencia/domain/` guarda las reglas del código de cuatro cifras, del nombre y del límite de llamadas por IP. No abre la base y no conoce el navegador.

`asistencia/actions/attendance.py` hace las acciones de pasar lista: datos públicos de una clase, registrar a un alumno, listar clases, abrir una clase, vista del profesor, cerrar una clase, quitar un registro y preparar el CSV. Usa las reglas y la base. No conoce el navegador.

`asistencia/infra/` es la forma de guardar y de salir fuera: la base SQLite, el CSV y el túnel. Hay una sola forma de guardar.

## Qué no se trae

Del ejemplo de capas se usa la separación de arriba. No se trae otra base de datos, ni una línea de comandos, ni un generador de documentación, ni ganchos de commit, ni una clase con su interfaz para cada detalle.
