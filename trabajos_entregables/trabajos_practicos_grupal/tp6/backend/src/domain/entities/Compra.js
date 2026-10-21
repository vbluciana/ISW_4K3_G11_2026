import crypto from 'node:crypto'
import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Visitante } from './Visitante.js'
import { Email } from '../valueObjects/Email.js'

export class Compra {
  constructor (datos) {
    this.id = datos.id || crypto.randomUUID()
    this.nombreComprador = (datos.nombreComprador || '').trim()
    this.fechaVisita = datos.fechaVisita
    this.email = datos.email
    this.emailComprador = datos.email.valor
    this.visitantes = Object.freeze([...datos.visitantes])
    this.formaPago = (datos.formaPago || '').toLowerCase()
    this.cantidadEntradas = datos.cantidadEntradas
    this.montoTotal = datos.montoTotal
    this.fechaCreacion = datos.fechaCreacion || new Date()
    Object.freeze(this)
  }

  static crear (datos, hoy = new Date()) {
    const fechaVO = FechaVisita.crear(datos.fechaVisita, hoy)
    const emailVO = Email.crear(datos.email || datos.emailComprador)
    const listaVisitantes = (datos.visitantes || []).map(v => Visitante.crear(v))
    const total = listaVisitantes.reduce((sum, v) => sum + v.precio, 0)

    return new Compra({
      nombreComprador: datos.nombreComprador,
      fechaVisita: fechaVO,
      email: emailVO,
      visitantes: listaVisitantes,
      formaPago: (datos.formaPago || '').toLowerCase(),
      cantidadEntradas: datos.cantidadEntradas,
      montoTotal: total
    })
  }
}
