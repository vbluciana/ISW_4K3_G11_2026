export function FilaVisitante ({ numero, visitante, onCambiar }) {
  return (
    <fieldset className="fila-visitante">
      <legend className="fila-visitante__titulo">Entrada #{numero}</legend>

      <label className="formulario__campo">
        <span className="formulario__etiqueta">Edad</span>
        <input
          className="formulario__input"
          type="number"
          min={0}
          max={120}
          value={visitante.edad}
          onChange={evento => onCambiar({ ...visitante, edad: evento.target.value })}
          required
        />
      </label>

      <label className="formulario__campo">
        <span className="formulario__etiqueta">Tipo de pase</span>
        <select
          className="formulario__input"
          value={visitante.tipoPase}
          onChange={evento => onCambiar({ ...visitante, tipoPase: evento.target.value })}
        >
          <option value="regular">Regular</option>
          <option value="vip">VIP</option>
        </select>
      </label>
    </fieldset>
  )
}
