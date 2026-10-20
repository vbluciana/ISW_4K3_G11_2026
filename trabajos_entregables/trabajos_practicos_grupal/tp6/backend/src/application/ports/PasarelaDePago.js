// Puerto (hexagonal): contrato para la pasarela de pago. El adaptador real usa
// el SDK de Mercado Pago (Checkout Pro); los tests usan un doble de prueba.
export class PasarelaDePago {
  async crearPreferenciaPago (_detallePago) {
    throw new Error('PasarelaDePago.crearPreferenciaPago: método no implementado')
  }
}
