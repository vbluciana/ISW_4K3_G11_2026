export class ComprasController {
  constructor (comprarEntradas, repositorioCompras, servicioEmail) {
    this.comprarEntradas = comprarEntradas
    this.repositorioCompras = repositorioCompras
    this.servicioEmail = servicioEmail
    this.emailsEnviados = new Set()
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

      const comprobante = {
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

      if (compra.formaPago === 'tarjeta' && this.servicioEmail && !this.emailsEnviados.has(compra.id)) {
        try {
          this.emailsEnviados.add(compra.id)
          await this.servicioEmail.enviarComprobante({
            email: compra.emailComprador || (compra.email?.valor || compra.email),
            comprobante
          })
          if (process.env.NODE_ENV !== 'test') {
            console.log(`[Backend] 📧 ✓ Comprobante enviado por correo tras confirmación de pago a: ${comprobante.emailComprador}`)
          }
        } catch (errEmail) {
          this.emailsEnviados.delete(compra.id)
          console.warn('[Backend] ⚠️ Error al enviar email de comprobante:', errEmail.message)
        }
      }

      return res.status(200).json({ comprobante })
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
        formaPago,
        frontendUrl
      } = req.body

      let urlDetectada = req.body.frontendUrl
      if (!urlDetectada) {
        const cabecera = req.headers.origin || req.headers.referer
        if (cabecera) {
          try {
            urlDetectada = new URL(cabecera).origin
          } catch {}
        }
      }

      const fechaReferencia = req.app.locals.fechaReferencia || new Date()

      const resultado = await this.comprarEntradas.ejecutar({
        nombreComprador: nombreComprador || 'Comprador EcoHarmony',
        emailComprador: emailComprador || email,
        email: email || emailComprador,
        fechaVisita,
        cantidadEntradas,
        visitantes,
        formaPago,
        frontendUrl: urlDetectada
      }, fechaReferencia)

      if (process.env.NODE_ENV !== 'test') {
        const titular = nombreComprador || 'Comprador EcoHarmony'
        const monto = resultado.comprobante ? `$${resultado.comprobante.montoTotal.toLocaleString('es-AR')}` : 'Procesando'
        if (formaPago === 'tarjeta') {
          console.log(`[Backend] ⏳ Preferencia Mercado Pago generada: ${titular} | ${cantidadEntradas} pase(s) | Total: ${monto} | Esperando pago en pasarela`)
        } else {
          console.log(`[Backend] ✓ Compra en efectivo registrada: ${titular} | ${cantidadEntradas} pase(s) | Total: ${monto} | Comprobante enviado por email`)
        }
      }

      return res.status(201).json(resultado)
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn(`[Backend] ⚠️ Petición rechazada (${error.name}): ${error.message}`)
      }
      next(error)
    }
  }
}
