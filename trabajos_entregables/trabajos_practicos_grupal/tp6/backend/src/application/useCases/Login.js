import { CredencialesInvalidasError } from '../../domain/errors/DomainError.js'

export class Login {
  constructor (repositorioUsuarios) {
    this.repositorioUsuarios = repositorioUsuarios
  }

  async ejecutar ({ nombre, password }) {
    const registro = await this.repositorioUsuarios.buscarPorNombre(nombre)

    if (!registro || registro.password !== password) {
      throw new CredencialesInvalidasError('El nombre de usuario o la contraseña son incorrectos')
    }

    return { id: registro.id, nombre: registro.nombre, email: registro.email }
  }
}
