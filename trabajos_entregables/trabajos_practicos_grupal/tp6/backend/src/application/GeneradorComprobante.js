const FORMATO_MONEDA_ARS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
})

function formatearFecha (cadenaFecha) {
  return (cadenaFecha || '').replace(/-/g, '/')
}

export function generarComprobante (compra) {
  return {
    idReserva: compra.id,
    fechaVisita: formatearFecha(compra.fechaVisita.valor),
    cantidadEntradas: compra.cantidadEntradas,
    formaPago: compra.formaPago,
    email: compra.email.valor,
    montoTotal: FORMATO_MONEDA_ARS.format(compra.montoTotal)
  }
}
