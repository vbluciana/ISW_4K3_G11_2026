import { Compra } from '../../domain/entities/Compra.js'

export class ComprarEntradas {
  constructor ({ repositorioCompras, pasarelaDePago, servicioEmail } = {}) {
    this.repositorioCompras = repositorioCompras
    this.pasarelaDePago = pasarelaDePago
    this.servicioEmail = servicioEmail
  }

  async ejecutar (datos, fechaReferencia = new Date()) {
    const compra = Compra.crear(datos, fechaReferencia)
    return { compra }
  }
}
