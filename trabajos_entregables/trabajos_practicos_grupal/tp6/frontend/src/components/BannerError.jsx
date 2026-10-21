export function BannerError ({ mensaje }) {
  if (!mensaje) {
    return null
  }

  return (
    <div className="banner-error" role="alert">
      {mensaje}
    </div>
  )
}
