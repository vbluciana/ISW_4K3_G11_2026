import { describe, it, expect, beforeEach } from 'vitest'
import { RegistrarUsuario } from '../../../src/application/useCases/RegistrarUsuario.js'
import { FakeRepositorioUsuarios } from '../../dobles/FakeRepositorioUsuarios.js'
import { UsuarioYaRegistradoError, NombreInvalidoError } from '../../../src/domain/errors/DomainError.js'

describe('RegistrarUsuario (caso de uso)', () => {
  let repositorioUsuarios
  let registrarUsuario

  beforeEach(() => {
    repositorioUsuarios = new FakeRepositorioUsuarios([
      { id: 100, nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' }
    ])
    registrarUsuario = new RegistrarUsuario(repositorioUsuarios)
  })

  it('registra un usuario nuevo y lo persiste en el repositorio', async () => {
    const registro = await registrarUsuario.ejecutar({ nombre: 'Beto', email: 'beto@ecoharmony.com', password: '5678' })

    expect(registro.id).toBeDefined()
    expect(registro.nombre).toBe('Beto')
    expect(registro.email).toBe('beto@ecoharmony.com')
    expect(await repositorioUsuarios.buscarPorNombre('Beto')).not.toBeNull()
  })

  it('rechaza el registro si ya existe un usuario con ese nombre', async () => {
    await expect(registrarUsuario.ejecutar({ nombre: 'Ana', email: 'otra@ecoharmony.com', password: '5678' }))
      .rejects.toThrow(UsuarioYaRegistradoError)
  })

  it('rechaza el registro si ya existe un usuario con ese email', async () => {
    await expect(registrarUsuario.ejecutar({ nombre: 'Otro', email: 'ana@ecoharmony.com', password: '5678' }))
      .rejects.toThrow(UsuarioYaRegistradoError)
  })

  it('propaga los errores de validación de negocio del Usuario', async () => {
    await expect(registrarUsuario.ejecutar({ nombre: '', email: 'beto@ecoharmony.com', password: '5678' }))
      .rejects.toThrow(NombreInvalidoError)
  })
})
