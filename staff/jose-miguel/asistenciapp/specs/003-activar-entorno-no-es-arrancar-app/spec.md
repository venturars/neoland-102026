# Spec 003 · Activar el entorno no es arrancar la app

> Estado: **Borrador** (2026-10-22) · Creada: 2026-10-22 · Aprobada: Pendiente

---

## 1. Problema

En el README, el paso de cada terminal nueva solo entra en la carpeta y activa el entorno. Ese paso se titula «Arrancar la app». Quien lo lee puede creer que la app ya está en marcha, y no lo está.

Poner la app en marcha son las dos opciones de después: una clase online, con alumnos en sus casas, o una prueba solo en el propio ordenador. «Arrancar la app» tiene que nombrar solo esas dos.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien abre el README para poner la app en marcha** | Distinguir el paso que solo activa el entorno del paso que sí arranca la app. |

---

## 3. Historias de usuario

- **HU-01**: Como persona que abre el README, quiero que el bloque que solo activa el entorno no se llame «Arrancar la app», para no dar por hecho que la app ya está en marcha.
- **HU-02**: Como persona que abre el README, quiero que «Arrancar la app» nombre solo las dos formas de ponerla en marcha, para saber qué hay que hacer después de activar el entorno.

---

## 4. Criterios de aceptación

Formato: **Dado** (situación inicial) · **Cuando** (acción) · **Entonces** (resultado esperado).

### El título del entorno (HU-01)

- **CA-01**: **Dado** el README, **cuando** se lee el bloque que entra en la carpeta del proyecto y activa el entorno, **entonces** ese bloque se titula activar el entorno y no «Arrancar la app».

### Qué cuenta como arrancar (HU-02)

- **CA-02**: **Dado** el README, **cuando** aparece el título «Arrancar la app», **entonces** bajo ese título solo están las dos formas de ponerla en marcha: la clase online (alumnos en sus casas) y la prueba solo en el propio ordenador.
- **CA-03**: **Dado** el título «Arrancar la app», **cuando** se lee lo que queda debajo, **entonces** ahí no está el paso de activar el entorno.

### Lo que no cambia (HU-01, HU-02)

- **CA-04**: **Dado** el resto del README, **cuando** se corrigen esos títulos, **entonces** preparar el entorno la primera vez, pasar lista, cerrar la app, los problemas frecuentes, los tests y la privacidad siguen diciendo lo mismo.

---

## 5. Fuera de alcance

- Las rutas del README que todavía nombran una carpeta personal.
- El comportamiento de la app al arrancar, en clase o en local.
- Cualquier otro título del README que no sea el de este paso.

---

## 6. Preguntas abiertas

Ninguna. El título del bloque y qué queda bajo «Arrancar la app» salen de la issue correspondiente.

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 0.1 | 2026-10-22 | Borrador inicial | Clarificar que activar el entorno no es arrancar la app |
