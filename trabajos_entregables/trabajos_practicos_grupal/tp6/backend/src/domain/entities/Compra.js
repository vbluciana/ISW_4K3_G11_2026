import crypto from 'node:crypto'
import { FechaVisita } from '../valueObjects/FechaVisita.js'
import { Visitante } from './Visitante.js'
import { Email } from '../valueObjects/Email.js'
import { CantidadEntradasInvalidaError } from '../errors/DomainError.js'

export class Compra {
  constructor (params) {
    Object.assign(this, params)
    this.id = params.id || crypto.randomUUID()
    this.emailComprador = params.email.valor
    Object.freeze(this)
  }

  static crear (datos, hoy = new Date()) {
    if (datos.cantidadEntradas < 1) {
      throw new CantidadEntradasInvalidaError('La cantidad de entradas debe ser al menos 1')
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
      formaPago: (datos.formaPago || '').toLowerCase(),
      cantidadEntradas: datos.cantidadEntradas,
      montoTotal: total
    })
  }
}
