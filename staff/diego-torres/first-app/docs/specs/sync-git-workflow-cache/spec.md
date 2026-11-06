Issue: #1165

# Poner al día el flujo de git con la plantilla del curso

Quien trabaja en first-app con el agente sigue un flujo de git. La plantilla del curso cambió el 5 de noviembre y este flujo se ha quedado por detrás. Este cambio lo pone al día, para que funcione igual que el del resto de la clase.

Lo usa el alumno al guardar su trabajo y al pedir revisión.

## Qué cambia

- **Pedir revisión:** el alumno sigue nombrando a quién revisa. Ahora lo hace el agente de las pull requests, que además comprueba que cada persona colabora en el repositorio y confirma el resultado consultando la pull request.
- **Nombres ya conocidos:** el agente recuerda en este ordenador qué usuario de GitHub corresponde a cada nombre, para no volver a buscarlo. Lo olvida a las 48 horas. Si un nombre puede ser de dos personas, pregunta y no guarda nada.
- **Mensaje de commit:** lleva una primera línea que dice qué cambió, un desglose con el porqué y un pie con la issue. En un commit trivial, el desglose se puede omitir. El commit vacío sigue siendo `chore: open #N`.
- **Tipo nuevo:** hay un tipo `knowledge`, con su plantilla de issue y de pull request.
- **Pull request cerrada:** una tarea nueva lleva una pull request nueva. No se reabre ni se reutiliza una cerrada.
- **Formulario abierto:** no demuestra que la pull request exista. Se comprueba antes de repetir una escritura.

## Qué sigue igual

Las rutas propias de esta carpeta, la comprobación de paquetes con Socket, el orden de spec, plan y tasks, las paradas para revisar y la regla de no hacer merge a `staging`. Quien usa la app no ve ningún cambio.

## Ejemplo

El alumno pide que revisen su pull request Meghan y Papushy. La primera vez, el agente busca a quién corresponde cada nombre entre los colaboradores y guarda esa relación. Pide las dos revisiones, saca la pull request de draft y consulta que todo ha quedado así. Si el alumno vuelve a nombrar a Meghan al día siguiente, el agente ya sabe quién es y no la busca otra vez, aunque sigue comprobando que colabora en el repositorio.

## Errores

Si un nombre no corresponde a ningún colaborador, el agente lo dice y no pide esa revisión. Si un paso falla, cuenta qué ha fallado y no da por pedida la revisión. Si falla lo que recuerda en este ordenador, sigue sin recordarlo.

## Qué queda fuera

La app y su código, `asistenciapp`, las carpetas de otras personas y cualquier cambio en la plantilla del curso.
