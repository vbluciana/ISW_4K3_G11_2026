import crypto from 'node:crypto'
import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Visitante } from './Visitante.js'
import { Email } from '../valueObjects/Email.js'
import { CantidadEntradasInvalidaError } from '../errors/DomainError.js'
import {
  CANTIDAD_MINIMA_ENTRADAS,
  CANTIDAD_MAXIMA_ENTRADAS
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
    validarCantidadEntradas(datos.cantidadEntradas, datos.visitantes)
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
