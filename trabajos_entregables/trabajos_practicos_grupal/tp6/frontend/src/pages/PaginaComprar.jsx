import { useState } from 'react'
import { clienteApi } from '../api/clienteApi.js'
import { aFormatoBackend } from '../utils/fecha.js'
import { BannerError } from '../components/BannerError.jsx'
import { FilaVisitante } from '../components/FilaVisitante.jsx'

const CANTIDAD_MINIMA_ENTRADAS = 1
const CANTIDAD_MAXIMA_ENTRADAS = 10

function crearVisitantesVacios (cantidad) {
  return Array.from({ length: cantidad }, () => ({ edad: '', tipoPase: 'regular' }))
}

export function PaginaComprar ({ usuario, onCompraRealizada }) {
  const [fecha, setFecha] = useState('')
  const [cantidadEntradas, setCantidadEntradas] = useState(1)
  const [visitantes, setVisitantes] = useState(crearVisitantesVacios(1))
  const [formaPago, setFormaPago] = useState('efectivo')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function manejarCambioCantidad (evento) {
    const cantidad = Number(evento.target.value)
    setCantidadEntradas(cantidad)
    setVisitantes(visitantesPrevios => {
      const nuevos = crearVisitantesVacios(cantidad)
      return nuevos.map((vacio, indice) => visitantesPrevios[indice] ?? vacio)
    })
  }

  function manejarCambioVisitante (indice, visitanteActualizado) {
    setVisitantes(visitantesPrevios =>
      visitantesPrevios.map((v, i) => (i === indice ? visitanteActualizado : v))
    )
  }

  async function manejarSubmit (evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)

    try {
      const resultado = await clienteApi.comprarEntradas({
        usuarioId: usuario.id,
        fechaVisita: aFormatoBackend(fecha),
        cantidadEntradas,
        visitantes: visitantes.map(v => ({ edad: Number(v.edad), tipoPase: v.tipoPase })),
        formaPago
      })

      if (formaPago === 'tarjeta' && resultado.pago?.initPoint) {
        window.location.href = resultado.pago.initPoint
        return
      }

      onCompraRealizada(resultado.comprobante)
    } catch (error) {
      setError(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="tarjeta tarjeta--formulario">
      <h1 className="tarjeta__titulo">Comprar entradas</h1>

      <BannerError mensaje={error} />

      <form className="formulario" onSubmit={manejarSubmit}>
        <label className="formulario__campo">
          <span className="formulario__etiqueta">Fecha de visita</span>
          <input
            className="formulario__input"
            type="date"
            value={fecha}
            onChange={evento => setFecha(evento.target.value)}
            required
          />
        </label>

        <label className="formulario__campo">
          <span className="formulario__etiqueta">Cantidad de entradas</span>
          <input
            className="formulario__input"
            type="number"
            min={CANTIDAD_MINIMA_ENTRADAS}
            max={CANTIDAD_MAXIMA_ENTRADAS}
            value={cantidadEntradas}
            onChange={manejarCambioCantidad}
            required
          />
        </label>

        <div className="fila-visitante__lista">
          {visitantes.map((visitante, indice) => (
            <FilaVisitante
              key={indice}
              numero={indice + 1}
              visitante={visitante}
              onCambiar={actualizado => manejarCambioVisitante(indice, actualizado)}
            />
          ))}
        </div>

        <label className="formulario__campo">
          <span className="formulario__etiqueta">Forma de pago</span>
          <select
            className="formulario__input"
            value={formaPago}
            onChange={evento => setFormaPago(evento.target.value)}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </label>

        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? 'Procesando...' : 'Confirmar compra'}
        </button>
      </form>
    </div>
  )
}
