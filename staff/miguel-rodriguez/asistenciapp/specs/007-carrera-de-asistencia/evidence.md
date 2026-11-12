# Evidencia 007 · 2026-10-25

Implementación local sobre 008 aprobado por Miguel. No se han ejecutado commits, pushes, creación de PR ni cambios en main/staging. Issue 007: #325; backend 008: #328. Copia: `007-local-implementation/asistenciapp`. Datos ficticios y acceso de prueba local; ningún dato de la base real.

## Entorno y comandos

Python 3.14.8, Flask 3.1.3, pytest 9.1.1 y qrcode 8.2, usando el entorno virtual autorizado. Node se usa solo para analizar sintaxis, sin modificar versiones del proyecto. No se instala Pillow para la aplicación. qrcode declara colorama en Windows.

```bash
python -m pytest -q
python -m pytest -q tests/test_race_qr.py
node --check static/race.js
node --check static/race-display.js
node --check static/race-renderer.js
node --check static/profesor.js
```

- Base aprobada antes de 007: **218 passed in 5.28s**.
- QR: pruebas escritas primero; fallo inicial por módulo de QR ausente. Tras generador y ruta: **8 passed in 0.10s**. Incluyen autorización, no-store, XML local, clases normales/inexistentes y revocación tras Go/cierre/caducidad.
- Suite tras integración inicial: **226 passed in 5.94s**.
- Una ejecución durante la actualización documental detectó un enlace al fichero de evidencia aún no creado: 225 passed y un fallo. Se completaron los documentos de destino; no se eliminó ni debilitó la comprobación de enlaces. Resultado final con todos los archivos presentes: **226 passed in 5.71s**.
- Los cuatro análisis de sintaxis JavaScript pasan.

Las únicas expectativas modificadas en pruebas anteriores son la versión constitucional 4.0 → 4.1, correspondientes a la enmienda QR aprobada. Los tests de backend 008 se conservan íntegros y se ejecutan, sin atribuir su implementación a 007.

## Ensayos de navegador

Servidor propio de Flask en loopback, puerto 8767, base temporal ficticia, sin túnel. Se eligió explícitamente HTTP local de desarrollo; el uso compartido real sigue exigiendo HTTPS. Los scripts están en `tests/browser/`; se ejecutaron con Playwright, función asíncrona que recibe `page`, contra ese servidor. Los escenarios crean carreras ficticias e independientes; no usan clases ajenas.

1. **Flujo de tres finalistas:** preparación desde la casilla del panel → QR/enlace → Jimena, Meghan y Miguel ocupan plaza → Go → cuenta atrás → Miguel, Jimena y Meghan confirman en ese orden. Se comprueban cierre automático, clasificación 1/2/3 y podio. Orden de entrada y orden de llegada son distintos. Retirar al ganador actualiza el puesto del segundo y el mensaje propio de retirada, sin reabrir participación.
2. **`race-review.js`: 17 comprobaciones.** Cero ocupantes no inicia; título HTML como texto; cancelación conserva lobby; cierre vacío sin medallas; 503 conserva UUID/cuerpo; podio de uno; respuesta de éxito abortada después del commit recupera el resultado sin repetir el POST ni el consumo; cancelación de cierre conserva fase abierta; podio de dos; recarga conserva resultado; 202 no crea envío automático y borra código pendiente; 422 no se reenvía; 410 oculta formulario y resultado; perder cookie tras Go no entrega otra plaza.
3. **`race-concurrency.js`: 8 comprobaciones.** Formulario enviado con Tab/Enter tras seleccionar el nombre; recarga durante cuenta atrás conserva startsAt; dos ventanas del profesor coinciden; tres códigos mal formados reales agotan solo una plaza; otro participante registra; cierre manual no inventa asistencia para el agotado; panel normal disponible; zoom 200 % sin desbordamiento horizontal. La selección del nombre se automatizó con selectOption: no se atribuye una prueba del menú nativo por flechas.
4. **`race-queued-action.js`: 3 comprobaciones.** Se retiene una consulta /me, se pulsa enviar durante ella y se libera después. La acción espera, llega exactamente un POST y nunca hay más de una petición API simultánea. Resultado: posts=1, maximum=1.
5. **Llegada final:** tres animaciones de transformación con duraciones 5800, 6900 y 8000 ms, asociadas a los puestos 1, 2 y 3. Al acabar el foco llega a «El podio de hoy». Recargar cerrado muestra directamente el resultado. Movimiento reducido: cero animaciones.
6. **Presentación/móvil:** vistas de 400 px sin desbordamiento horizontal; código visible solo en fase abierta; fragmentos retirados de la barra; una ventana sin autorización no obtiene el código. Formulario usable sin esperar la animación. No se ha hecho auditoría con lector de pantalla ni se presenta como tal.

La primera revisión detectó una causa de acciones perdidas: devolver inmediatamente si había un polling en curso. Se sustituyó por espera serializada. Deshabilitar controles en cada consulta periódica también podía interrumpir el foco; solo se deshabilitan durante mutaciones. La prueba con GET retenido comprueba la causa, no solo el aspecto del botón. Las animaciones usan transform en lugar de animar left.

## QR y conservación

El QR real de la pantalla fue decodificado localmente por Apple Vision: URL de la carrera, identificador y fragmento de entrada válidos. El contenido secreto no se imprime ni se guarda en esta evidencia. Esto no sustituye el escaneo con cámara de teléfono, que sigue pendiente en T43. No se ha probado un túnel real en esta ejecución.

