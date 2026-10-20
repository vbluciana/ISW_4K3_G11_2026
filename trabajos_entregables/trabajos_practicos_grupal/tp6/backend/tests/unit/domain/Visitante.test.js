import { describe, it, expect } from 'vitest'
import { Visitante } from '../../../src/domain/entities/Visitante.js'
import { VisitanteInvalidoError } from '../../../src/domain/errors/DomainError.js'

describe('Visitante', () => {
  it('se crea correctamente con edad y tipo de pase válidos', () => {
    const visitante = Visitante.crear({ edad: 30, tipoPase: 'regular' })

    expect(visitante.edad).toBe(30)
    expect(visitante.tipoPase).toBe('regular')
  })

  it('normaliza el tipo de pase a minúsculas', () => {
    const visitante = Visitante.crear({ edad: 30, tipoPase: 'VIP' })

    expect(visitante.tipoPase).toBe('vip')
  })

  it('rechaza una edad negativa', () => {
    expect(() => Visitante.crear({ edad: -1, tipoPase: 'regular' })).toThrow(VisitanteInvalidoError)
  })

  it('rechaza una edad mayor a 120 años', () => {
    expect(() => Visitante.crear({ edad: 121, tipoPase: 'regular' })).toThrow(VisitanteInvalidoError)
  })

  it('rechaza una edad no entera', () => {
    expect(() => Visitante.crear({ edad: 30.5, tipoPase: 'regular' })).toThrow(VisitanteInvalidoError)
  })

  it('rechaza un tipo de pase inválido', () => {
    expect(() => Visitante.crear({ edad: 30, tipoPase: 'premium' })).toThrow(VisitanteInvalidoError)
  })

  it('calcula su propio precio final colaborando con CalculadoraTarifas', () => {
    const adulto = Visitante.crear({ edad: 30, tipoPase: 'regular' })
    const menor = Visitante.crear({ edad: 10, tipoPase: 'regular' })

    expect(adulto.calcularPrecio()).toBe(10000)
    expect(menor.calcularPrecio()).toBe(5000)
  })
})
