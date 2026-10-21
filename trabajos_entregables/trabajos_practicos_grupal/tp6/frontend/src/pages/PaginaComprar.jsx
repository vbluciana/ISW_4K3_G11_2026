import { useState, useMemo } from 'react'
import { clienteApi } from '../api/clienteApi.js'
import {
  aFormatoBackend,
  obtenerHoyFormatoHtml,
  obtenerMaximoFormatoHtml,
  validarFechaVisita
} from '../utils/fecha.js'
import { BannerError } from '../components/BannerError.jsx'

const PRECIOS_BASE = {
  regular: 10000,
  vip: 20000
}

const FORMATO_MONEDA = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
})

function calcularPrecioVisitante (edad, tipoPase) {
  const edadNum = Number(edad)
  if (isNaN(edadNum) || edad === '') {
    return { precio: PRECIOS_BASE[tipoPase] || 0, etiqueta: 'Ingrese edad (0 a 100)', esInvalida: false }
  }

  if (edadNum < 0 || edadNum > 100 || !Number.isInteger(edadNum)) {
    return { precio: 0, etiqueta: '⚠️ Edad fuera de rango (0-100)', esInvalida: true }
  }

  const base = PRECIOS_BASE[tipoPase] || 10000

  if (edadNum >= 0 && edadNum <= 3) {
    return { precio: 0, etiqueta: 'Gratis (0 a 3 años)', esInvalida: false }
  }
  if (edadNum >= 4 && edadNum <= 15) {
    return { precio: Math.round(base * 0.5), etiqueta: '50% Desc. Menor (4 a 15)', esInvalida: false }
  }
  if (edadNum >= 60) {
    return { precio: Math.round(base * 0.5), etiqueta: '50% Desc. Adulto Mayor (60 a 100)', esInvalida: false }
  }
  return { precio: base, etiqueta: 'Tarifa Completa (16 a 59)', esInvalida: false }
}

