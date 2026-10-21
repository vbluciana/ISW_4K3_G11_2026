import crypto from 'node:crypto'
import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Visitante } from './Visitante.js'
import { Email } from '../valueObjects/Email.js'

export class Compra {
  constructor ({ id, nombreComprador, fechaVisita, email, visitantes, formaPago, cantidadEntradas, montoTotal, fechaCreacion }) {
    this.id = id || crypto.randomUUID()
    this.nombreComprador = (nombreComprador || '').trim()
    this.fechaVisita = fechaVisita
    this.email = email
    this.emailComprador = email.valor
    this.visitantes = Object.freeze([...visitantes])
    this.formaPago = (formaPago || '').toLowerCase()
    this.cantidadEntradas = cantidadEntradas
    this.montoTotal = montoTotal
    this.fechaCreacion = fechaCreacion || new Date()
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
      formaPago: datos.formaPago,
      cantidadEntradas: datos.cantidadEntradas,
      montoTotal: total
    })
  }
}
