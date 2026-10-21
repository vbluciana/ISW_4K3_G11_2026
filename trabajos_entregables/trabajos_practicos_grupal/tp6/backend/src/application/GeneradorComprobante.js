const FORMATO_MONEDA_ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

function capitalizar (texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

export function generarComprobante (compra) {
  const fechaStr = compra.fechaVisita.valor.replace(/-/g, '/')

  const detalleEntradas = compra.visitantes.map((visitante, index) => ({
    numero: index + 1,
    edad: visitante.edad,
    tipoPase: capitalizar(visitante.tipoPase),
    precioFinal: FORMATO_MONEDA_ARS.format(visitante.calcularPrecio())
  }))

  return {
    idReserva: compra.id,
    nombreComprador: compra.nombreComprador,
    email: compra.email.valor,
    emailComprador: compra.emailComprador,
    fechaVisita: fechaStr,
    cantidadEntradas: compra.cantidadEntradas,
    formaPago: compra.formaPago,
    montoTotal: FORMATO_MONEDA_ARS.format(compra.montoTotal),
    montoTotalNumero: compra.montoTotal,
    detalleEntradas,
    estado: compra.formaPago === 'efectivo' ? 'PENDIENTE_PAGO_BOLETERIA' : 'PREFERENCIA_PAGO_GENERADA',
    fechaEmision: new Date().toISOString()
  }
}
