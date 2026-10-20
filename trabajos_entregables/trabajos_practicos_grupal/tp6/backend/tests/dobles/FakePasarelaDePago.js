import { PasarelaDePago } from '../../src/application/ports/PasarelaDePago.js'

export class FakePasarelaDePago extends PasarelaDePago {
  constructor ({ fallar = false } = {}) {
    super()
    this.fallar = fallar
    this.llamadas = []
  }

  async crearPreferenciaPago (detallePago) {
    this.llamadas.push(detallePago)
    if (this.fallar) {
      throw new Error('La pasarela de pago rechazó la operación')
    }
    return { initPoint: 'https://sandbox.mercadopago.com/checkout/fake-preference-id' }
  }
}
