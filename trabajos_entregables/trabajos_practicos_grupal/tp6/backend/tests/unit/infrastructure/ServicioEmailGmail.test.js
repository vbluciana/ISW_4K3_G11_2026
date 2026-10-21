import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMailMock = vi.fn()

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: sendMailMock }))
  }
}))

const { ServicioEmailGmail } = await import('../../../src/infrastructure/external/email/ServicioEmailGmail.js')

describe('ServicioEmailGmail', () => {
  let servicioEmail

  const comprobante = {
    fechaVisita: '20/10/2026',
    cantidadEntradas: 1,
    formaPago: 'efectivo',
    email: 'ana@ecoharmony.com',
    montoTotal: '$ 10.000,00',
    detalleEntradas: [{ numero: 1, edad: 30, tipoPase: 'Regular', precioFinal: '$ 10.000,00' }]
  }

  beforeEach(() => {
    sendMailMock.mockReset()
    sendMailMock.mockResolvedValue({ messageId: 'abc123' })
    servicioEmail = new ServicioEmailGmail({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      user: 'parque@ecoharmony.com',
      pass: 'clave-de-aplicacion'
    })
  })

  it('envía el comprobante al email del destinatario con remitente EcoHarmony Park', async () => {
    await servicioEmail.enviarComprobante({ email: 'ana@ecoharmony.com', comprobante })

    expect(sendMailMock).toHaveBeenCalledTimes(1)
    const [mensaje] = sendMailMock.mock.calls[0]
    expect(mensaje.to).toBe('ana@ecoharmony.com')
    expect(mensaje.from).toContain('EcoHarmony Park')
    expect(mensaje.subject).toContain('Confirmación de compra')
  })

  it('incluye el monto total y la fecha de visita en el cuerpo del email', async () => {
    await servicioEmail.enviarComprobante({ email: 'ana@ecoharmony.com', comprobante })

    const [mensaje] = sendMailMock.mock.calls[0]
    expect(mensaje.html).toContain('$ 10.000,00')
    expect(mensaje.html).toContain('20/10/2026')
  })

  it('propaga el error si el envío falla', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP caído'))

    await expect(servicioEmail.enviarComprobante({ email: 'ana@ecoharmony.com', comprobante }))
      .rejects.toThrow('SMTP caído')
  })
})
