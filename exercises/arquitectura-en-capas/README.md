# Arquitectura en capas

Separar el código en capas, cada una con un solo trabajo, permite que un proyecto crezca sin romperse: se puede cambiar y probar cada parte sin tocar el resto.

Resumen de la clase de AI engineers junior. Las diapositivas originales están en [arquitectura-en-capas-clase.pptx](arquitectura-en-capas-clase.pptx).

## El problema

Cuando todo vive en la misma función, cada cambio es caro y arriesgado.

```js
function crearPedido(req) {
  revisarEntrada(req.body)    // 1. revisar la entrada
  const db = conectar(env.DB) // 2. abrir la base de datos
  if (deuda > 500) …          // 3. decidir una regla de negocio
  db.query("INSERT …")        // 4. escribir SQL
  enviarEmail(cliente)        // 5. llamar a otro servicio
  return filaDeLaBD           // 6. devolver datos internos sin filtrar
}
```

Esos seis comentarios son seis trabajos distintos. Si mañana cambia la regla de la deuda, hay que leer SQL y correo para tocarla. Cambiar de base de datos obliga a tocar la regla de negocio. Y no se puede probar la función sin una base de datos y un servidor de correo reales.

## La pregunta de la clase

¿Cómo organizamos el código para que cada responsabilidad tenga un sitio conocido, se pueda cambiar sin romper el resto y se pueda probar por separado?

La respuesta es la arquitectura en capas: un patrón descrito en los años 90 y popularizado para aplicaciones de negocio por Fowler (Buschmann et al., 1996; Fowler, 2002).

## Las cuatro capas

Cada capa tiene un solo trabajo, como en un restaurante. El camarero no cocina y el cocinero no atiende mesas. Las recetas no cambian si cambia el proveedor de tomates.

| Capa | En el restaurante | Su trabajo |
| --- | --- | --- |
| Presentación | El camarero | Recibe el pedido y entrega el plato. No cocina. |
| Aplicación | El jefe de cocina | Organiza los pasos de cada plato. |
| Dominio | Las recetas | Las reglas del negocio: lo más valioso. |
| Infraestructura | Despensa y proveedores | Base de datos, APIs externas, correo. |

Además hay una caja común, `shared`, con tipos de error y utilidades, sin lógica de negocio. Y un `main` que crea las piezas reales y las conecta. El modelo de cuatro capas viene de Evans (2003).

| Capa | Qué hace | Qué no hace nunca |
| --- | --- | --- |
| Presentación | Recibe la petición, comprueba su forma y llama a un caso de uso | Reglas de negocio, consultas a la base de datos |
| Aplicación | Un caso de uso por operación: carga, pide al dominio que decida, guarda | SQL, HTTP, detalles de frameworks |
| Dominio | Entidades, reglas y cálculos del negocio | Leer o escribir nada de fuera |
| Infraestructura | Habla con base de datos, APIs y correo; traduce sus errores | Decidir reglas de negocio |
| Shared | Tipos de error y utilidades comunes | Importar de otras capas |

La columna «qué no hace nunca» es la más útil en el día a día: si un controlador escribe SQL, algo está en el sitio equivocado.

Prueba rápida: si la regla seguiría siendo cierta con papel y lápiz, es dominio. «Un pedido confirmado no se puede editar» sería cierto en una tienda sin ordenadores.

## Las dependencias apuntan al dominio

Una capa solo conoce a la de debajo, nunca a la de arriba. El dominio no conoce la base de datos.

```text
Presentación
    │
    ▼
Aplicación
    │
    ▼
 Dominio  ◄──── Infraestructura
                (implementa sus interfaces)
```

La infraestructura apunta hacia arriba: implementa interfaces que define el dominio. Así el negocio no depende de la tecnología (inversión de dependencias; Martin, 2017).

El dominio define el enchufe. Dice qué necesita, no cómo se hace. Otros fabrican el aparato: SQL en producción, memoria en las pruebas. Se cambia la base de datos, o se prueba sin ella, sin tocar el dominio. Las piezas reales se conectan solo en `main`.

