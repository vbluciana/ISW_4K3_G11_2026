import { describe, it, expect } from 'vitest'
import { CalculadoraTarifas } from '../../../src/domain/services/CalculadoraTarifas.js'
import { VisitanteInvalidoError } from '../../../src/domain/errors/DomainError.js'

describe('CalculadoraTarifas', () => {
  it('cobra el precio base completo a un adulto con pase regular', () => {
    expect(CalculadoraTarifas.calcularPrecio({ edad: 30, tipoPase: 'regular' })).toBe(10000)
  })

  it('cobra el precio base completo a un adulto con pase vip', () => {
    expect(CalculadoraTarifas.calcularPrecio({ edad: 30, tipoPase: 'vip' })).toBe(20000)
  })
})
