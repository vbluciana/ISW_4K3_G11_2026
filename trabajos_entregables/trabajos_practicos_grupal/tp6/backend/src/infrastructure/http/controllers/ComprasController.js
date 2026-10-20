export class ComprasController {
  constructor (comprarEntradas) {
    this.comprarEntradas = comprarEntradas
  }

  comprar = async (req, res, next) => {
    try {
      const { usuarioId, fechaVisita, cantidadEntradas, visitantes, formaPago } = req.body
      const resultado = await this.comprarEntradas.ejecutar({
        usuarioId,
        fechaVisita,
        cantidadEntradas,
        visitantes,
        formaPago
      })
      res.status(201).json(resultado)
    } catch (error) {
      next(error)
    }
  }
}
