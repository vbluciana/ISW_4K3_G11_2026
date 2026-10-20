// Puerto (hexagonal): contrato que debe cumplir cualquier adaptador de persistencia
// de usuarios (JSON en archivo, base de datos, etc.). La capa de aplicación depende
// de esta abstracción, nunca de una implementación concreta (Dependency Inversion).
export class RepositorioUsuarios {
  async buscarPorId (_usuarioId) {
    throw new Error('RepositorioUsuarios.buscarPorId: método no implementado')
  }

  async buscarPorNombre (_nombre) {
    throw new Error('RepositorioUsuarios.buscarPorNombre: método no implementado')
  }

  async buscarPorEmail (_email) {
    throw new Error('RepositorioUsuarios.buscarPorEmail: método no implementado')
  }

  async guardar (_usuario) {
    throw new Error('RepositorioUsuarios.guardar: método no implementado')
  }
}
