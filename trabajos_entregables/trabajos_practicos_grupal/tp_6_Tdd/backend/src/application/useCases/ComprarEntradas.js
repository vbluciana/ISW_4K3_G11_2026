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
    // 1. Instanciar y validar el agregado Compra y todas sus entidades/VOs
    const compra = Compra.crear({
      nombreComprador: datos.nombreComprador,
      emailComprador: datos.emailComprador || datos.email,
      fechaVisita: datos.fechaVisita,
      cantidadEntradas: datos.cantidadEntradas,
      visitantes: datos.visitantes,
      formaPago: datos.formaPago
    }, fechaReferencia)

    // 2. Procesar pago con pasarela externa si la forma de pago es tarjeta y el monto es mayor a 0
    let pago = null
    if (compra.formaPago === 'tarjeta' && compra.montoTotal > 0) {
      pago = await this.#procesarPagoTarjeta(compra, datos.frontendUrl)
    }

    // 3. Persistir compra en repositorio
    if (this.#repositorioCompras) {
      await this.#repositorioCompras.guardar(compra)
    }

    // 4. Armar el comprobante
    const comprobante = this.#armarComprobante(compra, pago)

    // 5. Enviar comprobante por email si es compra en efectivo o sin cargo ($0)
    if ((compra.formaPago === 'efectivo' || compra.montoTotal === 0) && this.#servicioEmail) {
      await this.#servicioEmail.enviarComprobante({
        email: compra.email.valor,
        comprobante
      })
    }

    return {
      comprobante,
      pago: pago || undefined
    }
  }

  async #procesarPagoTarjeta (compra, frontendUrl) {
    if (!this.#pasarelaDePago) {
      throw new PagoRechazadoError('Pasarela de pago no configurada')
    }

    try {
      return await this.#pasarelaDePago.crearPreferenciaPago({
        compra,
        visitantes: compra.visitantes,
        montoTotal: compra.montoTotal,
        frontendUrl
      })
    } catch (error) {
      if (error instanceof PagoRechazadoError) {
        throw error
      }
      throw new PagoRechazadoError(`Error al procesar el pago: ${error.message}`)
    }
  }

  #armarComprobante (compra, pago) {
    return {
      idReserva: compra.id,
      nombreComprador: compra.nombreComprador,
      emailComprador: compra.email.valor,
      fechaVisita: compra.fechaVisita.valor,
      cantidadEntradas: compra.cantidadEntradas,
      visitantes: compra.visitantes.map(v => (typeof v.toJSON === 'function' ? v.toJSON() : v)),
      formaPago: compra.formaPago,
      montoTotal: compra.montoTotal,
      estado: compra.montoTotal === 0
        ? 'CONFIRMADO_SIN_CARGO'
        : compra.formaPago === 'efectivo'
          ? 'PENDIENTE_PAGO_BOLETERIA'
          : 'PREFERENCIA_PAGO_GENERADA',
      fechaEmision: new Date().toISOString()
    }
  }
}
