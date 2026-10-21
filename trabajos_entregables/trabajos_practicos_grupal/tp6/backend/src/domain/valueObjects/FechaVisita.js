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

export class FechaVisita {
  constructor (valor) {
    this.valor = valor
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

    // Estricto menor: si coincide con hoy, es valida
    if (iniciarDia(fecha) < iniciarDia(hoy)) {
      throw new FechaVisitaInvalidaError('La fecha de visita no puede ser anterior al día de hoy')
    }

    return new FechaVisita(fechaString)
  }
}
