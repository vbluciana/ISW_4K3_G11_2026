import { PRECIOS_BASE, DESCUENTOS_POR_EDAD } from '../../config/parque.config.js'
import { VisitanteInvalidoError } from '../errors/DomainError.js'

function obtenerPrecioBase (tipoPase) {
  const precioBase = PRECIOS_BASE[tipoPase]
  if (precioBase === undefined) {
    throw new VisitanteInvalidoError('El tipo de pase debe ser "regular" o "vip"')
  }
  return precioBase
}

export class CalculadoraTarifas {
  static calcularPrecio ({ edad, tipoPase }) {
    const precioBase = obtenerPrecioBase((tipoPase ?? '').toLowerCase())

    if (edad <= DESCUENTOS_POR_EDAD.SIN_CARGO_HASTA_EDAD) {
      return 0
    }

    if (edad <= DESCUENTOS_POR_EDAD.DESCUENTO_MENOR_HASTA_EDAD) {
      return Math.round(precioBase * DESCUENTOS_POR_EDAD.DESCUENTO_MENOR_PORCENTAJE)
    }

    if (edad >= DESCUENTOS_POR_EDAD.DESCUENTO_MAYOR_DESDE_EDAD) {
      return Math.round(precioBase * DESCUENTOS_POR_EDAD.DESCUENTO_MAYOR_PORCENTAJE)
    }

    return precioBase
  }
}
