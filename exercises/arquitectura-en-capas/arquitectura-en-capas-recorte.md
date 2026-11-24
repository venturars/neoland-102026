# Recorte de «Arquitectura en capas» hacia la skill

Fuente: `docs/research/arquitectura-en-capas.md` (v1.2, 92 reglas). Destino: `.apm/skills/layered-architecture-guideline/`.

Este documento decide qué regla va a qué fichero y con qué etiqueta. Quien corta la fuente lo ejecuta sin reclasificar. Si una regla no encaja, pregunta en la issue en lugar de decidir.

Reglas de trabajo:

- Conserva los IDs de la v1.2. Áreas: AGT, GEN, PRE, APL, DOM, INF, SHR, FLU, ERR, EST, PAR, TST.
- Cada ID se define una sola vez. Cuando dos reglas se fusionan, la frase conserva los dos IDs.
- `SKILL.md` tiene 1.500 palabras o menos. Cada referencia, 800 o menos, código incluido. Si algo no cabe, recorta ejemplos y tablas, nunca reglas INV. Si una referencia sigue sin caber, deja una sola plantilla de código y pregunta en la issue.
- `SKILL.md` no lleva código ni nombra `Result`, RORO, `AppError`, un lenguaje o un framework.

## Etiquetas

| Etiqueta | Significa | Cambiarla exige |
| --- | --- | --- |
| INV | No cambia con ninguna tecnología ni decisión de equipo | Una excepción escrita en `docs/ARCHITECTURE.md` del proyecto |
| DEF | Se aplica por defecto; el stack o el proyecto puede adaptarla | Registrar la decisión en `docs/ARCHITECTURE.md` o `docs/STYLE.md` |
| CONV | Convención de estilo o de equipo, intercambiable | Cambiar `docs/STYLE.md` del proyecto, o el fichero de `references/` si cambia el estándar |

Prueba para decidir: si quito la regla, ¿sigo teniendo capas, dependencias hacia dentro y dominio aislado? Si la respuesta es sí, no es INV.

## Destinos

| Código | Fichero |
| --- | --- |
| SKILL-INV | `SKILL.md`, sección Invariantes. El número remite a la tabla siguiente |
| SKILL-PROTO | `SKILL.md`, sección Flujo de Trabajo |
| SKILL-INT | `SKILL.md`, sección Intensidad y variante |
| REF-ERR | `references/errores.md` |
| REF-PAR | `references/paradigma-y-firmas.md` |
| REF-TST | `references/tests.md` |
| REF-NOM | `references/nombres-y-carpetas.md` |
| REF-FW | `references/frameworks.md` |
| REF-FLU | `references/flujo-y-validacion.md` |
| ASSET-MAPA | `assets/ARCHITECTURE.template.md` |
| SCRIPT | `scripts/check-boundaries.sh` y la configuración de fronteras en `assets/` |

## Invariantes del núcleo

Son 12 enunciados. En `SKILL.md` cada uno es una frase que cita sus IDs. Las reglas INV que no están aquí son de protocolo y van en SKILL-PROTO.

| Nº | Enunciado | IDs |
| --- | --- | --- |
| 1 | Cuatro capas (presentación, aplicación, dominio, infraestructura), cada una con una sola responsabilidad, más shared transversal | Sección 2.1, sin ID |
| 2 | Las dependencias van solo hacia dentro, sin ciclos. Las capas son cerradas y shared es la única abierta. Un módulo solo usa la API pública de otro | R-GEN-01, R-GEN-02, R-GEN-04, R-FLU-01, R-FLU-02, R-EST-02 |
| 3 | El dominio no hace entrada/salida ni importa frameworks. La hora, el azar y los identificadores entran por parámetro o por puerto | R-DOM-01, R-PAR-01 |
| 4 | La infraestructura implementa interfaces definidas en dominio o aplicación, y la aplicación solo la usa a través de ellas | R-INF-01, R-APL-03 |
| 5 | La presentación valida la forma, traduce y no contiene negocio ni importa infraestructura | R-PRE-01, R-PRE-02, R-PRE-04 |
| 6 | La aplicación orquesta el caso de uso y controla transacción y autorización. La autenticación se resuelve en la presentación | R-APL-05, R-APL-06 |
| 7 | Nada cruza una frontera sin mapeo: ni entidades ni modelos de persistencia | R-FLU-03, R-INF-02 |
| 8 | Las dependencias concretas se crean en un único sitio, la raíz de composición | R-FLU-08 |
| 9 | El protocolo (HTTP, CLI, interfaz) se queda en la presentación. El dominio no lo conoce | R-PRE-05, R-ERR-10 |
| 10 | Cada frontera traduce sus errores y conserva la causa. Nada interno ni sensible llega al cliente ni a los logs. Un único punto traduce y registra | R-INF-03, R-ERR-01, R-ERR-03, R-ERR-04, R-ERR-08, R-ERR-12, R-ERR-16 |
| 11 | El proyecto declara su política de errores y su trazabilidad en `docs/ARCHITECTURE.md` | R-ERR-05 |
| 12 | Shared no tiene negocio ni importa de otras capas | R-SHR-01, R-SHR-02 |

