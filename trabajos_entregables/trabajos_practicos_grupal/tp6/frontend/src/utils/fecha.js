// El input HTML type="date" entrega yyyy-mm-dd; el backend espera dd-mm-aaaa.
export function aFormatoBackend (fechaInputHtml) {
  if (!fechaInputHtml) return ''
  const [anio, mes, dia] = fechaInputHtml.split('-')
  return `${dia}-${mes}-${anio}`
}

export function obtenerHoyFormatoHtml () {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

export function obtenerMaximoFormatoHtml (dias = 30) {
  const limite = new Date()
  limite.setDate(limite.getDate() + dias)
  const anio = limite.getFullYear()
  const mes = String(limite.getMonth() + 1).padStart(2, '0')
  const dia = String(limite.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

export function validarFechaVisita (fechaInputHtml) {
  if (!fechaInputHtml) {
    return { esValida: false, mensaje: 'Debe seleccionar una fecha de visita.' }
  }

  const partes = fechaInputHtml.split('-')
  if (partes.length !== 3) {
    return { esValida: false, mensaje: 'El formato de la fecha es inválido.' }
  }

  const anio = Number(partes[0])
  const mes = Number(partes[1])
  const dia = Number(partes[2])

  if (isNaN(anio) || isNaN(mes) || isNaN(dia)) {
    return { esValida: false, mensaje: 'La fecha ingresada contiene valores no numéricos.' }
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const anioActual = hoy.getFullYear()

  // 1. Rango de año válido (no fechas absurdas como 6598 o años pasados)
  if (anio < anioActual || anio > anioActual + 1) {
    return {
      esValida: false,
      mensaje: 'La fecha ingresada es inválida: el año no es válido.'
    }
  }

  // 2. Existencia en calendario gregoriano
  const fechaObj = new Date(anio, mes - 1, dia)
  if (
    fechaObj.getFullYear() !== anio ||
    fechaObj.getMonth() !== mes - 1 ||
    fechaObj.getDate() !== dia
  ) {
    return { esValida: false, mensaje: 'La fecha ingresada no existe en el calendario.' }
  }

  // 3. Fecha anterior a hoy (debe evaluarse ANTES de si cae lunes o feriado)
  fechaObj.setHours(0, 0, 0, 0)
  if (fechaObj < hoy) {
    return {
      esValida: false,
      mensaje: 'La fecha seleccionada no es válida: no se pueden seleccionar fechas anteriores a hoy.'
    }
  }

  // 4. Límite de 30 días de anticipación
  const fechaLimite = new Date(hoy)
  fechaLimite.setDate(fechaLimite.getDate() + 30)
  if (fechaObj > fechaLimite) {
    return {
      esValida: false,
      mensaje: 'La fecha seleccionada supera el límite máximo de 30 días de anticipación.'
    }
  }

  // 5. Cierre los días lunes (0 = domingo, 1 = lunes, ...)
  if (fechaObj.getDay() === 1) {
    return {
      esValida: false,
      mensaje: 'El parque permanece cerrado los días lunes. Por favor, seleccione un día de martes a domingo.'
    }
  }

  // 6. Feriados de cierre fijos (25 de diciembre y 1 de enero)
  if ((dia === 25 && mes === 12) || (dia === 1 && mes === 1)) {
    return {
      esValida: false,
      mensaje: 'El parque permanece cerrado en esta fecha por feriado festivo (25 de Diciembre o 1 de Enero).'
    }
  }

  return { esValida: true, mensaje: null }
}
