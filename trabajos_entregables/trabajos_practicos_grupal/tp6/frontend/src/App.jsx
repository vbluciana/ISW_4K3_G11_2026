import { useState } from 'react'
import { Encabezado } from './components/Encabezado.jsx'
import { PaginaComprar } from './pages/PaginaComprar.jsx'
import { PaginaComprobante } from './pages/PaginaComprobante.jsx'
import { PaginaResultadoPago } from './pages/PaginaResultadoPago.jsx'

function obtenerPaginaInicial () {
  const paginasDePago = {
    '/pago-exitoso': 'pago-exitoso',
    '/pago-fallido': 'pago-fallido',
    '/pago-pendiente': 'pago-pendiente'
  }

  return paginasDePago[window.location.pathname] ?? 'comprar'
}

function App () {
  const [pagina, setPagina] = useState(obtenerPaginaInicial)
  const [comprobante, setComprobante] = useState(null)

  function manejarCompraRealizada (comprobanteRecibido) {
    setComprobante(comprobanteRecibido)
    setPagina('comprobante')
  }

  function manejarVolverDesdePago () {
    window.history.replaceState({}, '', '/')
    setPagina('comprar')
  }

  return (
    <>
      <Encabezado />

      <main className="contenido">
        {pagina === 'comprar' && (
          <PaginaComprar onCompraRealizada={manejarCompraRealizada} />
        )}

        {pagina === 'comprobante' && comprobante && (
          <PaginaComprobante
            comprobante={comprobante}
            onVolver={() => {
              setComprobante(null)
              setPagina('comprar')
            }}
          />
        )}

        {pagina.startsWith('pago-') && (
          <PaginaResultadoPago
            resultado={pagina.replace('pago-', '')}
            onVolver={manejarVolverDesdePago}
          />
        )}
      </main>
    </>
  )
}

export default App