Reglas INV de protocolo (SKILL-PROTO): R-AGT-01, R-AGT-02, R-AGT-05, R-AGT-07, R-EST-01, R-EST-04, R-EST-07, R-EST-08 y R-GEN-05 (esta, en SKILL-INT).

## Correcciones al cortar

1. **Manejador global duplicado.** La tabla 2.1 lo pone en presentación y en platform. La lógica de traducción vive en presentación (R-ERR-08). Platform solo lo registra en el servidor.
2. **ADR.** Elimina las menciones (cabecera «Cómo leer» y receta 9.1). Las desviaciones y las decisiones se registran en la sección «Excepciones y decisiones» de `docs/ARCHITECTURE.md`.
3. **R-GEN-05.** Cambia «íntegro el manejo de errores de la sección 5» por «las reglas de errores INV».
4. **R-DOM-05.** El DEBE aplica a la variante completa. En la ligera, los repositorios son opcionales (tabla 2.4).
5. **R-APL-02.** En `SKILL.md`, sin nombrar `Result` ni RORO: «recibe un comando inmutable y devuelve éxito o un error esperado». El contrato completo va en REF-PAR.
6. **R-ERR-01.** En `SKILL.md`, sin nombrar `AppError`: «error propio del sistema, con tipo y código estables». La jerarquía va en REF-ERR.
7. **R-ERR-05.** En `SKILL.md` solo exige declarar una política única para los errores esperados y la trazabilidad. `Result` queda como recomendación en REF-ERR.
8. **Controlador de ejemplo.** Añade un comentario: con política `Result`, el controlador relanza el error esperado para que el manejador global lo traduzca (R-ERR-08).
9. **Duplicados.** Fusiona en una frase, conservando los dos IDs: R-FLU-04 con R-PAR-03, R-AGT-02 con R-EST-04, R-AGT-07 con R-EST-08. R-ERR-14 se enlaza desde R-PRE-02.
10. **Anexo.** La plantilla gana dos secciones: «Política de errores y trazabilidad» y «Excepciones y decisiones». La ruta del mapa en un proyecto es `docs/ARCHITECTURE.md`, no `.apm/instructions/`.
11. **Cabecera de la fuente.** `applyTo: "**"` no pasa a la skill. El frontmatter de `SKILL.md` es `name` y `description`.
12. **Sección 10 (antipatrones).** No se migra: cada antipatrón es la negación de una regla. Las «señales de mal uso» de 2.4 van a SKILL-INT.

## Reglas: etiqueta y destino

### AGT · Protocolo del agente

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-AGT-01 | INV | SKILL-PROTO | Paso 1. La inferencia del mapa (3.2) va a REF-NOM |
| R-AGT-02 | INV | SKILL-PROTO | Fusionar con R-EST-04 |
| R-AGT-03 | DEF | SKILL-PROTO | Complementa a R-EST-07 |
| R-AGT-04 | DEF | SKILL-PROTO | Una línea |
| R-AGT-05 | INV | SKILL-PROTO | |
| R-AGT-06 | CONV | SKILL-PROTO | Una línea |
| R-AGT-07 | INV | SKILL-PROTO + REF-FW | Fusionar con R-EST-08 |

### GEN · Principios generales

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-GEN-01 | INV | SKILL-INV 2 | |
| R-GEN-02 | INV | SKILL-INV 2 | |
| R-GEN-03 | DEF | SKILL-INT | La variante clásica se documenta en el mapa |
| R-GEN-04 | INV | SKILL-INV 2 + SCRIPT | |
| R-GEN-05 | INV | SKILL-INT | Ver corrección 3 |

