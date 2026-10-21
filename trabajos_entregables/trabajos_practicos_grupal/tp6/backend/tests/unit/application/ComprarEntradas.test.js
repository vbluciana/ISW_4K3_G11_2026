import { describe, it, expect, beforeEach } from 'vitest'
import { ComprarEntradas } from '../../../src/application/useCases/ComprarEntradas.js'
import { FechaVisitaInvalidaError, PagoRechazadoError } from '../../../src/domain/errors/DomainError.js'
import { InMemoryRepositorioCompras } from '../../dobles/InMemoryRepositorioCompras.js'
import { FakePasarelaDePago } from '../../dobles/FakePasarelaDePago.js'
import { FakeServicioEmail } from '../../dobles/FakeServicioEmail.js'

const HOY = new Date(2026, 9, 17)
const FECHA_VALIDA = '20-10-2026'

function datosValidos (overrides = {}) {
  return {
    nombreComprador: 'Ana Gómez',
    emailComprador: 'ana@ecoharmony.com',
    fechaVisita: FECHA_VALIDA,
    cantidadEntradas: 2,
    visitantes: [
      { edad: 30, tipoPase: 'regular' },
      { edad: 10, tipoPase: 'regular' }
    ],
    formaPago: 'efectivo',
    ...overrides
  }
}

describe('ComprarEntradas', () => {
  let repositorioCompras
  let pasarelaDePago
  let servicioEmail
  let casoDeUso

  beforeEach(() => {
    repositorioCompras = new InMemoryRepositorioCompras()
    pasarelaDePago = new FakePasarelaDePago()
    servicioEmail = new FakeServicioEmail()
    casoDeUso = new ComprarEntradas({
      repositorioCompras,
      pasarelaDePago,
      servicioEmail
    })
  })

  it('propaga errores de dominio sin interactuar con repositorio ni pasarela ni email', async () => {
    const datosConFechaInvalida = datosValidos({ fechaVisita: '19-10-2026' }) // Lunes, cerrado

    await expect(casoDeUso.ejecutar(datosConFechaInvalida, HOY))
      .rejects
      .toThrow(FechaVisitaInvalidaError)

    expect(await repositorioCompras.listarTodas()).toHaveLength(0)
    expect(pasarelaDePago.llamadas).toHaveLength(0)
    expect(servicioEmail.enviados).toHaveLength(0)
  })

  it('completa una compra en efectivo: persiste la compra, envía email y retorna comprobante', async () => {
    const resultado = await casoDeUso.ejecutar(datosValidos(), HOY)

    expect(resultado.comprobante).toBeDefined()
    expect(resultado.comprobante.montoTotal).toBe(15000)
    expect(resultado.comprobante.formaPago).toBe('efectivo')
    expect(resultado.comprobante.estado).toBe('PENDIENTE_PAGO_BOLETERIA')
    expect(resultado.pago).toBeUndefined()

    expect(await repositorioCompras.listarTodas()).toHaveLength(1)
    expect(pasarelaDePago.llamadas).toHaveLength(0)
    expect(servicioEmail.enviados).toHaveLength(1)
    expect(servicioEmail.enviados[0].email).toBe('ana@ecoharmony.com')
  })

  it('compra con tarjeta: crea la preferencia en la pasarela pero NO envía email de inmediato', async () => {
    const datosTarjeta = datosValidos({ formaPago: 'tarjeta' })

    const resultado = await casoDeUso.ejecutar(datosTarjeta, HOY)

    expect(resultado.comprobante).toBeDefined()
    expect(resultado.comprobante.estado).toBe('PREFERENCIA_PAGO_GENERADA')
    expect(resultado.pago).toBeDefined()
    expect(resultado.pago.initPoint).toBe('https://sandbox.mercadopago.com/checkout/fake-preference-id')

    expect(await repositorioCompras.listarTodas()).toHaveLength(1)
    expect(pasarelaDePago.llamadas).toHaveLength(1)
    expect(servicioEmail.enviados).toHaveLength(0)
  })
})
