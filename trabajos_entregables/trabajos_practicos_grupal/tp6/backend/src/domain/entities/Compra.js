import crypto from 'node:crypto'
import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Visitante } from './Visitante.js'
import { Email } from '../valueObjects/Email.js'
import {
  CantidadEntradasInvalidaError,
  FormaPagoInvalidaError
} from '../errors/DomainError.js'
import {
  CANTIDAD_MINIMA_ENTRADAS,
  CANTIDAD_MAXIMA_ENTRADAS,
  FORMAS_PAGO_VALIDAS
} from '../../config/parque.config.js'

export class Compra {
  constructor ({ id, nombreComprador, fechaVisita, email, visitantes, formaPago, cantidadEntradas, montoTotal, fechaCreacion }) {
    this.id = id || crypto.randomUUID()
    this.nombreComprador = (nombreComprador || '').trim()
    this.fechaVisita = fechaVisita
    this.email = email
    this.emailComprador = email.valor
    this.visitantes = Object.freeze([...visitantes])
    this.formaPago = formaPago
    this.cantidadEntradas = cantidadEntradas
    this.montoTotal = montoTotal
    this.fechaCreacion = fechaCreacion || new Date()
    Object.freeze(this)
  }

  static crear (datos, hoy = new Date()) {
    const normalizada = (datos.formaPago || '').toLowerCase()
    if (!FORMAS_PAGO_VALIDAS.includes(normalizada)) {
      throw new FormaPagoInvalidaError('Forma de pago invalida')
    }
    if (datos.cantidadEntradas < CANTIDAD_MINIMA_ENTRADAS || datos.cantidadEntradas > CANTIDAD_MAXIMA_ENTRADAS) {
      throw new CantidadEntradasInvalidaError('Cantidad invalida')
    }
    const visitantes = datos.visitantes || []
    if (visitantes.length !== datos.cantidadEntradas) {
      throw new CantidadEntradasInvalidaError('Cantidad no coincide')
    }
    const fechaVO = FechaVisita.crear(datos.fechaVisita, hoy)
    const emailVO = Email.crear(datos.email || datos.emailComprador)
    const listaVisitantes = (datos.visitantes || []).map(v => Visitante.crear(v))
    const total = listaVisitantes.reduce((sum, v) => sum + v.precio, 0)

    return new Compra({
      nombreComprador: datos.nombreComprador,
      fechaVisita: fechaVO,
      email: emailVO,
      visitantes: listaVisitantes,
      formaPago: normalizada,
      cantidadEntradas: datos.cantidadEntradas,
      montoTotal: total
    })
  }

  toJSON () {
    return {
      id: this.id,
      nombreComprador: this.nombreComprador,
      emailComprador: this.emailComprador,
      fechaVisita: this.fechaVisita.valor,
      cantidadEntradas: this.cantidadEntradas,
      visitantes: this.visitantes.map(v => (typeof v.toJSON === 'function' ? v.toJSON() : v)),
      formaPago: this.formaPago,
      montoTotal: this.montoTotal,
      fechaCreacion: this.fechaCreacion.toISOString()
    }
  }
}
