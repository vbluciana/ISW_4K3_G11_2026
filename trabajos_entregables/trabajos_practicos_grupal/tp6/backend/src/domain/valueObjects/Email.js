import { EmailInvalidoError } from '../errors/DomainError.js'

export class Email {
  constructor (valor) {
    this.valor = valor
    Object.freeze(this)
  }

  static crear (valor) {
    const cadena = String(valor ?? '')
    if (cadena.includes(' ')) {
      throw new EmailInvalidoError('El email ingresado no tiene un formato válido')
    }
    const partes = cadena.split('@')
    if (partes.length !== 2 || !partes[0] || !partes[1] || !partes[1].includes('.')) {
      throw new EmailInvalidoError('El email ingresado no tiene un formato válido')
    }
    return new Email(valor)
  }
}
