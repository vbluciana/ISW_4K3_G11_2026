# Documento de Decisiones de Diseño

**Proyecto:** TP6 — TDD (Evaluable) · Ingeniería y Calidad de Software (ISW)
**Cátedra:** Unidad N°4 — Aseguramiento de Calidad de Proceso y de Producto
**Curso:** 4K4 · **Grupo:** 7 · **Año:** 2026
**User Story implementada:** *Comprar entradas* (grupo impar) — EcoHarmony Park

---

## 1. Alcance y contexto

Este trabajo retoma el dominio de **EcoHarmony Park** definido en el TP2 (Requerimientos
Ágiles — User Stories y Estimaciones) e implementa, mediante **TDD estricto
(Red-Green-Refactor)**, la User Story *"Comprar entradas"*, asignada a los grupos impares
según la consigna del Práctico 6.

Se implementó la funcionalidad **full-stack** (backend + frontend), reutilizando el lenguaje
de programación acordado por el grupo en el TP2 — **JavaScript** (Node.js/Express en el
backend, React/Vite en el frontend) — y los mismos criterios de aceptación evaluados en
dicha User Story.

A diferencia de la entrega de referencia del TP2 (estructura de módulos sueltos), en este
TP se decidió **evolucionar la arquitectura hacia Hexagonal / Clean Code**, dado que el
objetivo pedagógico del Práctico 6 es TDD aplicado a *diseño*, no solo a cobertura de
pruebas. Las razones puntuales de cada decisión se detallan a continuación.

---

## 2. Arquitectura: Hexagonal (Ports & Adapters)

### Decisión
El backend se organiza en tres capas concéntricas:

```
src/
├── domain/          ← Entidades, Value Objects, Servicios de dominio, Errores
├── application/      ← Casos de uso + Puertos (interfaces)
└── infrastructure/   ← Adaptadores HTTP, persistencia e integraciones externas
```

- **`domain/`** no importa nada de `application/` ni de `infrastructure/`. Contiene las
  reglas de negocio puras (`Compra`, `Visitante`, `Usuario`, `FechaVisita`, `Email`,
  `CalculadoraTarifas`) y no conoce Express, el sistema de archivos, Mercado Pago ni
  Nodemailer.
- **`application/`** define los **puertos** (`RepositorioUsuarios`, `PasarelaDePago`,
  `ServicioEmail`) como contratos abstractos, y los **casos de uso**
  (`ComprarEntradas`, `RegistrarUsuario`, `Login`) que orquestan al dominio a través de
  esos puertos — nunca contra una implementación concreta.
- **`infrastructure/`** contiene los **adaptadores** que implementan los puertos
  (`RepositorioUsuariosJson`, `PasarelaDePagoMercadoPago`, `ServicioEmailGmail`) y la
  capa HTTP (controllers, rutas, middlewares de Express).

### Por qué
1. **Testabilidad real sin mocks de infraestructura en el dominio.** Las reglas de
   negocio (p. ej. "el parque cierra los lunes" o "menores de 3 años no pagan") se
   prueban con tests unitarios puros, sin levantar un servidor ni tocar el filesystem.
2. **Cumple el objetivo del TP de forma explícita**: TDD funciona mejor cuando el
   código es fácil de poner bajo prueba, y una arquitectura que separa reglas de negocio
   de detalles técnicos (base de datos, SDKs externos) es la que mejor sostiene ese
   ciclo Red-Green-Refactor sin pruebas lentas o frágiles.
3. **Inversión de dependencias (Dependency Inversion Principle).** Los casos de uso
   dependen de interfaces (`RepositorioUsuarios`, etc.), no de clases concretas. Esto
   permite inyectar **dobles de prueba** (`FakeRepositorioUsuarios`,
   `FakePasarelaDePago`, `FakeServicioEmail`) en los tests y **adaptadores reales**
   (`RepositorioUsuariosJson`, `PasarelaDePagoMercadoPago`, `ServicioEmailGmail`) en
   producción, sin que el caso de uso cambie una sola línea.
4. **Composition root único.** Tanto los tests de integración (`app.test.js`) como el
   arranque real (`server.js`) arman el grafo de dependencias en un solo lugar
   (`crearApp({ repositorioUsuarios, pasarelaDePago, servicioEmail })`), evitando que la
   elección de adaptador esté dispersa por el código.

