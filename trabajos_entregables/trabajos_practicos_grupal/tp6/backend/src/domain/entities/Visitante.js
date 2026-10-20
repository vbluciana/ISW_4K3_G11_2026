import { CalculadoraTarifas } from '../services/CalculadoraTarifas.js'
import { VisitanteInvalidoError } from '../errors/DomainError.js'

const EDAD_MINIMA = 0
const EDAD_MAXIMA = 120
const PASES_VALIDOS = ['regular', 'vip']

export class Visitante {
  constructor (edad, tipoPase) {
    this.edad = edad
    this.tipoPase = tipoPase
    Object.freeze(this)
  }

  static crear ({ edad, tipoPase }) {
    if (!Number.isInteger(edad) || edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
      throw new VisitanteInvalidoError(`La edad debe ser un entero entre ${EDAD_MINIMA} y ${EDAD_MAXIMA}`)
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
}
