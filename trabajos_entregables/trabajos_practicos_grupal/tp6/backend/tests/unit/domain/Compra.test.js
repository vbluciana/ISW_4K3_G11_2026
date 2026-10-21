import { describe, it, expect } from 'vitest'
import { Compra } from '../../../src/domain/entities/Compra.js'
import {
  FechaVisitaInvalidaError,
  CantidadEntradasInvalidaError,
  VisitanteInvalidoError,
  FormaPagoInvalidaError,
  EmailInvalidoError
} from '../../../src/domain/errors/DomainError.js'

// Sábado 17-10-2026, día hábil fijo
const HOY = new Date(2026, 9, 17)

function datosValidos (overrides = {}) {
  return {
    nombreComprador: 'Ana Gómez',
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

    expect(compra.nombreComprador).toBe('Ana Gómez')
    expect(compra.fechaVisita.valor).toBe('20-10-2026')
    expect(compra.formaPago).toBe('efectivo')
    expect(compra.email.valor).toBe('visitante@ecoharmony.com')
    expect(compra.emailComprador).toBe('visitante@ecoharmony.com')
    expect(compra.visitantes).toHaveLength(2)
    expect(compra.montoTotal).toBe(15000)
    expect(compra.id).toBeDefined()
    expect(Object.isFrozen(compra)).toBe(true)
  })

  it('normaliza la forma de pago a minúsculas', () => {
    const compra = Compra.crear(datosValidos({ formaPago: 'TARJETA' }), HOY)
    expect(compra.formaPago).toBe('tarjeta')
  })

  it('propaga el error de fecha inválida', () => {
    expect(() => Compra.crear(datosValidos({ fechaVisita: '19-10-2026' }), HOY))
      .toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza cantidad de entradas menor a 1', () => {
    expect(() => Compra.crear(datosValidos({ cantidadEntradas: 0, visitantes: [] }), HOY))
      .toThrow(CantidadEntradasInvalidaError)
  })

  it('rechaza cantidad de entradas mayor a 10', () => {
    const onceVisitantes = Array.from({ length: 11 }, () => ({ edad: 30, tipoPase: 'regular' }))
    expect(() => Compra.crear(datosValidos({ cantidadEntradas: 11, visitantes: onceVisitantes }), HOY))
      .toThrow(CantidadEntradasInvalidaError)
  })

  it('rechaza cuando cantidadEntradas no coincide con la cantidad de visitantes', () => {
    expect(() => Compra.crear(datosValidos({ cantidadEntradas: 3 }), HOY))
      .toThrow(CantidadEntradasInvalidaError)
  })

  it('propaga errores de validación de visitantes', () => {
    const visitantesInvalidos = [
      { edad: 30, tipoPase: 'regular' },
      { edad: 150, tipoPase: 'regular' }
    ]
    expect(() => Compra.crear(datosValidos({ visitantes: visitantesInvalidos }), HOY))
      .toThrow(VisitanteInvalidoError)
  })
})
