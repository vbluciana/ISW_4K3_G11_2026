import { describe, it, expect } from 'vitest'
import { Email } from '../../../src/domain/valueObjects/Email.js'

describe('Email', () => {
  it('se crea correctamente con un email válido', () => {
    // Arrange & Act
    const email = Email.crear('visitante@ecoharmony.com')

    // Assert
    expect(email.valor).toBe('visitante@ecoharmony.com')
  })
})
