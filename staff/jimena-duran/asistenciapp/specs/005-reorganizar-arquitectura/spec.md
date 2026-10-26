# Spec 005 · Reorganizar documentos y arquitectura

Responsable: Jimena Durán. Issue #244.
Estado: implementación autorizada y verificada localmente.

## Problema y usuarios

Jimena necesita encontrar las reglas y comprender la organización del proyecto.
El agente necesita límites claros de responsabilidad y una guía de escritura.
Profesor y alumnado necesitan conservar el funcionamiento actual de asistencia.
Hoy la entrada de la aplicación mezcla decisiones de asistencia y almacenamiento.

## Historias de usuario

- HU-01: Como Jimena quiero localizar reglas y arquitectura en documentos claros.
- HU-02: Como agente quiero una guía de escritura y responsabilidades separadas.
- HU-03: Como profesora o alumna quiero conservar los resultados de uso actuales.

## Criterios de aceptación

- CA-01: La constitución está en docs/CONSTITUTION.md y no en la raíz.
- CA-02: docs/ARCHITECTURE.md explica reglas, acciones y borde, sin herramientas innecesarias.
- CA-03: AGENTS.md sustituye AGENT.md y explica parámetros, resultados y ejemplos de funciones.
- CA-04: Las reglas de asistencia no abren almacenamiento ni muestran pantallas.
- CA-05: El almacenamiento no decide reglas de asistencia ni muestra pantallas.
- CA-06: La entrada que atiende al usuario delega reglas y almacenamiento.
- CA-07: Abrir, registrar, listar, cerrar, eliminar y exportar asistencia conservan sus resultados.
- CA-08: README y guía enlazan los documentos en su ubicación nueva.
- CA-09: La constitución describe la organización nueva con enmienda registrada;
  propósito, privacidad y reglas del producto se conservan.

## Fuera de alcance

Funciones nuevas, dependencias nuevas, cambios visuales, bot de Discord,
reescribir specs 001–004 y adaptar comandos a otro sistema operativo.

## Preguntas abiertas

Ninguna para preparar el trabajo. Presentar el plan antes de ejecutar la reorganización.
## Resultado local

Jimena autorizó ejecutar la 005. Implementada y verificada: 108 pruebas pasan.
Static y specs 001–004 intactos por hash. Sin commit ni push de implementación.
