# ISW_4K3_G11_2026

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

```text
ISW_4K3_G11_2026/
├── materiales_alumnos/
│   ├── teorico/
│   └── practico/
├── materiales_catedra/
│   ├── bibliografia/
│   │   └── <<tema>>/
│   ├── templates/
│   ├── presentaciones_clases/
│   └── casos_estudio/
├── trabajos_entregables/
│   ├── trabajos_investigacion_grupal/
│   └── trabajos_practicos_grupal/
├── informacion_catedra/
├── gestion/
│   └── plan_scm.pdf
└── README.md
```

Se conserva `gestion` para el plan de SCM existente. Las carpetas de bibliografía por tema se crean cuando se incorpora material; `<<tema>>` representa un campo variable.

## Listado de ítems de configuración

| Nombre de ítem de configuración | Regla de nombrado | Ubicación física | Tipo de ítem |
|---|---|---|---|
| Resumen teórico de unidad | `resumen_u<<numero>>_<<legajo_alumno>>.pdf` | `materiales_alumnos/teorico` | Teórico |
| Resumen teórico de parcial | `resumen_p<<numero>>_<<legajo_alumno>>.pdf` | `materiales_alumnos/teorico` | Teórico |
| Ejercicios resueltos | `ej_<<tema>>_<<legajo_alumno>>.pdf` | `materiales_alumnos/practico` | Práctico |
| Material bibliográfico | `<<nombre_archivo>>.pdf` | `materiales_catedra/bibliografia/<<tema>>` | Teórico |
| Templates para prácticos y parciales | `template_<<tema>>.<<extension>>` | `materiales_catedra/templates` | Información |
| Presentaciones de clase | `<<numero>>_<<nombre>>.pdf` | `materiales_catedra/presentaciones_clases` | Teórico |
| Guías de estudio | `guia_<<nombre_guia>>.pdf` | `materiales_catedra/casos_estudio` | Práctico |
| Trabajo de investigación grupal | `ti_<<numero>>_<<nombre_trabajo>>.pdf` | `trabajos_entregables/trabajos_investigacion_grupal` | Entregable |
| Trabajo práctico grupal | `tp_<<numero>>_<<nombre_trabajo>>.pdf` | `trabajos_entregables/trabajos_practicos_grupal` | Entregable |
| Plan de gestión de configuración | `plan_scm.pdf` | `gestion` | Información |
| Cronograma | `cronograma_isw.xlsx` | `informacion_catedra` | Información |
| Programa | `programa_isw.pdf` | `informacion_catedra` | Información |
| Descripción del repositorio | `README.md` | `Raíz del repositorio` | Información |

## Clasificación de los tipos de ítem

Las carpetas separan los materiales según quién los produce o su función en el repositorio. El tipo de ítem indica su uso:

- **Teórico:** material para estudiar y consultar conceptos: resúmenes de unidad y de parcial, material bibliográfico y presentaciones de clase.
- **Práctico:** material para aplicar y practicar lo aprendido: ejercicios resueltos y casos de estudio.
- **Entregable:** trabajos grupales que se entregan a la cátedra (TP y TI). Luego de la devolución y de incorporar las correcciones, pueden integrarse a una línea base.
- **Información:** material de soporte y organización: templates, plan de gestión de configuración, cronograma, programa y README.

## Reglas de nombrado

- Los nombres de carpetas y archivos usan **snake_case**, con las excepciones de **UpperCamelCase** detalladas abajo. Los campos variables no llevan espacios ni tildes.
- Se usa **UpperCamelCase** en:
  - `<<tema>>` de los ejercicios resueltos y de los templates.
  - `<<nombre_trabajo>>` de los trabajos de investigación y de los trabajos prácticos grupales.
  - Las carpetas `<<tema>>` dentro de `materiales_catedra/bibliografia`.
  - `<<nombre_archivo>>` del material bibliográfico.
  - `<<nombre>>` de las presentaciones de clase.
  - `<<nombre_guia>>` de las guías de estudio.
- En un ejercicio asociado a un TP, el tema comienza con `TP<<numero>>` y luego el nombre descriptivo, sin separadores internos. Ejemplos: `ej_TP2EcoHarmony_95064.pdf` y `ej_TP3VentaSegundaMano_95064.pdf`. Cuando no se identifica un TP, se conserva el tema sin inventar su número.
- Los trabajos grupales usan el número directamente después del prefijo: `tp_4_HerramientasDeScm.pdf` y `ti_1_NombreTrabajo.pdf`; no se antepone `n` al número.
- Los archivos **no llevan sufijos de versión** (`_v1`, `_v2`, etc.) ni dobles extensiones como `.docx.pdf`. Cada actualización conserva el mismo nombre y ubicación; **Git registra las versiones en el historial de commits**.
- `README.md` conserva su nombre convencional. `.gitkeep` es un archivo auxiliar para registrar directorios vacíos y no constituye un ítem de configuración.
- Los commits siguen [Commits Convencionales 1.0.0](https://www.conventionalcommits.org/es/v1.0.0/): tipo en inglés (`feat`, `fix`, `docs`, etc.) y descripción en español.

## Glosario

| Término | Significado |
|---|---|
| `ISW` | Ingeniería y Calidad de Software |
| `U` | Unidad de contenido |
| `P` | Parcial |
| `TP` | Trabajo Práctico |
| `TPIG` | Trabajo Práctico de Investigación Grupal |
| `TI` | Trabajo de Investigación |
| `DDMM` | Fecha en formato día/mes (02/08 → 0208) |
| `K` | Referencia a Ingeniería en Sistemas de Información (4K3) |
| `PDF` | Extensión .pdf |
| `MD` | Extensión .md |
| `XLSX` | Extensión .xlsx |
| `Ej` | Ejercicio |

## Criterio de línea base

Se define una línea base luego de la devolución y corrección de cada trabajo entregable (TP o TI): una vez revisado por la cátedra, se incorporan los ajustes solicitados y se identifica el commit aprobado mediante una **etiqueta de Git**.

La etiqueta identifica un estado consolidado del repositorio; no cambia los nombres de los archivos. Se utiliza la convención `LB-TP<<numero>>_<<nombre_trabajo>>_vFinal` para trabajos prácticos y `LB-TI<<numero>>_<<nombre_trabajo>>_vFinal` para trabajos de investigación. El nombre del trabajo usa UpperCamelCase.

**Ejemplo:** `LB-TP4_HerramientasDeScm_vFinal`. El sufijo `vFinal` pertenece a la etiqueta de línea base, no al nombre del PDF.

Un ítem se incorpora a la línea base cuando:

- Fue revisado y aprobado por al menos **dos integrantes**, distintos al autor.
- Está completo y en su versión definitiva, sin marcas de borrador.
- Respeta las reglas de nombrado y la ubicación definidas en el listado de ítems.
- Incorpora las correcciones de la cátedra correspondientes al trabajo.

La etiqueta se crea sobre el commit que cumple estos criterios. No se considera aprobada una línea base por el solo hecho de renombrar archivos.

## Referencias

- [Documento de criterios generales del TP4](https://docs.google.com/document/d/1-ngUNfIVl3RXS-KcsimIF5ds9z-N7amVgMQERP0Uz04/edit?usp=sharing).
- [Repositorio del grupo](https://github.com/vbluciana/ISW_4K3_G11_2026).
