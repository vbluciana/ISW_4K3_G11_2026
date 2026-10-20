import { Compra } from '../../domain/entities/Compra.js'
import { UsuarioNoRegistradoError, PagoRechazadoError } from '../../domain/errors/DomainError.js'
import { generarComprobante } from '../GeneradorComprobante.js'

export class ComprarEntradas {
  constructor (repositorioUsuarios, pasarelaDePago, servicioEmail) {
    this.repositorioUsuarios = repositorioUsuarios
    this.pasarelaDePago = pasarelaDePago
    this.servicioEmail = servicioEmail
  }

  async ejecutar ({ usuarioId, fechaVisita, cantidadEntradas, visitantes, formaPago }, hoy = new Date()) {
    const usuario = await this.repositorioUsuarios.buscarPorId(usuarioId)
    if (!usuario) {
      throw new UsuarioNoRegistradoError('No existe un usuario registrado con el id informado')
    }

    const compra = Compra.crear({
      fechaVisita,
      cantidadEntradas,
      visitantes,
      formaPago,
      email: usuario.email
    }, hoy)

    const comprobante = generarComprobante(compra)

    await this.servicioEmail.enviarComprobante({ email: compra.email.valor, comprobante })

    if (compra.formaPago !== 'tarjeta') {
      return { comprobante }
    }

    try {
      const pago = await this.pasarelaDePago.crearPreferenciaPago({
        visitantes: compra.visitantes,
        email: compra.email.valor
      })
      return { comprobante, pago }
    } catch {
      throw new PagoRechazadoError('La pasarela de pago rechazó la operación')
    }
  }
}
