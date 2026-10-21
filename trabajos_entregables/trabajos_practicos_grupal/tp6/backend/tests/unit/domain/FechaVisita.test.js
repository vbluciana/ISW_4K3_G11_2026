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
})
