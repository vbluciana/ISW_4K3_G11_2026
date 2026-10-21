import { PRECIOS_BASE, DESCUENTOS_POR_EDAD } from '../../config/parque.config.js'

export class CalculadoraTarifas {
  static calcularPrecio ({ edad, tipoPase }) {
    if (edad <= DESCUENTOS_POR_EDAD.SIN_CARGO_HASTA_EDAD) {
      return 0
    }
    const precioBase = PRECIOS_BASE[tipoPase] || PRECIOS_BASE.regular
    if (edad <= 15) {
      return Math.round(precioBase * 0.5)
    }
    return precioBase
  }
}
