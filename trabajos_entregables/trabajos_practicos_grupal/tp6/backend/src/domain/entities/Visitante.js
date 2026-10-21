import { LIMITES_EDAD } from '../../config/parque.config.js'
import { CalculadoraTarifas } from '../services/CalculadoraTarifas.js'
import { VisitanteInvalidoError } from '../errors/DomainError.js'

export class Visitante {
  constructor (edad, tipoPase) {
    this.edad = edad
    this.tipoPase = tipoPase
  }

  static crear ({ edad, tipoPase }) {
    if (edad < LIMITES_EDAD.MIN || edad > LIMITES_EDAD.MAX) {
      throw new VisitanteInvalidoError(`La edad debe ser un entero entre ${LIMITES_EDAD.MIN} y ${LIMITES_EDAD.MAX}`)
    }
    const tipoPaseNormalizado = (tipoPase ?? '').toLowerCase()
    return new Visitante(edad, tipoPaseNormalizado)
  }

  calcularPrecio () {
    return CalculadoraTarifas.calcularPrecio({ edad: this.edad, tipoPase: this.tipoPase })
  }

  get precio () {
    return this.calcularPrecio()
  }
}
