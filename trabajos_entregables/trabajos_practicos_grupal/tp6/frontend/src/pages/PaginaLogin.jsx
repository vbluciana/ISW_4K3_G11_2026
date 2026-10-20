import { useState } from 'react'
import { clienteApi } from '../api/clienteApi.js'
import { BannerError } from '../components/BannerError.jsx'

export function PaginaLogin ({ onSesionIniciada, onIrARegistro }) {
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarSubmit (evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)

    try {
      const usuario = await clienteApi.iniciarSesion({ nombre, password })
      onSesionIniciada(usuario)
    } catch (error) {
      setError(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="tarjeta tarjeta--formulario">
      <h1 className="tarjeta__titulo">Iniciar sesión</h1>

      <BannerError mensaje={error} />

      <form className="formulario" onSubmit={manejarSubmit}>
        <label className="formulario__campo">
          <span className="formulario__etiqueta">Nombre de usuario</span>
          <input
            className="formulario__input"
            type="text"
            value={nombre}
            onChange={evento => setNombre(evento.target.value)}
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
            required
          />
        </label>

        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="tarjeta__pie">
        ¿No tenés una cuenta?{' '}
        <button type="button" className="boton boton--enlace" onClick={onIrARegistro}>
          Registrate
        </button>
      </p>
    </div>
  )
}