---

## 3. Patrones de diseño aplicados

### GRASP

| Patrón | Dónde se aplica | Justificación |
|---|---|---|
| **Information Expert** | `Visitante.calcularPrecio()` delega en `CalculadoraTarifas.calcularPrecio()`, pero es el `Visitante` quien expone la responsabilidad de "saber su propio precio" al resto del sistema. | El cálculo requiere `edad` y `tipoPase`, datos que `Visitante` posee; se evita que `Compra` o el caso de uso conozcan la fórmula de descuentos. |
| **Creator** | `Compra.crear()` es responsable de construir sus `Visitante`, `FechaVisita` y `Email`. | `Compra` agrega y contiene a esos objetos (relación todo-parte), por lo que es la responsable natural de crearlos, validando la coherencia entre ellos (p. ej. cantidad de visitantes == cantidad de entradas). |
| **Pure Fabrication** | `CalculadoraTarifas`, `GeneradorComprobante`, `RepositorioUsuariosJson`. | Ninguna de estas responsabilidades pertenece naturalmente a un concepto del dominio; se fabrican clases dedicadas para mantener alta cohesión y evitar sobrecargar las entidades con lógica de formateo o de persistencia. |
| **Low Coupling / High Cohesion** | Los *ports* (`RepositorioUsuarios`, `PasarelaDePago`, `ServicioEmail`) desacoplan `application` de `infrastructure`. | Cambiar de persistencia JSON a una base de datos real no requiere tocar ningún caso de uso ni entidad de dominio. |
| **Protected Variations** | Los *ports* protegen al dominio y a la aplicación de cambios en los SDKs externos (Mercado Pago, Nodemailer). | Si cambia la versión del SDK de Mercado Pago, el único archivo que se modifica es `PasarelaDePagoMercadoPago.js`. |
| **Polymorphism** | `DomainError` y sus subclases (`FechaVisitaInvalidaError`, `PagoRechazadoError`, etc.) son interpretadas polimórficamente por `manejadorErrores` para decidir el código HTTP de respuesta. | Evita un gran `if/else` con comparaciones de mensajes de error; cada subtipo de error se mapea una sola vez. |
| **Indirection** | Los controllers HTTP nunca llaman directamente a un adaptador concreto; siempre pasan por el caso de uso inyectado. | Desacopla la capa HTTP de la lógica de negocio y de la infraestructura concreta. |

### GoF

| Patrón | Dónde se aplica | Justificación |
|---|---|---|
| **Factory Method** | Constructores nombrados estáticos (`Compra.crear()`, `Visitante.crear()`, `Usuario.crear()`, `FechaVisita.crear()`, `Email.crear()`) en lugar de `new` directo. | Permiten validar invariantes **antes** de construir un objeto inmutable, y lanzar errores de dominio específicos si los datos de entrada son inválidos, algo que un constructor convencional no expresa con claridad. |
| **Strategy (implícito vía Ports & Adapters)** | `RepositorioUsuarios`, `PasarelaDePago` y `ServicioEmail` definen una interfaz común con múltiples implementaciones intercambiables (fake para test, real para producción). | Es la base del patrón Ports & Adapters: el caso de uso programa contra la interfaz, no contra la estrategia concreta. |
| **Facade (parcial)** | `app.js` (`crearApp`) actúa como fachada que ensambla rutas, middlewares y controllers a partir de los adaptadores recibidos. | Simplifica el punto de entrada: tanto `server.js` como los tests de integración solo necesitan llamar a `crearApp(...)`. |

### MVC / Layered (frontend)

El frontend separa:
- **Vistas** (`src/pages/*.jsx`, `src/components/*.jsx`): solo JSX y manejo de eventos.
- **Acceso a datos** (`src/api/clienteApi.js`): único punto que conoce la URL del backend
  y el formato de las peticiones HTTP.
- **Utilidades de dominio del cliente** (`src/utils/sesion.js`, `src/utils/fecha.js`):
  lógica de sesión y conversión de formatos, sin mezclarse con los componentes.

Esto reproduce, en el cliente, el mismo principio de **separación de responsabilidades**
que se aplica en el backend con la arquitectura hexagonal.

---

## 4. Proceso TDD (Red-Green-Refactor)

