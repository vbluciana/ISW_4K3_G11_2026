import express from 'express'
import cors from 'cors'
import { ComprarEntradas } from '../../application/useCases/ComprarEntradas.js'
import { ComprasController } from './controllers/ComprasController.js'
import { crearRutasCompras } from './routes/compras.routes.js'
import { manejadorErrores } from './middlewares/manejadorErrores.js'

export function crearApp ({ repositorioCompras, pasarelaDePago, servicioEmail, fechaReferencia } = {}) {
  const app = express()
  app.use(cors())
  app.use(express.json())

  if (fechaReferencia) {
    app.locals.fechaReferencia = fechaReferencia
  }

  const comprarEntradas = new ComprarEntradas({
    repositorioCompras,
    pasarelaDePago,
    servicioEmail
  })

  const comprasController = new ComprasController(comprarEntradas, repositorioCompras)

  app.use('/api/compras', crearRutasCompras(comprasController))

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'ecoharmony-backend' })
  })

  app.use(manejadorErrores)

  return app
}
