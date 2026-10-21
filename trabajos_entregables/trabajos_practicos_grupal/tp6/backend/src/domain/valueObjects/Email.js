export class Email {
  constructor (valor) {
    this.valor = valor
  }

  static crear (valor) {
    return new Email(valor)
  }
}
