# Spec 003 · Activar el entorno no arranca la app

> Estado: **Aprobada** (2026-10-22) · Creada: 2026-10-22 · Aprobada: 2026-10-22

---

## 1. Problema

En el README, el bloque que solo entra en la carpeta y hace `source .venv/bin/activate` se titula «Arrancar la app». Quien lo lee puede creer que la app ya está en marcha. No lo está.

Ponerla en marcha son los dos comandos de después: `python app.py --tunel` cuando los alumnos están en sus casas, y `python app.py` para probar en este ordenador. El título «Arrancar la app» tiene que nombrar solo esos dos.

---

## 2. Usuarios

| Usuario | Qué quiere |
| --- | --- |
| **Quien abre el README para poner la app en marcha** | Ver claro qué paso solo activa el entorno y qué paso sí arranca la app. |

---

## 3. Historias de usuario

- **HU-01**: Quiero que el bloque que solo activa el entorno no se llame «Arrancar la app».
- **HU-02**: Quiero que «Arrancar la app» muestre solo las dos formas de ponerla en marcha.

---

## 4. Criterios de aceptación

- **CA-01**: **Dado** el README, **cuando** leo el bloque con `cd` y `source .venv/bin/activate`, **entonces** su título es «Activar el entorno».
- **CA-02**: **Dado** el título «Arrancar la app», **cuando** leo lo que hay debajo, **entonces** están `python app.py --tunel` y `python app.py`, y el texto de lo que se ve al arrancar.
- **CA-03**: **Dado** ese mismo título, **cuando** sigo leyendo, **entonces** ahí no está `source .venv/bin/activate`.
- **CA-04**: **Dado** el resto del README, **cuando** cambio esos títulos, **entonces** preparar el entorno la primera vez, pasar lista, cerrar, los problemas, los tests y la privacidad dicen lo mismo. La ruta para entrar en la carpeta tampoco cambia.

---

## 5. Fuera de alcance

- Las rutas que todavía entran en una carpeta personal.
- Lo que hace la app al arrancar.
- Cualquier otro título del README.

---

## 6. Preguntas abiertas

Ninguna. El 2026-10-22 decidí el título del bloque y qué queda bajo «Arrancar la app».

---

## 7. Historial de cambios

| Versión | Fecha | Cambio | Motivo |
| --- | --- | --- | --- |
| 1.0 | 2026-10-22 | Aprobada | El paso que solo activa el entorno parecía arrancar la app |
