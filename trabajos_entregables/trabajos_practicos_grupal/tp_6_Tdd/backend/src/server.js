import 'dotenv/config'
import { crearApp } from './infrastructure/http/app.js'
import { InMemoryRepositorioCompras } from './infrastructure/persistence/InMemoryRepositorioCompras.js'
import { PasarelaDePagoMercadoPago } from './infrastructure/external/mercadopago/PasarelaDePagoMercadoPago.js'
import { ServicioEmailGmail } from './infrastructure/external/email/ServicioEmailGmail.js'

const repositorioCompras = new InMemoryRepositorioCompras()
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

const pasarelaDePago = new PasarelaDePagoMercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  frontendUrl
})

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
})
