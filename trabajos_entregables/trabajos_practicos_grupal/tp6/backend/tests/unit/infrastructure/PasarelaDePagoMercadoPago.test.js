import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PasarelaDePagoMercadoPago } from '../../../src/infrastructure/external/mercadopago/PasarelaDePagoMercadoPago.js'
import { Visitante } from '../../../src/domain/entities/Visitante.js'

const preferenceCreateMock = vi.fn()

vi.mock('mercadopago', () => ({
  MercadoPagoConfig: vi.fn(function MercadoPagoConfig () {}),
  Preference: vi.fn(function Preference () {
    this.create = preferenceCreateMock
  })
}))

describe('PasarelaDePagoMercadoPago', () => {
  let pasarela

  beforeEach(() => {
    vi.clearAllMocks()
    pasarela = new PasarelaDePagoMercadoPago({
      accessToken: 'TEST-ACCESS-TOKEN',
      frontendUrl: 'http://localhost:5173',
      autoReturn: true
    })
  })

  it('crea una preferencia de pago en Mercado Pago con los datos del visitante', async () => {
    preferenceCreateMock.mockResolvedValue({
      id: 'pref-123456',
      init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123',
      sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=123'
    })

    const visitantes = [
      Visitante.crear({ edad: 30, tipoPase: 'regular' }),
      Visitante.crear({ edad: 10, tipoPase: 'vip' })
    ]

    const resultado = await pasarela.crearPreferenciaPago({
      visitantes,
      email: 'ana@ecoharmony.com'
    })

    expect(preferenceCreateMock).toHaveBeenCalledTimes(1)
    const [argumento] = preferenceCreateMock.mock.calls[0]

    expect(argumento.body.payer).toEqual({ email: 'ana@ecoharmony.com' })
    expect(argumento.body.items).toEqual([
      { title: 'Entrada Regular #1', quantity: 1, unit_price: 10000, currency_id: 'ARS' },
      { title: 'Entrada Vip #2', quantity: 1, unit_price: 10000, currency_id: 'ARS' }
    ])
    expect(argumento.body.back_urls).toEqual({
      success: 'http://localhost:5173/pago-exitoso',
      failure: 'http://localhost:5173/pago-fallido',
      pending: 'http://localhost:5173/pago-pendiente'
    })
    expect(argumento.body.auto_return).toBe('approved')
    expect(resultado).toEqual({
      id: 'pref-123456',
      initPoint: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=123',
      sandboxInitPoint: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=123'
    })
  })

  it('no incluye objeto payer si no se especifica email para permitir checkout de invitado sin conflicto', async () => {
    preferenceCreateMock.mockResolvedValue({
      id: 'pref-guest-123',
      init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=guest',
      sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=guest'
    })

    const visitantes = [Visitante.crear({ edad: 30, tipoPase: 'regular' })]

    await pasarela.crearPreferenciaPago({ visitantes })

    const [argumento] = preferenceCreateMock.mock.calls[0]
    expect(argumento.body.payer).toBeUndefined()
  })

  it('propaga el error si Mercado Pago rechaza la creación de la preferencia', async () => {
    preferenceCreateMock.mockRejectedValue(new Error('token inválido'))

    const visitantes = [Visitante.crear({ edad: 30, tipoPase: 'regular' })]

    await expect(pasarela.crearPreferenciaPago({ visitantes, email: 'ana@ecoharmony.com' }))
      .rejects.toThrow('token inválido')
  })
})
