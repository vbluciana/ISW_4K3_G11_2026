const FORMATO_MONEDA = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
})

export function PaginaComprobante ({ comprobante, onVolver }) {
  const montoFormateado = typeof comprobante.montoTotal === 'number'
    ? FORMATO_MONEDA.format(comprobante.montoTotal)
    : comprobante.montoTotal

  const listaVisitantes = comprobante.detalleEntradas || comprobante.visitantes || []

  return (
    <div className="ticket-container">
      <div className="ticket-card">
        <div className="ticket-header">
          <div className="ticket-icono-exito">✓</div>
          <h1 className="ticket-titulo">¡Reserva Confirmada!</h1>
          <p className="ticket-subtitulo">
            Hemos registrado tu compra con éxito. Se envió una copia detallada a <strong>{comprobante.emailComprador || comprobante.email}</strong>.
          </p>
        </div>

        <div className="ticket-cuerpo">
          <div className="ticket-reserva-id">
            <div className="ticket-reserva-label">Código Único de Reserva</div>
            <div className="ticket-reserva-codigo">{comprobante.idReserva || 'ECO-2026-VIP'}</div>
          </div>

          <dl className="ticket-grilla-info">
            <div className="ticket-info-item">
              <dt>Titular</dt>
              <dd>{comprobante.nombreComprador || 'Comprador EcoHarmony'}</dd>
            </div>
            <div className="ticket-info-item">
              <dt>Fecha de Visita</dt>
              <dd>{comprobante.fechaVisita}</dd>
            </div>
            <div className="ticket-info-item">
              <dt>Entradas</dt>
              <dd>{comprobante.cantidadEntradas} pase(s)</dd>
            </div>
            <div className="ticket-info-item">
              <dt>Forma de Pago</dt>
              <dd style={{ textTransform: 'capitalize' }}>
                {comprobante.formaPago === 'efectivo' ? '💵 Efectivo (en boletería)' : '💳 Tarjeta (Mercado Pago)'}
              </dd>
            </div>
          </dl>

          <table className="ticket-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Edad</th>
                <th>Pase</th>
                <th style={{ textAlign: 'right' }}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {listaVisitantes.map((v, i) => (
                <tr key={i}>
                  <td>#{v.numero || i + 1}</td>
                  <td>{v.edad} años</td>
                  <td style={{ textTransform: 'capitalize' }}>{v.tipoPase}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    {typeof v.precio === 'number' ? FORMATO_MONEDA.format(v.precio) : (v.precioFinal || v.precio)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ticket-total-fila">
            <span>Total Abonado / A Abonar:</span>
            <strong>{montoFormateado}</strong>
          </div>

          <div className="ticket-barcode" aria-hidden="true">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: `${(i % 3) + 1}px`,
                  opacity: i % 2 === 0 ? 1 : 0.4
                }}
              />
            ))}
          </div>

          <div className="ticket-acciones">
            <button
              type="button"
              className="boton-secundario"
              onClick={() => window.print()}
            >
              🖨️ Imprimir Voucher
            </button>
            <button
              type="button"
              className="boton-comprar"
              style={{ flex: 1 }}
              onClick={onVolver}
            >
              Comprar Otras Entradas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
