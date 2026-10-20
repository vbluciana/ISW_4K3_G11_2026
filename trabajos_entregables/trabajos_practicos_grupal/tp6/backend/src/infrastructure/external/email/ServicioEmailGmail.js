import nodemailer from 'nodemailer'
import { ServicioEmail } from '../../../application/ports/ServicioEmail.js'

function filaDetalle (entrada) {
  return `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #a7c957;">#${entrada.numero}</td>
      <td style="padding:8px;border-bottom:1px solid #a7c957;">${entrada.edad} años</td>
      <td style="padding:8px;border-bottom:1px solid #a7c957;">${entrada.tipoPase}</td>
      <td style="padding:8px;border-bottom:1px solid #a7c957;">${entrada.precioFinal}</td>
    </tr>
  `
}

function construirHtml (comprobante) {
  const filas = comprobante.detalleEntradas.map(filaDetalle).join('')

  return `
    <div style="font-family: Lato, Arial, sans-serif; color: #386641;">
      <h1 style="color: #386641;">EcoHarmony Park</h1>
      <p>¡Gracias por tu compra! A continuación el comprobante de tu visita:</p>
      <p><strong>Fecha de visita:</strong> ${comprobante.fechaVisita}</p>
      <p><strong>Forma de pago:</strong> ${comprobante.formaPago}</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#6a994e;color:#f2e8cf;">
            <th style="padding:8px;text-align:left;">Entrada</th>
            <th style="padding:8px;text-align:left;">Edad</th>
            <th style="padding:8px;text-align:left;">Pase</th>
            <th style="padding:8px;text-align:left;">Precio</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
      <p style="font-size:1.2em;"><strong>Monto total: ${comprobante.montoTotal}</strong></p>
    </div>
  `
}

// Adaptador de infraestructura (hexagonal): implementa el puerto ServicioEmail
// usando Nodemailer contra un servidor SMTP real (Gmail). Las credenciales
// llegan por inyección de dependencias desde variables de entorno, nunca hardcodeadas.
export class ServicioEmailGmail extends ServicioEmail {
  constructor ({ host, port, secure, user, pass }) {
    super()
    this.remitente = user
    this.transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
  }

  async enviarComprobante ({ email, comprobante }) {
    await this.transporter.sendMail({
      from: `"EcoHarmony Park" <${this.remitente}>`,
      to: email,
      subject: 'Confirmación de compra - EcoHarmony Park',
      html: construirHtml(comprobante)
    })
  }
}
