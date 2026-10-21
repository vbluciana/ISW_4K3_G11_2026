export class ComprasController {
  constructor (comprarEntradas, repositorioCompras) {
    this.comprarEntradas = comprarEntradas
    this.repositorioCompras = repositorioCompras
  }

  obtenerPorId = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!this.repositorioCompras) {
        return res.status(404).json({ error: 'Repositorio no disponible' })
      }

      const compra = await this.repositorioCompras.buscarPorId(id)
      if (!compra) {
        return res.status(404).json({ error: 'Compra no encontrada' })
      }

      return res.status(200).json({
        comprobante: {
          idReserva: compra.id,
          nombreComprador: compra.nombreComprador,
          emailComprador: compra.emailComprador || (compra.email?.valor || compra.email),
          fechaVisita: compra.fechaVisita.valor,
          cantidadEntradas: compra.cantidadEntradas,
          visitantes: compra.visitantes.map(v => (typeof v.toJSON === 'function' ? v.toJSON() : v)),
          formaPago: compra.formaPago,
          montoTotal: compra.montoTotal,
          estado: compra.formaPago === 'tarjeta' ? 'PAGO_CONFIRMADO' : 'PENDIENTE_PAGO_BOLETERIA',
          fechaEmision: compra.fechaCreacion ? compra.fechaCreacion.toISOString() : new Date().toISOString()
        }
      })
    } catch (error) {
      next(error)
    }
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

      return res.status(201).json(resultado)
    } catch (error) {
      next(error)
    }
  }
}
