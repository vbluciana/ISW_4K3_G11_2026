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

  it('no cobra a un visitante de hasta 3 años (sin cargo)', () => {
    expect(CalculadoraTarifas.calcularPrecio({ edad: 3, tipoPase: 'regular' })).toBe(0)
    expect(CalculadoraTarifas.calcularPrecio({ edad: 0, tipoPase: 'vip' })).toBe(0)
  })

  it('aplica 50% de descuento a un menor de entre 4 y 15 años', () => {
    expect(CalculadoraTarifas.calcularPrecio({ edad: 15, tipoPase: 'regular' })).toBe(5000)
    expect(CalculadoraTarifas.calcularPrecio({ edad: 4, tipoPase: 'vip' })).toBe(10000)
  })

  it('aplica 50% de descuento a un adulto mayor de 60 años o más', () => {
    expect(CalculadoraTarifas.calcularPrecio({ edad: 60, tipoPase: 'regular' })).toBe(5000)
    expect(CalculadoraTarifas.calcularPrecio({ edad: 85, tipoPase: 'vip' })).toBe(10000)
  })

  it('no aplica descuento a un joven de 16 a 59 años', () => {
    expect(CalculadoraTarifas.calcularPrecio({ edad: 16, tipoPase: 'regular' })).toBe(10000)
    expect(CalculadoraTarifas.calcularPrecio({ edad: 59, tipoPase: 'vip' })).toBe(20000)
  })
})
