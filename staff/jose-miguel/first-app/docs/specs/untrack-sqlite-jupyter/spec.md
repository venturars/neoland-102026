# Spec · Base local fuera de git y arranque Jupyter

Issue: #744

## 1. Problema

Quien clona el repositorio no debe recibir la base de usuarios de otra persona. Quien prueba la app debe saber que la base es local y cómo abrir los cuadernos con el mismo comando de siempre.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien clona** | Un repo sin datos personales en la base SQLite. |
| **Quien prueba** | Arrancar Jupyter con `pnpm jupyter` y usar la base que se crea al usar la app. |

## 3. Historias de usuario

- **HU-01**: Como quien clona, quiero que la base de usuarios no esté en git, para empezar con mis propios datos.
- **HU-02**: Como quien prueba, quiero que las guías digan que la base es local y no se versiona.
- **HU-03**: Como quien prueba, quiero que `pnpm jupyter` siga abriendo Notebook sobre los cuadernos de `src/clients/jupyter/`.

## 4. Criterios de aceptación

- **CA-01**: **Dado** el repositorio, **cuando** se lista con git el fichero `src/db/users.sqlite` de first-app, **entonces** no aparece en el índice de versiones.
- **CA-02**: **Dado** first-app, **cuando** se comprueba ignore sobre `src/db/users.sqlite`, **entonces** git lo trata como ignorado.
- **CA-03**: **Dado** first-app, **cuando** se ejecuta `pnpm jupyter`, **entonces** se usa el script shell y se abre Notebook sobre `src/clients/jupyter/`.
- **CA-04**: **Dado** las guías DATABASE, ARCHITECTURE, TREE y AGENTS, **cuando** se leen, **entonces** indican que la base es local y no va en git.
- **CA-05**: **Dado** un cliente terminal existente, **cuando** se ejecuta tras el cambio, **entonces** el comportamiento de la app no cambia.

## 5. Fuera de alcance

- Nuevas funciones en `logic/`, SQL o clientes.
- Cambiar cuadernos o el contenido de las pruebas.
- Spec `jupyter-cross-platform`.
- Editar specs antiguas en `docs/specs/jupyter-client/`.

## 6. Preguntas abiertas

Ninguna.

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-11-02 | Spec inicial para #744 |
