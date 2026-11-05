# Spec · Arranque de Jupyter en Linux y Windows

Issue: #746

## 1. Problema

Quien prueba la app en Windows con PowerShell no puede abrir Jupyter con `pnpm jupyter` porque el comando depende de `sh`, que no está en PATH. En Linux el mismo entrypoint debe seguir funcionando.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien prueba en Windows** | Ejecutar `pnpm jupyter` desde PowerShell y ver los nueve cuadernos. |
| **Quien prueba en Linux** | El mismo comando sin instalar Git Bash. |

## 3. Historias de usuario

- **HU-01**: Como quien prueba en PowerShell, quiero `pnpm jupyter`, para abrir Notebook sobre los cuadernos sin `sh`.
- **HU-02**: Como quien prueba, quiero la primera ejecución que prepare `.venv` y Notebook 7.6.3, y las siguientes que reutilicen el entorno.
- **HU-03**: Como quien prueba, quiero ver los nueve cuadernos existentes en `src/clients/jupyter/`.

## 4. Criterios de aceptación

- **CA-01**: **Dado** PowerShell con el directorio en first-app, **cuando** se ejecuta `pnpm jupyter`, **entonces** arranca Notebook sin error de `sh` no reconocido.
- **CA-02**: **Dado** el arranque correcto, **cuando** se abre la interfaz, **entonces** hay nueve documentos en `src/clients/jupyter/`.
- **CA-03**: **Dado** falta Python 3 en el sistema, **cuando** se ejecuta `pnpm jupyter`, **entonces** el mensaje es `Python 3 is required to start Jupyter.` y el código de salida no es cero.
- **CA-04**: **Dado** el launcher Node, **cuando** arranca Notebook, **entonces** el proceso hereda `PYTHONUTF8=1`.
- **CA-05**: **Dado** las guías AGENTS y ARCHITECTURE, **cuando** se leen, **entonces** describen `node scripts/start-jupyter.js` y no `sh scripts/jupyter.sh`.
- **CA-06**: **Dado** Linux real o WSL, **cuando** se prueba `pnpm jupyter`, **entonces** funciona igual; si no hay Linux en el equipo, la spec deja constancia en tasks de validación pendiente.

## 5. Fuera de alcance

- Cambiar cuadernos, clientes terminal o `logic/`.
- Paquetes npm nuevos.
- Editar carpetas de specs antiguas (`jupyter-client/`, `untrack-sqlite-jupyter/`).

## 6. Preguntas abiertas

Ninguna.

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-11-02 | Spec inicial para #746 |
