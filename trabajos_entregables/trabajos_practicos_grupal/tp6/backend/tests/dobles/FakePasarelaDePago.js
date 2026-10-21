import { PasarelaDePago } from '../../src/application/ports/PasarelaDePago.js'
import { PagoRechazadoError } from '../../src/domain/errors/DomainError.js'

export class FakePasarelaDePago extends PasarelaDePago {
  constructor () {
    super()
    this.llamadas = []
    this.fallar = false
  }

  async crearPreferenciaPago (datos) {
    this.llamadas.push(datos)
    if (this.fallar) {
      throw new PagoRechazadoError('Fondos insuficientes')
    }
    return {
      id: 'fake-preference-id',
      initPoint: 'https://sandbox.mercadopago.com/checkout/fake-preference-id'
    }
  }
}
