import { FechaVisitaInvalidaError } from '../errors/DomainError.js'

export class FechaVisita {
  constructor (valor) {
    this.valor = (valor || '').trim()
  }
  static crear (cadenaFecha) {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(cadenaFecha)) {
      throw new FechaVisitaInvalidaError('La fecha debe tener el formato dd-mm-aaaa')
    }
    return new FechaVisita(cadenaFecha)
  }
}
