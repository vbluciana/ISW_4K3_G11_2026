export const PRECIOS_BASE = Object.freeze({
  regular: 10000,
  vip: 20000
})

export const DESCUENTOS_POR_EDAD = Object.freeze({
  SIN_CARGO_HASTA_EDAD: 3,
  DESCUENTO_MENOR_HASTA_EDAD: 15,
  DESCUENTO_MENOR_PORCENTAJE: 0.5,
  DESCUENTO_MAYOR_DESDE_EDAD: 60,
  DESCUENTO_MAYOR_PORCENTAJE: 0.5
})

export const DIA_SEMANA_CERRADO = 1 // 1 = Lunes
export const DIAS_SEMANA_CERRADO = Object.freeze([1])

export const FERIADOS_CERRADOS = Object.freeze([
  Object.freeze({ dia: 1, mes: 1 }),
  Object.freeze({ dia: 25, mes: 12 })
])

export const CANTIDAD_MINIMA_ENTRADAS = 1
export const CANTIDAD_MAXIMA_ENTRADAS = 10

export const LIMITES_ENTRADAS = Object.freeze({
  MIN: 1,
  MAX: 10
})

export const LIMITES_EDAD = Object.freeze({
  MIN: 0,
  MAX: 100
})

export const MAX_DIAS_ANTICIPACION = 30

export const FORMAS_PAGO_VALIDAS = Object.freeze(['efectivo', 'tarjeta'])
export const FORMAS_PAGO = FORMAS_PAGO_VALIDAS

export const PARQUE_CONFIG = Object.freeze({
  PRECIOS_BASE,
  DESCUENTOS_POR_EDAD,
  DIA_SEMANA_CERRADO,
  DIAS_SEMANA_CERRADO,
  FERIADOS_CERRADOS,
  CANTIDAD_MINIMA_ENTRADAS,
  CANTIDAD_MAXIMA_ENTRADAS,
  LIMITES_ENTRADAS,
  LIMITES_EDAD,
  MAX_DIAS_ANTICIPACION,
  FORMAS_PAGO_VALIDAS,
  FORMAS_PAGO
})
