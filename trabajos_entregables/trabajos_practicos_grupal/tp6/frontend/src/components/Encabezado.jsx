export function Encabezado () {
  return (
    <header className="encabezado">
      <div className="encabezado__marca">
        <svg className="encabezado__logo" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#6a994e" />
          <path d="M24 8c7 7 11 13 11 19a11 11 0 1 1-22 0c0-6 4-12 11-19Z" fill="#a7c957" />
          <circle cx="24" cy="30" r="5" fill="#386641" />
        </svg>
        <div className="encabezado__textos">
          <span className="encabezado__titulo">EcoHarmony Park</span>
          <span className="encabezado__subtitulo">Sistema de Reserva de Entradas</span>
        </div>
      </div>

      <div className="encabezado__badge">
        UTN-FRC • 4K3 Grupo 11
      </div>
    </header>
  )
}
