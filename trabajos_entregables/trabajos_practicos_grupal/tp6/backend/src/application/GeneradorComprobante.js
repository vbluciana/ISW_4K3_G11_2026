const FORMATO_MONEDA_ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

function formatearFecha (fechaDdMmAaaa) {
  const [dia, mes, anio] = fechaDdMmAaaa.split('-')
  return `${dia}/${mes}/${anio}`
}

function capitalizar (texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export function generarComprobante (compra) {
  const detalleEntradas = compra.visitantes.map((visitante, indice) => ({
    numero: indice + 1,
    edad: visitante.edad,
    tipoPase: capitalizar(visitante.tipoPase),
    precioFinal: FORMATO_MONEDA_ARS.format(visitante.calcularPrecio())
  }))

  return {
    fechaVisita: formatearFecha(compra.fechaVisita.valor),
    cantidadEntradas: compra.visitantes.length,
    formaPago: compra.formaPago,
    email: compra.email.valor,
    montoTotal: FORMATO_MONEDA_ARS.format(compra.montoTotal),
    detalleEntradas
  }
}
