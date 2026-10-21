import { PRECIOS_BASE } from '../../config/parque.config.js'

export class CalculadoraTarifas {
  static calcularPrecio ({ edad, tipoPase }) {
    return PRECIOS_BASE[tipoPase] || PRECIOS_BASE.regular
  }
}
