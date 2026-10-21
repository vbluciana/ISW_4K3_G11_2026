import { PRECIOS_BASE } from '../../config/parque.config.js'

export class CalculadoraTarifas {
  static calcularPrecio ({ edad, tipoPase }) {
    if (edad <= 3) {
      return 0
    }
    return PRECIOS_BASE[tipoPase] || PRECIOS_BASE.regular
  }
}
