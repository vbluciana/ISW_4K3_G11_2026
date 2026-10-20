import 'dotenv/config'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { crearApp } from './infrastructure/http/app.js'
import { RepositorioUsuariosJson } from './infrastructure/persistence/RepositorioUsuariosJson.js'
import { PasarelaDePagoMercadoPago } from './infrastructure/external/mercadopago/PasarelaDePagoMercadoPago.js'
import { ServicioEmailGmail } from './infrastructure/external/email/ServicioEmailGmail.js'

const directorioActual = dirname(fileURLToPath(import.meta.url))
const RUTA_USUARIOS_JSON = join(directorioActual, '..', 'data', 'usuarios.json')

function resolverFrontendUrl () {
  const rutaTunnel = '/shared/cloudflared/frontend-url.txt'
  if (existsSync(rutaTunnel)) {
    try {
      const urlTunnel = readFileSync(rutaTunnel, 'utf8').trim()
      if (urlTunnel) {
        return urlTunnel
      }
    } catch {
      // Ignora error de lectura y continúa con la variable de entorno
    }
  }
  return process.env.FRONTEND_URL || 'http://localhost:5173'
}

const frontendUrl = resolverFrontendUrl()

// Composition root: único lugar donde se eligen las implementaciones concretas
// (adaptadores) de cada puerto hexagonal, a partir de la configuración real
// del entorno (.env). Las credenciales nunca están hardcodeadas en el código.
const repositorioUsuarios = new RepositorioUsuariosJson(RUTA_USUARIOS_JSON)

const pasarelaDePago = new PasarelaDePagoMercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  frontendUrl
})

const servicioEmail = new ServicioEmailGmail({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS
})

const app = crearApp({ repositorioUsuarios, pasarelaDePago, servicioEmail })

const puerto = process.env.PORT || 3000
app.listen(puerto, () => {
  console.log(`EcoHarmony Park API escuchando en http://localhost:${puerto}`)
  console.log(`Frontend URL configurada para Mercado Pago: ${frontendUrl}`)
})
