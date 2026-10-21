function formatearFecha (cadenaFecha) {
  return cadenaFecha.replace(/-/g, '/')
}

export function generarComprobante (compra) {
  return {
    fechaVisita: formatearFecha(compra.fechaVisita.valor)
  }
}
