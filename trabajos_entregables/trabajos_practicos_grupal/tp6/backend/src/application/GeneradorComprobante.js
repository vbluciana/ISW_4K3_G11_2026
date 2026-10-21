const FORMATO_MONEDA_ARS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
})

function formatearMoneda (monto) {
  return FORMATO_MONEDA_ARS.format(monto)
}

function formatearFecha (cadenaFecha) {
  return (cadenaFecha || '').replace(/-/g, '/')
}

export function generarComprobante (compra) {
  const detalleEntradas = compra.visitantes.map((v, i) => ({
    numero: i + 1,
    edad: v.edad,
    tipoPase: v.tipoPase.charAt(0).toUpperCase() + v.tipoPase.slice(1),
    precioFinal: formatearMoneda(v.precio)
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
