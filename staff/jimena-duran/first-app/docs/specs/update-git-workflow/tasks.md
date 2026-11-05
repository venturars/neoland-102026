Issue: #1015

# Tareas de actualización del flujo Git

Rama: `1015-docs-update-git-workflow`.
Las rutas parten de `staff/jimena-duran/first-app/`.
La implementación espera la revisión de estas tareas y su autorización.

Los componentes se copian literalmente de `exercises/git-workflow-agent-template`.
Solo se adaptan rutas a `staff/jimena-duran/first-app/`, conservando sus referencias originales.
Se mantienen las referencias y pausas SDD locales, sin parafrasear ni añadir reglas propias.

1. Copiar literalmente `agents/git-workflow-agent.md` de la plantilla actualizada.
   Conservar el párrafo local con las referencias y la prioridad de las pausas SDD.
   El resto coincide con la plantilla, incluida la selección por estado y la confirmación de cada paso.

2. Copiar literalmente `agents/help-me-to-think.md` de la plantilla actualizada.
   El archivo conserva íntegramente instrucciones, organización y referencias originales.

3. Copiar literalmente `skills/grill-me/SKILL.md` de la plantilla actualizada.
   El archivo conserva íntegramente instrucciones y referencias originales.

4. Copiar literalmente `skills/grill-with-docs/SKILL.md` de la plantilla actualizada.
   El archivo conserva íntegramente instrucciones y referencias originales.

5. Copiar literalmente `skills/commit-changes/SKILL.md` de la plantilla actualizada.
   Adaptar únicamente la ruta del comando a first-app y conservar las referencias originales.
   El texto incluye la regla técnica del mensaje sin modificar sus demás instrucciones.

6. Copiar literalmente `tools/create-pr-base-staging.sh` de la plantilla actualizada.
   El script nuevo coincide íntegramente con el original, sin traducir ni cambiar código.

7. Copiar literalmente `skills/create-pr-base-staging/SKILL.md` de la plantilla actualizada.
   Adaptar únicamente la ruta del script a first-app y conservar las referencias originales.
   El contrato de argumentos, creación y reutilización permanece idéntico.

8. Copiar literalmente `agents/create-pr.md` de la plantilla actualizada.
   El archivo conserva íntegramente instrucciones, organización y referencias originales.

9. Copiar literalmente `skills/create-draft/SKILL.md` de la plantilla actualizada.
   El archivo conserva íntegramente instrucciones y referencias originales.

10. Actualizar `docs/GIT-AUTOMATION.md` con los ocho scripts y sus rutas locales.
    Documentar el nuevo comando, archivo de cuerpo, Git Bash y gh autenticado.
    Conservar siete agentes, quince skills y la prioridad de las pausas SDD.

11. Actualizar `docs/TREE.md` con el octavo script del flujo Git.
    El árbol conserva la organización y muestra `tools/create-pr-base-staging.sh`.

12. Actualizar `docs/ARCHITECTURE.md` con el flujo actualizado.
    Describir coordinación por estado, continuidad de entrevistas, mensajes técnicos y creación conjunta de PR.
    Mantener separados el workflow y la aplicación, con pausas SDD y ocho scripts.

13. Revisar por lectura y contraste las doce modificaciones operativas del plan.
    Comprobar copia literal con solo rutas adaptadas y conservación de referencias originales y SDD locales.
    Confirmar que coincidencias, plantillas y siete scripts existentes permanecen intactos.

14. Ejecutar `bash -n` sobre `tools/create-pr-base-staging.sh` mediante Git Bash.
    La sintaxis termina correctamente sin ejecutar el script ni crear PR.
    No realizar ensayos que modifiquen repositorios.
