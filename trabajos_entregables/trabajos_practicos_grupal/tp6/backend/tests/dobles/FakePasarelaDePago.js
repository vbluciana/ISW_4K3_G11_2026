import { PasarelaDePago } from '../../src/application/ports/PasarelaDePago.js'
import { PagoRechazadoError } from '../../src/domain/errors/DomainError.js'

export class FakePasarelaDePago extends PasarelaDePago {
  constructor ({ fallar = false } = {}) {
    super()
    this.fallar = fallar
    this.llamadas = []
  }

  async crearPreferenciaPago (detallePago) {
    this.llamadas.push(detallePago)
    if (this.fallar) {
      throw new PagoRechazadoError('La pasarela de pago rechazó la operación')
    }
    return {
      id: 'pref_fake_123',
      initPoint: 'https://sandbox.mercadopago.com/checkout/fake-preference-id',
      sandboxInitPoint: 'https://sandbox.mercadopago.com/checkout/fake-preference-id'
    }
  }

  limpiar () {
    this.llamadas = []
  }
}
