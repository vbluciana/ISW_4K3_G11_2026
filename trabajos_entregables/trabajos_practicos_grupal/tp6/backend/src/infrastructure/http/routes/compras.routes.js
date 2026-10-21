import { Router } from 'express'

export function crearRutasCompras (comprasController) {
  const router = Router()

  router.post('/', comprasController.comprar)
  router.get('/:id', comprasController.obtenerPorId)

  return router
}
