const URL_BASE = import.meta.env.VITE_API_URL ?? ''

async function peticion (ruta, opciones = {}) {
  const url = `${URL_BASE}${ruta}`
  let respuesta
  try {
    respuesta = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones
    })
  } catch (err) {
    throw new Error('No se pudo conectar con el servidor backend (asegúrese de que esté corriendo en http://localhost:3000)')
  }

  const cuerpo = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw new Error(cuerpo.mensaje || cuerpo.error || `Error ${respuesta.status}: Solicitud rechazada`)
  }

  return cuerpo
}

export const clienteApi = {
  comprarEntradas ({ nombreComprador, emailComprador, fechaVisita, cantidadEntradas, visitantes, formaPago }) {
    return peticion('/api/compras', {
      method: 'POST',
      body: JSON.stringify({
        nombreComprador,
        emailComprador,
        fechaVisita,
        cantidadEntradas,
        visitantes,
        formaPago
      })
    })
  },
  obtenerCompraPorId (id) {
    return peticion(`/api/compras/${id}`)
  }
}
