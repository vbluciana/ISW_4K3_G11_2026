export class DomainError extends Error {
  constructor (mensaje) {
    super(mensaje)
    this.name = this.constructor.name
  }
}

export class FechaVisitaInvalidaError extends DomainError {}
export class CantidadEntradasInvalidaError extends DomainError {}
export class VisitanteInvalidoError extends DomainError {}
export class FormaPagoInvalidaError extends DomainError {}
export class EmailInvalidoError extends DomainError {}
export class PagoRechazadoError extends DomainError {}
