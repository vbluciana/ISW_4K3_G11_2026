import { describe, it, expect, beforeEach } from 'vitest'
import { ComprarEntradas } from '../../../src/application/useCases/ComprarEntradas.js'
import { FakeRepositorioUsuarios } from '../../dobles/FakeRepositorioUsuarios.js'
import { FakePasarelaDePago } from '../../dobles/FakePasarelaDePago.js'
import { FakeServicioEmail } from '../../dobles/FakeServicioEmail.js'
import { UsuarioNoRegistradoError, FechaVisitaInvalidaError, PagoRechazadoError } from '../../../src/domain/errors/DomainError.js'

const HOY = new Date(2026, 9, 17)
const USUARIO = { id: 100, nombre: 'Ana', email: 'ana@ecoharmony.com' }

function datosValidos (overrides = {}) {
  return {
    usuarioId: 100,
    fechaVisita: '20-10-2026',
    cantidadEntradas: 1,
    visitantes: [{ edad: 30, tipoPase: 'regular' }],
    formaPago: 'efectivo',
    ...overrides
  }
}

describe('ComprarEntradas (caso de uso)', () => {
  let repositorioUsuarios
  let pasarelaDePago
  let servicioEmail
  let comprarEntradas

  beforeEach(() => {
    repositorioUsuarios = new FakeRepositorioUsuarios([USUARIO])
    pasarelaDePago = new FakePasarelaDePago()
    servicioEmail = new FakeServicioEmail()
    comprarEntradas = new ComprarEntradas(repositorioUsuarios, pasarelaDePago, servicioEmail)
  })

  it('rechaza la compra si el usuario no está registrado', async () => {
    await expect(comprarEntradas.ejecutar(datosValidos({ usuarioId: 999 }), HOY))
      .rejects.toThrow(UsuarioNoRegistradoError)

    expect(servicioEmail.enviados).toHaveLength(0)
    expect(pasarelaDePago.llamadas).toHaveLength(0)
  })

  it('propaga los errores de validación de negocio de la Compra sin notificar nada', async () => {
    await expect(comprarEntradas.ejecutar(datosValidos({ fechaVisita: '19-10-2026' }), HOY))
      .rejects.toThrow(FechaVisitaInvalidaError)

    expect(servicioEmail.enviados).toHaveLength(0)
    expect(pasarelaDePago.llamadas).toHaveLength(0)
  })

  it('en una compra en efectivo: envía el comprobante por email y no usa la pasarela de pago', async () => {
    const resultado = await comprarEntradas.ejecutar(datosValidos(), HOY)

    expect(servicioEmail.enviados).toHaveLength(1)
    expect(servicioEmail.enviados[0].email).toBe('ana@ecoharmony.com')
    expect(pasarelaDePago.llamadas).toHaveLength(0)
    expect(resultado.comprobante.montoTotal).toBeDefined()
    expect(resultado.pago).toBeUndefined()
  })

  it('en una compra con tarjeta: envía el comprobante y genera la preferencia de pago', async () => {
    const resultado = await comprarEntradas.ejecutar(datosValidos({ formaPago: 'tarjeta' }), HOY)

    expect(servicioEmail.enviados).toHaveLength(1)
    expect(pasarelaDePago.llamadas).toHaveLength(1)
    expect(resultado.pago.initPoint).toBe('https://sandbox.mercadopago.com/checkout/fake-preference-id')
  })

  it('si la pasarela de pago falla, lanza PagoRechazadoError', async () => {
    pasarelaDePago.fallar = true

    await expect(comprarEntradas.ejecutar(datosValidos({ formaPago: 'tarjeta' }), HOY))
      .rejects.toThrow(PagoRechazadoError)
  })
})
