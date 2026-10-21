import { useState, useEffect } from 'react'
import { Encabezado } from './components/Encabezado.jsx'
import { PaginaComprar } from './pages/PaginaComprar.jsx'
import { PaginaComprobante } from './pages/PaginaComprobante.jsx'
import { PaginaResultadoPago } from './pages/PaginaResultadoPago.jsx'
import { clienteApi } from './api/clienteApi.js'

function obtenerPaginaInicial () {
  const ruta = window.location.pathname
  const params = new URLSearchParams(window.location.search)
  const statusMP = params.get('collection_status') || params.get('status')

  if (statusMP === 'rejected' || statusMP === 'cancelled' || ruta === '/pago-fallido') {
    return 'pago-fallido'
  }
  if (statusMP === 'approved' || ruta === '/pago-exitoso') {
    return 'pago-exitoso'
  }
  if (statusMP === 'in_process' || statusMP === 'pending' || ruta === '/pago-pendiente') {
    return 'pago-pendiente'
  }

  return 'comprar'
}

function App () {
  const [pagina, setPagina] = useState(obtenerPaginaInicial)
  const [comprobante, setComprobante] = useState(null)
  const [cargandoComprobante, setCargandoComprobante] = useState(false)
  const [formaPagoInicial, setFormaPagoInicial] = useState('efectivo')
  const [errorInicial, setErrorInicial] = useState('')

  useEffect(() => {
    const ruta = window.location.pathname
    const params = new URLSearchParams(window.location.search)
    const idReserva = params.get('reserva') || params.get('external_reference') || sessionStorage.getItem('ecoharmony_id_reserva')
    const statusMP = params.get('collection_status') || params.get('status')

    // 1. Intentar recuperar comprobante desde sessionStorage
    let guardado = null
    try {
      const raw = sessionStorage.getItem('ecoharmony_ultima_compra')
      if (raw) guardado = JSON.parse(raw)
    } catch (e) {
      console.warn('Error al leer sessionStorage:', e)
    }

    if (guardado) {
      setComprobante(guardado)
    }

    // 2. Si el pago es exitoso, confirmar en el backend por ID y enviar comprobante por email
    if (idReserva && (ruta === '/pago-exitoso' || statusMP === 'approved')) {
      setCargandoComprobante(true)
      clienteApi.obtenerCompraPorId(idReserva)
        .then(res => {
          if (res?.comprobante) {
            setComprobante(res.comprobante)
            try {
              sessionStorage.setItem('ecoharmony_ultima_compra', JSON.stringify(res.comprobante))
            } catch (e) {}
          }
        })
        .catch(err => {
          console.warn('No se pudo recuperar el comprobante desde el servidor:', err)
        })
        .finally(() => {
          setCargandoComprobante(false)
        })
    }
  }, [])

  function manejarCompraRealizada (comprobanteRecibido) {
    setComprobante(comprobanteRecibido)
    setPagina('comprobante')
  }

  function limpiarEstadoUrl () {
    window.history.replaceState({}, '', '/')
  }

  function manejarVolverDesdePago () {
    limpiarEstadoUrl()
    try {
      sessionStorage.removeItem('ecoharmony_ultima_compra')
      sessionStorage.removeItem('ecoharmony_id_reserva')
      sessionStorage.removeItem('ecoharmony_borrador_formulario')
    } catch (e) {}
    setComprobante(null)
    setErrorInicial('')
    setPagina('comprar')
  }

  function manejarReintentarPago () {
    limpiarEstadoUrl()
    setFormaPagoInicial('tarjeta')
    setErrorInicial('El pago anterior fue rechazado por Mercado Pago. Podés intentar nuevamente con otra tarjeta o medio de pago.')
    setPagina('comprar')
  }

  function manejarCambiarEfectivo () {
    limpiarEstadoUrl()
    setFormaPagoInicial('efectivo')
    setErrorInicial('')
    setPagina('comprar')
  }

  return (
    <>
      <Encabezado />

      <main className="contenido">
        {pagina === 'comprar' && (
          <PaginaComprar
            onCompraRealizada={manejarCompraRealizada}
            formaPagoInicial={formaPagoInicial}
            errorInicial={errorInicial}
          />
        )}

        {pagina === 'comprobante' && comprobante && (
          <PaginaComprobante
            comprobante={comprobante}
            onVolver={manejarVolverDesdePago}
          />
        )}

        {pagina.startsWith('pago-') && (
          <PaginaResultadoPago
            resultado={pagina.replace('pago-', '')}
            comprobante={comprobante}
            cargando={cargandoComprobante}
            idReserva={new URLSearchParams(window.location.search).get('reserva') || sessionStorage.getItem('ecoharmony_id_reserva')}
            onVolver={manejarVolverDesdePago}
            onReintentar={manejarReintentarPago}
            onCambiarEfectivo={manejarCambiarEfectivo}
          />
        )}
      </main>
    </>
  )
}

export default App

