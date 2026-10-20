// Puerto (hexagonal): contrato para el envío de notificaciones por correo. El
// adaptador real usa Nodemailer contra Gmail SMTP; los tests usan un doble de prueba.
export class ServicioEmail {
  async enviarComprobante (_destino) {
    throw new Error('ServicioEmail.enviarComprobante: método no implementado')
  }
}
