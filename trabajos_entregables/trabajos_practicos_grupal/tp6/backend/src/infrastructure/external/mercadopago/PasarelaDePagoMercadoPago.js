import { MercadoPagoConfig, Preference } from 'mercadopago'
import { PasarelaDePago } from '../../../application/ports/PasarelaDePago.js'

function capitalizar (texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

function esUrlLocal (url) {
  try {
    const { hostname } = new URL(url)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

export class PasarelaDePagoMercadoPago extends PasarelaDePago {
  constructor ({ accessToken, frontendUrl, autoReturn } = {}) {
    super()
    const cliente = new MercadoPagoConfig({ accessToken: accessToken || 'TEST-ACCESS-TOKEN' })
    this.preference = new Preference(cliente)
    this.frontendUrl = (frontendUrl || 'http://localhost:5173').replace(/\/+$/, '')
    // Mercado Pago rechaza auto_return cuando back_urls es localhost ("invalid_auto_return").
    // Por defecto se omite en localhost y se activa en URLs públicas, o se fuerza con autoReturn.
    this.autoReturn = autoReturn !== undefined ? autoReturn : !esUrlLocal(this.frontendUrl)
  }

  async crearPreferenciaPago ({ compra, visitantes, email }) {
    const listaVisitantes = visitantes || (compra ? compra.visitantes : [])
    const emailPayer = email || (compra ? (compra.email?.valor || compra.email) : '')

    const items = listaVisitantes.map((visitante, indice) => ({
      title: `Entrada ${capitalizar(visitante.tipoPase)} #${indice + 1}`,
      quantity: 1,
      unit_price: typeof visitante.calcularPrecio === 'function' ? visitante.calcularPrecio() : visitante.precio,
      currency_id: 'ARS'
    }))

    const body = {
      items,
      payer: { email: emailPayer },
      back_urls: {
        success: `${this.frontendUrl}/pago-exitoso`,
        failure: `${this.frontendUrl}/pago-fallido`,
        pending: `${this.frontendUrl}/pago-pendiente`
      }
    }

    if (this.autoReturn) {
      body.auto_return = 'approved'
    }

    const respuesta = await this.preference.create({ body })

    return {
      id: respuesta.id,
      initPoint: respuesta.init_point,
      sandboxInitPoint: respuesta.sandbox_init_point
    }
  }
}
