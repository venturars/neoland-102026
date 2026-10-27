# Spec 003 · Títulos de las instrucciones de arranque

> Estado: **Aprobada** · Creada: 2026-10-23 · Aprobada: 2026-10-23

---

## 1. Problema

Quien sigue las instrucciones de arranque de AsistenciApp encuentra el título «Arrancar la app» encima del bloque que solo entra en la carpeta del proyecto y prepara el entorno de trabajo. Los pasos que de verdad ponen la aplicación en marcha quedan debajo, sin un título propio.

Eso hace que preparar el entorno y arrancar la aplicación parezcan la misma acción.

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien arranca AsistenciApp** | Distinguir, al leer las instrucciones, el paso de preparar el entorno del paso de poner la aplicación en marcha. |

## 3. Historias de usuario

- **HU-01**: Como persona que arranca AsistenciApp, quiero que el bloque para entrar en la carpeta y preparar el entorno se titule «Activar el entorno», para no confundirlo con arrancar la aplicación.
- **HU-02**: Como persona que arranca AsistenciApp, quiero que el título «Arrancar la app» cubra solo los pasos que ejecutan la aplicación, para saber cuál usar en una clase online y cuál para probar en mi ordenador.

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

- **CA-01**: **Dado** el documento de uso de AsistenciApp, **cuando** se lee el bloque que entra en la carpeta del proyecto y prepara el entorno de trabajo, **entonces** ese bloque se titula «Activar el entorno» y ya no se titula «Arrancar la app».
- **CA-02**: **Dado** el documento de uso de AsistenciApp, **cuando** se buscan los pasos que ejecutan la aplicación, uno para una clase online y otro para probar solo en el ordenador, **entonces** esos pasos siguen bajo el título «Arrancar la app».
- **CA-03**: **Dado** las instrucciones de arranque ya escritas, **cuando** se corrigen los títulos, **entonces** se conservan los comandos, las rutas, el formato de las instrucciones y el resto del documento, y no cambia el comportamiento de la aplicación ni otros archivos.

## 5. Fuera de alcance

- Cambiar el texto de los comandos o las rutas que ya están en las instrucciones.
- Renumerar el resto de secciones del documento de uso.
- Cambiar cómo se arranca la aplicación o cualquier otra parte del producto.
- Escribir el plan o las tareas dentro de este documento. Esas son las fases siguientes.

## 6. Preguntas abiertas

Ninguna. El título del bloque de preparación es «Activar el entorno» y el título de la ejecución es «Arrancar la app».
