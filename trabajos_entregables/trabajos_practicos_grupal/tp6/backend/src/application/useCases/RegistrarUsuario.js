import { Usuario } from '../../domain/entities/Usuario.js'
import { UsuarioYaRegistradoError } from '../../domain/errors/DomainError.js'

export class RegistrarUsuario {
  constructor (repositorioUsuarios) {
    this.repositorioUsuarios = repositorioUsuarios
  }

  async ejecutar ({ nombre, email, password }) {
    if (await this.repositorioUsuarios.buscarPorNombre(nombre)) {
      throw new UsuarioYaRegistradoError('Ya existe un usuario registrado con ese nombre')
    }

    if (await this.repositorioUsuarios.buscarPorEmail(email)) {
      throw new UsuarioYaRegistradoError('Ya existe un usuario registrado con ese email')
    }

    const usuario = Usuario.crear({ nombre, email, password })
    return this.repositorioUsuarios.guardar(usuario)
  }
}
