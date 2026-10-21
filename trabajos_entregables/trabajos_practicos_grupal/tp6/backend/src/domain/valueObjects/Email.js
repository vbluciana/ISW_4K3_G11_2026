import { EmailInvalidoError } from '../errors/DomainError.js'

export class Email {
  constructor (valor) {
    this.valor = valor
    Object.freeze(this)
  }

  static crear (valor) {
    if (!valor || !String(valor).trim()) {
      throw new EmailInvalidoError('El email ingresado no tiene un formato válido')
    }
    return new Email(valor)
  }
}
