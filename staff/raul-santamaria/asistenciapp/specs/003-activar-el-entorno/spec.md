# Spec 003 · Activar el entorno no es arrancar la app

> Estado: **Implementada** (2026-10-26) · Creada: 2026-10-26 · Aprobada: 2026-10-26

---

## 1. Problema

Quien abre el README encuentra el paso de cada terminal nueva (entrar en la carpeta y activar el entorno) bajo el título «Arrancar la app». Ese título sugiere que la app ya está en marcha, y solo se ha preparado el entorno.

Poner la app en marcha son las dos opciones que vienen después: clase online (alumnos en casa) o prueba solo en el propio ordenador. «Arrancar la app» debe nombrar únicamente esas dos.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien lee el README para poner la app en marcha** | Ver claro qué paso solo activa el entorno y cuál sí arranca la app. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que abre el README, quiero que el bloque que solo activa el entorno no se llame «Arrancar la app», para no creer que la app ya está corriendo.
- **HU-02**: Como persona que abre el README, quiero que «Arrancar la app» cubra solo las dos formas de ponerla en marcha, para saber qué hacer después de activar el entorno.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### Título del bloque del entorno (HU-01)

- **CA-01**: **Dado** el README, **cuando** se lee el bloque que entra en la carpeta del proyecto y activa el entorno, **entonces** ese bloque se titula activar el entorno y no «Arrancar la app».

### Qué cuenta como arrancar (HU-02)

- **CA-02**: **Dado** el README, **cuando** aparece el título «Arrancar la app», **entonces** bajo ese título solo están las dos formas de ponerla en marcha: la clase online (alumnos en sus casas) y la prueba solo en el propio ordenador.
- **CA-03**: **Dado** el título «Arrancar la app», **cuando** se lee lo que queda debajo, **entonces** ahí no está el paso de activar el entorno.

### Lo que no cambia (HU-01, HU-02)

- **CA-04**: **Dado** el resto del README, **cuando** se corrigen esos títulos, **entonces** preparar el entorno la primera vez, pasar lista, cerrar la app, los problemas frecuentes, los tests y la privacidad siguen diciendo lo mismo.

---

## 5. Fuera de alcance

- Las rutas del README que nombran una carpeta personal.
- El comportamiento de la app al arrancar, en clase o en local.
- Cualquier otro título del README que no sea el de este paso.

---

## 6. Preguntas abiertas

Ninguna. El alcance (separar activar el entorno de arrancar la app) y el nombre de carpeta `003-activar-el-entorno` quedaron decididos el 2026-10-26. De momento no hay issue en GitHub.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-26 | Borrador inicial | El README mezcla activar el entorno bajo «Arrancar la app» |
| 1.0 | 2026-10-26 | Aprobada | Ok para plan, tasks e implementación |
| 1.1 | 2026-10-26 | Implementada | T01–T04 hechas en el README; pytest en verde |
