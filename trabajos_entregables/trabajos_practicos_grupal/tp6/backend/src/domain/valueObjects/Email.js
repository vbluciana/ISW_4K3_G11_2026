export class Email {
  constructor (valor) {
    this.valor = valor
    Object.freeze(this)
  }

  static crear (valor) {
    return new Email(valor)
  }
}
