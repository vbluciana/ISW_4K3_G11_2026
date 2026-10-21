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
  CANTIDAD_MAXIMA_ENTRADAS
} from '../../config/parque.config.js'

export class Compra {
  constructor (params) {
    Object.assign(this, params)
    this.id = params.id || crypto.randomUUID()
    this.emailComprador = params.email.valor
    Object.freeze(this)
  }

  static crear (datos, hoy = new Date()) {
    const pago = (datos.formaPago || '').toLowerCase()
    if (pago !== 'efectivo' && pago !== 'tarjeta') {
      throw new FormaPagoInvalidaError('Forma de pago no soportada')
    }
    if (datos.cantidadEntradas < CANTIDAD_MINIMA_ENTRADAS || datos.cantidadEntradas > CANTIDAD_MAXIMA_ENTRADAS) {
      throw new CantidadEntradasInvalidaError('Cantidad fuera de rango')
    }
    const visitantes = datos.visitantes || []
    if (visitantes.length !== datos.cantidadEntradas) {
      throw new CantidadEntradasInvalidaError('No coincide la cantidad de visitantes')
    }
    const fechaVO = FechaVisita.crear(datos.fechaVisita, hoy)
    const emailVO = Email.crear(datos.email || datos.emailComprador)
    const listaVisitantes = visitantes.map(v => Visitante.crear(v))
    const total = listaVisitantes.reduce((sum, v) => sum + v.precio, 0)

    return new Compra({
      nombreComprador: datos.nombreComprador,
      fechaVisita: fechaVO,
      email: emailVO,
      visitantes: listaVisitantes,
      formaPago: pago,
      cantidadEntradas: datos.cantidadEntradas,
      montoTotal: total
    })
  }
}
