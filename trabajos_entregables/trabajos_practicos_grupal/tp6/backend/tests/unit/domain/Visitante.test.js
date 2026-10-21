import { describe, it, expect } from 'vitest'
import { Visitante } from '../../../src/domain/entities/Visitante.js'
import { VisitanteInvalidoError } from '../../../src/domain/errors/DomainError.js'

describe('Visitante', () => {
  it('se crea correctamente con edad y tipo de pase válidos', () => {
    const visitante = Visitante.crear({ edad: 30, tipoPase: 'regular' })

    expect(visitante.edad).toBe(30)
    expect(visitante.tipoPase).toBe('regular')
    expect(visitante.precio).toBe(10000)
  })

  it('normaliza el tipo de pase a minúsculas', () => {
    const visitante = Visitante.crear({ edad: 30, tipoPase: 'VIP' })

    expect(visitante.tipoPase).toBe('vip')
    expect(visitante.precio).toBe(20000)
  })

  it('rechaza una edad negativa (< 0)', () => {
    expect(() => Visitante.crear({ edad: -1, tipoPase: 'regular' })).toThrow(VisitanteInvalidoError)
  })

  it('rechaza una edad mayor a 100 años (> 100)', () => {
    expect(() => Visitante.crear({ edad: 101, tipoPase: 'regular' })).toThrow(VisitanteInvalidoError)
  })

  it('acepta los límites exactos de edad: 0 y 100 años', () => {
    const bebe = Visitante.crear({ edad: 0, tipoPase: 'regular' })
    const centenario = Visitante.crear({ edad: 100, tipoPase: 'regular' })

    expect(bebe.edad).toBe(0)
    expect(centenario.edad).toBe(100)
  })

  it('rechaza una edad no entera', () => {
    expect(() => Visitante.crear({ edad: 30.5, tipoPase: 'regular' })).toThrow(VisitanteInvalidoError)
  })

  it('rechaza un tipo de pase inválido', () => {
    expect(() => Visitante.crear({ edad: 30, tipoPase: 'premium' }))
      .toThrow(VisitanteInvalidoError)
  })
})
