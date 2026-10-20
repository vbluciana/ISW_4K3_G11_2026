import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Email } from '../valueObjects/Email.js'
import { Visitante } from './Visitante.js'
import { CANTIDAD_MINIMA_ENTRADAS, CANTIDAD_MAXIMA_ENTRADAS } from '../../config/parque.config.js'
import { CantidadEntradasInvalidaError, FormaPagoInvalidaError } from '../errors/DomainError.js'

const FORMAS_PAGO_VALIDAS = ['efectivo', 'tarjeta']

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
  const formaPagoNormalizada = (formaPago ?? '').toLowerCase()
  if (!FORMAS_PAGO_VALIDAS.includes(formaPagoNormalizada)) {
    throw new FormaPagoInvalidaError('La forma de pago debe ser "efectivo" o "tarjeta"')
  }
  return formaPagoNormalizada
}

export class Compra {
  constructor (fechaVisita, visitantes, formaPago, email, montoTotal) {
    this.fechaVisita = fechaVisita
    this.visitantes = visitantes
    this.formaPago = formaPago
    this.email = email
    this.montoTotal = montoTotal
    Object.freeze(this)
  }

  static crear ({ fechaVisita, cantidadEntradas, visitantes, formaPago, email }, hoy = new Date()) {
    const fechaVisitaVO = FechaVisita.crear(fechaVisita, hoy)

    validarCantidadEntradas(cantidadEntradas)
    validarCoincidenciaVisitantes(visitantes, cantidadEntradas)

    const visitantesVO = visitantes.map(Visitante.crear)
    const formaPagoNormalizada = validarFormaPago(formaPago)
    const emailVO = Email.crear(email)

    const montoTotal = visitantesVO.reduce((acumulado, visitante) => acumulado + visitante.calcularPrecio(), 0)

    return new Compra(fechaVisitaVO, visitantesVO, formaPagoNormalizada, emailVO, montoTotal)
  }
}
