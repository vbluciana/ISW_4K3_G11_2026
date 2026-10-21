import crypto from 'node:crypto'
import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Visitante } from './Visitante.js'
import { Email } from '../valueObjects/Email.js'

export class Compra {
  constructor (datos) {
    this.id = crypto.randomUUID()
    this.nombreComprador = datos.nombreComprador
    this.fechaVisita = FechaVisita.crear(datos.fechaVisita)
    this.email = Email.crear(datos.email)
    this.emailComprador = this.email.valor
    this.visitantes = (datos.visitantes || []).map(v => Visitante.crear(v))
    this.formaPago = datos.formaPago
    this.cantidadEntradas = datos.cantidadEntradas
    this.montoTotal = this.visitantes.reduce((sum, v) => sum + v.precio, 0)
    this.fechaCreacion = new Date()
    Object.freeze(this)
  }
  static crear (datos) {
    return new Compra(datos)
  }
}
