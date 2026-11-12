# ARCHITECTURAL PLAN: [Código de la Issue]

## 1. ANÁLISIS DE IMPACTO EN CÓDIGO

- **Archivos a Modificar:**
  - `ruta/al/archivo_1.ext`
  - `ruta/al/archivo_2.ext`
- **Archivos a Crear:**
  - `ruta/al/nuevo_archivo.ext`

## 2. DISEÑO TÉCNICO Y FLUJO DE DATOS

<!-- Explicación técnica estricta: funciones a crear, firmas, tipos o cambios en los contratos que ya usa el proyecto -->

## 3. ESTRATEGIA DE TESTING

- **Tests Unitarios requeridos:**
  - [ ] `nombre_del_test_o_archivo` -> Verifica [comportamiento]
- **Tests de Concepto:**
  - [ ] `nombre_del_test_o_archivo` -> Verifica [la lógica de la especificación]

## 4. RIESGOS Y MITIGACIONES

- **Riesgo:** [Ej: Romper compatibilidad hacia atrás] -> **Mitigación:** [Ej: Mantener fallback]

## 5. CAPAS

<!--
  Qué capa cambia. Solo llama a la de debajo.
  El RAG de scripts/ no usa las capas de src/.
-->

- **Capa:** <!-- scripts / clients / sdk / core / storage / db -->
- **Llama a:** <!-- la capa de debajo, o ningún otro script si es un paso del RAG -->

## 6. TRADUCCIÓN A PYTEST

<!--
  Cada nombre de escenario de spec.md apunta a un test_.
  Un módulo tests/test_<funcion>.py por función de producción.
  Dentro, un test por escenario. Esto lo escribe code_tester.
-->

- **Escenario 1:** [Nombre] -> `tests/test_<funcion>.py::test_<escenario>`

## 7. COMPROBACIÓN DE CONCEPTO

<!--
  Qué frase de la documentación tiene que decir lo mismo que el código.
  No es pytest. Lo lee concept_tester.
-->

- **Documento:** `docs/<fichero>.md`
  - **Frase:** [Qué tiene que seguir diciendo]
  - **Código:** `ruta/al/fichero.py`

## 8. ESTILO

<!--
  El diseño cumple docs/STYLE.md.
  Sin clases, salvo que la librería las pida.
  Un fichero por función. RuntimeError. Tipos en la firma.
-->

- [ ] Sin clases nuevas
- [ ] Un fichero, una función
- [ ] Los fallos son `raise RuntimeError`
- [ ] La firma lleva tipos