### FLU · Flujo entre capas

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-FLU-01 | INV | SKILL-INV 2 | |
| R-FLU-02 | INV | SKILL-INV 2 + SCRIPT | La matriz 2.2 va en `SKILL.md` y es la base de la configuración del script |
| R-FLU-03 | INV | SKILL-INV 7 | |
| R-FLU-04 | CONV | REF-PAR | Fusionar con R-PAR-03 |
| R-FLU-05 | DEF | REF-FLU | La pureza del mapper se remite a REF-PAR |
| R-FLU-06 | DEF | REF-FLU | Mecanismo de la transacción de R-APL-05 |
| R-FLU-07 | DEF | SKILL-INT + REF-FLU | Una línea en `SKILL.md`: es la única excepción a R-GEN-01 |
| R-FLU-08 | INV | SKILL-INV 8 | |
| R-FLU-09 | DEF | REF-FLU | |
| R-FLU-10 | CONV | REF-FLU | |
| R-FLU-11 | CONV | REF-FLU | |
| R-FLU-12 | CONV | REF-FLU | |
| R-FLU-13 | DEF | REF-FLU | |
| R-FLU-14 | CONV | REF-FLU | |

### PRE · Presentación

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-PRE-01 | INV | SKILL-INV 5 | |
| R-PRE-02 | INV | SKILL-INV 5 | Enlaza R-ERR-14 |
| R-PRE-03 | DEF | REF-FLU | |
| R-PRE-04 | INV | SKILL-INV 5 + SCRIPT | |
| R-PRE-05 | INV | SKILL-INV 9 | |

### APL · Aplicación

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-APL-01 | DEF | REF-NOM | |
| R-APL-02 | CONV | REF-PAR | Ver corrección 5 |
| R-APL-03 | INV | SKILL-INV 4 | |
| R-APL-04 | DEF | REF-FLU | |
| R-APL-05 | INV | SKILL-INV 6 | El mecanismo va en R-FLU-06 |
| R-APL-06 | INV | SKILL-INV 6 | |

### DOM · Dominio

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-DOM-01 | INV | SKILL-INV 3 + SCRIPT | |
| R-DOM-02 | DEF | REF-PAR | Modelo rico, variante completa |
| R-DOM-03 | CONV | REF-PAR | |
| R-DOM-04 | CONV | REF-PAR | |
| R-DOM-05 | DEF | SKILL-INT | Ver corrección 4 |

### INF · Infraestructura

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-INF-01 | INV | SKILL-INV 4 | |
| R-INF-02 | INV | SKILL-INV 7 | |
| R-INF-03 | INV | SKILL-INV 10 | |
| R-INF-04 | DEF | REF-FLU | Sección «Resiliencia» |

### SHR · Código común

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-SHR-01 | INV | SKILL-INV 12 + SCRIPT | |
| R-SHR-02 | INV | SKILL-INV 12 | |
| R-SHR-03 | DEF | REF-NOM | |
| R-SHR-04 | DEF | REF-PAR | Se agrupa con la lista de efectos secundarios (variables de entorno) |

### EST · Estructura

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-EST-01 | INV | SKILL-PROTO + ASSET-MAPA | El proyecto declara su mapa y sus decisiones en `docs/ARCHITECTURE.md` |
| R-EST-02 | INV | SKILL-INV 2 + SCRIPT | Si el proyecto tiene módulos |
| R-EST-03 | DEF | REF-NOM | |
| R-EST-04 | INV | SKILL-PROTO | Fusionar con R-AGT-02 |
| R-EST-05 | DEF | REF-NOM | |
| R-EST-06 | DEF | SCRIPT + ASSET-MAPA | Reglas verificadas: R-GEN-04, R-DOM-01, R-PRE-04, R-SHR-01, R-EST-02 |
| R-EST-07 | INV | SKILL-PROTO | |
| R-EST-08 | INV | SKILL-PROTO + REF-FW | Fusionar con R-AGT-07 |

