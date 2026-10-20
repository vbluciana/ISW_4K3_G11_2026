// El input HTML type="date" entrega yyyy-mm-dd; el backend espera dd-mm-aaaa.
export function aFormatoBackend (fechaInputHtml) {
  const [anio, mes, dia] = fechaInputHtml.split('-')
  return `${dia}-${mes}-${anio}`
}
