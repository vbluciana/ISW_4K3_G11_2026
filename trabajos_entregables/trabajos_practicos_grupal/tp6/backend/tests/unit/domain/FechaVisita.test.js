import { describe, it, expect } from 'vitest'
import { FechaVisita } from '../../../src/domain/valueObjects/FechaVisita.js'
import { FechaVisitaInvalidaError } from '../../../src/domain/errors/DomainError.js'

// Referencia fija para que los tests no dependan del día en que se ejecutan.
// Lunes 19-10-2026.
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

  it('rechaza fechas anteriores al día de hoy', () => {
    expect(() => FechaVisita.crear('16-10-2026', HOY)).toThrow(FechaVisitaInvalidaError)
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

  it('rechaza el 25 de diciembre por ser feriado de cierre', () => {
    expect(() => FechaVisita.crear('25-12-2026', HOY)).toThrow(FechaVisitaInvalidaError)
  })

  it('rechaza el 1 de enero por ser feriado de cierre', () => {
    const fechaVisita2027 = new Date(2026, 11, 1)
    expect(() => FechaVisita.crear('01-01-2027', fechaVisita2027)).toThrow(FechaVisitaInvalidaError)
  })
})