```ts
// Dominio: el enchufe
interface OrderRepository {
  findById(id): Order | null
  save(order): void
}

// Infraestructura: aparato real
class SqlOrderRepository implements OrderRepository {}

// Pruebas: aparato en memoria
class InMemoryOrderRepository implements OrderRepository {}
```

## Dónde va cada código

Seis preguntas en orden. La primera respuesta «sí» decide la capa.

| # | Si el código… | Va en |
| --- | --- | --- |
| 1 | recibe la petición o pinta la respuesta (web, pantalla, consola) | Presentación |
| 2 | habla con algo de fuera (base de datos, API, ficheros, correo) | Infraestructura |
| 3 | es una regla del negocio cierta incluso sin ordenador | Dominio |
| 4 | coordina pasos: cargar, decidir, guardar, avisar | Aplicación |
| 5 | es genérico, sin negocio, y lo usan varias partes | Shared |
| 6 | crea las piezas reales y las conecta entre sí | `main` |

Ejemplos: calcular el descuento por volumen es dominio. Enviar el email de confirmación es infraestructura; decidir cuándo se envía es aplicación. Crear la conexión al arrancar es `main`.

## Qué se pasa entre capas

Al cruzar una frontera, los datos se traducen. Nada interno pasa al otro lado. Un solo caso de uso por cada pantalla o endpoint.

```text
Petición (JSON tal cual llega)
    → Comando (datos simples, sin HTTP)
        → Entidades (aquí se decide)
            → Objeto de respuesta (nunca la fila de la BD)
                → Respuesta (HTTP, pantalla o consola)
```

La presentación convierte la petición en un comando, que no sabe nada de HTTP. La aplicación trabaja con entidades. Lo que vuelve es un objeto de respuesta pensado para el cliente. Un cambio en la base de datos no rompe la API y no se filtran campos internos.

## Cómo se organizan las carpetas

En un proyecto pequeño basta una carpeta por capa. Cuando hay varios temas (pedidos, clientes, pagos) conviene agrupar primero por módulo y luego por capa: así se mantiene junto lo que cambia junto.

```text
src/
├── main.ts       conecta las piezas
├── shared/       lo común
└── modules/
    ├── orders/
    │   ├── presentation/
    │   ├── application/
    │   ├── domain/
    │   └── infrastructure/
    └── customers/ …
```

Un módulo no mira dentro de otro: solo usa lo que ofrece hacia fuera. Las palabras técnicas (`Sql`, `Http`) solo aparecen en infraestructura. Una herramienta puede vigilarlo en la integración continua: dependency-cruiser, import-linter o ArchUnit.

## Errores

Cada capa trata sus errores. Un único punto los convierte en respuesta.

| Capa | Su papel con los errores |
| --- | --- |
| Dominio | Detecta las reglas incumplidas. No sabe nada de HTTP. |
| Aplicación | Detecta lo que no existe o no está permitido. |
| Infraestructura | Traduce los errores de las librerías a errores del proyecto. |
| Presentación | Un único sitio los convierte en respuesta y los registra una vez. |

La pregunta clave: ¿puede el usuario hacer algo? Si el pedido no existe, sí: es un error esperado. Si la base de datos está caída, no: es un error técnico.

Tres reglas: código fijo por error (`ORDER_NOT_FOUND`); un solo sitio traduce y registra; nada interno sale fuera.

## Clásica o invertida

Mismas capas. Cambia quién conoce a quién en el último tramo.

| | Clásica | Invertida (recomendada) |
| --- | --- | --- |
| Dirección | El negocio depende de la base de datos | El dominio define interfaces y la infraestructura las cumple |
| Coste | Menos archivos | Una interfaz por cada dependencia externa |
| Cuándo | Prototipos y proyectos pequeños | Lógica real y proyectos que duran |

Cockburn (2005); Palermo (2008); Martin (2012).

## Empezar ligero y crecer

No hay que decidirlo todo al principio. Un módulo pasa a la versión completa cuando sus reglas crecen.