Cada módulo con lógica de negocio (dominio y aplicación) se desarrolló siguiendo
estrictamente el ciclo:

1. **Red** — se escribió un test que describe el comportamiento esperado y se ejecutó
   `npm test` para confirmar que falla (por falta de implementación).
2. **Green** — se escribió el código mínimo necesario para que el test pase.
3. **Refactor** — se mejoró el diseño (nombres, extracción de funciones, eliminación de
   duplicación) sin romper ningún test, volviendo a correr la suite completa tras cada
   cambio.

Este ciclo se aplicó de abajo hacia arriba (*inside-out*): primero los Value Objects
(`FechaVisita`, `Email`), luego los servicios de dominio (`CalculadoraTarifas`), después
las entidades (`Visitante`, `Compra`, `Usuario`), luego los casos de uso de aplicación
(con dobles de prueba inyectados) y finalmente los adaptadores de infraestructura y la
capa HTTP (con Supertest).

**Resultado medido:** 78 tests automatizados, 100% en verde, con cobertura de
statements superior al 95% en las capas `domain` y `application` (las capas con mayor
densidad de reglas de negocio y, por lo tanto, las más críticas de cubrir).

---

## 5. Persistencia: archivo JSON

### Decisión
Se mantiene la persistencia en un archivo JSON (`backend/data/usuarios.json`), igual que
en la entrega de referencia del TP2, en lugar de introducir una base de datos real
(SQLite, PostgreSQL, etc.).

### Por qué
- El alcance del trabajo es académico y el foco evaluado es el **proceso TDD y el
  diseño**, no la persistencia. Agregar un motor de base de datos introduciría
  complejidad de configuración sin aportar valor al objetivo del práctico.
- `RepositorioUsuariosJson` implementa el puerto `RepositorioUsuarios`, por lo que
  **reemplazarlo por un adaptador real de base de datos en el futuro no requeriría
  tocar el dominio ni los casos de uso** — es precisamente la garantía que da la
  arquitectura hexagonal.

### Mejora respecto de la referencia: aislamiento de tests de persistencia
En la entrega de referencia, los tests de persistencia escribían sobre un único archivo
compartido, lo que generaba acoplamiento entre tests y riesgo de efectos colaterales al
correrlos en paralelo. En esta entrega, `RepositorioUsuariosJson` recibe la **ruta del
archivo por constructor** (inyección de dependencia), y cada test de integración crea un
directorio temporal único con `fs.mkdtemp` (en `os.tmpdir()`), que se elimina al
finalizar. Esto garantiza que los tests de persistencia sean **independientes,
reproducibles y paralelizables**, sin estado compartido entre ellos.

---

## 6. Contraseñas en texto plano

Las contraseñas de los usuarios se almacenan **en texto plano** en `usuarios.json`. Esta
decisión se toma de forma **consciente y acotada al contexto académico** del trabajo
práctico — los criterios de aceptación de la User Story no exigen hashing de contraseñas,
y el foco del Práctico 6 es el ciclo TDD aplicado al dominio de negocio (reglas de compra
de entradas), no la seguridad de autenticación.

En un sistema productivo real se utilizaría una función de hashing con salt (`bcrypt` o
`argon2`) para almacenar únicamente el hash, nunca el valor original, y nunca se
registrarían logs ni se expondrían contraseñas en texto plano por ningún canal.

---

## 7. Sesión del lado del cliente

La sesión del usuario autenticado se gestiona en el frontend mediante `sessionStorage`
(`src/utils/sesion.js`), con una duración máxima de **5 minutos** desde el login o
registro exitoso. Transcurrido ese tiempo, la sesión se considera expirada y el usuario
debe volver a iniciar sesión.

- Se eligió `sessionStorage` en lugar de `localStorage` porque los datos se eliminan
  automáticamente al cerrar la pestaña del navegador, reduciendo la superficie de
  exposición de datos del usuario.
- **No se implementó JWT ni tokens de sesión en el servidor.** El backend valida
  credenciales únicamente en el momento del login (`Login.ejecutar`); no existe un
  middleware de autenticación que proteja rutas posteriores. El alcance de la User
  Story ("solo usuarios registrados pueden comprar") se cumple validando que el
  `usuarioId` enviado por el cliente exista en el repositorio
  (`UsuarioNoRegistradoError` si no existe), que es el criterio de aceptación
  evaluado — no la robustez de un esquema de autorización de nivel productivo.

