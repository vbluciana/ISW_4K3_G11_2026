const CLAVE_SESION = 'ecoharmony_sesion'
const DURACION_SESION_MS = 5 * 60 * 1000

export function guardarSesion (usuario) {
  const sesion = { usuario, expiraEn: Date.now() + DURACION_SESION_MS }
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
}

export function obtenerSesion () {
  const contenido = sessionStorage.getItem(CLAVE_SESION)
  if (!contenido) {
    return null
  }

  const sesion = JSON.parse(contenido)
  if (Date.now() > sesion.expiraEn) {
    sessionStorage.removeItem(CLAVE_SESION)
    return null
  }

  return sesion.usuario
}

export function cerrarSesion () {
  sessionStorage.removeItem(CLAVE_SESION)
}
