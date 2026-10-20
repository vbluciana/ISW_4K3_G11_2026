import { Router } from 'express'
import { body } from 'express-validator'
import { validarRequest } from '../middlewares/validarRequest.js'

export function crearRutasUsuarios (usuariosController) {
  const router = Router()

  router.post(
    '/registro',
    [
      body('nombre').isString().withMessage('El nombre es obligatorio'),
      body('email').isString().withMessage('El email es obligatorio'),
      body('password').isString().withMessage('La contraseña es obligatoria')
    ],
    validarRequest,
    usuariosController.registrar
  )

  router.post(
    '/login',
    [
      body('nombre').isString().withMessage('El nombre es obligatorio'),
      body('password').isString().withMessage('La contraseña es obligatoria')
    ],
    validarRequest,
    usuariosController.iniciarSesion
  )

  return router
}
