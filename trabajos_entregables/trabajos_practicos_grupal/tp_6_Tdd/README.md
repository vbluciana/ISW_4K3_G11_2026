# EcoHarmony Park - TP6: Test-Driven Development (TDD)
**Cátedra:** Ingeniería y Calidad de Software  
**Curso:** 4K3 - Grupo 11  
**Universidad Tecnológica Nacional - Facultad Regional Córdoba (UTN-FRC)**  

---

## ⚡ Cómo levantar todo en 1 solo paso

Hay dos formas equivalentes y directas:

### Opción A (Recomendada en Windows):
Simplemente hacer **doble clic en `iniciar.bat`**.  
* Levanta automáticamente el Backend en `http://localhost:3000`.
* Levanta el Frontend en `http://localhost:5173`.
* Abre de forma automática el navegador en la aplicación.

### Opción B (Desde la terminal en la carpeta `tp6`):
```bash
npm start
```
*(O `npm run dev`)*.

Para detener ambos servicios de forma ordenada, presione `Ctrl + C` en la consola.

---

## 🧪 Cómo ejecutar las pruebas TDD

### Opción A (En Windows):
Hacer **doble clic en `probar-tdd.bat`**.

### Opción B (Desde la terminal en `tp6`):
```bash
npm test
```

Muestra el reporte académico en español con la verificación de las 10 suites de prueba según la **Arquitectura Hexagonal**, el 100% de los tests en verde y cero ruido en consola.

Para ver el reporte con cobertura detallada de código:
```bash
npm run test:coverage
```
*(Cobertura de dominio: 100% | Cobertura general: >96%)*.

---

## 🏗️ Estructura del Proyecto

* **`backend/`**: Node.js + Express con Arquitectura Hexagonal y TDD estricto.
  * **Dominio:** `entities` (`Compra`, `Visitante`), `valueObjects` (`FechaVisita`, `Email`), `services` (`CalculadoraTarifas`).
  * **Aplicación:** `useCases` (`ComprarEntradas`), `ports` (`RepositorioCompras`, `PasarelaDePago`, `ServicioEmail`).
  * **Infraestructura:** Persistencia en memoria, adaptadores reales de **Mercado Pago Checkout Pro** y **Gmail SMTP**.
* **`frontend/`**: Single Page Application con React 19 + Vite, diseño moderno, validaciones en tiempo real y flujo de compra completo.