---

## 8. Validación en dos capas (defensa en profundidad)

- **Capa de dominio (fuente de verdad):** `Compra.crear()`, `Visitante.crear()`,
  `Usuario.crear()`, `FechaVisita.crear()` y `Email.crear()` validan las reglas de
  negocio y **lanzan** errores de dominio tipados (`DomainError` y subclases) si los
  datos son inválidos. Esta capa es la que realmente garantiza la integridad de los
  datos, independientemente de quién llame al código (HTTP, un test, un futuro cliente
  CLI, etc.).
- **Capa HTTP (defensa en profundidad):** las rutas Express usan `express-validator`
  (`body(...).isInt()`, `.isString()`, etc.) para rechazar peticiones con formato
  claramente inválido **antes** de llegar al caso de uso, devolviendo `400` con mensajes
  claros. Esto evita invocar innecesariamente la lógica de negocio con datos
  estructuralmente incorrectos (p. ej. `cantidadEntradas` como texto).

Ambas capas son necesarias: la de dominio no se puede saltear (es la única fuente de
verdad), y la de HTTP mejora la experiencia de la API sin duplicar las reglas de negocio.

---

## 9. Manejo centralizado de errores

El middleware `manejadorErrores` (`src/infrastructure/http/middlewares/`) mapea cada
subtipo de `DomainError` a un código HTTP semánticamente correcto:

| Error de dominio | Código HTTP | Motivo |
|---|---|---|
| `FechaVisitaInvalidaError`, `CantidadEntradasInvalidaError`, `VisitanteInvalidoError`, `FormaPagoInvalidaError`, `EmailInvalidoError`, `PasswordInvalidaError`, `NombreInvalidoError` | 400 | Datos de entrada inválidos (error del cliente). |
| `UsuarioNoRegistradoError` | 404 | El recurso (usuario) referenciado no existe. |
| `UsuarioYaRegistradoError` | 409 | Conflicto: ya existe un usuario con ese nombre/email. |
| `CredencialesInvalidasError` | 401 | Autenticación fallida. |
| `PagoRechazadoError` | 402 | Pago requerido/rechazado por la pasarela. |
| Cualquier otro error no contemplado | 500 | Error interno no esperado. |

Esto evita repetir bloques `try/catch` con lógica de mapeo de errores en cada
controller: los controllers delegan el error al middleware (`next(error)`) y la
traducción a HTTP ocurre en un único lugar.

---

## 10. Integraciones reales: Mercado Pago y Gmail

Se cumple el criterio de aceptación *"Debe redirigir a Mercado Pago al confirmar la
compra si el pago es con tarjeta"* y *"Debe enviar un mensaje de confirmación vía mail"*
con **adaptadores reales**, no simulados:

- **`PasarelaDePagoMercadoPago`** usa el SDK oficial `mercadopago` (Checkout Pro) para
  crear una preferencia de pago real y devolver la URL (`initPoint`) a la que el
  frontend redirige al visitante.
- **`ServicioEmailGmail`** usa `nodemailer` con una cuenta SMTP de Gmail real (no una
  cuenta de prueba tipo Ethereal) para enviar el comprobante de compra.

### Credenciales
Las credenciales (access token de Mercado Pago, usuario/contraseña de aplicación de
Gmail) **nunca se hardcodean en el código fuente**. Se leen exclusivamente desde
variables de entorno (`process.env.*`) cargadas por `dotenv` en `server.js`. El archivo
`.env` real está en `.gitignore` y **no se commitea**; en su lugar se provee
`backend/.env.example` con las claves necesarias y valores vacíos, para que cada
integrante configure su propio `.env` local.

### Estrategia de testing para integraciones reales
Ejecutar la suite de tests contra Mercado Pago y Gmail reales en cada corrida sería
lento, no determinístico (depende de la red) y generaría efectos secundarios reales
(emails enviados, preferencias de pago creadas). Por eso:

- Los tests unitarios de los adaptadores (`PasarelaDePagoMercadoPago.test.js`,
  `ServicioEmailGmail.test.js`) usan `vi.mock()` para simular el SDK de Mercado Pago y
  de Nodemailer **a nivel de librería**, verificando que el adaptador construye
  correctamente los parámetros de la petición (items, back_urls, destinatario, asunto,
  etc.) sin pegarle a la red real.
