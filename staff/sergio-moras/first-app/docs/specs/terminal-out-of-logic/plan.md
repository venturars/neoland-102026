# Plan: Sacar la terminal de `logic/`

Implementa [spec.md](spec.md). Respeta [CONSTITUTIONS.md](../../CONSTITUTIONS.md), salvo la línea de §2 que pide el bloque `isRunFromTerminal`: esa línea se cambia con el permiso del usuario.

## Decisiones técnicas
| Tema | Decisión | Motivo |
|---|---|---|
| `logic/` | Se borra el bloque `isRunFromTerminal` y el `import { pathToFileURL }`. El comentario inicial deja de decir `Uso desde la terminal: node logic/...` | `logic/` no sabe quién la llama |
| Forma del `.txt` | `node --no-warnings --input-type=module -e "` en la primera línea, el código en las siguientes con su sangría, y `"` sola en la última | Con la comilla doble abierta, PowerShell y Git Bash siguen leyendo hasta que se cierra. Se lee como un archivo `.js`. Un heredoc (`<<'EOF'`) no funciona en PowerShell y una sola línea larga cuesta de leer |
| Código dentro del comando | `import` de la función, `try` con la llamada y el `console.log` de antes, `catch` con `console.error('Error: ' + error.message)` y `process.exit(1)` | Misma salida y mismo código de salida que el bloque que se quita |
| Comillas | Fuera, comillas dobles. Dentro del código, comillas simples. Sin `${...}` | Git Bash sustituiría `${...}` dentro de comillas dobles |
| `classifyGender` | `await classifyGender()` dentro del `try` | Con `--input-type=module` se puede usar `await` sin función |
| `updateUser` | Se mantienen los tres ejemplos, uno detrás de otro y separados por una línea en blanco | Mismo contenido que el `.txt` actual |
| Constitución §2 | `Cada archivo de logic/ exporta su función y puede ejecutarse desde la terminal con el bloque isRunFromTerminal.` pasa a `Cada archivo de logic/ solo exporta su función. No lee process.argv, no imprime y no llama a process.exit. El .txt de terminal/ la importa y muestra el resultado.` Sube a la versión 1.1.0 | Solo el usuario cambia la constitución |
| `AGENTS.md` | La sección Comandos apunta a los `.txt` de `terminal/`. La plantilla de `logic/` deja de citar el bloque `isRunFromTerminal` | `AGENTS.md` dice lo mismo que el código |

## Ejemplo de `.txt`
```
node --no-warnings --input-type=module -e "
import { createUser } from './logic/createUser.js';

try {
  const user = createUser('Pedro', 'pedro@gmail.com');
  console.log('User created:', user);
} catch (error) {
  console.error('Error: ' + error.message);
  process.exit(1);
}
"
```

## Archivos
```
logic/*.js          6 archivos: se quita el bloque de terminal
terminal/*.txt      6 archivos: un comando que importa la función
AGENTS.md           Comandos y plantilla
docs/CONSTITUTIONS.md  §2, versión y fecha
queries/, db/       SIN cambios
```

## Cómo se prueba
- Antes de cambiar nada se guarda la salida de los comandos actuales con un usuario temporal.
- Después se pegan los `.txt` nuevos con los mismos datos y se compara la salida. Cada `.txt` se prueba en PowerShell y en Git Bash.
- Se importa cada función desde un `node -e` que solo hace `import` y se comprueba que no imprime nada.
- Los usuarios de prueba usan `tmp-638-<n>@example.com` y se borran al terminar.
