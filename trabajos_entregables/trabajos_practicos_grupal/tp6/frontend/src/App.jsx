import { useState } from 'react'
import { Encabezado } from './components/Encabezado.jsx'
import { PaginaLogin } from './pages/PaginaLogin.jsx'
import { PaginaRegistro } from './pages/PaginaRegistro.jsx'
import { PaginaComprar } from './pages/PaginaComprar.jsx'
import { PaginaComprobante } from './pages/PaginaComprobante.jsx'
import { guardarSesion, obtenerSesion, cerrarSesion } from './utils/sesion.js'

function App () {
  const [usuario, setUsuario] = useState(() => obtenerSesion())
  const [pagina, setPagina] = useState(() => (obtenerSesion() ? 'comprar' : 'login'))
  const [comprobante, setComprobante] = useState(null)

  function manejarSesionIniciada (usuarioIniciado) {
    guardarSesion(usuarioIniciado)
    setUsuario(usuarioIniciado)
    setPagina('comprar')
  }

  function manejarCerrarSesion () {
    cerrarSesion()
    setUsuario(null)
    setComprobante(null)
    setPagina('login')
  }

  function manejarCompraRealizada (comprobanteRecibido) {
    setComprobante(comprobanteRecibido)
    setPagina('comprobante')
  }

  return (
    <>
      <Encabezado usuario={usuario} onCerrarSesion={manejarCerrarSesion} />

      <main className="contenido">
        {pagina === 'login' && (
          <PaginaLogin
            onSesionIniciada={manejarSesionIniciada}
            onIrARegistro={() => setPagina('registro')}
          />
        )}

        {pagina === 'registro' && (
          <PaginaRegistro
            onUsuarioRegistrado={() => setPagina('login')}
            onIrALogin={() => setPagina('login')}
          />
        )}

        {pagina === 'comprar' && usuario && (
          <PaginaComprar usuario={usuario} onCompraRealizada={manejarCompraRealizada} />
        )}

        {pagina === 'comprobante' && comprobante && (
          <PaginaComprobante comprobante={comprobante} onVolver={() => setPagina('comprar')} />
        )}
      </main>
    </>
  )
}

export default App
