export function generarComprobante (compra) {
  return {
    fechaVisita: compra.fechaVisita.valor.replace(/-/g, '/')
  }
}
