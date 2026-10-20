import { describe, it, expect } from 'vitest'
import { Compra } from '../../../src/domain/entities/Compra.js'
import {
  FechaVisitaInvalidaError,
  CantidadEntradasInvalidaError,
  VisitanteInvalidoError,
  FormaPagoInvalidaError,
  EmailInvalidoError
} from '../../../src/domain/errors/DomainError.js'

// Sábado 17-10-2026, día hábil fijo para que los tests no dependan de "hoy".
const HOY = new Date(2026, 9, 17)

function datosValidos (overrides = {}) {
  return {
    fechaVisita: '20-10-2026',
    cantidadEntradas: 2,
    visitantes: [
      { edad: 30, tipoPase: 'regular' },
      { edad: 10, tipoPase: 'regular' }
    ],
    formaPago: 'efectivo',
    email: 'visitante@ecoharmony.com',
    ...overrides
  }
}

describe('Compra', () => {
  it('se crea correctamente con datos válidos y calcula el monto total', () => {
    const compra = Compra.crear(datosValidos(), HOY)

    expect(compra.fechaVisita.valor).toBe('20-10-2026')
    expect(compra.formaPago).toBe('efectivo')
    expect(compra.email.valor).toBe('visitante@ecoharmony.com')
    expect(compra.visitantes).toHaveLength(2)
    // adulto regular ($10000) + menor de 15 con 50% ($5000)
    expect(compra.montoTotal).toBe(15000)
  })

  it('normaliza la forma de pago a minúsculas', () => {
    const compra = Compra.crear(datosValidos({ formaPago: 'TARJETA' }), HOY)

    expect(compra.formaPago).toBe('tarjeta')
  })

  it('propaga el error de fecha inválida', () => {
    expect(() => Compra.crear(datosValidos({ fechaVisita: '19-10-2026' }), HOY))
      .toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza una cantidad de entradas menor a 1', () => {
    expect(() => Compra.crear(datosValidos({ cantidadEntradas: 0, visitantes: [] }), HOY))
      .toThrow(CantidadEntradasInvalidaError)
  })

  it('rechaza una cantidad de entradas mayor a 10', () => {
    const visitantes = Array.from({ length: 11 }, () => ({ edad: 30, tipoPase: 'regular' }))
    expect(() => Compra.crear(datosValidos({ cantidadEntradas: 11, visitantes }), HOY))
      .toThrow(CantidadEntradasInvalidaError)
  })

  it('rechaza cuando la cantidad de visitantes no coincide con cantidadEntradas', () => {
    expect(() => Compra.crear(datosValidos({ cantidadEntradas: 3 }), HOY))
      .toThrow(CantidadEntradasInvalidaError)
  })

  it('propaga el error de visitante inválido', () => {
    const visitantes = [{ edad: 200, tipoPase: 'regular' }, { edad: 10, tipoPase: 'regular' }]
    expect(() => Compra.crear(datosValidos({ visitantes }), HOY)).toThrow(VisitanteInvalidoError)
  })

  it('rechaza una forma de pago inválida', () => {
    expect(() => Compra.crear(datosValidos({ formaPago: 'cheque' }), HOY))
      .toThrow(FormaPagoInvalidaError)
  })

  it('propaga el error de email inválido', () => {
    expect(() => Compra.crear(datosValidos({ email: 'no-es-un-email' }), HOY))
      .toThrow(EmailInvalidoError)
  })
})
