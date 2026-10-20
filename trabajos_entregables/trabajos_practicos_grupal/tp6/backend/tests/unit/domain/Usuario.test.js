import { describe, it, expect } from 'vitest'
import { Usuario } from '../../../src/domain/entities/Usuario.js'
import { NombreInvalidoError, PasswordInvalidaError, EmailInvalidoError } from '../../../src/domain/errors/DomainError.js'

describe('Usuario', () => {
  it('se crea correctamente con datos válidos', () => {
    const usuario = Usuario.crear({ nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' })

    expect(usuario.nombre).toBe('Ana')
    expect(usuario.email.valor).toBe('ana@ecoharmony.com')
    expect(usuario.password).toBe('1234')
  })

  it('rechaza un nombre vacío', () => {
    expect(() => Usuario.crear({ nombre: '', email: 'ana@ecoharmony.com', password: '1234' }))
      .toThrow(NombreInvalidoError)
  })

  it('rechaza un nombre de menos de 3 caracteres', () => {
    expect(() => Usuario.crear({ nombre: 'An', email: 'ana@ecoharmony.com', password: '1234' }))
      .toThrow(NombreInvalidoError)
  })

  it('rechaza un email inválido', () => {
    expect(() => Usuario.crear({ nombre: 'Ana', email: 'no-es-email', password: '1234' }))
      .toThrow(EmailInvalidoError)
  })

  it('rechaza una contraseña de menos de 4 caracteres', () => {
    expect(() => Usuario.crear({ nombre: 'Ana', email: 'ana@ecoharmony.com', password: '123' }))
      .toThrow(PasswordInvalidaError)
  })
})
