export class FechaVisita {
  constructor (valor) {
    this.valor = (valor || '').trim()
  }
  static crear (cadenaFecha) {
    return new FechaVisita(cadenaFecha)
  }
}
