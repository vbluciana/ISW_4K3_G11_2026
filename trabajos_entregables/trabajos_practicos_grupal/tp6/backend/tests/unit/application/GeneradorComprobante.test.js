import { describe, it, expect } from 'vitest'
import { generarComprobante } from '../../../src/application/GeneradorComprobante.js'
import { Compra } from '../../../src/domain/entities/Compra.js'

const HOY = new Date(2026, 9, 17)
const FORMATO_MONEDA_ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

describe('generadorComprobante', () => {
  const compra = Compra.crear({
    fechaVisita: '20-10-2026',
    cantidadEntradas: 2,
    visitantes: [
      { edad: 30, tipoPase: 'regular' },
      { edad: 10, tipoPase: 'vip' }
    ],
    formaPago: 'efectivo',
    email: 'visitante@ecoharmony.com'
  }, HOY)

  const comprobante = generarComprobante(compra)

  it('convierte la fecha de visita a formato dd/mm/aaaa', () => {
    expect(comprobante.fechaVisita).toBe('20/10/2026')
  })

  it('informa la cantidad de entradas y la forma de pago', () => {
    expect(comprobante.cantidadEntradas).toBe(2)
    expect(comprobante.formaPago).toBe('efectivo')
    expect(comprobante.email).toBe('visitante@ecoharmony.com')
  })

  it('formatea el monto total como moneda argentina', () => {
    expect(comprobante.montoTotal).toBe(FORMATO_MONEDA_ARS.format(20000))
  })

  it('detalla cada entrada con su número, edad, tipo de pase y precio final formateado', () => {
    expect(comprobante.detalleEntradas).toEqual([
      { numero: 1, edad: 30, tipoPase: 'Regular', precioFinal: FORMATO_MONEDA_ARS.format(10000) },
      { numero: 2, edad: 10, tipoPase: 'Vip', precioFinal: FORMATO_MONEDA_ARS.format(10000) }
    ])
  })
})
