# Solicitud de Material a Marketing — Sitio Web plasticospimsa.com

> Documento para el equipo de **Marketing**. Lista de todo el material que Sistemas necesita
> para desarrollar el nuevo sitio web corporativo.
> Fecha de solicitud: 2026-07-03 · Contacto: sistemas@plasticospimsa.com

**Cómo entregar**: carpeta compartida (OneDrive) con subcarpetas por sección numerada.
Los textos en Word o Google Docs; las imágenes en su resolución original (sin comprimir, sin WhatsApp).

**Prioridades**:

- **P1 — Bloquea el desarrollo**: se necesita para construir las páginas.
- **P2 — Se necesita antes del lanzamiento**: se puede desarrollar sin ello, pero no publicar.
- **P3 — Deseable**: mejora el resultado; puede llegar después del lanzamiento.

---

## 1. Identidad de marca (P1)

- Logotipo en **vector** (SVG, AI o EPS) en todas sus variantes:
  - Versión principal (color) y versión para fondos oscuros (blanca/negativa)
  - Isotipo/ícono solo (para favicon y app)
- Manual de identidad de marca, si existe (colores oficiales, tipografías, usos correctos)
- Si NO existe manual: confirmar que los colores oficiales son los del logo actual
  (azul #294466 / verde #7F9D41) o indicar los correctos

## 2. Fotografía (P1)

> Requisitos técnicos: resolución mínima **2000 px de ancho**, formato original de cámara
> (JPG/RAW), **sin marcas de agua, sin logos encimados, sin pasar por WhatsApp** (comprime la calidad).
> Orientación horizontal de preferencia. Si no existen fotos de calidad, cotizar una sesión
> de 1 día en planta — es la inversión #1 en la imagen del sitio.

- **Planta**: fachada/exterior, naves, áreas de proceso, almacén
- **Proceso** (una serie por etapa — el sitio narra la transformación del material):
  - Recolección / recepción de scrap
  - Molienda (molinos en operación)
  - Peletizado (peletizadora, pellets saliendo)
  - Producto terminado (sacos, súper sacos, almacén de producto)
- **Material en detalle** (close-ups): scrap, plástico molido, pellets — por tipo/color si es posible
- **Contenedores colapsables**: producto solo y en uso, varios ángulos
- **Equipo**: retratos individuales de directivos (fondo neutro, misma iluminación) y 2–3 fotos de equipo trabajando
- (P3) Video corto de proceso (aunque sea de celular estabilizado, para evaluar su uso)

## 3. Textos y contenido por página (P1)

> En Word/Docs, sin diseño. Nosotros los adaptamos al formato web y SEO. Si ya existe
> el texto en el sitio actual y sigue vigente, basta con indicar "usar el actual" + correcciones.

- **Inicio**: propuesta de valor en 1–2 frases (¿por qué PIMSA y no otro?), y los 3 mensajes clave
- **Nosotros**:
  - Historia validada (fechas y hitos: 2008 inicio, 2011 constitución, ¿qué más?)
  - Misión, visión y valores vigentes
  - Lista de directivos con nombre, puesto y (opcional) 1 línea de trayectoria
- **Por cada servicio** (Polímeros · Molienda y peletizado · Recolección de scrap · Contenedores):
  - Descripción del servicio (¿qué incluye, cómo funciona?)
  - Materiales que se aceptan/manejan (ABS, PC, PA, HDPE, etc.)
  - Capacidades reales (ton/mes, tamaños de lote, cobertura geográfica de recolección)
  - Presentación del producto (molido, pellet, sacos de X kg, súper sacos)
  - 3–5 beneficios diferenciadores
- **Stock de plástico**: lista actual de materiales disponibles con: material, forma (molido/pellet), color, y si se publica o no la disponibilidad/precio
- **Preguntas frecuentes**: las 10–15 preguntas REALES que más hacen clientes y prospectos (con sus respuestas) — pedir apoyo a ventas
- **Aviso de privacidad** vigente y completo (obligatorio por LFPDPPP) — P1

## 4. Datos duros y certificaciones (P1)

> Estos números son protagonistas del diseño (estadísticas en grande). Deben ser reales y defendibles.

- Cifras clave: años operando, toneladas procesadas/mes o /año, número de clientes activos, industrias atendidas, kilómetros/estados de cobertura
- Certificado **ISO 9001:2015**: vigencia, organismo certificador y autorización para mostrarlo
- Registros **IMMEX** y **DUNS**: confirmar que se pueden publicar y en qué nivel de detalle
- Permisos ambientales (SEMARNAT/estatales): cuáles se pueden mencionar públicamente
- (P2) Logos de clientes: archivos en buena calidad + **autorización por escrito** de cada cliente para usarlos (si no hay autorización, usamos "industrias que atendemos" genérico)

## 5. Datos de contacto oficiales (P1)

- ~~Teléfono(s) oficial(es) y número de **WhatsApp Business** definitivo~~ — confirmado 2026-07-29: **+52 442 274 7546** (teléfono y WhatsApp)
- ~~Correo público que muestra el sitio~~ — confirmado 2026-08-07: **contacto@plasticospimsa.com**. Es el que aparece en el pie de página, en `/contact`, en el aviso de privacidad y en el JSON-LD de Google.
- ~~Correo(s) que recibirán los **leads del formulario**~~ — confirmado 2026-08-07: **marketing@plasticospimsa.com**. Es a propósito distinto del público: el sitio muestra `contacto@`, la notificación llega a quien trabaja el lead.
- ~~Correo de RRHH que recibirá las postulaciones~~ — confirmado 2026-08-07: **gte.rh@plasticospimsa.com**. Van aparte porque llevan el CV del candidato.
- Horario de atención
- Dirección exacta validada + pin de Google Maps correcto
- Enlaces oficiales de redes: Facebook, LinkedIn, Instagram, TikTok

> Los tres correos se cambian desde `/admin/settings` sin redesplegar; las variables de entorno solo son el respaldo.

## 6. Cuentas y accesos de marketing digital (P2)

> Necesarios para analítica y campañas. Si alguno no existe, lo creamos juntos — indicar cuáles sí existen.

- Acceso a **Google Analytics 4** (o autorización para crear la propiedad)
- Acceso a **Google Tag Manager** (o lo creamos y les damos acceso)
- Acceso a **Google Search Console** y **Google Business Profile** (ficha de Maps)
- ID de **Meta Pixel** / acceso a Meta Business Suite (si hacen campañas en FB/IG)
- (P3) LinkedIn Insight Tag (si harán campañas B2B en LinkedIn)
- ¿Usan algún **CRM** o dónde quieren registrar los leads además del correo?

## 7. Accesos técnicos (puede ser con Dirección) (P2)

- Acceso al panel de **Hostinger** (hPanel) y gestión del dominio/DNS de plasticospimsa.com
- Acceso de administrador al **WordPress actual** (para exportar contenido y mapear las URLs viejas → nuevas sin perder posicionamiento en Google)

## 8. Decisiones de marketing (P2)

- **Tono de voz**: formal-técnico, cercano-profesional… ¿cómo quieren sonar?
- 5–10 **palabras/frases clave** por las que quieren ser encontrados en Google (desde la experiencia de ventas)
- 2–3 sitios web (de cualquier industria) que les gusten como referencia
- ¿Campañas activas o próximas que necesiten landing page al lanzar?
- ¿Quién será la persona de Marketing **responsable de validar contenido** durante el proyecto? (nombre y disponibilidad)

---

## Resumen de urgencias

| Para poder... | Necesitamos... |
|---|---|
| Empezar a construir páginas | Secciones **1, 2, 3, 4, 5** (P1) |
| Lanzar el sitio | Secciones **6, 7, 8** (P2) + aviso de privacidad |
| Mejorar después del lanzamiento | Los puntos P3 |

> **Nota**: el desarrollo de la base técnica ya está en marcha y no depende de este material,
> pero las páginas con contenido real solo pueden construirse conforme llegue lo marcado como P1.
> Sugerimos una reunión de arranque de 45 min para revisar esta lista juntos.
