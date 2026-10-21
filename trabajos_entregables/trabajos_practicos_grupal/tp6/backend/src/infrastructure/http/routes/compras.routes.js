import { Router } from 'express'

export function crearRutasCompras (comprasController) {
  const router = Router()

  router.post('/', comprasController.comprar)

  return router
}
