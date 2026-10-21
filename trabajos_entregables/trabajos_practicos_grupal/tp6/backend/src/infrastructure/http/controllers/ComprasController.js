export class ComprasController {
  constructor (comprarEntradas) {
    this.comprarEntradas = comprarEntradas
  }

  comprar = async (req, res, next) => {
    try {
      const {
        nombreComprador,
        emailComprador,
        email,
        fechaVisita,
        cantidadEntradas,
        visitantes,
        formaPago
      } = req.body

      const fechaReferencia = req.app.locals.fechaReferencia || new Date()

      const resultado = await this.comprarEntradas.ejecutar({
        nombreComprador: nombreComprador || 'Comprador EcoHarmony',
        emailComprador: emailComprador || email,
        email: email || emailComprador,
        fechaVisita,
        cantidadEntradas,
        visitantes,
        formaPago
      }, fechaReferencia)

      if (process.env.NODE_ENV !== 'test') {
        const titular = nombreComprador || 'Comprador EcoHarmony'
        const metodo = formaPago === 'tarjeta' ? 'Tarjeta (MP)' : 'Efectivo'
        const monto = resultado.comprobante ? `$${resultado.comprobante.montoTotal.toLocaleString('es-AR')}` : 'Procesando'
        console.log(`[Backend] ✓ Compra registrada: ${titular} | ${cantidadEntradas} pase(s) | Total: ${monto} | Pago: ${metodo}`)
      }

      return res.status(201).json(resultado)
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn(`[Backend] ⚠️ Petición rechazada (${error.name}): ${error.message}`)
      }
      next(error)
    }
  }
}
