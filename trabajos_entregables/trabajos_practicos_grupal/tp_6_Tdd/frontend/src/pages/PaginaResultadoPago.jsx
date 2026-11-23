import { PaginaComprobante } from './PaginaComprobante.jsx'

export function PaginaResultadoPago ({
  resultado,
  comprobante,
  cargando,
  errorDetalle,
  idReserva,
  onVolver,
  onReintentar,
  onCambiarEfectivo
}) {
  if (resultado === 'exitoso' && comprobante) {
    return (
      <div className="resultado-pago-exitoso">
        <div className="alerta-pago alerta-pago--exito">
          <span className="alerta-pago__icono">🎉</span>
          <div>
            <strong>¡Pago aprobado con éxito en Mercado Pago!</strong>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
              Tu transacción fue procesada correctamente. A continuación podés ver el resumen completo de tu reserva:
            </p>
          </div>
        </div>
        <PaginaComprobante comprobante={comprobante} onVolver={onVolver} />
      </div>
    )
  }

  if (resultado === 'exitoso' && cargando) {
    return (
      <section className="tarjeta tarjeta--resultado-pago" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="pago-icono-estado" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
        <h2 className="tarjeta__titulo">Cargando resumen de la compra...</h2>
        <p>Estamos recuperando los datos de tu reserva desde Mercado Pago.</p>
      </section>
    )
  }

  if (resultado === 'fallido') {
    return (
      <section className="tarjeta tarjeta--resultado-pago tarjeta--pago-error">
        <div className="pago-icono-estado pago-icono-estado--error">✕</div>
        <h1 className="tarjeta__titulo" style={{ color: '#b02a37' }}>
          No se pudo completar el pago con Mercado Pago
        </h1>
        <p className="tarjeta__descripcion">
          {errorDetalle || 'La operación fue rechazada por Mercado Pago o por la tarjeta ingresada. No se ha debitado ningún importe de tu cuenta.'}
        </p>

        {idReserva && (
          <div className="pago-referencia-caja">
            <span>Identificador de Referencia:</span>
            <code>{idReserva}</code>
          </div>
        )}

        <div className="pago-consejos">
          <strong>Posibles motivos del rechazo:</strong>
          <ul>
            <li>Fondos insuficientes o límite de compra diario alcanzado en la tarjeta.</li>
            <li>Cancelación de la operación o tiempo de sesión expirado en la pasarela.</li>
            <li>Código de seguridad (CVV) o fecha de vencimiento ingresados de forma incorrecta.</li>
          </ul>
        </div>

        <div className="pago-acciones">
          {onReintentar && (
            <button type="button" className="boton boton--primario" onClick={onReintentar}>
              🔄 Reintentar con Mercado Pago
            </button>
          )}
          {onCambiarEfectivo && (
            <button type="button" className="boton boton--secundario" onClick={onCambiarEfectivo}>
              💵 Cambiar a Efectivo en Boletería
            </button>
          )}
          <button type="button" className="boton boton--enlace" onClick={onVolver}>
            Volver al formulario
          </button>
        </div>
      </section>
    )
  }

  // Pendiente
  return (
    <section className="tarjeta tarjeta--resultado-pago">
      <div className="pago-icono-estado pago-icono-estado--pendiente">⏳</div>
      <h1 className="tarjeta__titulo">Tu pago está pendiente de confirmación</h1>
      <p className="tarjeta__descripcion">
        Mercado Pago todavía está procesando tu pago. Si abonaste a través de un canal en efectivo (como Rapipago o Pago Fácil), la acreditación puede demorar unas horas. Te enviaremos el comprobante por correo en cuanto se acredite.
      </p>
      {idReserva && (
        <div className="pago-referencia-caja">
          <span>Identificador de Reserva:</span>
          <code>{idReserva}</code>
        </div>
      )}
      <div className="pago-acciones">
        <button type="button" className="boton boton--primario" onClick={onVolver}>
          Volver a la aplicación
        </button>
      </div>
    </section>
  )
}

