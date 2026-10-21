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

  it('rechaza fechas anteriores al día de hoy', () => {
    expect(() => FechaVisita.crear('16-10-2026', HOY)).toThrow('La fecha de visita no puede ser anterior al día de hoy')
  })

  it('rechaza una fecha pasada aunque caiga un día lunes con el error de fecha anterior', () => {
    // 12-10-2026 fue lunes anterior a HOY (17-10-2026)
    expect(() => FechaVisita.crear('12-10-2026', HOY)).toThrow('La fecha de visita no puede ser anterior al día de hoy')
  })

  it('acepta el día de hoy como fecha de visita válida', () => {
    // 17-10-2026 es sábado, día hábil.
    const fechaVisita = FechaVisita.crear('17-10-2026', HOY)

    expect(fechaVisita.valor).toBe('17-10-2026')
  })

  it('rechaza los lunes porque el parque cierra ese día', () => {
    // 19-10-2026 es lunes.
    expect(() => FechaVisita.crear('19-10-2026', HOY)).toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza fechas con más de 30 días de anticipación', () => {
    // Desde el 17-10-2026, el 25-11-2026 supera los 30 días.
    expect(() => FechaVisita.crear('25-11-2026', HOY)).toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza el 25 de diciembre por ser feriado de cierre', () => {
    const fechaRefDiciembre = new Date(2026, 11, 1)
    expect(() => FechaVisita.crear('25-12-2026', fechaRefDiciembre)).toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza el 1 de enero por ser feriado de cierre', () => {
    const fechaRefEnero = new Date(2026, 11, 20)
    expect(() => FechaVisita.crear('01-01-2027', fechaRefEnero)).toThrow(FechaVisitaInvalidaError)
  })

  it('es inmutable con Object.freeze', () => {
    const fechaVisita = FechaVisita.crear('20-10-2026', HOY)
    expect(Object.isFrozen(fechaVisita)).toBe(true)
  })
})
