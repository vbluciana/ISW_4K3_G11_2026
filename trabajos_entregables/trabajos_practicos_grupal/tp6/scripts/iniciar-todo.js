import { spawn, exec } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const raizTp6 = path.resolve(__dirname, '..')
const dirBackend = path.join(raizTp6, 'backend')
const dirFrontend = path.join(raizTp6, 'frontend')

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'

let backendProcess = null
let frontendProcess = null
let backendListo = false
let frontendListo = false
let navegadorAbierto = false

function abrirNavegador () {
  if (navegadorAbierto) return
  navegadorAbierto = true
  console.log('')
  console.log('--------------------------------------------------------------------------------')
  console.log('🎉 ¡SISTEMA LEVANTADO CON ÉXITO!')
  console.log('   👉 Frontend (Aplicación Web): http://localhost:5173')
  console.log('   👉 Backend (API REST):        http://localhost:3000')
  console.log('--------------------------------------------------------------------------------')
  console.log('Presione Ctrl + C para detener todos los servicios de forma limpia.\n')

  const comandoAbrir = process.platform === 'win32'
    ? 'start http://localhost:5173'
    : process.platform === 'darwin'
      ? 'open http://localhost:5173'
      : 'xdg-open http://localhost:5173'

  exec(comandoAbrir, () => {})
}

function iniciarServicios () {
  console.log('\n🚀 Iniciando servicios de la aplicación...\n')

  // 1. Iniciar Backend
  backendProcess = spawn(npmCmd, ['start'], {
    cwd: dirBackend,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
  })

  backendProcess.stdout.on('data', data => {
    const lineas = data.toString().split('\n')
    for (const linea of lineas) {
      const lim = linea.trim()
      if (!lim) continue
      console.log(`\x1b[32m[BACKEND]\x1b[0m  ${lim}`)
      if (lim.includes('3000') || lim.includes('activo') || lim.includes('escuchando')) {
        backendListo = true
        if (frontendListo) abrirNavegador()
      }
    }
  })

  backendProcess.stderr.on('data', data => {
    const lineas = data.toString().split('\n')
    for (const linea of lineas) {
      const lim = linea.trim()
      if (!lim) continue
      console.error(`\x1b[31m[BACKEND ERROR]\x1b[0m ${lim}`)
    }
  })

  // 2. Iniciar Frontend
  frontendProcess = spawn(npxCmd, ['vite'], {
    cwd: dirFrontend,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
  })

  frontendProcess.stdout.on('data', data => {
    const lineas = data.toString().split('\n')
    for (const linea of lineas) {
      const lim = linea.trim()
      if (!lim) continue
      if (lim.includes('shortcuts') || lim.includes('press h')) continue
      console.log(`\x1b[36m[FRONTEND]\x1b[0m ${lim}`)
      if (lim.includes('localhost:5173') || lim.includes('Local:')) {
        frontendListo = true
        if (backendListo) abrirNavegador()
      }
    }
  })

  frontendProcess.stderr.on('data', data => {
    const lineas = data.toString().split('\n')
    for (const linea of lineas) {
      const lim = linea.trim()
      if (!lim) continue
      console.error(`\x1b[33m[FRONTEND AVISO]\x1b[0m ${lim}`)
    }
  })

  setTimeout(() => {
    if (!navegadorAbierto) abrirNavegador()
  }, 4000)
}

// Iniciar directamente los servicios de Backend y Frontend
iniciarServicios()


// Manejo de apagado ordenado con Ctrl+C
function apagar () {
  console.log('\n🛑 Cerrando servicios de EcoHarmony Park...')
  try {
    if (process.platform === 'win32') {
      if (backendProcess && backendProcess.pid) exec(`taskkill /pid ${backendProcess.pid} /T /F`, () => {})
      if (frontendProcess && frontendProcess.pid) exec(`taskkill /pid ${frontendProcess.pid} /T /F`, () => {})
    } else {
      if (backendProcess) backendProcess.kill('SIGINT')
      if (frontendProcess) frontendProcess.kill('SIGINT')
    }
  } catch (e) {
    // ignorar
  }
  process.exit(0)
}

process.on('SIGINT', apagar)
process.on('SIGTERM', apagar)
