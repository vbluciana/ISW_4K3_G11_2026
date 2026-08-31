# ISW_4K3_G11_2Q_2026

Este repositorio pertenece al **Grupo 11** de la materia **Ingeniería y Calidad de Software** de la UTN FRC, curso **4K3**, segundo cuatrimestre del año 2026.

## Integrantes

| Apellido y nombre | Legajo |
|---|---|
| Acuña, Micaela Sol | 400360 |
| Almiron, Bruno | 82838 |
| Berta, Theo | 95064 |
| Bustos Giacomoni, Facundo Tomas | 400302 |
| Chauvet, Nicole | 400369 |
| Corvera, Yazmín Guadalupe | 402241 |
| Di Pietro, Ezequiel | 94357 |
| Fronte, Gaston Agustín | 91292 |
| Mottura, Mateo | 91154 |
| Quinteros Lazcano, Felipe | 400567 |
| Ramirez, Carlos David | 401710 |
| Ribotta, Juan Martin | 96977 |
| Riccio, Facundo Samuel | 89925 |
| Rosencovich, Juan | 403961 |
| Villarroel Barreto, Luciana | 401556 |

---

## Estructura del repositorio

```
ISW_4K3_GX_2Q_2026/
├── materiales_alumnos/
│   ├── teorico/
│   │   └── resumen_u<<numero>>_v<<numero>>.pdf
│   └── practico/
│       └── ej_<<tema>>_<<legajo_alumno>>_v<<numero>>.pdf
├── trabajos_entregables/
│   ├── trabajos_investigacion_grupal/
│   │   └── ti_n<<numero>>_<<nombre_trabajo>>.pdf
│   └── trabajos_practicos_grupal/
│       └── tp_n<<numero>>_<<nombre_trabajo>>.pdf
├── planificacion_catedra/
│   ├── cronograma_isw.xlsx
│   └── programa_isw.pdf
├── gestion/
│   └── plan_scm_v<<numero_version>>.pdf
└── README.md
```

---

## Listado de ítems de configuración

| Nombre de ítem de configuración | Regla de nombrado | Ubicación física | Tipo de ítem |
|---|---|---|---|
| Resumen teórico de unidad | `resumen_u<<numero>>_v<<numero>>.pdf` | `materiales_alumnos/teorico` | Iteración |
| Ejercicios resueltos | `ej_<<tema>>_<<legajo_alumno>>_v<<numero>>.pdf` | `materiales_alumnos/practico` | Iteración |
| Trabajo de investigación grupal | `ti_<<numero>>_<<nombre_trabajo>>_v<<version>>.pdf` | `trabajos_entregables/trabajos_investigacion_grupal` | Producto |
| Trabajo práctico grupal | `tp_<<numero>>_<<nombre_trabajo>>_v<<version>>.pdf` | `trabajos_entregables/trabajos_practicos_grupal` | Producto |
| Plan de gestión de configuración | `plan_scm_v<<numero_version>>.pdf` | `gestion` | Proyecto |
| Cronograma | `cronograma_isw.xlsx` | `planificacion_catedra` | Proyecto |
| Programa | `programa_isw.pdf` | `planificacion_catedra` | Proyecto |

---

## Reglas de nombrado

- Todos los nombres de carpetas y archivos se escriben en formato **snake_case**.
- Se utiliza **UpperCamelCase** (`CamelCase`) únicamente para nombrar el siguiente contenido dentro de estos ítems:
  - En **Ejercicios resueltos** (`ej_<<tema>>_<<legajo_alumno>>_v<<numero>>.pdf`) → el campo `<<tema>>`.
  - En **Trabajo de investigación grupal** (`ti_<<numero>>_<<nombre_trabajo>>_v<<version>>.pdf`) → el campo `<<nombre_trabajo>>`.
  - En **Trabajo práctico grupal** (`tp_<<numero>>_<<nombre_trabajo>>_v<<version>>.pdf`) → el campo `<<nombre_trabajo>>`.
- Los commits siguen el estándar [**Commits Convencionales 1.0.0**](https://www.conventionalcommits.org/es/v1.0.0/): el **tipo** del commit se escribe en **inglés** (`feat`, `fix`, `docs`, etc.) y el **cuerpo/descripción** se escribe en **español**.

---

## Glosario

| Término | Significado |
|---|---|
| `ISW` | Ingeniería y Calidad de Software |
| `U` | Unidad (de contenido) |
| `TP` | Trabajo Práctico |
| `TPIG` | Trabajo Práctico de Investigación Grupal |
| `TI` | Trabajo de Investigación |
| `DDMM` | Formato de fecha Día/Mes (ej: 02/08 → `0208`) |
| `K` | Referencia a la carrera Ingeniería en Sistemas de Información (ej: `4K3`) |
| `PDF` | Extensión de archivo `.pdf` |
| `MD` | Extensión de archivo `.md` |
| `XLSX` | Extensión de archivo `.xlsx` |
| `Ej` | Ejercicio |

---

## Criterio de línea base

En nuestro proyecto definimos una línea base luego de la devolución y corrección de cada **Trabajo Entregable** (trabajos prácticos grupales o trabajos de investigación grupales): una vez que la cátedra revisa el ítem, incorporamos los ajustes solicitados y ese estado queda marcado como línea base.

Esta decisión permite que el repositorio refleje versiones **consolidadas, correctas y alineadas con los criterios de la cátedra**, evitando errores, y funcione como un historial de estados estables y verificables a lo largo del cuatrimestre.

Para su identificación, adoptamos una convención de nombrado basada en el número de trabajo práctico, su nombre y su condición de versión final:

```
LB-TP<<numero>>_<<nombre_trabajo>>_vFinal
```

**Ejemplo:** `LB_TP3_scm_vFinal`

Esto garantiza trazabilidad y claridad en la evolución de los ítems de configuración.

Un ítem de configuración se incorpora a la línea base cuando:

- Fue revisado y aprobado por al menos **dos integrantes** del grupo, distintos al autor.
- Está completo y en su versión definitiva, sin marcas de borrador (sin sufijos como `_borrador` o `_v0`).
- Respeta las reglas de nombrado y la ubicación definidas en el listado de ítems de configuración.
- Si la cátedra ya devolvió la corrección para ese trabajo, incorpora los cambios solicitados.