import { useState } from 'react'
import { clienteApi } from '../api/clienteApi.js'
import { BannerError } from '../components/BannerError.jsx'

export function PaginaRegistro ({ onUsuarioRegistrado, onIrALogin }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarSubmit (evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)

    try {
      await clienteApi.registrarUsuario({ nombre, email, password })
      onUsuarioRegistrado()
    } catch (error) {
      setError(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="tarjeta tarjeta--formulario">
      <h1 className="tarjeta__titulo">Crear cuenta</h1>

      <BannerError mensaje={error} />

      <form className="formulario" onSubmit={manejarSubmit}>
        <label className="formulario__campo">
          <span className="formulario__etiqueta">Nombre de usuario</span>
          <input
            className="formulario__input"
            type="text"
            value={nombre}
            onChange={evento => setNombre(evento.target.value)}
            minLength={3}
            required
          />
        </label>

        <label className="formulario__campo">
          <span className="formulario__etiqueta">Email</span>
          <input
            className="formulario__input"
            type="email"
            value={email}
            onChange={evento => setEmail(evento.target.value)}
            required
          />
        </label>

        <label className="formulario__campo">
          <span className="formulario__etiqueta">Contraseña</span>
          <input
            className="formulario__input"
            type="password"
            value={password}
            onChange={evento => setPassword(evento.target.value)}
            minLength={4}
            required
          />
        </label>

        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="tarjeta__pie">
        ¿Ya tenés una cuenta?{' '}
        <button type="button" className="boton boton--enlace" onClick={onIrALogin}>
          Iniciá sesión
        </button>
      </p>
    </div>
  )
}
