import express from 'express'
import cors from 'cors'
import { RegistrarUsuario } from '../../application/useCases/RegistrarUsuario.js'
import { Login } from '../../application/useCases/Login.js'
import { ComprarEntradas } from '../../application/useCases/ComprarEntradas.js'
import { UsuariosController } from './controllers/UsuariosController.js'
import { ComprasController } from './controllers/ComprasController.js'
import { crearRutasUsuarios } from './routes/usuarios.routes.js'
import { crearRutasCompras } from './routes/compras.routes.js'
import { manejadorErrores } from './middlewares/manejadorErrores.js'

// Composición hexagonal: la app HTTP recibe los puertos ya implementados
// (por adaptadores reales o dobles de prueba) y los inyecta en los casos de
// uso. Ningún controlador conoce la implementación concreta de un puerto.
export function crearApp ({ repositorioUsuarios, pasarelaDePago, servicioEmail }) {
  const app = express()
  app.use(cors())
  app.use(express.json())

  const registrarUsuario = new RegistrarUsuario(repositorioUsuarios)
  const login = new Login(repositorioUsuarios)
  const comprarEntradas = new ComprarEntradas(repositorioUsuarios, pasarelaDePago, servicioEmail)

  const usuariosController = new UsuariosController(registrarUsuario, login)
  const comprasController = new ComprasController(comprarEntradas)

  app.use('/api/usuarios', crearRutasUsuarios(usuariosController))
  app.use('/api/compras', crearRutasCompras(comprasController))

  app.use(manejadorErrores)

  return app
}
