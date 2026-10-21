import { describe, it, expect, beforeEach } from 'vitest'
import { ComprarEntradas } from '../../../src/application/useCases/ComprarEntradas.js'
import { InMemoryRepositorioCompras } from '../../dobles/InMemoryRepositorioCompras.js'
import { FakePasarelaDePago } from '../../dobles/FakePasarelaDePago.js'
import { FakeServicioEmail } from '../../dobles/FakeServicioEmail.js'
import { FechaVisitaInvalidaError, PagoRechazadoError } from '../../../src/domain/errors/DomainError.js'

// Referencia fija determinista (Sábado 17-10-2026)
const HOY = new Date(2026, 9, 17)

function datosValidos (overrides = {}) {
  return {
    nombreComprador: 'Ana Gómez',
    emailComprador: 'ana@ecoharmony.com',
    fechaVisita: '20-10-2026',
    cantidadEntradas: 1,
    visitantes: [{ edad: 30, tipoPase: 'regular' }],
    formaPago: 'efectivo',
    ...overrides
  }
}

describe('ComprarEntradas (caso de uso)', () => {
  let repositorioCompras
  let pasarelaDePago
  let servicioEmail
  let comprarEntradas

  beforeEach(() => {
    repositorioCompras = new InMemoryRepositorioCompras()
    pasarelaDePago = new FakePasarelaDePago()
    servicioEmail = new FakeServicioEmail()
    comprarEntradas = new ComprarEntradas({
      repositorioCompras,
      pasarelaDePago,
      servicioEmail
    })
  })

  it('propaga los errores de validación de negocio de Compra sin notificar email ni guardar', async () => {
    await expect(comprarEntradas.ejecutar(datosValidos({ fechaVisita: '19-10-2026' }), HOY))
      .rejects.toThrow(FechaVisitaInvalidaError)

    expect(servicioEmail.enviados).toHaveLength(0)
    expect(pasarelaDePago.llamadas).toHaveLength(0)
    expect(await repositorioCompras.listarTodas()).toHaveLength(0)
  })

  it('en compra en efectivo: guarda la compra, envía el comprobante por email y no llama a pasarela', async () => {
    const resultado = await comprarEntradas.ejecutar(datosValidos(), HOY)

    expect(servicioEmail.enviados).toHaveLength(1)
    expect(servicioEmail.enviados[0].email).toBe('ana@ecoharmony.com')
    expect(servicioEmail.enviados[0].comprobante.nombreComprador).toBe('Ana Gómez')
    expect(pasarelaDePago.llamadas).toHaveLength(0)
    expect(resultado.comprobante.montoTotal).toBe(10000)
    expect(resultado.comprobante.estado).toBe('PENDIENTE_PAGO_BOLETERIA')
    expect(resultado.pago).toBeUndefined()

    const comprasGuardadas = await repositorioCompras.listarTodas()
    expect(comprasGuardadas).toHaveLength(1)
    expect(comprasGuardadas[0].emailComprador).toBe('ana@ecoharmony.com')
  })

  it('en compra con tarjeta: genera la preferencia en la pasarela, guarda la compra y despacha el mail', async () => {
    const resultado = await comprarEntradas.ejecutar(datosValidos({ formaPago: 'tarjeta' }), HOY)

    expect(pasarelaDePago.llamadas).toHaveLength(1)
    expect(servicioEmail.enviados).toHaveLength(1)
    expect(resultado.pago.initPoint).toBe('https://sandbox.mercadopago.com/checkout/fake-preference-id')
    expect(resultado.comprobante.estado).toBe('PREFERENCIA_PAGO_GENERADA')

    const comprasGuardadas = await repositorioCompras.listarTodas()
    expect(comprasGuardadas).toHaveLength(1)
  })

  it('si la pasarela de pago falla, lanza PagoRechazadoError y NUNCA despacha el correo ni guarda la compra', async () => {
    pasarelaDePago.fallar = true

    await expect(comprarEntradas.ejecutar(datosValidos({ formaPago: 'tarjeta' }), HOY))
      .rejects.toThrow(PagoRechazadoError)

    // CORRECCIÓN DEL BUG DE NEGOCIO: el email NO debe enviarse
    expect(servicioEmail.enviados).toHaveLength(0)
    expect(await repositorioCompras.listarTodas()).toHaveLength(0)
  })
})
