import { Router } from 'express'
import { body } from 'express-validator'
import { validarRequest } from '../middlewares/validarRequest.js'

export function crearRutasCompras (comprasController) {
  const router = Router()

  router.post(
    '/',
    [
      body('usuarioId').isInt().withMessage('El id de usuario es obligatorio'),
      body('fechaVisita').isString().withMessage('La fecha de visita es obligatoria'),
      body('cantidadEntradas').isInt().withMessage('La cantidad de entradas es obligatoria'),
      body('visitantes').isArray().withMessage('El listado de visitantes es obligatorio'),
      body('formaPago').isString().withMessage('La forma de pago es obligatoria')
    ],
    validarRequest,
    comprasController.comprar
  )

  return router
}
