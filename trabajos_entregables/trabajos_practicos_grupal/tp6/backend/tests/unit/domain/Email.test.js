import { describe, it, expect } from 'vitest'
import { Email } from '../../../src/domain/valueObjects/Email.js'
import { EmailInvalidoError } from '../../../src/domain/errors/DomainError.js'

describe('Email', () => {
  it('se crea correctamente con un email válido', () => {
    const email = Email.crear('visitante@ecoharmony.com')

    expect(email.valor).toBe('visitante@ecoharmony.com')
  })

  it('rechaza un string vacío', () => {
    expect(() => Email.crear('')).toThrow(EmailInvalidoError)
  })

  it('rechaza un email sin arroba', () => {
    expect(() => Email.crear('visitante.ecoharmony.com')).toThrow(EmailInvalidoError)
  })

  it('rechaza un email sin dominio', () => {
    expect(() => Email.crear('visitante@')).toThrow(EmailInvalidoError)
  })

  it('rechaza un email con espacios', () => {
    expect(() => Email.crear('visitante @ecoharmony.com')).toThrow(EmailInvalidoError)
  })
})
