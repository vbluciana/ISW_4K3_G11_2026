import { FERIADOS_CERRADOS, DIA_SEMANA_CERRADO, MAX_DIAS_ANTICIPACION } from '../../config/parque.config.js'
import { FechaVisitaInvalidaError } from '../errors/DomainError.js'

const FORMATO_DD_MM_AAAA = /^(\d{2})-(\d{2})-(\d{4})$/

function iniciarDia (fecha) {
  const copia = new Date(fecha)
  copia.setHours(0, 0, 0, 0)
  return copia
}

function esFechaCalendarioValida (dia, mes, anio, fecha) {
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia
}

function esFeriadoCerrado (dia, mes) {
  return FERIADOS_CERRADOS.some(feriado => feriado.dia === dia && feriado.mes === mes)
}

export class FechaVisita {
  constructor (valor) {
    this.valor = valor
    Object.freeze(this)
  }

  static crear (fechaString, hoy = new Date()) {
    const coincidencia = FORMATO_DD_MM_AAAA.exec(fechaString ?? '')
    if (!coincidencia) {
      throw new FechaVisitaInvalidaError('La fecha debe tener el formato dd-mm-aaaa')
    }

    const [, diaStr, mesStr, anioStr] = coincidencia
    const dia = Number(diaStr)
    const mes = Number(mesStr)
    const anio = Number(anioStr)
    const fecha = new Date(anio, mes - 1, dia)

    if (!esFechaCalendarioValida(dia, mes, anio, fecha)) {
      throw new FechaVisitaInvalidaError('La fecha ingresada no existe en el calendario')
    }

    const anioHoy = hoy.getFullYear()
    if (anio < anioHoy || anio > anioHoy + 1) {
      throw new FechaVisitaInvalidaError('El año de la fecha de visita es inválido')
    }

    if (iniciarDia(fecha) < iniciarDia(hoy)) {
      throw new FechaVisitaInvalidaError('La fecha de visita no puede ser anterior al día de hoy')
    }

    const fechaLimite = new Date(iniciarDia(hoy))
    fechaLimite.setDate(fechaLimite.getDate() + MAX_DIAS_ANTICIPACION)

    if (iniciarDia(fecha) > fechaLimite) {
      throw new FechaVisitaInvalidaError(`La fecha de visita no puede superar los ${MAX_DIAS_ANTICIPACION} días de anticipación`)
    }

    if (fecha.getDay() === DIA_SEMANA_CERRADO) {
      throw new FechaVisitaInvalidaError('El parque permanece cerrado los días lunes')
    }

    if (esFeriadoCerrado(dia, mes)) {
      throw new FechaVisitaInvalidaError('El parque permanece cerrado en esa fecha por feriado')
    }

    return new FechaVisita(fechaString)
  }
}
