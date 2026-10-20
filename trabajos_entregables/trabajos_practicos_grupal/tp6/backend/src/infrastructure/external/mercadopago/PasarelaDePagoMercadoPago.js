import { MercadoPagoConfig, Preference } from 'mercadopago'
import { PasarelaDePago } from '../../../application/ports/PasarelaDePago.js'

function capitalizar (texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function esUrlLocal (url) {
  try {
    const { hostname } = new URL(url)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

// Adaptador de infraestructura (hexagonal): implementa el puerto PasarelaDePago
// usando el SDK oficial de Mercado Pago (Checkout Pro). Las credenciales nunca
// se hardcodean: llegan por inyección de dependencias desde variables de entorno.
export class PasarelaDePagoMercadoPago extends PasarelaDePago {
  constructor ({ accessToken, frontendUrl }) {
    super()
    const cliente = new MercadoPagoConfig({ accessToken })
    this.preference = new Preference(cliente)
    this.frontendUrl = (frontendUrl ?? 'http://localhost:5173').replace(/\/+$/, '')
  }

  async crearPreferenciaPago ({ visitantes, email }) {
    const items = visitantes.map((visitante, indice) => ({
      title: `Entrada ${capitalizar(visitante.tipoPase)} #${indice + 1}`,
      quantity: 1,
      unit_price: visitante.calcularPrecio(),
      currency_id: 'ARS'
    }))

    const body = {
      items,
      payer: { email },
      back_urls: {
        success: `${this.frontendUrl}/pago-exitoso`,
        failure: `${this.frontendUrl}/pago-fallido`,
        pending: `${this.frontendUrl}/pago-pendiente`
      }
    }

    // Mercado Pago rechaza auto_return si las back_urls apuntan a localhost
    // (error "invalid_auto_return"), así que solo se activa en URLs públicas (como Cloudflare Tunnel).
    if (!esUrlLocal(this.frontendUrl)) {
      body.auto_return = 'approved'
    }

    const respuesta = await this.preference.create({ body })

    return {
      initPoint: respuesta.init_point,
      sandboxInitPoint: respuesta.sandbox_init_point
    }
  }
}
