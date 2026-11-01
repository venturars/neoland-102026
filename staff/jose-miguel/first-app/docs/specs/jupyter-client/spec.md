# Spec · Cliente Jupyter

> Estado: **Aprobada** (2026-10-27)

---

## 1. Problema

Las funcionalidades de usuarios ya se prueban pegando comandos en la terminal. Quien no quiere usar solo la terminal necesita los mismos comandos en el navegador, en un cuaderno, sin cambiar lo que hace cada prueba.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien prueba la app** | Abrir un cuaderno por cada prueba de terminal y ejecutar el mismo comando. |
| **Quien desarrolla** | Un solo comando desde la app que abre esos cuadernos en local. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que prueba la app, quiero un cuaderno por cada cliente de terminal, para repetir la misma prueba en el navegador.
- **HU-02**: Como persona que prueba la app, quiero que el comando de cada celda sea el mismo texto que en la terminal, para no aprender otra forma de lanzarlo.
- **HU-03**: Como persona que desarrolla, quiero abrir esos cuadernos con un comando de la app, para no depender del Jupyter instalado en el sistema.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** los clientes de terminal existentes, **cuando** se mira el cliente Jupyter, **entonces** hay un cuaderno con el mismo nombre por cada `.txt` de terminal.
- **CA-02**: **Dado** un cuaderno, **cuando** se mira una celda de prueba, **entonces** su texto es exactamente la línea `node --input-type=module -e "..."` del `.txt` correspondiente.
- **CA-03**: **Dado** la app, **cuando** se lanza el comando de Jupyter desde el gestor de paquetes, **entonces** se abre la interfaz Notebook (no Lab) sobre la carpeta de cuadernos, en la máquina local.
- **CA-04**: **Dado** un cuaderno abierto, **cuando** se ejecuta una celda de prueba, **entonces** la salida es la misma que al pegar esa línea en la terminal con el directorio en la app.
- **CA-05**: **Dado** la primera ejecución, **cuando** falta el entorno local de Notebook, **entonces** el comando lo prepara; las veces siguientes solo abren la interfaz.

---

## 5. Fuera de alcance

- Cambiar las funcionalidades de usuarios.
- JupyterLab o el Jupyter global del ordenador.
- Un kernel de JavaScript aparte.
- Sustituir la salida por tablas u otro formato distinto al de la terminal.

---

## 6. Preguntas abiertas

Ninguna.

---

## 7. Historial

| Versión | Fecha | Cambio |
| --- | --- | --- |
| 1.0 | 2026-10-27 | Aprobada para implementar (opción B, texto exacto) |
