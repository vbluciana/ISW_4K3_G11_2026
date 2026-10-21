import { ServicioEmail } from '../../src/application/ports/ServicioEmail.js'

export class FakeServicioEmail extends ServicioEmail {
  constructor () {
    super()
    this.enviados = []
  }

  async enviarComprobante ({ email, comprobante }) {
    this.enviados.push({ email, comprobante })
    return { idMensaje: 'fake-id' }
  }
}
