import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import { RepositorioUsuarios } from '../../application/ports/RepositorioUsuarios.js'

const ID_INICIAL = 100

async function leerUsuarios (rutaArchivo) {
  try {
    const contenido = await readFile(rutaArchivo, 'utf-8')
    return JSON.parse(contenido)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

async function escribirUsuarios (rutaArchivo, usuarios) {
  await mkdir(dirname(rutaArchivo), { recursive: true })
  await writeFile(rutaArchivo, JSON.stringify(usuarios, null, 2), 'utf-8')
}

// Adaptador de persistencia (hexagonal): implementa el puerto RepositorioUsuarios
// usando un archivo JSON como almacenamiento, sin motor de base de datos, por
// simplicidad académica (ver decisiones_diseño.md).
export class RepositorioUsuariosJson extends RepositorioUsuarios {
  constructor (rutaArchivo) {
    super()
    this.rutaArchivo = rutaArchivo
  }

  async buscarPorId (usuarioId) {
    const usuarios = await leerUsuarios(this.rutaArchivo)
    return usuarios.find(usuario => usuario.id === usuarioId) ?? null
  }

  async buscarPorNombre (nombre) {
    const usuarios = await leerUsuarios(this.rutaArchivo)
    return usuarios.find(usuario => usuario.nombre === nombre) ?? null
  }

  async buscarPorEmail (email) {
    const usuarios = await leerUsuarios(this.rutaArchivo)
    return usuarios.find(usuario => usuario.email === email) ?? null
  }

  async guardar (usuario) {
    const usuarios = await leerUsuarios(this.rutaArchivo)
    const ultimoId = usuarios.reduce((maximo, actual) => Math.max(maximo, actual.id), ID_INICIAL - 1)

    const registro = {
      id: ultimoId + 1,
      nombre: usuario.nombre,
      email: usuario.email.valor,
      password: usuario.password
    }

    usuarios.push(registro)
    await escribirUsuarios(this.rutaArchivo, usuarios)

    return registro
  }
}