### ERR · Errores

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-ERR-01 | INV | SKILL-INV 10 | Ver corrección 6 |
| R-ERR-02 | CONV | REF-ERR | |
| R-ERR-03 | INV | SKILL-INV 10 | |
| R-ERR-04 | INV | SKILL-INV 10 | Agrupar con R-ERR-16: sin secretos en `details` ni en logs |
| R-ERR-05 | INV | SKILL-INV 11 | Ver corrección 7 |
| R-ERR-06 | CONV | REF-ERR | |
| R-ERR-07 | CONV | REF-ERR | |
| R-ERR-08 | INV | SKILL-INV 10 | |
| R-ERR-09 | CONV | REF-ERR | |
| R-ERR-10 | INV | SKILL-INV 9 | |
| R-ERR-11 | CONV | REF-ERR | |
| R-ERR-12 | INV | SKILL-INV 10 | |
| R-ERR-13 | CONV | REF-FLU | Validación de forma |
| R-ERR-14 | DEF | REF-FLU | Consecuencia de R-PRE-02 |
| R-ERR-15 | DEF | REF-ERR | `requestId`. En `SKILL.md` basta con que la política declare la trazabilidad (invariante 11) |
| R-ERR-16 | INV | SKILL-INV 10 | Agrupar con R-ERR-04 |

### PAR · Paradigmas

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-PAR-01 | INV | SKILL-INV 3 | |
| R-PAR-02 | CONV | REF-PAR | |
| R-PAR-03 | CONV | REF-PAR | Fusionar con R-FLU-04 |
| R-PAR-04 | CONV | REF-PAR | |
| R-PAR-05 | CONV | REF-PAR | |
| R-PAR-06 | CONV | REF-PAR | |
| R-PAR-07 | DEF | REF-PAR | |
| R-PAR-08 | CONV | REF-PAR + ASSET-MAPA | El estilo elegido se registra en el mapa |
| R-PAR-09 | CONV | REF-PAR | RORO |
| R-PAR-10 | CONV | REF-PAR | |
| R-PAR-11 | CONV | REF-PAR | |
| R-PAR-12 | CONV | REF-PAR | |
| R-PAR-13 | CONV | REF-PAR | |

### TST · Pruebas

| ID | Etiqueta | Destino | Nota |
| --- | --- | --- | --- |
| R-TST-01 | DEF | REF-TST | |
| R-TST-02 | CONV | REF-TST | |
| R-TST-03 | DEF | REF-TST | |
| R-TST-04 | DEF | REF-TST | |
| R-TST-05 | CONV | REF-TST | |

## Contenido que no es una regla

| Sección de la fuente | Destino |
| --- | --- |
| Cabecera «Cómo leer» (vocabulario y prioridad ante conflictos) | SKILL-PROTO, en breve |
| 2.1 Capas | `SKILL.md`, tabla reducida a Responsabilidad y No contiene |
| 2.2 Matriz de imports | `SKILL.md` y base de la configuración de SCRIPT |
| 2.3 Tabla de decisión | `SKILL.md`. Las equivalencias por tipo de proyecto van a REF-FW |
| 2.4 Variante e intensidad | SKILL-INT, con las señales de mal uso |
| 3.1 Mapa de capas | ASSET-MAPA |
| 3.2 Inferir el mapa, 3.3 Nombres | REF-NOM |
| 4.1, 4.2, 4.3 | REF-FLU. En `SKILL.md`, una línea sobre fronteras (invariante 7) |
| 5.1 Taxonomía y Trazabilidad | REF-ERR |
| 5.2 Qué hace cada capa | `SKILL.md` (cuatro líneas, invariante 10) y REF-ERR |
| 6 Paradigmas, efectos, RORO, equivalencias por lenguaje | REF-PAR |
| 7 Pruebas | REF-TST |
| 8 Plantillas de código | Errores y repositorio: REF-ERR. Entidad: REF-PAR. Caso de uso y controlador: REF-FLU. Manejador global: REF-ERR. `SKILL.md` no lleva código |
| 9.1 Receta | SKILL-PROTO, resumida |
| 9.2 Verificación final | Checklist de `SKILL.md`, una línea por fila |
| 10 Antipatrones | No se migra (corrección 12) |
| Anexo | ASSET-MAPA, con la corrección 10 |

## Cuentas de control

| Etiqueta | Reglas |
| --- | --- |
| INV | 39 (30 en los 12 invariantes y 9 de protocolo) |
| DEF | 25 |
| CONV | 28 |
| Total | 92 |

Al terminar, comprueba que cada ID de la v1.2 aparece en la skill exactamente una vez y que las cuentas coinciden.
