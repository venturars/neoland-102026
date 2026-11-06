Issue: #1155.

# Recuento de género en los clientes

## Qué se pide

Quien consulta los usuarios quiere saber cuántos hay de cada género. Hoy ese recuento solo sale por el cliente de node-http (puerto 3004). Hace falta verlo también en los clientes HTTP con Express, en Nest, en Chrome, en VS Code y en Electron.

El género lo decide la IA local a partir del nombre de cada usuario, igual que en el clasificador. No se guarda nada. Solo se muestra el conteo.

## Quién lo usa

- Quien consulta la API desde fuera de la app, con `curl` o con un programa.
- Quien abre la pantalla inicial de Chrome, VS Code o Electron.

## Qué entra

### API

Una ruta nueva, `GET /users/gender-count`, en los clientes HTTP con Express (3001), Chrome (3002) y Nest (3003). No lleva entrada.

La respuesta tiene tres números:

```json
{ "woman": 1, "man": 1, "genderUndefined": 2 }
```

Ejemplo: hay María, Pedro, Alex y Kim. La IA dice que María es mujer y Pedro es hombre, duda con Alex y no dice nada de Kim. El resultado es el objeto de arriba.

Si no hay usuarios, la respuesta es `{ "woman": 0, "man": 0, "genderUndefined": 0 }` y la IA no se llama.

### Pantalla

En Chrome, VS Code y Electron, la pantalla inicial tiene al final un panel «Recuento por género».

- Antes del primer clic, el panel muestra «Pulsa «Contar género usuarios» para ver el recuento.».
- Tiene un botón «Contar género usuarios». El recuento solo se pide al pulsarlo.
- Mientras cuenta, el botón está deshabilitado y el panel dice «Cargando…».
- Cuando termina, el panel muestra tres líneas: «Mujer: 1», «Hombre: 1» y «Sin clasificar: 2», con los números del ejemplo.
- Mientras cuenta, la lista, la búsqueda y el alta siguen funcionando.
- Si el recuento falla, el aviso de la pantalla dice «Could not classify the users». El panel conserva el último resultado correcto. Si todavía no hubo ninguno, vuelve a mostrar la frase inicial.

En Electron, el recuento lo calcula el proceso principal de la app y la pantalla lo pide por un canal interno, no por la API. Para quien usa la app, el panel se ve, se comporta y muestra los mismos mensajes que en Chrome y VS Code.

## Qué fallo se ve

| Caso                                                                 | Qué se ve                                                                   |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| La IA local no responde                                              | API: 500 con `Could not classify the users`. Pantalla: el aviso con ese mismo mensaje. |
| No se pueden leer los usuarios                                       | API: 500 con `Could not classify the users`. Pantalla: el aviso con ese mismo mensaje. |
| El servidor de Chrome (3002) no responde, en el popup de Chrome       | Pantalla: el aviso `Could not classify the users` (ver plan, pregunta P1). |

Un nombre que la IA no clasifica cuenta en `genderUndefined`. No es un fallo.

## Fuera de esto

- El cliente web.
- Guardar el género o el recuento.
- Devolver el género de cada persona.
- Cambiar el modelo o la forma de clasificar.
- Un cliente de terminal nuevo para este recuento.
- Otras peticiones de Electron. Solo se añade la del recuento.
- Cambiar las specs anteriores. Lo que cambia respecto a ellas está en el plan.