- Los tests de integración HTTP (`app.test.js`) inyectan los **fakes** de aplicación
  (`FakePasarelaDePago`, `FakeServicioEmail`), no los adaptadores reales, para probar el
  flujo completo (ruta → controller → caso de uso → dominio) de forma rápida y
  determinística.
- El código de los adaptadores reales **sí** se ejercita manualmente contra las APIs
  reales como parte de la verificación funcional del trabajo (arranque de `server.js`
  con credenciales reales cargadas desde `.env`), cumpliendo así el requisito de
  integración real sin sacrificar la velocidad y determinismo de la suite automatizada
  que se corre en cada ciclo Red-Green-Refactor.

---

## 11. Trazabilidad: criterios de aceptación → diseño → tests

| Criterio de aceptación (User Story) | Responsable en el diseño | Test(s) que lo cubren |
|---|---|---|
| Indicar fecha, cantidad de entradas, edad y tipo de pase por visitante | `Compra.crear()`, `Visitante.crear()` | `Compra.test.js`, `Visitante.test.js` |
| La fecha puede ser del día actual o futura | `FechaVisita.crear()` (rechaza fechas pasadas) | `FechaVisita.test.js` |
| La fecha debe estar dentro de los días en que el parque está abierto | `FechaVisita.crear()` (rechaza lunes y feriados fijos) | `FechaVisita.test.js` |
| Seleccionar forma de pago: efectivo o tarjeta | `Compra.crear()` → `validarFormaPago()` | `Compra.test.js` |
| La cantidad de entradas no debe ser mayor a 10 | `Compra.crear()` → `validarCantidadEntradas()` (`CANTIDAD_MAXIMA_ENTRADAS`) | `Compra.test.js` |
| Enviar mensaje de confirmación vía mail | `ComprarEntradas.ejecutar()` → `ServicioEmail.enviarComprobante()` | `ComprarEntradas.test.js`, `ServicioEmailGmail.test.js` |
| Redirigir a Mercado Pago si el pago es con tarjeta | `ComprarEntradas.ejecutar()` → `PasarelaDePago.crearPreferenciaPago()`; `PaginaComprar` redirige a `pago.initPoint` | `ComprarEntradas.test.js`, `PasarelaDePagoMercadoPago.test.js` |
| Informar cantidad de entradas y fecha al finalizar | `GeneradorComprobante.generarComprobante()`; `PaginaComprobante` | `GeneradorComprobante.test.js` |
| Solo usuarios registrados pueden comprar entradas | `ComprarEntradas.ejecutar()` → `RepositorioUsuarios.buscarPorId()` + `UsuarioNoRegistradoError` | `ComprarEntradas.test.js`, `app.test.js` |

### Pruebas de usuario (consigna del Práctico 6)

| Prueba de usuario | Resultado esperado | Test(s) |
|---|---|---|
| Comprar con fecha disponible, cantidad < 10, edades y tipos de pase, pago con tarjeta vía Mercado Pago, recepción de mail | Pasa | `app.test.js` (flujo HTTP completo), `ComprarEntradas.test.js` |
| Comprar entradas sin seleccionar forma de pago | Falla (`FormaPagoInvalidaError` / 400) | `Compra.test.js` |
| Comprar entradas con fecha en que el parque está cerrado (lunes/feriado) | Falla (`FechaVisitaInvalidaError` / 400) | `FechaVisita.test.js` |
| Comprar entradas con cantidad mayor a 10 | Falla (`CantidadEntradasInvalidaError` / 400) | `Compra.test.js` |

---

## 12. Herramientas y estilo de código

- **Backend:** JavaScript Standard Style (`standard`), sin punto y coma, 2 espacios de
  indentación, `camelCase`. Ver [`guia_estilo.md`](../guia_estilo.md).
- **Testing backend:** Vitest + Supertest, siguiendo la estructura AAA
  (Arrange-Act-Assert) en cada test.
- **Frontend:** React 19 + Vite, componentes funcionales con hooks, CSS con convención
  BEM y variables CSS para la identidad visual de EcoHarmony Park.
