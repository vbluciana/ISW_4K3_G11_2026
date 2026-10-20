import { Email } from '../valueObjects/Email.js'
import { NombreInvalidoError, PasswordInvalidaError } from '../errors/DomainError.js'

const NOMBRE_LONGITUD_MINIMA = 3
const PASSWORD_LONGITUD_MINIMA = 4

export class Usuario {
  constructor (nombre, email, password) {
    this.nombre = nombre
    this.email = email
    this.password = password
    Object.freeze(this)
  }

  static crear ({ nombre, email, password }) {
    if (typeof nombre !== 'string' || nombre.trim().length < NOMBRE_LONGITUD_MINIMA) {
      throw new NombreInvalidoError(`El nombre debe tener al menos ${NOMBRE_LONGITUD_MINIMA} caracteres`)
    }

    const emailVO = Email.crear(email)

    if (typeof password !== 'string' || password.length < PASSWORD_LONGITUD_MINIMA) {
      throw new PasswordInvalidaError(`La contraseña debe tener al menos ${PASSWORD_LONGITUD_MINIMA} caracteres`)
    }

    return new Usuario(nombre.trim(), emailVO, password)
  }
}
