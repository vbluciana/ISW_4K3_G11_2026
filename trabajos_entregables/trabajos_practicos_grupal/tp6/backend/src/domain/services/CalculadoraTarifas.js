export class CalculadoraTarifas {
  static calcularPrecio ({ edad, tipoPase }) {
    if (tipoPase === 'vip') {
      return 20000
    }
    return 10000
  }
}
