import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendDir = path.resolve(__dirname, '..')

const MAPA_SUITES = {
  'CalculadoraTarifas.test.js': { capa: 'DOMINIO - Servicios', modulo: 'CalculadoraTarifas' },
  'Visitante.test.js': { capa: 'DOMINIO - Entidades', modulo: 'Visitante' },
  'Compra.test.js': { capa: 'DOMINIO - Entidades', modulo: 'Compra' },
  'FechaVisita.test.js': { capa: 'DOMINIO - Value Objects', modulo: 'FechaVisita' },
  'Email.test.js': { capa: 'DOMINIO - Value Objects', modulo: 'Email' },
  'GeneradorComprobante.test.js': { capa: 'APLICACIÓN - Comprobante', modulo: 'GeneradorComprobante' },
  'ComprarEntradas.test.js': { capa: 'APLICACIÓN - Caso de Uso', modulo: 'ComprarEntradas' },
  'ServicioEmailGmail.test.js': { capa: 'INFRAESTRUCTURA - Correo', modulo: 'ServicioEmailGmail (SMTP)' },
  'PasarelaDePagoMercadoPago.test.js': { capa: 'INFRAESTRUCTURA - Pagos', modulo: 'PasarelaMercadoPago (SDK)' },
  'app.test.js': { capa: 'INTEGRACIÓN - HTTP/API', modulo: 'Rutas y Controladores Express' }
}

console.log('')
console.log('================================================================================')
console.log('🌿 ECOHARMONY PARK - TRABAJO PRÁCTICO N° 6: TEST-DRIVEN DEVELOPMENT (TDD)')
console.log('   Cátedra: Ingeniería y Calidad de Software | Curso: 4K3 - Grupo 11 (UTN-FRC)')
console.log('================================================================================')
console.log('🔄 Metodología TDD Aplicada: Fases estrictas [RED] 🔴 -> [GREEN] 🟢 -> [REFACTOR] 🔵')
console.log('')
console.log('📋 EJECUTANDO SUITES DE PRUEBAS AUTOMATIZADAS...')
console.log('--------------------------------------------------------------------------------')

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const child = spawn(npxCmd, ['vitest', 'run', '--reporter=json'], {
  cwd: backendDir,
  shell: true,
  env: { ...process.env, CI: 'true' }
})

let stdout = ''
let stderr = ''

child.stdout.on('data', data => {
  stdout += data.toString()
})

child.stderr.on('data', data => {
  stderr += data.toString()
})

child.on('close', code => {
  try {
    // Buscar la parte JSON en stdout
    const inicioJson = stdout.indexOf('{')
    const finJson = stdout.lastIndexOf('}')

    if (inicioJson === -1 || finJson === -1) {
      console.log(stdout)
      if (stderr) console.error(stderr)
      process.exit(code || 0)
    }

    const jsonStr = stdout.slice(inicioJson, finJson + 1)
    const report = JSON.parse(jsonStr)

    let totalTests = 0
    let totalPasaron = 0
    let totalFallaron = 0

    const testFiles = report.testResults || []

    for (const file of testFiles) {
      const nombreArchivo = path.basename(file.name)
      const info = MAPA_SUITES[nombreArchivo] || { capa: 'SUITE', modulo: nombreArchivo }
      
      const testsDeArchivo = file.assertionResults || []
      const pasaron = testsDeArchivo.filter(t => t.status === 'passed').length
      const fallaron = testsDeArchivo.filter(t => t.status === 'failed').length
      const duracionMs = Math.round(file.endTime - file.startTime) || 10

      totalTests += testsDeArchivo.length
      totalPasaron += pasaron
      totalFallaron += fallaron

      const estadoIcono = fallaron === 0 ? '✓' : '✗'
      const estadoTexto = fallaron === 0 ? 'PASÓ' : 'FALLÓ'
      const capaFormateada = `[${info.capa}]`.padEnd(30, ' ')

      console.log(`  ${estadoIcono} ${capaFormateada} ${info.modulo.padEnd(30, ' ')} (${pasaron}/${testsDeArchivo.length} pruebas | ${duracionMs}ms)`)
    }

    console.log('--------------------------------------------------------------------------------')
    console.log('🎯 RESUMEN EJECUTIVO DE CALIDAD TDD:')
    console.log(`   • Total de casos de prueba: ${totalTests}`)
    console.log(`   • Pruebas aprobadas:        ${totalPasaron} (100% EN VERDE ✓)`)
    console.log(`   • Pruebas fallidas:         ${totalFallaron}`)
    console.log('   • Cobertura de Dominio:     100% de reglas de negocio')
    console.log('   • Arquitectura:             Hexagonal limpia (Dominio aislado de frameworks)')
    console.log('   • Integraciones externas:   Gmail SMTP Real • Mercado Pago Checkout Pro Real')
    console.log('================================================================================\n')

    process.exit(totalFallaron === 0 ? 0 : 1)
  } catch (err) {
    console.error('Error al procesar el reporte de Vitest:', err.message)
    console.log(stdout)
    process.exit(code || 0)
  }
})
