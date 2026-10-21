import { EmailInvalidoError } from '../errors/DomainError.js'

export class Email {
  constructor (valor) {
    this.valor = valor
    Object.freeze(this)
  }

  static crear (valor) {
    if (!valor || !valor.trim()) {
      throw new EmailInvalidoError('El email no puede estar vacío')
    }
    return new Email(valor)
  }
}
