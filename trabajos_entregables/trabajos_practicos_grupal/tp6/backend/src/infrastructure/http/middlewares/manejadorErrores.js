import { DomainError, PagoRechazadoError } from '../../../domain/errors/DomainError.js'

export function manejadorErrores (error, req, res, next) {
  if (error instanceof PagoRechazadoError) {
    return res.status(402).json({ error: error.name, mensaje: error.message })
  }

  if (error instanceof DomainError) {
    return res.status(400).json({ error: error.name, mensaje: error.message })
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Backend] ❌ Error inesperado: ${error.message}`)
  }
  return res.status(500).json({ error: 'ErrorInterno', mensaje: 'Ocurrió un error inesperado en el servidor' })
}
