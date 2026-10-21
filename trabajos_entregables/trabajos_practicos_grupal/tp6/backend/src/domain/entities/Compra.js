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

function validarCantidadEntradas (cantidad, visitantes) {
  if (
    typeof cantidad !== 'number' ||
    cantidad < CANTIDAD_MINIMA_ENTRADAS ||
    cantidad > CANTIDAD_MAXIMA_ENTRADAS
  ) {
    throw new CantidadEntradasInvalidaError(
      `La cantidad de entradas debe estar entre ${CANTIDAD_MINIMA_ENTRADAS} y ${CANTIDAD_MAXIMA_ENTRADAS}`
    )
  }

  if (!Array.isArray(visitantes) || visitantes.length !== cantidad) {
    throw new CantidadEntradasInvalidaError(
      `La cantidad de entradas (${cantidad}) no coincide con la cantidad de visitantes registrados (${visitantes?.length ?? 0})`
    )
  }
}

function validarFormaPago (formaPago) {
  const normalizada = (formaPago || '').toLowerCase()
  if (!FORMAS_PAGO_VALIDAS.includes(normalizada)) {
    throw new FormaPagoInvalidaError(
      `Forma de pago inválida: "${formaPago}". Formas válidas: ${FORMAS_PAGO_VALIDAS.join(', ')}`
    )
  }
  return normalizada
}

export class Compra {
  constructor ({
    id,
    nombreComprador,
    fechaVisita,
    email,
    visitantes,
    formaPago,
    cantidadEntradas,
    montoTotal,
    fechaCreacion
  }) {
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
    validarCantidadEntradas(datos.cantidadEntradas, datos.visitantes)
    const formaPagoNormalizada = validarFormaPago(datos.formaPago)
    const fechaVisitaVO = FechaVisita.crear(datos.fechaVisita, hoy)
    const emailVO = Email.crear(datos.email || datos.emailComprador)
    const listaVisitantes = (datos.visitantes || []).map(v => Visitante.crear(v))
    const montoTotal = listaVisitantes.reduce((acumulado, v) => acumulado + v.precio, 0)

    return new Compra({
      nombreComprador: datos.nombreComprador,
      fechaVisita: fechaVisitaVO,
      email: emailVO,
      visitantes: listaVisitantes,
      formaPago: formaPagoNormalizada,
      cantidadEntradas: datos.cantidadEntradas,
      montoTotal
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
