Issue: #759

# Tareas para restaurar el flujo original

Spec, plan y T01–T10 aprobados. T01–T10 implementados y comprobados; resultados en [verification.md](verification.md). T10 y publicación selectiva autorizados; sin revisores ni merge.
Fuente fijada: `6db669aac7c0811c966ba7ba9bc4fc7e3ae6e953`. Rutas relativas a first-app.

- [x] T01. Capturar hashes y referencias del alcance protegido antes de implementar.
  Resultado: datos, lógica, clientes, dependencias, documentos históricos y trabajos independientes comprobables al cierre. (Criterio 5)
- [x] T02. Copiar los siete `.sh` originales desde sus blobs, conservando nombres, contenido y LF; retirar los ocho `.ps1` y tres ensayos propios del inventario.
  Resultado: siete herramientas originales, sin sustitutos, helpers ni ensayos permanentes añadidos. (Criterio 1)
- [x] T03. Recuperar los siete agentes y quince skills; aplicar únicamente el párrafo local del orquestador y las siete rutas aprobadas.
  Resultado: prioridad expresa del SDD de first-app y ocho adaptaciones exactas, sin reglas nuevas. (Criterios 2–3)
- [x] T04. Conservar las doce plantillas coincidentes y restaurar la referencia MCP original.
  Resultado: coincidencia con la fuente, selección y alternativa originales; sin instalaciones ni cambios de configuración personal. (Criterios 2, 4–5)
- [x] T05. Actualizar únicamente AGENTS y las guías GIT-AUTOMATION, TREE y ARCHITECTURE según el plan.
  Resultado: inventario y uso Bash actuales, SDD intacto y ausencia de garantías propias retiradas. (Criterios 3, 5–6)
- [x] T06. Comparar los 42 archivos con la fuente mediante contenido y hashes/blobs; registrar el diff exacto de las ocho adaptaciones.
  Resultado: 34 coincidencias y ocho diferencias permitidas; los problemas heredados quedan señalados sin corregir. (Criterios 1–2, 4, 6)
- [x] T07. Ejecutar `bash -n` sobre los siete scripts y comprobar estado desde raíz y una copia con espacios.
  Resultado: sintaxis y lectura verificadas con Git Bash existente, sin mutaciones sobre datos personales. (Criterios 1, 5, 7)
- [x] T08. Ensayar los contratos originales en repositorios desechables con remoto local cuando se autorice implementar.
  Resultado: avance rápido/divergencia, ramas nuevas y recuperadas, otra base, apertura vacía, commit selectivo con índice ajeno, push/upstream y rechazo sin avance rápido comprobados. (Criterios 1, 5, 7)
- [x] T09. Registrar resultados nuevos, límites y conservación en `verification.md` de esta spec; revisar enlaces, espacios y alcance final.
  Resultado: evidencia propia separada de PowerShell, archivos protegidos intactos y ninguna prueba histórica o funcional ajena repetida. (Criterios 5–7)

## Comprobación al preparar publicación

- [x] T10. Comprobar los siete `.sh` en el índice con modo Git `100755` y blobs idénticos a la fuente.
  Resultado: modos y contenido preparados acreditados antes del commit, sin modificar los originales. No autoriza publicar. (Criterio 1)

## Autorización y pausa

T08 está autorizado, incluidos commits y push exclusivamente en repositorios desechables con remoto local. No requiere otro permiso. T10 y preparación del índice autorizados; commit selectivo, push y PR draft contra staging expresamente autorizados.

El arnés de ensayo será temporal, fuera de las herramientas entregadas, y comprobará su aislamiento del repositorio de trabajo. No se exigirá a los originales ningún control adicional ausente de la fuente.

#757 permanece pausada; AsistenciApp, datos y documentos históricos se conservan. No se ejecutan instrucciones de instalación o configuración de las referencias.

Al terminar T01–T09, detenerse para revisar resultados y límites. Commit selectivo, push y PR draft contra staging autorizados para esta entrega; sin revisores ni merge.
