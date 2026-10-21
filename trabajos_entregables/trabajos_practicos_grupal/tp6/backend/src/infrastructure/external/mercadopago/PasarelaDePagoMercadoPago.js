import { MercadoPagoConfig, Preference } from 'mercadopago'
import { PasarelaDePago } from '../../../application/ports/PasarelaDePago.js'

function capitalizar (texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

export class PasarelaDePagoMercadoPago extends PasarelaDePago {
  constructor ({ accessToken, frontendUrl, autoReturn } = {}) {
    super()
    const cliente = new MercadoPagoConfig({ accessToken: accessToken || 'TEST-ACCESS-TOKEN' })
    this.preference = new Preference(cliente)
    this.frontendUrl = (frontendUrl || 'http://localhost:5173').replace(/\/+$/, '')
    this.autoReturn = autoReturn !== undefined ? autoReturn : this.frontendUrl.startsWith('https://')
  }

  async crearPreferenciaPago ({ compra, visitantes, email, frontendUrl } = {}) {
    const listaVisitantes = visitantes || (compra ? compra.visitantes : [])
    const emailPayerReal = email || (compra ? (compra.email?.valor || compra.email) : '')
    const emailPayer = (process.env.NODE_ENV !== 'test' && !emailPayerReal.includes('@testuser.com'))
      ? 'test_user_8207705484891376030@testuser.com'
      : emailPayerReal

    const idCompra = compra?.id
    const queryReserva = idCompra ? `?reserva=${idCompra}` : ''

    let urlRetorno = (frontendUrl || this.frontendUrl || 'http://localhost:5173').replace(/\/+$/, '')
    if (process.env.NODE_ENV !== 'test' && urlRetorno.includes('localhost')) {
      urlRetorno = urlRetorno.replace('localhost', 'localtest.me')
    }
    const debeAutoRetornar = this.autoReturn !== undefined
      ? this.autoReturn
      : urlRetorno.startsWith('https://')

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
        success: `${urlRetorno}/pago-exitoso${queryReserva}`,
        failure: `${urlRetorno}/pago-fallido${queryReserva}`,
        pending: `${urlRetorno}/pago-pendiente${queryReserva}`
      }
    }

    if (idCompra) {
      body.external_reference = idCompra
    }

    if (debeAutoRetornar) {
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
