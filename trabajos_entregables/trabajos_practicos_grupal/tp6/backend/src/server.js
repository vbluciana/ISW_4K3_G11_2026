import 'dotenv/config'
import { crearApp } from './infrastructure/http/app.js'
import { InMemoryRepositorioCompras } from './infrastructure/persistence/InMemoryRepositorioCompras.js'
import { PasarelaDePagoMercadoPago } from './infrastructure/external/mercadopago/PasarelaDePagoMercadoPago.js'
import { ServicioEmailGmail } from './infrastructure/external/email/ServicioEmailGmail.js'

// Persistencia en memoria requerida por la cátedra
const repositorioCompras = new InMemoryRepositorioCompras()

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

// Adaptador real de Mercado Pago con credenciales de .env
const pasarelaDePago = new PasarelaDePagoMercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  frontendUrl
})

// Adaptador real de Gmail SMTP con credenciales de .env
const servicioEmail = new ServicioEmailGmail({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER,
  pass: (process.env.SMTP_PASS || '').replace(/\s+/g, '')
})

const app = crearApp({
  repositorioCompras,
  pasarelaDePago,
  servicioEmail
})

const puerto = process.env.PORT || 3000
app.listen(puerto, () => {
  console.log(`[Backend] 🌿 EcoHarmony API activo en http://localhost:${puerto}`)
  console.log(`[Backend] 📧 Correo: Gmail SMTP activo (${process.env.SMTP_USER})`)
  console.log('[Backend] 💳 Pasarela: Mercado Pago Checkout Pro Sandbox activo')
})
