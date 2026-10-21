import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { crearApp } from '../../../src/infrastructure/http/app.js'
import { InMemoryRepositorioCompras } from '../../dobles/InMemoryRepositorioCompras.js'
import { FakePasarelaDePago } from '../../dobles/FakePasarelaDePago.js'
import { FakeServicioEmail } from '../../dobles/FakeServicioEmail.js'

// CORRECCIÓN DEL TEST SMELL: Fecha base fija de prueba determinista
// 17-10-2026 es sábado, día hábil conocido. Cero while, cero setDate() dinámicos.
const HOY = new Date(2026, 9, 17)
const FECHA_VALIDA = '20-10-2026' // Martes hábil
const FECHA_LUNES = '19-10-2026' // Lunes cerrado
const FECHA_PASADA = '15-10-2026' // Anterior a hoy

describe('API HTTP - EcoHarmony Park (POST /api/compras)', () => {
  let app
  let repositorioCompras
  let servicioEmail
  let pasarelaDePago

  beforeEach(() => {
    repositorioCompras = new InMemoryRepositorioCompras()
    pasarelaDePago = new FakePasarelaDePago()
    servicioEmail = new FakeServicioEmail()
    app = crearApp({
      repositorioCompras,
      pasarelaDePago,
      servicioEmail,
      fechaReferencia: HOY
    })
  })

  it('procesa una compra en efectivo y responde 201 con el comprobante', async () => {
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_VALIDA,
        cantidadEntradas: 1,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'efectivo'
      })

    expect(respuesta.status).toBe(201)
    expect(respuesta.body.comprobante).toBeDefined()
    expect(respuesta.body.comprobante.nombreComprador).toBe('Ana Gómez')
    expect(respuesta.body.comprobante.emailComprador).toBe('ana@ecoharmony.com')
    expect(respuesta.body.comprobante.montoTotal).toBe(10000)
    expect(respuesta.body.comprobante.estado).toBe('PENDIENTE_PAGO_BOLETERIA')
    expect(respuesta.body.pago).toBeUndefined()

    expect(servicioEmail.enviados).toHaveLength(1)
    expect(servicioEmail.enviados[0].email).toBe('ana@ecoharmony.com')
  })

  it('procesa una compra con tarjeta y responde 201 con la preferencia de pago', async () => {
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_VALIDA,
        cantidadEntradas: 1,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'tarjeta'
      })

    expect(respuesta.status).toBe(201)
    expect(respuesta.body.comprobante).toBeDefined()
    expect(respuesta.body.pago.initPoint).toBe('https://sandbox.mercadopago.com/checkout/fake-preference-id')
    expect(pasarelaDePago.llamadas).toHaveLength(1)
    expect(servicioEmail.enviados).toHaveLength(1)
  })

  it('responde 400 si la fecha de visita es un lunes (parque cerrado)', async () => {
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_LUNES,
        cantidadEntradas: 1,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'efectivo'
      })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.error).toBe('FechaVisitaInvalidaError')
    expect(respuesta.body.mensaje).toContain('lunes')
  })

  it('responde 400 si la fecha de visita es anterior al día de hoy', async () => {
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_PASADA,
        cantidadEntradas: 1,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'efectivo'
      })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.error).toBe('FechaVisitaInvalidaError')
    expect(respuesta.body.mensaje).toContain('anterior al día de hoy')
  })

  it('responde 400 si la cantidad de entradas supera el máximo de 10', async () => {
    const visitantes = Array.from({ length: 11 }, () => ({ edad: 30, tipoPase: 'regular' }))
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_VALIDA,
        cantidadEntradas: 11,
        visitantes,
        formaPago: 'efectivo'
      })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.error).toBe('CantidadEntradasInvalidaError')
  })

  it('responde 400 si la cantidad de visitantes no coincide con cantidadEntradas', async () => {
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_VALIDA,
        cantidadEntradas: 2,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'efectivo'
      })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.error).toBe('CantidadEntradasInvalidaError')
  })

  it('responde 400 si la forma de pago es inválida', async () => {
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_VALIDA,
        cantidadEntradas: 1,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'criptomoneda'
      })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.error).toBe('FormaPagoInvalidaError')
  })

  it('responde 400 si el email es inválido', async () => {
    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'email-invalido',
        fechaVisita: FECHA_VALIDA,
        cantidadEntradas: 1,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'efectivo'
      })

    expect(respuesta.status).toBe(400)
    expect(respuesta.body.error).toBe('EmailInvalidoError')
  })

  it('responde 402 si la pasarela de pago rechaza la operación y NO envía email', async () => {
    pasarelaDePago.fallar = true

    const respuesta = await request(app)
      .post('/api/compras')
      .send({
        nombreComprador: 'Ana Gómez',
        emailComprador: 'ana@ecoharmony.com',
        fechaVisita: FECHA_VALIDA,
        cantidadEntradas: 1,
        visitantes: [{ edad: 30, tipoPase: 'regular' }],
        formaPago: 'tarjeta'
      })

    expect(respuesta.status).toBe(402)
    expect(respuesta.body.error).toBe('PagoRechazadoError')
    expect(servicioEmail.enviados).toHaveLength(0)
    expect(await repositorioCompras.listarTodas()).toHaveLength(0)
  })
})
