const URL_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function peticion (ruta, opciones = {}) {
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  })

  const cuerpo = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw new Error(cuerpo.mensaje ?? 'Ocurrió un error inesperado al comunicarse con el servidor')
  }

  return cuerpo
}

export const clienteApi = {
  registrarUsuario ({ nombre, email, password }) {
    return peticion('/api/usuarios/registro', { method: 'POST', body: JSON.stringify({ nombre, email, password }) })
  },

  iniciarSesion ({ nombre, password }) {
    return peticion('/api/usuarios/login', { method: 'POST', body: JSON.stringify({ nombre, password }) })
  },

  comprarEntradas ({ usuarioId, fechaVisita, cantidadEntradas, visitantes, formaPago }) {
    return peticion('/api/compras', {
      method: 'POST',
      body: JSON.stringify({ usuarioId, fechaVisita, cantidadEntradas, visitantes, formaPago })
    })
  }
}