| | Ligera (3 capas) | Completa (4 capas) |
| --- | --- | --- |
| Capas | Presentación, servicios (aplicación + dominio), infraestructura | Presentación, aplicación, dominio, infraestructura |
| Interfaces de repositorio | Opcionales | Obligatorias |
| Para qué | CRUD con pocas reglas, primeras versiones | Sistemas con reglas de negocio importantes |

## Cuándo compensa

Las capas cuestan más archivos y más estructura. Compensan cuando el proyecto va a vivir tiempo y tiene reglas que proteger.

| Sí encaja | No encaja, y qué usar |
| --- | --- |
| Aplicaciones con reglas de negocio: tiendas, reservas, gestión | Scripts de un solo uso: funciones bien nombradas |
| APIs y backends | Procesos de datos en cadena (ETL): un pipeline |
| Apps móviles o web con lógica propia | Prototipos que vas a tirar: lo más simple |
| Proyectos largos y con varias personas | CRUD casi sin reglas: la versión ligera |

## Cinco errores típicos

| Error | Cómo se reconoce | Cómo se arregla |
| --- | --- | --- |
| Controlador que lo hace todo | Valida reglas, abre transacciones o escribe SQL | Pasos al caso de uso, reglas al dominio |
| Entidades que solo guardan datos | Toda la lógica en servicios enormes llenos de `if` | Reglas dentro de la entidad o del dominio |
| El ORM por todas partes | Objetos de la BD en la respuesta de la API | Modelos separados y conversores |
| Shared como cajón de sastre | Carpeta `utils/` con lógica de negocio | Devolver cada cosa a su módulo |
| Saltarse capas | Un controlador escribe en el repositorio | Pasar siempre por un caso de uso |

El más común es el controlador gordo. El más traicionero es el ORM por todas partes: funciona hasta que alguien añade un campo interno a la tabla y aparece en la API.

## El límite

Si casi todas las capas solo reenvían llamadas, la estructura sobra. La señal de alarma: la mayoría de los casos de uso solo pasan la llamada al repositorio («sinkhole»). Tampoco encaja en ETL, streaming ni videojuegos.

La misma idea aparece con otros nombres. En todas, el negocio está en el centro y la tecnología alrededor.

- Hexagonal, puertos y adaptadores (Cockburn, 2005)
- Cebolla (Palermo, 2008)
- Clean Architecture (Martin, 2012)

Richards (2015) recoge estos patrones.

## Conclusiones

1. Cada parte del código tiene su capa, y cada capa un solo trabajo.
2. Las dependencias apuntan al dominio: el negocio no conoce la base de datos.
3. Las capas se comunican con interfaces y objetos simples, y cada una traduce sus errores.
4. Compensa con reglas de negocio y proyectos largos. Si no, versión ligera.

Eso responde a la pregunta inicial: cada parte tiene un sitio conocido, se puede cambiar sin romper el resto y se puede probar por separado gracias a las interfaces.

## Revisar un proyecto propio

Ocho preguntas. Cada «no» marca por dónde empezar a mejorar.

1. ¿Cada archivo está en la capa que indica la tabla de decisión?
2. ¿El dominio evita importar base de datos, frameworks o red?
3. ¿La infraestructura se usa siempre a través de una interfaz?
4. ¿Cada endpoint o pantalla llama a un solo caso de uso?
5. ¿Sale un objeto de respuesta y no la fila de la base de datos?
6. ¿Ningún módulo mira dentro de las carpetas de otro?
7. ¿Los errores tienen código fijo y un único sitio que los traduce?
8. ¿Las piezas reales se conectan solo en `main`?

## Referencias

- Buschmann, F., Meunier, R., Rohnert, H., Sommerlad, P. y Stal, M. (1996). *Pattern-Oriented Software Architecture, Vol. 1: A System of Patterns*. Wiley.
- Cockburn, A. (2005). *Hexagonal Architecture (Ports and Adapters)*. Artículo en línea.
- Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.
- Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
- Martin, R. C. (2012). *The Clean Architecture*. Artículo en línea.
- Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
- Palermo, J. (2008). *The Onion Architecture*. Serie de artículos en línea.
- Richards, M. (2015). *Software Architecture Patterns*. O'Reilly Media.
