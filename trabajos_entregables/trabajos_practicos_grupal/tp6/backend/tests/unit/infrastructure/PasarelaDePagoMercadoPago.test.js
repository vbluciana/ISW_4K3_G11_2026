import { describe, it, expect, vi, beforeEach } from 'vitest'

const preferenceCreateMock = vi.fn()

vi.mock('mercadopago', () => ({
  MercadoPagoConfig: vi.fn(function MercadoPagoConfig () {}),
  Preference: vi.fn(function Preference () {
    this.create = preferenceCreateMock
  })
}))

const { PasarelaDePagoMercadoPago } = await import('../../../src/infrastructure/external/mercadopago/PasarelaDePagoMercadoPago.js')
const { Visitante } = await import('../../../src/domain/entities/Visitante.js')

describe('PasarelaDePagoMercadoPago', () => {
  let pasarela

  beforeEach(() => {
    preferenceCreateMock.mockReset()
    pasarela = new PasarelaDePagoMercadoPago({
      accessToken: 'TEST-ACCESS-TOKEN',
      frontendUrl: 'http://localhost:5173'
    })
  })

  it('construye un item por cada visitante con su precio final y crea la preferencia', async () => {
    preferenceCreateMock.mockResolvedValue({
      init_point: 'https://mercadopago.com/checkout/pro',
      sandbox_init_point: 'https://sandbox.mercadopago.com/checkout/pro'
    })

    const visitantes = [
      Visitante.crear({ edad: 30, tipoPase: 'regular' }),
      Visitante.crear({ edad: 10, tipoPase: 'vip' })
    ]

    const resultado = await pasarela.crearPreferenciaPago({ visitantes, email: 'ana@ecoharmony.com' })

    expect(preferenceCreateMock).toHaveBeenCalledTimes(1)
    const [argumento] = preferenceCreateMock.mock.calls[0]
    expect(argumento.body.items).toEqual([
      { title: 'Entrada Regular #1', quantity: 1, unit_price: 10000, currency_id: 'ARS' },
      { title: 'Entrada Vip #2', quantity: 1, unit_price: 10000, currency_id: 'ARS' }
    ])
    expect(argumento.body.payer.email).toBe('ana@ecoharmony.com')

    expect(resultado).toEqual({
      initPoint: 'https://mercadopago.com/checkout/pro',
      sandboxInitPoint: 'https://sandbox.mercadopago.com/checkout/pro'
    })
  })

  it('no envía auto_return cuando el frontend corre en localhost (Mercado Pago lo rechaza)', async () => {
    preferenceCreateMock.mockResolvedValue({ init_point: 'x', sandbox_init_point: 'y' })

    const visitantes = [Visitante.crear({ edad: 30, tipoPase: 'regular' })]
    await pasarela.crearPreferenciaPago({ visitantes, email: 'ana@ecoharmony.com' })

    const [argumento] = preferenceCreateMock.mock.calls[0]
    expect(argumento.body.back_urls.success).toBe('http://localhost:5173/pago-exitoso')
    expect(argumento.body).not.toHaveProperty('auto_return')
  })

  it('envía auto_return "approved" cuando el frontend tiene una URL pública', async () => {
    preferenceCreateMock.mockResolvedValue({ init_point: 'x', sandbox_init_point: 'y' })
    const pasarelaPublica = new PasarelaDePagoMercadoPago({
      accessToken: 'TEST-ACCESS-TOKEN',
      frontendUrl: 'https://ecoharmony.example.com'
    })

    const visitantes = [Visitante.crear({ edad: 30, tipoPase: 'regular' })]
    await pasarelaPublica.crearPreferenciaPago({ visitantes, email: 'ana@ecoharmony.com' })

    const [argumento] = preferenceCreateMock.mock.calls[0]
    expect(argumento.body.auto_return).toBe('approved')
  })

  it('propaga el error si Mercado Pago rechaza la creación de la preferencia', async () => {
    preferenceCreateMock.mockRejectedValue(new Error('token inválido'))

    const visitantes = [Visitante.crear({ edad: 30, tipoPase: 'regular' })]

    await expect(pasarela.crearPreferenciaPago({ visitantes, email: 'ana@ecoharmony.com' }))
      .rejects.toThrow('token inválido')
  })
})
