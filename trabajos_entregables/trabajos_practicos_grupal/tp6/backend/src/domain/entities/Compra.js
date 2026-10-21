import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Email } from '../valueObjects/Email.js'
import { Visitante } from './Visitante.js'
import {
  CANTIDAD_MINIMA_ENTRADAS,
  CANTIDAD_MAXIMA_ENTRADAS,
  FORMAS_PAGO_VALIDAS
} from '../../config/parque.config.js'
import {
  CantidadEntradasInvalidaError,
  FormaPagoInvalidaError
} from '../errors/DomainError.js'

function validarCantidadEntradas (cantidadEntradas) {
  if (
    !Number.isInteger(cantidadEntradas) ||
    cantidadEntradas < CANTIDAD_MINIMA_ENTRADAS ||
    cantidadEntradas > CANTIDAD_MAXIMA_ENTRADAS
  ) {
    throw new CantidadEntradasInvalidaError(
      `La cantidad de entradas debe ser un entero entre ${CANTIDAD_MINIMA_ENTRADAS} y ${CANTIDAD_MAXIMA_ENTRADAS}`
    )
  }
}

function validarCoincidenciaVisitantes (visitantes, cantidadEntradas) {
  if (!Array.isArray(visitantes) || visitantes.length !== cantidadEntradas) {
    throw new CantidadEntradasInvalidaError(
      'La cantidad de visitantes informados no coincide con la cantidad de entradas'
    )
  }
}

function validarFormaPago (formaPago) {
  const formaPagoNormalizada = (formaPago ?? '').toLowerCase().trim()
  if (!FORMAS_PAGO_VALIDAS.includes(formaPagoNormalizada)) {
    throw new FormaPagoInvalidaError('La forma de pago debe ser "efectivo" o "tarjeta"')
  }
  return formaPagoNormalizada
}

export class Compra {
  constructor ({ id, nombreComprador = 'Comprador EcoHarmony', fechaVisita, visitantes, formaPago, email, montoTotal, cantidadEntradas }) {
    this.id = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `compra_${Date.now()}`)
    this.nombreComprador = nombreComprador
    this.fechaVisita = fechaVisita
    this.visitantes = visitantes
    this.formaPago = formaPago
    this.email = email
    this.emailComprador = typeof email === 'string' ? email : (email?.valor || '')
    this.montoTotal = montoTotal
    this.cantidadEntradas = cantidadEntradas || (visitantes ? visitantes.length : 0)
    this.fechaCreacion = new Date()
    Object.freeze(this)
  }

  static crear ({ id, nombreComprador, fechaVisita, cantidadEntradas, visitantes, formaPago, email, emailComprador }, hoy = new Date()) {
    const fechaVisitaVO = FechaVisita.crear(fechaVisita, hoy)

    validarCantidadEntradas(cantidadEntradas)
    validarCoincidenciaVisitantes(visitantes, cantidadEntradas)

    const visitantesVO = visitantes.map(v => (v instanceof Visitante ? v : Visitante.crear(v)))
    const formaPagoNormalizada = validarFormaPago(formaPago)
    const emailVO = Email.crear(email || emailComprador)

    const montoTotal = visitantesVO.reduce((acumulado, visitante) => acumulado + visitante.calcularPrecio(), 0)

    return new Compra({
      id,
      nombreComprador: nombreComprador || 'Comprador EcoHarmony',
      fechaVisita: fechaVisitaVO,
      visitantes: visitantesVO,
      formaPago: formaPagoNormalizada,
      email: emailVO,
      montoTotal,
      cantidadEntradas
    })
  }

  toJSON () {
    return {
      id: this.id,
      nombreComprador: this.nombreComprador,
      email: this.email.valor,
      emailComprador: this.emailComprador,
      fechaVisita: this.fechaVisita.valor,
      cantidadEntradas: this.cantidadEntradas,
      visitantes: this.visitantes.map(v => v.toJSON()),
      formaPago: this.formaPago,
      montoTotal: this.montoTotal,
      fechaCreacion: this.fechaCreacion.toISOString()
    }
  }
}
