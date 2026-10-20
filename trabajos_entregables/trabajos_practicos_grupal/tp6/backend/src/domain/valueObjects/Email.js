import { EmailInvalidoError } from '../errors/DomainError.js'

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class Email {
  constructor (valor) {
    this.valor = valor
    Object.freeze(this)
  }

  static crear (valor) {
    if (!FORMATO_EMAIL.test(valor ?? '')) {
      throw new EmailInvalidoError('El email ingresado no tiene un formato válido')
    }

    return new Email(valor)
  }
}
