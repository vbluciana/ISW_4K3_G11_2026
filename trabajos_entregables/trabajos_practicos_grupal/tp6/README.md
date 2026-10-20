# EcoHarmony Park — Comprar Entradas

**Trabajo Práctico N°6 — TDD (Evaluable)**
Cátedra de Ingeniería y Calidad de Software · Unidad N°4: Aseguramiento de Calidad de
Proceso y de Producto
**Curso:** 4K4 · **Grupo:** 7 · **Año:** 2026

User Story implementada: **"Comprar entradas"** (grupos impares), desarrollada
íntegramente mediante **TDD (Red-Green-Refactor)**, con arquitectura hexagonal en el
backend e integraciones reales a **Mercado Pago** (Checkout Pro) y **Gmail SMTP**
(envío del comprobante de compra).

> Documentación ampliada: [`docs/decisiones_diseño.md`](docs/decisiones_diseño.md) ·
> [`guia_estilo.md`](guia_estilo.md) ·
> [`docs/diagramas/`](docs/diagramas/) (diagrama de clases y de secuencia, PlantUML).

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express, arquitectura hexagonal (ports & adapters) |
| Persistencia | Archivo JSON (`backend/data/usuarios.json`) |
| Pagos | SDK oficial `mercadopago` (Checkout Pro) |
| Email | `nodemailer` sobre SMTP de Gmail |
| Testing backend | Vitest + Supertest |
| Frontend | React 19 + Vite |

---

## Estructura del repositorio

```
tp6/
├── backend/     ← API REST (Express), dominio y casos de uso
├── frontend/    ← SPA en React (login, registro, compra de entradas)
└── docs/        ← Decisiones de diseño y diagramas UML
```

---

## Puesta en marcha

### Arranque completo con Docker Compose (recomendado)

```bash
cp .env.example .env
```

Completar en `.env` el access token de prueba/sandbox de Mercado Pago y, si se
quiere enviar el comprobante, las credenciales de Gmail. Luego levantar toda la app:

```bash
docker compose up --build
```

Cloudflare Quick Tunnel publica el frontend con una URL temporal, sin cuenta ni
authtoken. El backend espera a que el tunnel genere la URL pública y, automáticamente,
usa esa URL como `FRONTEND_URL` para armar las `back_urls` de Mercado Pago. La app
queda disponible localmente en <http://localhost:5173> y el checkout usa la URL pública
del túnel. Para ver la URL:

```bash
docker compose logs -f cloudflared
```

Al volver con pago aprobado se muestra **“¡Gracias por tu compra!”**. Los datos de
usuarios se conservan en un volumen de Docker.

Para detener los servicios, ejecutar `docker compose down`. Para desarrollo sin Docker,
se pueden iniciar backend y frontend por separado; `npm run dev` usa el proxy de Vite a
`http://localhost:3000`.

### Tests del backend

```bash
cd backend
npm install
npm test
npm run test:coverage
```

---

## Flujo funcional

1. El visitante se **registra** (`POST /api/usuarios/registro`) o **inicia sesión**
   (`POST /api/usuarios/login`).
2. Con sesión activa, accede al formulario de **compra de entradas**: fecha de visita,
   cantidad de entradas (hasta 10), edad y tipo de pase (regular/VIP) por cada
   visitante, y forma de pago (efectivo o tarjeta).
3. Al confirmar (`POST /api/compras`):
   - Se valida que el usuario esté registrado, que la fecha esté dentro de los días de
     apertura del parque (no lunes, no feriados), que la cantidad de entradas no supere
     10 y que los datos de cada visitante sean válidos.
   - Se calcula el precio de cada entrada (gratis hasta 3 años, 50% de descuento para
     menores de 15 y mayores de 60).
   - Se envía el comprobante de compra por email.
   - Si la forma de pago es **tarjeta**, se crea una preferencia de pago en Mercado
     Pago y el frontend redirige al visitante al Checkout Pro.
   - Si es **efectivo**, se muestra directamente el comprobante de compra en pantalla.

---

## Tests

```bash
cd backend
npm test
```

78 tests automatizados (unitarios de dominio y aplicación + integración de
persistencia y HTTP), 100% en verde, con cobertura de statements superior al 95% en
las capas `domain` y `application`. El detalle de la estrategia de testing (incluyendo
por qué las integraciones reales se prueban con mocks de SDK en lugar de contra la red
real) está documentado en
[`docs/decisiones_diseño.md`](docs/decisiones_diseño.md#10-integraciones-reales-mercado-pago-y-gmail).
