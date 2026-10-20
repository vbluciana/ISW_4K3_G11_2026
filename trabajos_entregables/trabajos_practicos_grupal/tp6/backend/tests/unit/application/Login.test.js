import { describe, it, expect, beforeEach } from 'vitest'
import { Login } from '../../../src/application/useCases/Login.js'
import { FakeRepositorioUsuarios } from '../../dobles/FakeRepositorioUsuarios.js'
import { CredencialesInvalidasError } from '../../../src/domain/errors/DomainError.js'

describe('Login (caso de uso)', () => {
  let repositorioUsuarios
  let login

  beforeEach(() => {
    repositorioUsuarios = new FakeRepositorioUsuarios([
      { id: 100, nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' }
    ])
    login = new Login(repositorioUsuarios)
  })

  it('autentica correctamente con nombre y contraseña válidos', async () => {
    const sesion = await login.ejecutar({ nombre: 'Ana', password: '1234' })

    expect(sesion).toEqual({ id: 100, nombre: 'Ana', email: 'ana@ecoharmony.com' })
  })

  it('rechaza el login si el nombre de usuario no existe', async () => {
    await expect(login.ejecutar({ nombre: 'Inexistente', password: '1234' }))
      .rejects.toThrow(CredencialesInvalidasError)
  })

  it('rechaza el login si la contraseña no coincide', async () => {
    await expect(login.ejecutar({ nombre: 'Ana', password: 'incorrecta' }))
      .rejects.toThrow(CredencialesInvalidasError)
  })
})
