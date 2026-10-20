export class UsuariosController {
  constructor (registrarUsuario, login) {
    this.registrarUsuario = registrarUsuario
    this.login = login
  }

  registrar = async (req, res, next) => {
    try {
      const { nombre, email, password } = req.body
      const registro = await this.registrarUsuario.ejecutar({ nombre, email, password })
      res.status(201).json(registro)
    } catch (error) {
      next(error)
    }
  }

  iniciarSesion = async (req, res, next) => {
    try {
      const { nombre, password } = req.body
      const sesion = await this.login.ejecutar({ nombre, password })
      res.status(200).json(sesion)
    } catch (error) {
      next(error)
    }
  }
}
