import { Compra } from '../../domain/entities/Compra.js'
import { PagoRechazadoError } from '../../domain/errors/DomainError.js'

export class ComprarEntradas {
  #repositorioCompras
  #pasarelaDePago
  #servicioEmail

  constructor ({ repositorioCompras, pasarelaDePago, servicioEmail }) {
    this.#repositorioCompras = repositorioCompras
    this.#pasarelaDePago = pasarelaDePago
    this.#servicioEmail = servicioEmail
  }

  async ejecutar ({
    nombreComprador,
    emailComprador,
    email,
    fechaVisita,
    cantidadEntradas,
    visitantes,
    formaPago
  }, fechaReferencia = new Date()) {
    // 1. Crear y validar la entidad Compra (Aggregate Root)
    const compra = Compra.crear({
      nombreComprador: nombreComprador || 'Comprador EcoHarmony',
      email: email || emailComprador,
      emailComprador: emailComprador || email,
      fechaVisita,
      cantidadEntradas,
      visitantes,
      formaPago
    }, fechaReferencia)

    // 2. Procesar pago con pasarela externa si la forma de pago es tarjeta
    let pago = null
    if (compra.formaPago === 'tarjeta') {
      pago = await this.#procesarPagoTarjeta(compra)
    }

    // 3. Persistir compra en repositorio
    if (this.#repositorioCompras) {
      await this.#repositorioCompras.guardar(compra)
    }

    // 4. Armar el comprobante
    const comprobante = this.#armarComprobante(compra, pago)

    // 5. Enviar comprobante por email ESTRICTAMENTE AL FINAL
    if (this.#servicioEmail) {
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

  async #procesarPagoTarjeta (compra) {
    if (!this.#pasarelaDePago) {
      throw new PagoRechazadoError('Pasarela de pago no configurada')
    }

    try {
      return await this.#pasarelaDePago.crearPreferenciaPago({
        compra,
        email: compra.email.valor,
        visitantes: compra.visitantes,
        montoTotal: compra.montoTotal
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
      visitantes: compra.visitantes.map(v => v.toJSON()),
      formaPago: compra.formaPago,
      montoTotal: compra.montoTotal,
      estado: compra.formaPago === 'efectivo' ? 'PENDIENTE_PAGO_BOLETERIA' : 'PREFERENCIA_PAGO_GENERADA',
      fechaEmision: new Date().toISOString()
    }
  }
}