Se comprobaron los quince SVG como XML: sin script, foreignObject, image, eventos ni referencias externas. Se consultaron las quince imágenes originales y los prompts disponibles. Los 43 archivos originales de Halloween mantienen sus hashes. No faltan archivos respecto a los 78 de la base aprobada. Dominio, almacenamiento, casos de uso y specs históricas 001–004 no cambian. Detalle: [comparación](evidence/preservation-review.json).

Contraste calculado de textos sobre sus fondos: principal 11.83:1; secundario 5.02:1; botón 13.44:1; personaje en pista 6.71:1; etiqueta de estado 6.57:1. Las posiciones también se escriben con números y palabras.

## Cobertura por criterio

| CA | Evidencia concreta |
| --- | --- |
| 01 | Quince nombres del roster 008, quince SVG y revisión de correspondencias en RACE-ASSETS; preparación por panel. |
| 02 | Flujo completo por enlace, ruta QR autorizada, decodificación Apple Vision; cámara física pendiente T43. |
| 03 | Pruebas 008 de colisión/release; recuperación de cookie y UI de nombres ocupados. |
| 04 | Cero ocupantes rechazado; Go con tres fija grupo; acceso perdido/tardío no crea plaza. |
| 05 | Dos ventanas y recarga conservan startsAt; contrato 008 prohíbe código y registros antes de salida. |
| 06 | Entrada Jimena/Meghan/Miguel frente a confirmaciones Miguel/Jimena/Meghan; orden backend estable. |
| 07 | Tres peticiones mal formadas agotan plaza; UI Sin intentos; duplicados y tercera válida probados en 008. |
| 08 | Código y confirmaciones en directo, resultado propio antes de la llegada, animación final solo al cierre. |
| 09 | Cierre automático con todos y manual con ausente/agotado; cancelar conserva fase; concurrencia 008. |
| 10 | Podios de cero/uno/dos/tres, final de ocho segundos y retirada del ganador. |
| 11 | Recarga de cuenta atrás/resultado, dos ventanas, recuperación de respuesta perdida y backoff sin puestos inventados. |
| 12 | Quince originales consultados y quince adaptaciones revisadas, dos rasgos o más por piloto. |
| 13 | Regresión completa, pruebas de exportación y retirada de asistencia/podio sin reabrir. |
| 14 | Auth/no-store QR, ventana sin profesor, alumno sin código; cookie/CSRF y rutas antiguas en 008. |
| 15 | Suite 008 de quince clientes y cincuenta peticiones, también HTTP real; otro alumno entra tras agotar al atacante. |
| 16 | 400 px, zoom 200 %, Tab/Enter/foco, contraste, movimiento reducido y alternativa sin cámara; prueba personal pendiente. |
| 17 | P4/§6 de 008 intactos, secretos temporales, fragmentos retirados y ausencia de secretos en evidencia. |
| 18 | Vanilla JS/HTML/CSS/SVG, qrcode local autorizado, originales intactos; sin servicios IA ni motor. |
| 19 | Tests 008 de reservas simultáneas, tercera válida y máximo tres; UI muestra agotamiento. |
| 20 | Pruebas 008 de reinicio/rotación/dirección; navegador sin cookie después de Go rechazado. |
| 21 | Tests 008 de rutas antiguas y permisos falsos; 007 no crea otro registro público. |
| 22 | Respuesta de éxito realmente perdida y recuperada; 503 mismo cuerpo/UUID; 202 sin evaluación automática. |
| 23 | Agotado no comprueba un cuarto; suite 008 y segundo participante mantiene presupuesto. |
| 24 | Roster fijo, pruebas 008 de join frente a Go y acaparamiento de quince plazas con máximo 45 evaluaciones. |
| 25 | 008 prueba 7199/7200 s y esperas durante lectura; UI 410 limpia pendientes y oculta datos privados; QR revocado. |

La prueba acotada de Wi-Fi compartida y acaparamiento está en `test_race_concurrency.py` y `test_race_live_http.py`, conservadas de 008. No implica protección frente a saturación general ni identidad verificada.

## Capturas

Capturas ficticias sin códigos vigentes, tokens, QR legible ni enlaces de entrada:

- [Quince pilotos](evidence/pilotos.png)
- [Lobby móvil con acceso oculto](evidence/lobby-movil.png)
- [Podio](evidence/podio.png)
- [Confirmación del alumno](evidence/alumno.png)

## Cierre del ensayo

Servidor propio detenido con Ctrl+C. `lsof -nP -iTCP:8767 -sTCP:LISTEN` y el control de puerto 8000 no muestran escuchas. No se inició cloudflared. Base de navegador ficticia eliminada después de detener el servidor; copia de implementación conservada para la prueba de Miguel. T02/T50 (publicación), T43 (cámara física) y T49 (Miguel juega/aprueba resultado y limpieza final) continúan pendientes.


## Prueba de Miguel · 2026-10-25

Miguel abrió la app de ensayo y confirmó «funciona!» tras las instrucciones para completar el recorrido con un participante. Se registra esa confirmación del recorrido básico. No acredita todavía escaneo físico, varios participantes reales ni el cierre de todas las tareas de entrega. La copia y su servidor se conservan temporalmente por su petición de seguir probando.


## Escaneo físico y prueba HTTPS · 2026-10-25

Miguel confirmó «it works!» tras escanear el QR e intentar el recorrido desde su teléfono con el enlace HTTPS temporal. El panel público respondió 200, con TLS verificado mediante curl y el almacén de certificados del sistema. No se desactivó TLS: la primera consulta con Python falló por su almacén local de certificados, y se verificó después con el cliente del sistema. El túnel usó el modo Cloudflare existente y base ficticia; no se cambió la seguridad para admitir el móvil. T43 queda completada. Servidor y túnel detenidos al terminar; código local conservado para publicación. Esta comprobación complementa, no reemplaza, los ensayos de varios clientes ya documentados.
