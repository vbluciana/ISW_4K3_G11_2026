import { PRECIOS_BASE, DESCUENTOS_POR_EDAD } from '../../config/parque.config.js'

export class CalculadoraTarifas {
  static calcularPrecio ({ edad, tipoPase }) {
    if (edad <= DESCUENTOS_POR_EDAD.SIN_CARGO_HASTA_EDAD) {
      return 0
    }
    return PRECIOS_BASE[tipoPase] || PRECIOS_BASE.regular
  }
}
