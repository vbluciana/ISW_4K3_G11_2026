import { LIMITES_EDAD } from '../../config/parque.config.js'
import { CalculadoraTarifas } from '../services/CalculadoraTarifas.js'
import { VisitanteInvalidoError } from '../errors/DomainError.js'

export class Visitante {
  constructor (edad, tipoPase) {
    this.edad = edad
    this.tipoPase = tipoPase
  }

  static crear ({ edad, tipoPase }) {
    if (edad < LIMITES_EDAD.MIN || edad > 100) {
      throw new VisitanteInvalidoError('Edad fuera de rango')
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
