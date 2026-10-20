const MENSAJES_POR_RESULTADO = {
  exitoso: {
    titulo: '¡Gracias por tu compra!',
    mensaje: 'Tu pago fue aprobado. Te enviamos el comprobante al correo indicado durante la compra.'
  },
  fallido: {
    titulo: 'No se pudo completar el pago',
    mensaje: 'El pago no fue aprobado. Podés volver a la aplicación e intentarlo nuevamente.'
  },
  pendiente: {
    titulo: 'Tu pago está pendiente',
    mensaje: 'Mercado Pago todavía está procesando tu pago. Revisá tu correo para conocer las novedades.'
  }
}

export function PaginaResultadoPago ({ resultado, onVolver }) {
  const { titulo, mensaje } = MENSAJES_POR_RESULTADO[resultado] ?? MENSAJES_POR_RESULTADO.pendiente

  return (
    <section className="tarjeta tarjeta--resultado-pago">
      <h1 className="tarjeta__titulo">{titulo}</h1>
      <p>{mensaje}</p>
      <button type="button" className="boton boton--primario" onClick={onVolver}>
        Volver a la aplicación
      </button>
    </section>
  )
}
