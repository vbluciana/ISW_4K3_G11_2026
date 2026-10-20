import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { crearApp } from '../../../src/infrastructure/http/app.js'
import { FakeRepositorioUsuarios } from '../../dobles/FakeRepositorioUsuarios.js'
import { FakePasarelaDePago } from '../../dobles/FakePasarelaDePago.js'
import { FakeServicioEmail } from '../../dobles/FakeServicioEmail.js'
import { DIA_SEMANA_CERRADO, FERIADOS_CERRADOS } from '../../../src/config/parque.config.js'

function formatearDdMmAaaa (fecha) {
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const anio = fecha.getFullYear()
  return `${dia}-${mes}-${anio}`
}

function esFeriadoCerrado (fecha) {
  return FERIADOS_CERRADOS.some(feriado => feriado.dia === fecha.getDate() && feriado.mes === fecha.getMonth() + 1)
}

function proximaFechaHabil () {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + 7)
  while (fecha.getDay() === DIA_SEMANA_CERRADO || esFeriadoCerrado(fecha)) {
    fecha.setDate(fecha.getDate() + 1)
  }
  return formatearDdMmAaaa(fecha)
}

const FECHA_VISITA_VALIDA = proximaFechaHabil()

describe('API HTTP - EcoHarmony Park', () => {
  let app
  let repositorioUsuarios
  let servicioEmail
  let pasarelaDePago

  beforeEach(() => {
    repositorioUsuarios = new FakeRepositorioUsuarios([
      { id: 100, nombre: 'Ana', email: 'ana@ecoharmony.com', password: '1234' }
    ])
    pasarelaDePago = new FakePasarelaDePago()
    servicioEmail = new FakeServicioEmail()
    app = crearApp({ repositorioUsuarios, pasarelaDePago, servicioEmail })
  })

  describe('POST /api/usuarios/registro', () => {
    it('registra un usuario nuevo y responde 201', async () => {
      const respuesta = await request(app)
        .post('/api/usuarios/registro')
        .send({ nombre: 'Beto', email: 'beto@ecoharmony.com', password: '5678' })

      expect(respuesta.status).toBe(201)
      expect(respuesta.body.nombre).toBe('Beto')
    })

    it('responde 409 si el usuario ya existe', async () => {
      const respuesta = await request(app)
        .post('/api/usuarios/registro')
        .send({ nombre: 'Ana', email: 'otra@ecoharmony.com', password: '5678' })

      expect(respuesta.status).toBe(409)
      expect(respuesta.body.error).toBe('UsuarioYaRegistradoError')
    })

    it('responde 400 si falta la contraseña en el body', async () => {
      const respuesta = await request(app)
        .post('/api/usuarios/registro')
        .send({ nombre: 'Beto', email: 'beto@ecoharmony.com' })

      expect(respuesta.status).toBe(400)
    })
  })

  describe('POST /api/usuarios/login', () => {
    it('autentica correctamente y responde 200 con la sesión', async () => {
      const respuesta = await request(app)
        .post('/api/usuarios/login')
        .send({ nombre: 'Ana', password: '1234' })

      expect(respuesta.status).toBe(200)
      expect(respuesta.body).toEqual({ id: 100, nombre: 'Ana', email: 'ana@ecoharmony.com' })
    })

    it('responde 401 si la contraseña es incorrecta', async () => {
      const respuesta = await request(app)
        .post('/api/usuarios/login')
        .send({ nombre: 'Ana', password: 'incorrecta' })

      expect(respuesta.status).toBe(401)
    })
  })

  describe('POST /api/compras', () => {
    it('procesa una compra en efectivo y responde 201 con el comprobante', async () => {
      const respuesta = await request(app)
        .post('/api/compras')
        .send({
          usuarioId: 100,
          fechaVisita: FECHA_VISITA_VALIDA,
          cantidadEntradas: 1,
          visitantes: [{ edad: 30, tipoPase: 'regular' }],
          formaPago: 'efectivo'
        })

      expect(respuesta.status).toBe(201)
      expect(respuesta.body.comprobante).toBeDefined()
      expect(respuesta.body.pago).toBeUndefined()
      expect(servicioEmail.enviados).toHaveLength(1)
    })

    it('procesa una compra con tarjeta y responde con los datos de pago', async () => {
      const respuesta = await request(app)
        .post('/api/compras')
        .send({
          usuarioId: 100,
          fechaVisita: FECHA_VISITA_VALIDA,
          cantidadEntradas: 1,
          visitantes: [{ edad: 30, tipoPase: 'regular' }],
          formaPago: 'tarjeta'
        })

      expect(respuesta.status).toBe(201)
      expect(respuesta.body.pago.initPoint).toBeDefined()
    })

    it('responde 404 si el usuario no está registrado', async () => {
      const respuesta = await request(app)
        .post('/api/compras')
        .send({
          usuarioId: 999,
          fechaVisita: FECHA_VISITA_VALIDA,
          cantidadEntradas: 1,
          visitantes: [{ edad: 30, tipoPase: 'regular' }],
          formaPago: 'efectivo'
        })

      expect(respuesta.status).toBe(404)
    })

    it('responde 400 si la fecha de visita viola una regla de negocio', async () => {
      const respuesta = await request(app)
        .post('/api/compras')
        .send({
          usuarioId: 100,
          fechaVisita: '25-12-2026',
          cantidadEntradas: 1,
          visitantes: [{ edad: 30, tipoPase: 'regular' }],
          formaPago: 'efectivo'
        })

      expect(respuesta.status).toBe(400)
      expect(respuesta.body.error).toBe('FechaVisitaInvalidaError')
    })

    it('responde 400 si falta un campo obligatorio en el body', async () => {
      const respuesta = await request(app)
        .post('/api/compras')
        .send({ usuarioId: 100, fechaVisita: FECHA_VISITA_VALIDA })

      expect(respuesta.status).toBe(400)
    })
  })
})
