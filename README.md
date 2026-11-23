# ISW_4K3_G11_2026

Este repositorio pertenece al **Grupo 11** de la materia **Ingeniería y Calidad de Software** de la UTN FRC, curso **4K3**, segundo cuatrimestre del año 2026. Este documento centraliza la descripción del repositorio y el **Plan de Gestión de Configuración de Software (SCM)** del grupo.

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
├── informacion_catedra/
├── materiales_alumnos/
│   ├── teorico/
│   └── practico/
├── materiales_catedra/
│   ├── bibliografia/
│   │   └── <<tema>>/
│   ├── casos_estudio/
│   ├── presentaciones_clases/
│   └── templates/
├── trabajos_entregables/
│   ├── trabajos_investigacion_grupal/
│   └── trabajos_practicos_grupal/
│       └── tp_<<numero>>_<<nombre_trabajo>>/   # Solo si el TP es un proyecto con múltiples artefactos (ej.: tp_6_Tdd/)
└── README.md
```

Las carpetas de `materiales_catedra/bibliografia/<<tema>>/` se crean a medida que se incorpora material (por ejemplo, `Scm/` y `TestingDeSoftware/`). Cuando un trabajo práctico consiste en un proyecto de desarrollo de software con múltiples artefactos —como el **TP6 (TDD)**—, se aloja en su propia carpeta `tp_<<numero>>_<<nombre_trabajo>>/` dentro de `trabajos_entregables/trabajos_practicos_grupal/`.

## Listado de ítems de configuración

| Nombre de ítem de configuración | Regla de nombrado | Ubicación física | Tipo de ítem |
|---|---|---|---|
| Resumen teórico de unidad | `resumen_u<<numero>>_<<legajo_alumno>>[_<<tema>>].pdf` | `materiales_alumnos/teorico` | Teórico |
| Resumen teórico de parcial | `resumen_p<<numero>>_<<legajo_alumno>>[_<<tema>>].pdf` | `materiales_alumnos/teorico` | Teórico |
| Ejercicios resueltos | `ej_<<tema>>_<<legajo_alumno>>.pdf` | `materiales_alumnos/practico` | Práctico |
| Material bibliográfico | `<<nombre_archivo>>.pdf` | `materiales_catedra/bibliografia/<<tema>>` | Teórico |
| Templates para prácticos y parciales | `template_<<tema>>.<<extension>>` | `materiales_catedra/templates` | Información |
| Presentaciones de clase | `<<numero>>_<<nombre>>.pdf` | `materiales_catedra/presentaciones_clases` | Teórico |
| Guías de estudio | `guia_<<nombre_guia>>.pdf` | `materiales_catedra/casos_estudio` | Práctico |
| Trabajo de investigación grupal | `ti_<<numero>>_<<nombre_trabajo>>.pdf` | `trabajos_entregables/trabajos_investigacion_grupal` | Entregable |
| Trabajo práctico grupal | `tp_<<numero>>_<<nombre_trabajo>>.pdf` *(o carpeta `tp_<<numero>>_<<nombre_trabajo>>/` si incluye código fuente y múltiples artefactos)* | `trabajos_entregables/trabajos_practicos_grupal` | Entregable |
| Cronograma | `cronograma_isw.xlsx` | `informacion_catedra` | Información |
| Programa | `programa_isw.pdf` | `informacion_catedra` | Información |
| Plan de SCM y descripción del repositorio | `README.md` | Raíz del repositorio | Información |

## Clasificación de los tipos de ítem

Las carpetas separan los materiales según quién los produce o su función en el repositorio. El tipo de ítem indica su uso:

- **Teórico:** material para estudiar y consultar conceptos: resúmenes de unidad y de parcial, material bibliográfico y presentaciones de clase.
- **Práctico:** material para aplicar y practicar lo aprendido: ejercicios resueltos y guías de casos de estudio.
- **Entregable:** trabajos grupales que se entregan a la cátedra (TP y TI). Luego de la devolución y de incorporar las correcciones, pueden integrarse a una línea base.
- **Información:** material de soporte y organización: templates, cronograma, programa y este `README.md` (Plan de SCM).

## Reglas de nombrado

### Reglas generales

- Los nombres de carpetas y archivos usan **snake_case**, con las excepciones de **UpperCamelCase** detalladas abajo. Los campos variables no llevan espacios, tildes ni la letra `ñ`.
- Se usa **UpperCamelCase** en:
  - `<<tema>>` de los ejercicios resueltos, de los templates, del sufijo opcional de resúmenes y de las carpetas dentro de `materiales_catedra/bibliografia`.
  - `<<nombre_trabajo>>` de los trabajos de investigación y de los trabajos prácticos grupales.
  - `<<nombre_archivo>>` del material bibliográfico.
  - `<<nombre>>` de las presentaciones de clase.
  - `<<nombre_guia>>` de las guías de estudio.
- En los **resúmenes teóricos**, el sufijo `[_<<tema>>]` es opcional y se utiliza cuando un mismo integrante sube más de un resumen para la misma unidad o parcial sobre un tema específico (ejemplo: `resumen_u2_400567_Scrumban.pdf`).
- En un **ejercicio resuelto** asociado a un TP, el tema comienza con `TP<<numero>>` seguido del nombre descriptivo sin separadores internos (ejemplos: `ej_TP2EcoHarmony_95064.pdf`, `ej_TP3VentaSegundaMano_95064.pdf`). Cuando no se identifica un TP, se conserva el tema descriptivo sin inventar su número.
- En las **presentaciones de clase**, `<<numero>>` indica el número de tema/clase en dos dígitos (puede repetirse cuando un mismo tema tiene más de una presentación, por ejemplo `09_...`).
- Los **trabajos grupales** usan el número directamente después del prefijo (`tp_4_HerramientasDeScm.pdf`, `tp_6_Tdd/`, `ti_1_Despliegue.pdf`); no se antepone `n` al número.
- Los archivos **no llevan sufijos de versión** (`_v1`, `_v2`, etc.) ni dobles extensiones como `.docx.pdf`. Cada actualización conserva el mismo nombre y ubicación; **Git registra las versiones en el historial de commits**.
- `README.md` conserva su nombre convencional. Los archivos auxiliares propios de Git (`.gitkeep`, `.gitignore`, `.gitattributes`) sirven para el control del repositorio y no constituyen ítems de configuración funcionales.
- Los commits siguen [Commits Convencionales 1.0.0](https://www.conventionalcommits.org/es/v1.0.0/): tipo en inglés (`feat`, `fix`, `docs`, `test`, `refactor`, `chore`, etc.) y descripción en español.

### Convenciones internas para proyectos de software (`tp_<<numero>>_<<nombre_trabajo>>/`)

Cuando un trabajo práctico consiste en un proyecto de desarrollo de software (como `tp_6_Tdd/`), su carpeta contenedora respeta la regla general de nombrado, mientras que el código fuente, las pruebas automatizadas, los scripts y los archivos de configuración internos siguen las convenciones estándar del stack tecnológico utilizado (Node.js, React, Vitest, PlantUML), documentadas en el `README.md` y la `guia_estilo.md` del proyecto. La documentación interna en `docs/` sigue `snake_case` sin tildes ni `ñ`.

## Glosario

| Término | Significado |
|---|---|
| `ISW` | Ingeniería y Calidad de Software |
| `SCM` | Gestión de Configuración de Software (*Software Configuration Management*) |
| `LB` | Línea Base |
| `TDD` | Desarrollo Conducido por Pruebas (*Test-Driven Development*) |
| `U` | Unidad de contenido |
| `P` | Parcial |
| `TP` | Trabajo Práctico |
| `TI` | Trabajo de Investigación |
| `K` | Referencia a Ingeniería en Sistemas de Información (`4K3`) |
| `Ej` | Ejercicio |
| `PDF` / `MD` / `XLSX` | Extensiones de archivo (`.pdf`, `.md`, `.xlsx`) |

## Criterio de línea base

Se define una línea base luego de la devolución y corrección de cada trabajo entregable (TP o TI): una vez revisado por la cátedra, se incorporan los ajustes solicitados y se identifica el commit aprobado mediante una **etiqueta anotada de Git**.

La etiqueta identifica un estado consolidado del repositorio; no cambia los nombres de los archivos. Se utiliza la convención `LB-TP<<numero>>_<<nombre_trabajo>>_vFinal` para trabajos prácticos y `LB-TI<<numero>>_<<nombre_trabajo>>_vFinal` para trabajos de investigación. El nombre del trabajo usa `UpperCamelCase`.

**Ejemplo:** `LB-TP4_HerramientasDeScm_vFinal`. El sufijo `vFinal` pertenece a la etiqueta de línea base, no al nombre del entregable.

Un ítem se incorpora a la línea base cuando:

- Fue revisado y aprobado por al menos **dos integrantes**, distintos al autor.
- Está completo y en su versión definitiva, sin marcas de borrador.
- Respeta las reglas de nombrado y la ubicación definidas en el listado de ítems.
- Incorpora las correcciones de la cátedra correspondientes al trabajo.

La etiqueta se crea sobre el commit que cumple estos criterios. No se considera aprobada una línea base por el solo hecho de renombrar archivos.

## Referencias

- [Documento de criterios generales del TP4](https://docs.google.com/document/d/1-ngUNfIVl3RXS-KcsimIF5ds9z-N7amVgMQERP0Uz04/edit?usp=sharing).
- [Repositorio del grupo](https://github.com/vbluciana/ISW_4K3_G11_2026).
