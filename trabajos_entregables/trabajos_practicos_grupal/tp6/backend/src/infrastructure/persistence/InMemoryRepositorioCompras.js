import { RepositorioCompras } from '../../application/ports/RepositorioCompras.js'

export class InMemoryRepositorioCompras extends RepositorioCompras {
  constructor () {
    super()
    this.compras = new Map()
  }

  async guardar (compra) {
    this.compras.set(compra.id, compra)
    return compra
  }

  async buscarPorId (id) {
    return this.compras.get(id) || null
  }

  async listarTodas () {
    return Array.from(this.compras.values())
  }

  limpiar () {
    this.compras.clear()
  }
}
