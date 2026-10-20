import {
  FechaVisitaInvalidaError,
  CantidadEntradasInvalidaError,
  VisitanteInvalidoError,
  FormaPagoInvalidaError,
  EmailInvalidoError,
  NombreInvalidoError,
  PasswordInvalidaError,
  UsuarioNoRegistradoError,
  UsuarioYaRegistradoError,
  CredencialesInvalidasError,
  PagoRechazadoError
} from '../../../domain/errors/DomainError.js'

const ERRORES_DE_VALIDACION = [
  FechaVisitaInvalidaError,
  CantidadEntradasInvalidaError,
  VisitanteInvalidoError,
  FormaPagoInvalidaError,
  EmailInvalidoError,
  NombreInvalidoError,
  PasswordInvalidaError
]

// Traduce errores de negocio (dominio) a códigos HTTP. Los errores que no son
// DomainError se consideran bugs/infraestructura y se devuelven como 500 sin
// exponer detalles internos al cliente.
export function manejadorErrores (error, req, res, next) {
  if (ERRORES_DE_VALIDACION.some(ErrorClase => error instanceof ErrorClase)) {
    return res.status(400).json({ error: error.name, mensaje: error.message })
  }

  if (error instanceof UsuarioNoRegistradoError) {
    return res.status(404).json({ error: error.name, mensaje: error.message })
  }

  if (error instanceof UsuarioYaRegistradoError) {
    return res.status(409).json({ error: error.name, mensaje: error.message })
  }

  if (error instanceof CredencialesInvalidasError) {
    return res.status(401).json({ error: error.name, mensaje: error.message })
  }

  if (error instanceof PagoRechazadoError) {
    return res.status(402).json({ error: error.name, mensaje: error.message })
  }

  console.error(error)
  return res.status(500).json({ error: 'ErrorInterno', mensaje: 'Ocurrió un error inesperado en el servidor' })
}
