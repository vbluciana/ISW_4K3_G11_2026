import { Compra } from '../../domain/entities/Compra.js'
import { PagoRechazadoError } from '../../domain/errors/DomainError.js'

export class ComprarEntradas {
  #repositorioCompras
  #pasarelaDePago
  #servicioEmail

  constructor ({ repositorioCompras, pasarelaDePago, servicioEmail } = {}) {
    this.#repositorioCompras = repositorioCompras
    this.#pasarelaDePago = pasarelaDePago
    this.#servicioEmail = servicioEmail
  }

  async ejecutar (datos, fechaReferencia = new Date()) {
    const compra = Compra.crear(datos, fechaReferencia)

    let pago = null
    if (compra.formaPago === 'tarjeta') {
      try {
        pago = await this.#procesarPagoTarjeta(compra)
      } catch (err) {
        throw err
      }
    }

    if (this.#repositorioCompras) {
      await this.#repositorioCompras.guardar(compra)
    }

    const comprobante = this.#armarComprobante(compra, pago)

    if (compra.formaPago === 'efectivo' && this.#servicioEmail) {
      await this.#servicioEmail.enviarComprobante({
        email: compra.email.valor,
        comprobante
      })
    }

    return { comprobante, pago: pago || undefined }
  }

  async #procesarPagoTarjeta (compra) {
    if (!this.#pasarelaDePago) {
      throw new PagoRechazadoError('Pasarela de pago no configurada')
    }
    return await this.#pasarelaDePago.crearPreferenciaPago({
      compra,
      email: compra.email.valor,
      visitantes: compra.visitantes,
      montoTotal: compra.montoTotal
    })
  }

  #armarComprobante (compra, pago = null) {
    return {
      idReserva: compra.id,
      nombreComprador: compra.nombreComprador,
      emailComprador: compra.email.valor,
      fechaVisita: compra.fechaVisita.valor,
      cantidadEntradas: compra.cantidadEntradas,
      visitantes: compra.visitantes.map(v => (typeof v.toJSON === 'function' ? v.toJSON() : v)),
      formaPago: compra.formaPago,
      montoTotal: compra.montoTotal,
      estado: compra.formaPago === 'efectivo' ? 'PENDIENTE_PAGO_BOLETERIA' : 'PREFERENCIA_PAGO_GENERADA',
      fechaEmision: new Date().toISOString()
    }
  }
}
