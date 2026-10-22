
name: create-github-pull-request-from-specification
description: >-
  Create a GitHub pull request from .github/pull_request_template.md.
  Use when the user asks to create a pull request, open a PR, or says
  "crear una PR" or "crea la PR". Check for an existing pull request on
  the current branch before creating one.

---

# Create GitHub Pull Request from Specification

Create GitHub Pull Request for the specification at `${workspaceFolder}/.github/pull_request_template.md` .

## Process

1. Analyze specification file template from '${workspaceFolder}/.github/pull_request_template.md' to extract requirements by 'search' tool.
2. Create pull request draft template by using 'create_pull_request' tool on to `${input:targetBranch}`. and make sure don't have any pull request of current branch was exist `get_pull_request`. If has continue to step 4, and skip step 3.
3. Get changes in pull request by using 'get_pull_request_diff' tool to analyze information that was changed in pull Request.
4. Update the pull request body and title created in the previous step using the 'update_pull_request' tool. Incorporate the information from the template obtained in the first step to update the body and title as needed.
5. Switch from draft to ready for review by using 'update_pull_request' tool. To update state of pull request.
6. Using 'get_me' to get username of person was created pull request and assign to `update_issue` tool. To assign pull request
7. Response URL Pull request was create to user.

## Requirements

- Single pull request for the complete specification
- Clear title/pull_request_template.md identifying the specification
- Fill enough information into pull_request_template.md
- Verify against existing pull requests before creation

## ConvenciÃ³n de este repositorio

Esta secciÃ³n gana cuando choca con el proceso de arriba. El paso 5 no se ejecuta al crear la pull request. El flujo completo estÃ¡ en `docs/GIT-WORKFLOW.md`.

- La base es `staging`.
- Se crea en draft. Pasarla a lista es la acciÃ³n Â«pedir revisiÃ³nÂ».
- El tÃ­tulo es el de la issue, en inglÃ©s.
- El cuerpo rellena `.github/pull_request_template.md` e incluye `Closes #<nÃºmero>`.
- La persona asignada es el alumno. El nombre sale de `gh api user --jq .login`.
- Si la rama ya tiene una pull request, se actualiza esa y no se abre otra.
- Antes de crearla o actualizarla, enseÃ±a el tÃ­tulo, la rama, el destino, el `Closes` y la persona asignada, y espera el sÃ­.
- La orden, despuÃ©s del sÃ­, es `gh pr create --draft --base staging`, con el tÃ­tulo, el cuerpo y `--assignee`. Para actualizar una pull request que ya existe, `gh pr edit`.
- Al terminar, responde con la URL.

