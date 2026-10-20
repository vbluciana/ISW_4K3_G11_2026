// Reglas de negocio provistas por el Product Owner de la cátedra
// (ver ERS — EcoHarmony Park, sección 3.3 "Reglas de negocio" RN-01 a RN-05).

export const PRECIOS_BASE = Object.freeze({
  regular: 10000,
  vip: 20000
})

export const DESCUENTOS_POR_EDAD = Object.freeze({
  SIN_CARGO_HASTA_EDAD: 3,
  DESCUENTO_MENOR_PORCENTAJE: 0.5,
  DESCUENTO_MENOR_HASTA_EDAD: 15,
  DESCUENTO_MAYOR_PORCENTAJE: 0.5,
  DESCUENTO_MAYOR_DESDE_EDAD: 60
})

// getDay(): 0=Domingo ... 1=Lunes ... 6=Sábado. El parque cierra los lunes.
export const DIA_SEMANA_CERRADO = 1

// Feriados fijos en los que el parque permanece cerrado (día, mes).
export const FERIADOS_CERRADOS = Object.freeze([
  { dia: 25, mes: 12 },
  { dia: 1, mes: 1 }
])

export const CANTIDAD_MINIMA_ENTRADAS = 1
export const CANTIDAD_MAXIMA_ENTRADAS = 10
