import { CalculadoraTarifas } from '../services/CalculadoraTarifas.js'
import { VisitanteInvalidoError } from '../errors/DomainError.js'

export class Visitante {
  constructor (edad, tipoPase) {
    this.edad = edad
    this.tipoPase = tipoPase
  }

  static crear ({ edad, tipoPase }) {
    if (edad < 0) {
      throw new VisitanteInvalidoError('La edad no puede ser menor a 0')
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
