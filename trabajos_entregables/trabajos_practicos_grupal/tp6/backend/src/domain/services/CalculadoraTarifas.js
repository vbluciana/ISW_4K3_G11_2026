import { PRECIOS_BASE, DESCUENTOS_POR_EDAD } from '../../config/parque.config.js'

export class CalculadoraTarifas {
  static calcularPrecio ({ edad, tipoPase }) {
    const precioBase = PRECIOS_BASE[tipoPase] || PRECIOS_BASE.regular

    if (edad <= DESCUENTOS_POR_EDAD.SIN_CARGO_HASTA_EDAD) {
      return 0
    }

    if (edad <= DESCUENTOS_POR_EDAD.DESCUENTO_MENOR_HASTA_EDAD) {
      return Math.round(precioBase * DESCUENTOS_POR_EDAD.DESCUENTO_MENOR_PORCENTAJE)
    }

    return precioBase
  }
}
