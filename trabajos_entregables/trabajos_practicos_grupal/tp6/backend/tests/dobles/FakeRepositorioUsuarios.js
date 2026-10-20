import { RepositorioUsuarios } from '../../src/application/ports/RepositorioUsuarios.js'

export class FakeRepositorioUsuarios extends RepositorioUsuarios {
  constructor (usuarios = []) {
    super()
    this.usuarios = usuarios
    this.proximoId = usuarios.length ? Math.max(...usuarios.map(usuario => usuario.id)) + 1 : 100
  }

  async buscarPorId (usuarioId) {
    return this.usuarios.find(usuario => usuario.id === usuarioId) ?? null
  }

  async buscarPorNombre (nombre) {
    return this.usuarios.find(usuario => usuario.nombre === nombre) ?? null
  }

  async buscarPorEmail (email) {
    return this.usuarios.find(usuario => usuario.email === email) ?? null
  }

  async guardar (usuario) {
    const registro = { id: this.proximoId++, nombre: usuario.nombre, email: usuario.email.valor, password: usuario.password }
    this.usuarios.push(registro)
    return registro
  }
}
