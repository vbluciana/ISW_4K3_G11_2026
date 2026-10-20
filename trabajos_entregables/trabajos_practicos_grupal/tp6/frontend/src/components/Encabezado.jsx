export function Encabezado ({ usuario, onCerrarSesion }) {
  return (
    <header className="encabezado">
      <div className="encabezado__marca">
        <svg className="encabezado__logo" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill="#6a994e" />
          <path d="M24 10c6 6 10 11 10 16a10 10 0 1 1-20 0c0-5 4-10 10-16Z" fill="#a7c957" />
          <circle cx="24" cy="30" r="4" fill="#386641" />
        </svg>
        <span className="encabezado__titulo">EcoHarmony Park</span>
      </div>

      {usuario && (
        <div className="encabezado__usuario">
          <span>Hola, {usuario.nombre}</span>
          <button type="button" className="boton boton--enlace" onClick={onCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}
