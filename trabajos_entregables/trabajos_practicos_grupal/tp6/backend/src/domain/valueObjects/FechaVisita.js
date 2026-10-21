export class FechaVisita {
  constructor (valor) {
    this.valor = valor
  }
  static crear (valor) {
    return new FechaVisita(valor)
  }
}
