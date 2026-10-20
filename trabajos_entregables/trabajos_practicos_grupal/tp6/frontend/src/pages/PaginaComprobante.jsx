export function PaginaComprobante ({ comprobante, onVolver }) {
  return (
    <div className="tarjeta tarjeta--comprobante">
      <h1 className="tarjeta__titulo">¡Compra confirmada!</h1>
      <p className="comprobante__aviso">Te enviamos el comprobante a {comprobante.email}.</p>

      <dl className="comprobante__datos">
        <div className="comprobante__fila">
          <dt>Fecha de visita</dt>
          <dd>{comprobante.fechaVisita}</dd>
        </div>
        <div className="comprobante__fila">
          <dt>Cantidad de entradas</dt>
          <dd>{comprobante.cantidadEntradas}</dd>
        </div>
        <div className="comprobante__fila">
          <dt>Forma de pago</dt>
          <dd>{comprobante.formaPago}</dd>
        </div>
      </dl>

      <table className="comprobante__tabla">
        <thead>
          <tr>
            <th>Entrada</th>
            <th>Edad</th>
            <th>Tipo de pase</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {comprobante.detalleEntradas.map(entrada => (
            <tr key={entrada.numero}>
              <td>#{entrada.numero}</td>
              <td>{entrada.edad}</td>
              <td>{entrada.tipoPase}</td>
              <td>{entrada.precioFinal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="comprobante__total">Total: {comprobante.montoTotal}</p>

      <button type="button" className="boton boton--primario" onClick={onVolver}>
        Comprar otras entradas
      </button>
    </div>
  )
}
