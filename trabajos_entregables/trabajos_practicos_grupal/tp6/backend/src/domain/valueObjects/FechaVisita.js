import { FechaVisitaInvalidaError } from '../errors/DomainError.js'

const FORMATO_DD_MM_AAAA = /^(\d{2})-(\d{2})-(\d{4})$/

export class FechaVisita {
  constructor (valor) {
    this.valor = valor
  }
  static crear (fechaString) {
    if (!FORMATO_DD_MM_AAAA.test(fechaString ?? '')) {
      throw new FechaVisitaInvalidaError('La fecha debe tener el formato dd-mm-aaaa')
    }
    return new FechaVisita(fechaString)
  }
}
