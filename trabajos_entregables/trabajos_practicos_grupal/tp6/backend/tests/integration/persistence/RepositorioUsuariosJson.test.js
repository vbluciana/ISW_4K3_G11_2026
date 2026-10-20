import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { RepositorioUsuariosJson } from '../../../src/infrastructure/persistence/RepositorioUsuariosJson.js'
import { Usuario } from '../../../src/domain/entities/Usuario.js'

describe('RepositorioUsuariosJson', () => {
  let directorioTemporal
  let rutaArchivo
  let repositorio

  beforeEach(async () => {
    directorioTemporal = await mkdtemp(join(tmpdir(), 'ecoharmony-usuarios-'))
    rutaArchivo = join(directorioTemporal, 'usuarios.json')
    repositorio = new RepositorioUsuariosJson(rutaArchivo)
  })

  afterEach(async () => {
    await rm(directorioTemporal, { recursive: true, force: true })
  })

  it('devuelve null al buscar en un repositorio vacío', async () => {
    expect(await repositorio.buscarPorId(1)).toBeNull()
    expect(await repositorio.buscarPorNombre('Ana')).toBeNull()
    expect(await repositorio.buscarPorEmail('ana@ecoharmony.com')).toBeNull()
  })

  it('guarda un usuario y le asigna un id autoincremental a partir de 100', async () => {
    const usuario = Usuario.crear({ nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' })

    const registro = await repositorio.guardar(usuario)

    expect(registro.id).toBe(100)
    expect(registro.nombre).toBe('Ana')
    expect(registro.email).toBe('ana@ecoharmony.com')
  })

  it('incrementa el id en cada nuevo usuario guardado', async () => {
    await repositorio.guardar(Usuario.crear({ nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' }))
    const segundo = await repositorio.guardar(Usuario.crear({ nombre: 'Beto', email: 'beto@ecoharmony.com', password: '5678' }))

    expect(segundo.id).toBe(101)
  })

  it('encuentra un usuario guardado por id, nombre y email', async () => {
    const guardado = await repositorio.guardar(Usuario.crear({ nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' }))

    expect(await repositorio.buscarPorId(guardado.id)).toEqual(guardado)
    expect(await repositorio.buscarPorNombre('Ana')).toEqual(guardado)
    expect(await repositorio.buscarPorEmail('ana@ecoharmony.com')).toEqual(guardado)
  })

  it('persiste los datos entre distintas instancias que apuntan al mismo archivo', async () => {
    await repositorio.guardar(Usuario.crear({ nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' }))

    const otraInstancia = new RepositorioUsuariosJson(rutaArchivo)
    expect(await otraInstancia.buscarPorNombre('Ana')).not.toBeNull()
  })
})
