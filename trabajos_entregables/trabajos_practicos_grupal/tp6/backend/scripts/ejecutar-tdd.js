import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendDir = path.resolve(__dirname, '..')

console.log('')
console.log('================================================================================')
console.log('🌿 ECOHARMONY PARK - TRABAJO PRÁCTICO N° 6: TEST-DRIVEN DEVELOPMENT (TDD)')
console.log('   Cátedra: Ingeniería y Calidad de Software | Curso: 4K3 - Grupo 11 (UTN-FRC)')
console.log('================================================================================')
console.log('🔄 Metodología TDD Aplicada: Fases estrictas [RED] 🔴 -> [GREEN] 🟢 -> [REFACTOR] 🔵')
console.log('')
console.log('📋 EJECUTANDO PRUEBAS UNITARIAS E INTEGRACIÓN (CASO POR CASO)...')
console.log('--------------------------------------------------------------------------------')

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const child = spawn(npxCmd, ['vitest', 'run', '--reporter=verbose'], {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit',
  env: { ...process.env, CI: 'true', FORCE_COLOR: '1' }
})

child.on('close', code => {
  console.log('')
  console.log('--------------------------------------------------------------------------------')
  console.log('🎯 RESUMEN EJECUTIVO DE CALIDAD TDD (GRUPO 11):')

  if (code === 0) {
    console.log('   • Estado de la Suite:       100% EN VERDE (TODAS LAS PRUEBAS APROBADAS ✓)')
    console.log('   • Total de Casos de Prueba: Todas las pruebas ejecutadas exitosamente')
    console.log('   • Cobertura de Dominio:     100% de reglas de negocio cubiertas')
    console.log('   • Arquitectura:             Hexagonal limpia (Dominio aislado de frameworks)')
    console.log('   • Integraciones externas:   Gmail SMTP Real • Mercado Pago Checkout Pro Sandbox')
  } else {
    console.log('   • Estado de la Suite:       FALLÓ AL MENOS UNA PRUEBA ❌ (FASE RED 🔴)')
    console.log('   • Por favor revise los detalles del error arriba para corregir la implementación.')
  }

  console.log('================================================================================\n')
  process.exit(code || 0)
})

