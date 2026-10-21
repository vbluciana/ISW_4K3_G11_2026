import nodemailer from 'nodemailer'
import { ServicioEmail } from '../../../application/ports/ServicioEmail.js'

export class ServicioEmailGmail extends ServicioEmail {
  constructor ({ host, port, secure, user, pass } = {}) {
    super()
    this.remitente = user || 'parque@ecoharmony.com'
    this.transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
  }

  async enviarComprobante ({ email, comprobante }) {
    await this.transporter.sendMail({
      from: `"EcoHarmony Park" <${this.remitente}>`,
      to: email,
      subject: 'Confirmación de compra - EcoHarmony Park',
      html: `<p>${comprobante.fechaVisita} - ${comprobante.montoTotal}</p>`
    })
  }
}
