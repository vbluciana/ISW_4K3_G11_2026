import { describe, it, expect } from 'vitest'
import { FechaVisita } from '../../../src/domain/valueObjects/FechaVisita.js'
import { FechaVisitaInvalidaError } from '../../../src/domain/errors/DomainError.js'

// Referencia fija determinista (Sábado 17-10-2026)
const HOY = new Date(2026, 9, 17)

describe('FechaVisita', () => {
  it('se crea correctamente con una fecha futura válida en formato dd-mm-aaaa', () => {
    const fechaVisita = FechaVisita.crear('20-10-2026', HOY)

    expect(fechaVisita.valor).toBe('20-10-2026')
  })

  it('rechaza formatos que no sean dd-mm-aaaa', () => {
    expect(() => FechaVisita.crear('2026-10-20', HOY)).toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza fechas calendario inexistentes', () => {
    expect(() => FechaVisita.crear('31-02-2026', HOY)).toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza fechas con años inválidos o lejanos (ej. año 6598 o año pasado)', () => {
    expect(() => FechaVisita.crear('20-10-6598', HOY)).toThrow('El año de la fecha de visita es inválido')
    expect(() => FechaVisita.crear('20-10-2025', HOY)).toThrow('El año de la fecha de visita es inválido')
  })
})