export function PaginaComprar ({ onCompraRealizada, formaPagoInicial, errorInicial }) {
  const borradorGuardado = useMemo(() => {
    try {
      const data = sessionStorage.getItem('ecoharmony_borrador_formulario')
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }, [])

  const [nombreComprador, setNombreComprador] = useState(() => borradorGuardado?.nombreComprador || '')
  const [emailComprador, setEmailComprador] = useState(() => borradorGuardado?.emailComprador || '')
  const [fecha, setFecha] = useState(() => borradorGuardado?.fecha || '')
  const [cantidadEntradas, setCantidadEntradas] = useState(() => borradorGuardado?.cantidadEntradas || 1)
  const [visitantes, setVisitantes] = useState(() => borradorGuardado?.visitantes || [{ edad: 25, tipoPase: 'regular' }])
  const [formaPago, setFormaPago] = useState(() => formaPagoInicial || borradorGuardado?.formaPago || 'efectivo')
  const [error, setError] = useState(() => errorInicial || '')
  const [cargando, setCargando] = useState(false)

  // Límites dinámicos para el selector de fecha
  const fechaMinima = useMemo(() => obtenerHoyFormatoHtml(), [])
  const fechaMaxima = useMemo(() => obtenerMaximoFormatoHtml(30), [])

  // Validación preventiva y granular de la fecha
  const validacionFecha = useMemo(() => {
    if (!fecha) return null
    return validarFechaVisita(fecha)
  }, [fecha])

  function cambiarCantidad (nuevaCantidad) {
    if (nuevaCantidad < 1 || nuevaCantidad > 10) return
    setCantidadEntradas(nuevaCantidad)
    setVisitantes(prev => {
      const actualizados = Array.from({ length: nuevaCantidad }, (_, i) => {
        return prev[i] || { edad: 25, tipoPase: 'regular' }
      })
      return actualizados
    })
  }

  function actualizarVisitante (indice, campo, valor) {
    setVisitantes(prev =>
      prev.map((v, i) => (i === indice ? { ...v, [campo]: valor } : v))
    )
  }

  const detallePrecios = useMemo(() => {
    return visitantes.map(v => {
      const info = calcularPrecioVisitante(v.edad, v.tipoPase)
      return { ...info, edad: v.edad, tipoPase: v.tipoPase }
    })
  }, [visitantes])

  const montoTotal = useMemo(() => {
    return detallePrecios.reduce((acc, item) => acc + item.precio, 0)
  }, [detallePrecios])

  function validarFormulario () {
    const nombreLimpio = nombreComprador.trim()
    if (!nombreLimpio) {
      return 'Debe ingresar el nombre y apellido del titular.'
    }
    if (nombreLimpio.length < 3) {
      return 'El nombre del titular debe contener al menos 3 caracteres.'
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(nombreLimpio)) {
      return 'El nombre del titular solo puede contener letras y espacios.'
    }

    const emailLimpio = emailComprador.trim()
    if (!emailLimpio) {
      return 'Debe ingresar el correo electrónico del titular.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(emailLimpio)) {
      return 'El correo electrónico no tiene un formato válido (ejemplo: ana@dominio.com).'
    }

    const valFecha = validarFechaVisita(fecha)
    if (!valFecha.esValida) {
      return valFecha.mensaje
    }

    const cantNum = Number(cantidadEntradas)
    if (!Number.isInteger(cantNum) || cantNum < 1 || cantNum > 10) {
      return 'La cantidad de entradas debe ser un número entero entre 1 y 10.'
    }

    if (visitantes.length !== cantNum) {
      return `La cantidad de visitantes (${visitantes.length}) debe coincidir con la cantidad de entradas (${cantNum}).`
    }

    for (let i = 0; i < visitantes.length; i++) {
      const v = visitantes[i]
      if (v.edad === '' || v.edad === null || v.edad === undefined) {
        return `Debe indicar la edad para el Visitante #${i + 1}.`
      }
      const edadNum = Number(v.edad)
      if (!Number.isInteger(edadNum) || isNaN(edadNum)) {
        return `La edad del Visitante #${i + 1} debe ser un número entero sin decimales.`
      }
      if (edadNum < 0 || edadNum > 100) {
        return `La edad del Visitante #${i + 1} (${edadNum} años) es inválida. El rango permitido es de 0 a 100 años inclusive.`
      }
      if (!['regular', 'vip'].includes(v.tipoPase)) {
        return `El tipo de pase para el Visitante #${i + 1} debe ser "regular" o "vip".`
      }
    }

    if (!['efectivo', 'tarjeta'].includes(formaPago)) {
      return 'Debe seleccionar un método de pago válido (Efectivo o Tarjeta).'
    }

    return null
  }

  async function manejarSubmit (evento) {
    if (evento && evento.preventDefault) {
      evento.preventDefault()
    }
    setError('')

    const errorValidacion = validarFormulario()
    if (errorValidacion) {
      setError(errorValidacion)
      return
    }

    setCargando(true)

    try {
      const resultado = await clienteApi.comprarEntradas({
        nombreComprador: nombreComprador.trim(),
        emailComprador: emailComprador.trim(),
        fechaVisita: aFormatoBackend(fecha),
        cantidadEntradas: Number(cantidadEntradas),
        visitantes: visitantes.map(v => ({
          edad: Number(v.edad),
          tipoPase: v.tipoPase
        })),
        formaPago
      })

      if (formaPago === 'tarjeta' && montoTotal > 0 && (resultado.pago?.sandboxInitPoint || resultado.pago?.initPoint)) {
        try {
          sessionStorage.setItem('ecoharmony_ultima_compra', JSON.stringify(resultado.comprobante))
          sessionStorage.setItem('ecoharmony_id_reserva', resultado.comprobante.idReserva)
        } catch (e) {
          console.warn('No se pudo guardar en sessionStorage:', e)
        }

        const urlPago = resultado.pago.sandboxInitPoint || resultado.pago.initPoint
        window.location.href = urlPago
        return
      }

      try {
        sessionStorage.removeItem('ecoharmony_borrador_formulario')
      } catch (e) {}

      onCompraRealizada(resultado.comprobante)
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar la compra.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="compra-layout">
      {/* Columna Izquierda: Formulario Interactivo */}
      <div className="tarjeta-panel">
        <div className="panel-header">
          <h1 className="panel-titulo">Comprar Entradas</h1>
          <p className="panel-descripcion">
            Parque Ecológico EcoHarmony Park • Reserva tus pases en simples pasos
          </p>
        </div>

        {error && <BannerError mensaje={error} />}

        <form id="formulario-compra" className="formulario" onSubmit={manejarSubmit}>
          {/* Paso 1: Datos del Comprador */}
          <section className="seccion-formulario">
            <h2 className="seccion-titulo">
              <span className="paso-numero">1</span> Datos del Titular
            </h2>
            <div className="campo-grupo">
              <label className="campo-control">
                <span className="campo-label">Nombre completo</span>
                <input
                  className="campo-input"
                  type="text"
                  placeholder="Ej: Ana Gómez"
                  value={nombreComprador}
                  onChange={e => setNombreComprador(e.target.value)}
                  required
                />
                <span className="campo-ayuda">Solo letras y al menos 3 caracteres</span>
              </label>

              <label className="campo-control">
                <span className="campo-label">Correo electrónico</span>
                <input
                  className="campo-input"
                  type="email"
                  placeholder="Ej: ana@ecoharmony.com"
                  value={emailComprador}
                  onChange={e => setEmailComprador(e.target.value)}
                  required
                />
                <span className="campo-ayuda">El comprobante se enviará a esta casilla</span>
              </label>
            </div>
          </section>

          {/* Paso 2: Fecha de Visita */}
          <section className="seccion-formulario">
            <h2 className="seccion-titulo">
              <span className="paso-numero">2</span> Fecha de la Visita
            </h2>
            <label className="campo-control">
              <span className="campo-label">Seleccione el día</span>
              <input
                className="campo-input"
                type="date"
                min={fechaMinima}
                max={fechaMaxima}
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                required
              />
              <span className="campo-ayuda">
                🌿 Abierto de Martes a Domingo. Cerrado Lunes y feriados (25-Dic / 01-Ene). Máximo 30 días de anticipación.
              </span>
              {validacionFecha && !validacionFecha.esValida && (
                <div style={{ color: 'var(--color-rojo)', fontWeight: 700, marginTop: '0.4rem', fontSize: '0.88rem' }}>
                  ⚠️ {validacionFecha.mensaje}
                </div>
              )}
            </label>
          </section>

          {/* Paso 3: Cantidad y Detalle de Visitantes */}
          <section className="seccion-formulario">
            <h2 className="seccion-titulo">
              <span className="paso-numero">3</span> Cantidad de Entradas y Visitantes
            </h2>
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="contador-entradas">
                <button
                  type="button"
                  className="contador-btn"
                  onClick={() => cambiarCantidad(cantidadEntradas - 1)}
                  disabled={cantidadEntradas <= 1}
                  aria-label="Disminuir entradas"
                >
                  −
                </button>
                <span className="contador-valor">{cantidadEntradas}</span>
                <button
                  type="button"
                  className="contador-btn"
                  onClick={() => cambiarCantidad(cantidadEntradas + 1)}
                  disabled={cantidadEntradas >= 10}
                  aria-label="Aumentar entradas"
                >
                  +
                </button>
                <span style={{ fontSize: '0.9rem', color: '#55705a', fontWeight: 600 }}>
                  entradas (mín. 1, máx. 10)
                </span>
              </div>
            </div>

            <div className="visitantes-grid">
              {visitantes.map((visitante, index) => {
                const infoPrecio = detallePrecios[index] || { precio: 0, etiqueta: '', esInvalida: false }
                return (
                  <div key={index} className="visitante-card">
                    <span className="visitante-badge">Visitante #{index + 1}</span>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <label className="visitante-edad-control">
                        <span className="campo-label">Edad (0 a 100):</span>
                        <input
                          type="number"
                          className="visitante-edad-input"
                          min="0"
                          max="100"
                          step="1"
                          placeholder="25"
                          value={visitante.edad}
                          onChange={e => actualizarVisitante(index, 'edad', e.target.value)}
                          required
                        />
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>años</span>
                      </label>

                      <div className="pase-selector">
                        <button
                          type="button"
                          className={`pase-btn ${visitante.tipoPase === 'regular' ? 'pase-btn--activo' : ''}`}
                          onClick={() => actualizarVisitante(index, 'tipoPase', 'regular')}
                        >
                          Pase Regular ($10.000)
                        </button>
                        <button
                          type="button"
                          className={`pase-btn ${visitante.tipoPase === 'vip' ? 'pase-btn--activo' : ''}`}
                          onClick={() => actualizarVisitante(index, 'tipoPase', 'vip')}
                        >
                          Pase VIP ($20.000)
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="visitante-precio-tag">
                        {FORMATO_MONEDA.format(infoPrecio.precio)}
                      </div>
                      <span
                        className="visitante-descuento-nota"
                        style={{ color: infoPrecio.esInvalida ? 'var(--color-rojo)' : undefined, fontWeight: infoPrecio.esInvalida ? 700 : undefined }}
                      >
                        {infoPrecio.etiqueta}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#68826b' }}>
              💡 Rango de edad permitido: <strong>0 a 100 años</strong> (0 a 3 gratis • 4 a 15 y 60 a 100: 50% descuento).
            </div>
          </section>

          {/* Paso 4: Forma de Pago */}
          <section className="seccion-formulario">
            <h2 className="seccion-titulo">
              <span className="paso-numero">4</span> Método de Pago
            </h2>
            <div className="pagos-opciones">
              <div
                className={`pago-card ${formaPago === 'efectivo' ? 'pago-card--seleccionado' : ''}`}
                onClick={() => setFormaPago('efectivo')}
                role="button"
                tabIndex={0}
              >
                <div className="pago-icono">💵</div>
                <div>
                  <div className="pago-info-titulo">Efectivo en Boletería</div>
                  <div className="pago-info-desc">Abona al ingresar al parque el día de la visita</div>
                </div>
              </div>

              <div
                className={`pago-card pago-card--mp ${formaPago === 'tarjeta' ? 'pago-card--seleccionado' : ''}`}
                onClick={() => setFormaPago('tarjeta')}
                role="button"
                tabIndex={0}
              >
                <div className="pago-icono">💳</div>
                <div>
                  <div className="pago-info-titulo">Tarjeta (Mercado Pago)</div>
                  <div className="pago-info-desc">Checkout seguro con débito o crédito en cuotas</div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>

      {/* Columna Derecha: Resumen de Compra y ÚNICO Botón de Compra */}
      <aside className="resumen-columna">
        <div className="resumen-card">
          <h3 className="resumen-titulo">Resumen de Compra</h3>

          <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: '#446149' }}>
            <div><strong>Comprador:</strong> {nombreComprador.trim() || '—'}</div>
            <div><strong>Fecha:</strong> {fecha ? aFormatoBackend(fecha) : '—'}</div>
            <div><strong>Pago:</strong> {formaPago === 'efectivo' ? 'Efectivo en boletería' : 'Tarjeta (Mercado Pago)'}</div>
          </div>

          <div className="resumen-lista">
            {detallePrecios.map((item, idx) => (
              <div key={idx} className="resumen-item">
                <div className="resumen-item-desc">
                  <strong>Entrada #{idx + 1} ({item.tipoPase.toUpperCase()})</strong>
                  <br />
                  <span style={{ fontSize: '0.78rem', color: '#68826b' }}>
                    Edad: {item.edad !== '' ? `${item.edad} años` : '—'} • {item.etiqueta}
                  </span>
                </div>
                <div className="resumen-item-precio">
                  {FORMATO_MONEDA.format(item.precio)}
                </div>
              </div>
            ))}
          </div>

          <div className="resumen-total-bloque">
            <span className="resumen-total-label">Total a Pagar</span>
            <span className="resumen-total-monto">{FORMATO_MONEDA.format(montoTotal)}</span>
          </div>

          {/* ÚNICO BOTÓN DE COMPRA: Vinculado al formulario */}
          <button
            type="submit"
            form="formulario-compra"
            className="boton-comprar"
            disabled={cargando || (validacionFecha && !validacionFecha.esValida)}
          >
            {cargando ? 'Procesando compra...' : `Confirmar y Reservar • ${FORMATO_MONEDA.format(montoTotal)}`}
          </button>
        </div>
      </aside>
    </div>
  )
}
