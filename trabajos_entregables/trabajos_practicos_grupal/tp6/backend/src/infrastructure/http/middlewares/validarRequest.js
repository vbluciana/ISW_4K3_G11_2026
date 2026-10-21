import { validationResult } from 'express-validator'

// Primera barrera de validación (defensa en profundidad): rechaza requests con
// formato incorrecto antes de que lleguen a la capa de aplicación/dominio.
export function validarRequest (req, res, next) {
  const resultado = validationResult(req)
  if (!resultado.isEmpty()) {
    return res.status(400).json({ error: 'RequestInvalido', mensaje: resultado.array()[0].msg })
  }
  next()
}
