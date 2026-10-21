# Guía de Estilo del Proyecto — EcoHarmony Park (TP6)

**Proyecto:** TP6 — TDD (Evaluable) · Ingeniería y Calidad de Software (ISW) · Grupo 11 · 4K3 · 2026
**Stack:** Node.js + Express, arquitectura hexagonal (backend) · React + Vite (frontend)

> Esta guía extiende las reglas de estilo acordadas por el grupo en el TP6
> (Requerimientos Ágiles — User Stories y Estimaciones), adaptadas a la organización en
> capas (dominio / aplicación / infraestructura) introducida en este trabajo.

---

## Índice

1. [Principios Generales](#1-principios-generales)
2. [Formato y Sangría](#2-formato-y-sangría)
3. [Convenciones de Nombres](#3-convenciones-de-nombres)
4. [Importaciones y Módulos](#4-importaciones-y-módulos)
5. [Funciones, Clases y Constructores Nombrados](#5-funciones-clases-y-constructores-nombrados)
6. [Constantes y Variables](#6-constantes-y-variables)
7. [Objetos y Arrays](#7-objetos-y-arrays)
8. [Manejo de Errores](#8-manejo-de-errores)
9. [Comentarios](#9-comentarios)
10. [Componentes React (Frontend)](#10-componentes-react-frontend)
11. [CSS y Estilos](#11-css-y-estilos)
12. [Tests](#12-tests)
13. [Estructura del Proyecto](#13-estructura-del-proyecto)
14. [Herramientas de Automatización](#14-herramientas-de-automatización)

---

## 1. Principios Generales

- **Legibilidad primero:** el código debe entenderse sin necesitar explicaciones del
  autor original.
- **Consistencia:** las mismas reglas aplican en todas las capas (dominio, aplicación,
  infraestructura, frontend).
- **Separación de responsabilidades:** el dominio no conoce HTTP, filesystem ni SDKs
  externos. Ver [`docs/decisiones_diseño.md`](docs/decisiones_diseño.md) para el
  detalle de la arquitectura.
- **Responsabilidad única:** cada clase, función o componente hace una sola cosa bien
  definida.

---

## 2. Formato y Sangría

- **2 espacios** por nivel de sangría. No usar tabulaciones.
- **Sin punto y coma** al final de las sentencias (JavaScript Standard Style).
- **Comillas simples** `'` para strings; *template literals* solo para interpolación.
- **Un espacio** entre el nombre de una función/método declarado y el paréntesis de
  parámetros (`crear (datos) { ... }`, `constructor (repositorio) { ... }`) — es la
  convención que aplica `standard` a funciones con nombre.
- **Límite recomendado de línea:** 100 caracteres.

```js
// ✅ Correcto
export class Visitante {
  static crear ({ edad, tipoPase }) {
    if (!Number.isInteger(edad) || edad < 0 || edad > 120) {
      throw new VisitanteInvalidoError('La edad debe ser un entero entre 0 y 120')
    }
    return new Visitante(edad, tipoPase.toLowerCase())
  }
}

// ❌ Incorrecto
export class Visitante{
    static crear({edad,tipoPase}){
        if(!Number.isInteger(edad)||edad<0||edad>120){
            throw new VisitanteInvalidoError("La edad debe ser un entero entre 0 y 120");
        }
    }
}
```

---

## 3. Convenciones de Nombres

| Elemento | Estilo | Ejemplo |
|---|---|---|
| Variables y funciones | `camelCase` | `fechaVisita`, `calcularPrecio()` |
| Constantes de configuración | `UPPER_SNAKE_CASE` | `PRECIOS_BASE`, `CANTIDAD_MAXIMA_ENTRADAS` |
| Clases (entidades, servicios, casos de uso, adaptadores) | `PascalCase` | `Compra`, `CalculadoraTarifas`, `ComprarEntradas`, `RepositorioUsuariosJson` |
| Puertos (interfaces de aplicación) | `PascalCase`, sustantivo que describe la capacidad | `RepositorioUsuarios`, `PasarelaDePago`, `ServicioEmail` |
| Errores de dominio | `PascalCase` + sufijo `Error` | `FechaVisitaInvalidaError`, `UsuarioNoRegistradoError` |
| Constructores nombrados (Factory Method) | `crear(...)` como método estático | `Compra.crear(...)`, `Email.crear(...)` |
| Componentes React | `PascalCase`, prefijo `Pagina` para vistas de nivel ruta | `PaginaComprar`, `FilaVisitante`, `Encabezado` |
| Archivos de módulo (JS) | Igual al nombre de la clase/export principal | `Compra.js`, `CalculadoraTarifas.js` |
| Archivos de componente (JSX) | `PascalCase.jsx` | `PaginaComprar.jsx` |
| Archivos de test | `<Módulo>.test.js`, en `tests/unit` o `tests/integration` reflejando la ruta de `src/` | `tests/unit/domain/Compra.test.js` |

### Reglas adicionales

- Los nombres de dominio van **en español** (`Visitante`, `calcularPrecio`,
  `fechaVisita`), reflejando el lenguaje ubicuo (*ubiquitous language*) del negocio
  EcoHarmony Park.
- Los nombres de infraestructura/técnicos pueden combinarse con el SDK que adaptan
  (`PasarelaDePagoMercadoPago`, `ServicioEmailGmail`): el sufijo identifica el
  proveedor concreto detrás del puerto.
- Evitar abreviaciones ambiguas (`visitante` en vez de `vis`).
- Las props de callback en React se prefijan con `on` (`onSesionIniciada`,
  `onCompraRealizada`).

---

## 4. Importaciones y Módulos

- Usar **ES Modules** (`import`/`export`) en todo el proyecto (`"type": "module"` en
  ambos `package.json`). Prohibido `require()`.
- Orden de importaciones:
  1. Librerías externas / Node.js.
  2. Módulos internos del proyecto, en orden de "cercanía" a la capa (dominio →
     aplicación → infraestructura según corresponda).
- **Named exports** para clases de dominio, puertos, casos de uso y adaptadores.
  **Default export** reservado para el componente principal de cada archivo `.jsx` y
  para `app`/`crearApp` en el backend.

```js
// ✅ Correcto
import { Compra } from '../../domain/entities/Compra.js'
import { UsuarioNoRegistradoError, PagoRechazadoError } from '../../domain/errors/DomainError.js'
import { generarComprobante } from '../GeneradorComprobante.js'
```

---

## 5. Funciones, Clases y Constructores Nombrados

- Las **entidades y value objects del dominio** se modelan como clases de ES con
  `constructor` privado-por-convención y `Object.freeze(this)` al final del
  constructor (inmutabilidad), exponiendo un **Factory Method estático** `crear(...)`
  que valida invariantes antes de construir la instancia.

```js
export class Email {
  constructor (valor) {
    this.valor = valor
    Object.freeze(this)
  }

  static crear (valor) {
    if (!EMAIL_REGEX.test(valor)) {
      throw new EmailInvalidoError(`"${valor}" no es un email válido`)
    }
    return new Email(valor)
  }
}
```

- Las **funciones de validación privadas de un módulo** (no exportadas) se declaran
  como *function declarations* al inicio del archivo, antes de la clase que las usa.
- Las **funciones de utilidad exportadas y sin estado** (helpers de formateo, mapeos)
  usan *arrow functions* o *function declarations* indistintamente, priorizando
  claridad.
- Los **casos de uso** se modelan como clases con un único método público `ejecutar(...)`
  (async cuando interactúan con puertos), y reciben sus dependencias (puertos) por
  constructor — nunca las instancian internamente.

---

## 6. Constantes y Variables

- `const` siempre que no haya reasignación. `let` solo si es necesario. `var` prohibido.
- Las reglas de negocio con "números mágicos" (precios, edades límite, cantidades
  máximas, días de cierre) se centralizan en `src/config/parque.config.js`, nunca
  hardcodeadas dentro de una función.

```js
// src/config/parque.config.js
export const CANTIDAD_MAXIMA_ENTRADAS = 10
export const DESCUENTOS_POR_EDAD = Object.freeze({
  DESCUENTO_MENOR_HASTA_EDAD: 15,
  DESCUENTO_MENOR_PORCENTAJE: 0.5
})
```

---

## 7. Objetos y Arrays

- **Destructuring** al recibir parámetros de un único objeto de datos (DTO):
  `({ fechaVisita, cantidadEntradas, visitantes, formaPago, email })`.
- **Shorthand properties** al devolver objetos cuya clave coincide con la variable:
  `return { comprobante, pago }`.
- Los objetos de configuración inmutables se congelan con `Object.freeze(...)`.

---

## 8. Manejo de Errores

- El dominio **lanza** subclases de `DomainError` (nunca devuelve `null`/`false` para
  indicar un error de validación).
- Los casos de uso **no capturan** errores de dominio: los dejan propagar hacia arriba
  para que la capa HTTP los traduzca.
- Los controllers HTTP delegan los errores con `next(error)`; la traducción a código
  HTTP ocurre **únicamente** en `manejadorErrores` (ver
  [`docs/decisiones_diseño.md`](docs/decisiones_diseño.md#9-manejo-centralizado-de-errores)).
- No se permiten bloques `catch` vacíos. Si se captura un error solo para
  retipificarlo (p. ej. en `ComprarEntradas` al envolver el fallo de la pasarela de
  pago en `PagoRechazadoError`), debe quedar explícito por qué.

---

## 9. Comentarios

- Los comentarios explican el **"por qué"**, no el "qué" (el código ya lo dice).
- Se usan con moderación: la mayoría de los módulos de dominio no necesitan comentarios
  porque los nombres son autoexplicativos.
- Excepción justificada: referencias a la fuente de una regla de negocio (p. ej. el
  comentario en `parque.config.js` que referencia la sección de la ERS de donde surgen
  los valores), o advertencias sobre comportamiento no obvio (p. ej. el formato de
  fecha esperado por el backend en `utils/fecha.js`).
- No se deja código comentado en el repositorio.

---

## 10. Componentes React (Frontend)

### Estructura de un componente

```jsx
import { useState } from 'react'
import { clienteApi } from '../api/clienteApi.js'
import { BannerError } from '../components/BannerError.jsx'

export function PaginaLogin ({ onSesionIniciada, onIrARegistro }) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')

  async function manejarSubmit (evento) {
    evento.preventDefault()
    // ...
  }

  return (
    <div className="tarjeta tarjeta--formulario">
      {/* ... */}
    </div>
  )
}
```

- **Named export** por componente (no default), un componente principal por archivo.
- Handlers de eventos prefijados con `manejar` (equivalente en español a `handle`):
  `manejarSubmit`, `manejarCambioCantidad`.
- Props de callback prefijadas con `on`: `onSesionIniciada`, `onCompraRealizada`.
- Hooks siempre al inicio del componente, nunca dentro de condicionales o loops.
- Componentes de página (`src/pages/`) orquestan estado y llamadas a `clienteApi`;
  componentes de presentación (`src/components/`) reciben datos por props y no hacen
  fetch.

---

## 11. CSS y Estilos

- Convención **BEM** (`bloque`, `bloque__elemento`, `bloque--modificador`), en español
  cuando el bloque representa un concepto de la UI del dominio (`.formulario`,
  `.comprobante__tabla`, `.tarjeta--formulario`).
- **Variables CSS** (`src/styles/variables.css`) para la paleta de marca de EcoHarmony
  Park, tipografía y espaciados — nunca colores o tamaños hardcodeados en los estilos
  de componente.
- Estilos en hojas `.css` dedicadas (`src/styles/componentes.css`); se evita el estilo
  inline salvo necesidad puntual.

---

## 12. Tests

- Estructura **AAA** (Arrange → Act → Assert) en cada test.
- `describe` agrupa por unidad bajo prueba; `it` describe el comportamiento esperado en
  lenguaje natural (`'rechaza una fecha anterior a hoy'`).
- **Tests unitarios** (`tests/unit/`): dominio y aplicación, sin dependencias externas
  reales — los casos de uso reciben **dobles de prueba** (`tests/dobles/Fake*.js`) que
  implementan los puertos.
- **Tests de integración** (`tests/integration/`): persistencia contra archivos
  temporales reales (`fs.mkdtemp`) y HTTP contra `crearApp(...)` con Supertest.
- Los adaptadores externos reales (Mercado Pago, Nodemailer) se prueban con
  `vi.mock()` a nivel de SDK — nunca contra la red real en la suite automatizada (ver
  [`docs/decisiones_diseño.md`](docs/decisiones_diseño.md#10-integraciones-reales-mercado-pago-y-gmail)).

---

## 13. Estructura del Proyecto

```
tp6/
├── guia_estilo.md                  ← Este documento
├── docs/
│   ├── decisiones_diseño.md
│   └── diagramas/
│       ├── diagrama_clases.puml
│       └── diagrama_secuencia_comprar_entradas.puml
├── backend/
│   ├── .env.example                 ← Variables de entorno necesarias (sin valores reales)
│   ├── src/
│   │   ├── config/
│   │   │   └── parque.config.js     ← Reglas de negocio parametrizadas
│   │   ├── domain/
│   │   │   ├── entities/            ← Compra, Visitante, Usuario
│   │   │   ├── valueObjects/        ← FechaVisita, Email
│   │   │   ├── services/            ← CalculadoraTarifas
│   │   │   └── errors/              ← DomainError y subclases
│   │   ├── application/
│   │   │   ├── ports/                ← RepositorioUsuarios, PasarelaDePago, ServicioEmail
│   │   │   ├── useCases/             ← ComprarEntradas, RegistrarUsuario, Login
│   │   │   └── GeneradorComprobante.js
│   │   ├── infrastructure/
│   │   │   ├── http/                 ← app.js, controllers/, routes/, middlewares/
│   │   │   ├── persistence/          ← RepositorioUsuariosJson
│   │   │   └── external/             ← mercadopago/, email/
│   │   └── server.js                 ← Composition root (producción)
│   └── tests/
│       ├── unit/                     ← domain/, application/, infrastructure/
│       ├── integration/              ← persistence/, http/
│       └── dobles/                   ← Fakes de los puertos
└── frontend/
    └── src/
        ├── api/clienteApi.js
        ├── utils/                    ← sesion.js, fecha.js
        ├── components/               ← Encabezado, BannerError, FilaVisitante
        ├── pages/                    ← PaginaLogin, PaginaRegistro, PaginaComprar, PaginaComprobante
        ├── styles/                   ← variables.css, componentes.css
        └── App.jsx                   ← Enrutamiento por estado (sin react-router)
```

### Principio de organización

- **La dependencia apunta hacia adentro:** `infrastructure` depende de `application`,
  que depende de `domain`. Nunca al revés.
- Un archivo por clase/componente/caso de uso.
- Los tests reflejan la misma estructura de carpetas que `src/`, prefijados por tipo
  (`unit`/`integration`).

---

## 14. Herramientas de Automatización

### Backend — JavaScript Standard Style

```bash
cd backend
npm run lint       # Verificar estilo
npm run lint:fix   # Corregir automáticamente
```

### Backend — Tests

```bash
cd backend
npm test             # Correr toda la suite (Vitest)
npm run test:watch   # Modo watch durante TDD
npm run test:coverage
```

### Frontend — oxlint

```bash
cd frontend
npm run lint
```

---

*Guía generada para el Trabajo Práctico 6 (TDD) — ISW 4K4 · Grupo 7 · 2026*
