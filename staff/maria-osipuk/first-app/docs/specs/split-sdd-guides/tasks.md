# Guías separadas por tema

## 1. Crear el árbol

Abrir `docs/TREE.md` y escribir el apartado «Árbol» de `docs/specs/split-sdd-guides/plan.md`.
El fichero solo tiene el árbol.
No tiene frases de responsabilidad.
Incluye los cinco ficheros nuevos y `docs/CONSTITUTION.md`.

## 2. Crear la arquitectura

Abrir `docs/ARCHITECTURE.md` y escribir el apartado «Arquitectura» del plan.
Dice qué hace cada capa y cada fichero.
No repite el árbol.
No añade una responsabilidad que la constitución no tenga ya.

## 3. Crear la base de datos

Abrir `docs/DATABASE.md` y copiar los textos del apartado «Base de datos» del plan.
La base de datos y las queries quedan en ese fichero.
El texto copiado no se reescribe.
El título del fichero es `# Base de datos`.

## 4. Crear los errores

Abrir `docs/ERRORS.md` y copiar el texto del apartado «Errores» del plan.
La lista queda en ese fichero, tal cual.
No entra la respuesta que sale bien.
El título del fichero es `# Errores`.

## 5. Crear el estilo

Abrir `docs/STYLE.md` y escribir el apartado «Estilo» del plan.
Están las convenciones y la regla declarativa de la línea.
Las constantes en mayúsculas están en ese fichero.
No se repite esa regla en otro fichero.

## 6. Dejar la constitución

Editar `docs/CONSTITUTION.md` y conservar su nombre.
Quitar el árbol, las responsabilidades, «Usuario» y las cinco viñetas de base de datos.
Añadir «Guías» y los seis pasos de `logic/`, sin la frase de la línea.
Specs, paquetes y el flujo siguen igual.

## 7. Dejar el manual del agente

Abrir `AGENTS.md` de first-app.
El estilo, la fuente de verdad y las tres frases nuevas quedan como dice el plan.
Quitar de aquí el texto que ya está en los ficheros nuevos.
No se toca el `AGENTS.md` de la raíz.

## 8. Comprobar las guías

Cada tema está en un solo fichero.
El árbol no explica responsabilidades.
La constitución y `AGENTS.md` enlazan a las guías nuevas y no copian el texto movido.
El JavaScript, el SQL y las specs ya escritas no cambian.
