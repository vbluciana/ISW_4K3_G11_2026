import { LIMITES_EDAD } from '../../config/parque.config.js'
import { CalculadoraTarifas } from '../services/CalculadoraTarifas.js'
import { VisitanteInvalidoError } from '../errors/DomainError.js'

const PASES_VALIDOS = Object.freeze(['regular', 'vip'])

export class Visitante {
  constructor (edad, tipoPase) {
    this.edad = edad
    this.tipoPase = tipoPase
    Object.freeze(this)
  }

  static crear ({ edad, tipoPase }) {
    if (!Number.isInteger(edad) || edad < LIMITES_EDAD.MIN || edad > LIMITES_EDAD.MAX) {
      throw new VisitanteInvalidoError(`La edad debe ser un entero entre ${LIMITES_EDAD.MIN} y ${LIMITES_EDAD.MAX}`)
    }

    const tipoPaseNormalizado = (tipoPase ?? '').toLowerCase()
    if (!PASES_VALIDOS.includes(tipoPaseNormalizado)) {
      throw new VisitanteInvalidoError('El tipo de pase debe ser "regular" o "vip"')
    }

    return new Visitante(edad, tipoPaseNormalizado)
  }

  calcularPrecio () {
    return CalculadoraTarifas.calcularPrecio({ edad: this.edad, tipoPase: this.tipoPase })
  }

  get precio () {
    return this.calcularPrecio()
  }

  toJSON () {
    return {
      edad: this.edad,
      tipoPase: this.tipoPase,
      precio: this.precio
    }
  }
}
