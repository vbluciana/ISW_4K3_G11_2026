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
})
