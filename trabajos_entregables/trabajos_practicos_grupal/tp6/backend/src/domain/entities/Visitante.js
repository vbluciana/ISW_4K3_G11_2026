import { CalculadoraTarifas } from '../services/CalculadoraTarifas.js'

export class Visitante {
  constructor (edad, tipoPase) {
    this.edad = edad
    this.tipoPase = tipoPase
  }

  static crear ({ edad, tipoPase }) {
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
