const FORMATO_MONEDA_ARS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
})

function capitalizar (texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

function formatearMoneda (monto) {
  return FORMATO_MONEDA_ARS.format(monto)
}

function formatearFecha (cadenaFecha) {
  return (cadenaFecha || '').replace(/-/g, '/')
}

export function generarComprobante (compra) {
  const detalleEntradas = compra.visitantes.map((visitante, indice) => ({
    numero: indice + 1,
    edad: visitante.edad,
    tipoPase: capitalizar(visitante.tipoPase),
    precioFinal: formatearMoneda(visitante.precio)
  }))

  return {
    idReserva: compra.id,
    fechaVisita: formatearFecha(compra.fechaVisita.valor),
    cantidadEntradas: compra.cantidadEntradas,
    formaPago: compra.formaPago,
    email: compra.email.valor,
    montoTotal: formatearMoneda(compra.montoTotal),
    detalleEntradas
  }
}
