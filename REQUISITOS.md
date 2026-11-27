# Requisitos en el código

Cada requisito está marcado en el código con su código, por ejemplo `US-CRO-S2-03`.
Para encontrar dónde hacer un cambio, busca el código con **Ctrl+Shift+F** en VS Code.
Para ir a un criterio concreto, busca por ejemplo `S2-04 · C3`.

- La primera línea de cada archivo dice a qué requisitos pertenece.
- Dentro del código, `C1`, `C2`… son los criterios de `SPRINT-1.md` y `SPRINT-2.md`.

## US-CRO-S1-01 — Configurar el proyecto y el sistema de diseño

**Archivos:** `src/components/Badge.css`, `src/components/Badge.jsx`, `src/components/Button.css`, `src/components/Button.jsx`, `src/components/Card.css`, `src/components/Card.jsx`, `src/components/CookieBanner.jsx`, `src/components/Icono.css`, `src/components/Icono.jsx`, `src/components/LanguageSelector.jsx`, `src/components/TextField.css`, `src/components/TextField.jsx`, `src/main.jsx`, `src/styles/global.css`, `src/styles/tokens.css`, `src/utils/clasesBoton.js`

## US-CRO-S1-02 — Navegar por el sitio en web y móvil

**Archivos:** `src/App.jsx`, `src/components/Footer.css`, `src/components/Footer.jsx`, `src/components/Navbar.css`, `src/components/Navbar.jsx`, `src/components/PanelAccesibilidad.css`, `src/components/PanelAccesibilidad.jsx`, `src/components/PrimerMundo.jsx`, `src/styles/App.css`, `src/utils/tituloPagina.js`

- **C1** — encabezado y pie en todas las vistas (salvo /ingresar, pantalla completa). → `src/App.jsx`
- **C2** — el menú móvil se cierra con teclado (Escape). → `src/components/Navbar.jsx`

## US-CRO-S1-03 — Inicio público

**Archivos:** `src/components/InicioHero.css`, `src/components/InicioHero.jsx`, `src/components/InicioMundos.css`, `src/components/InicioMundos.jsx`, `src/components/InicioPublico.jsx`, `src/components/InicioRarezas.css`, `src/components/InicioRarezas.jsx`, `src/hooks/useInicioPublico.js`, `src/utils/emblemasMundos.js`

## US-CRO-S1-04 — Catálogo de un mundo

**Archivos:** `src/components/Badge.css`, `src/components/Badge.jsx`, `src/components/CabeceraMundo.css`, `src/components/CabeceraMundo.jsx`, `src/components/CartaCromo.css`, `src/components/CartaCromo.jsx`, `src/components/CatalogoMundo.css`, `src/components/CatalogoMundo.jsx`, `src/components/FiltrosCatalogo.css`, `src/components/FiltrosCatalogo.jsx`, `src/hooks/useCatalogoMundo.js`, `src/utils/catalogo.js`

- **C2** — los filtros viven en la URL (?rareza=…&tipo=…). → `src/components/CatalogoMundo.jsx`
- **C3** — cada cromo enlaza a su detalle (S2-01: recordando mundo y filtros). → `src/components/CatalogoMundo.jsx`

## US-CRO-S1-05 — Cambiar el idioma entre español e inglés

**Archivos:** `src/App.jsx`, `src/components/LanguageSelector.css`, `src/components/LanguageSelector.jsx`, `src/components/Navbar.jsx`, `src/hooks/useTextos.js`, `src/utils/cookies.js`, `src/utils/textos.js`

- **C3** — <html lang> cambia con el idioma. → `src/App.jsx`
- **C4** — el idioma se guarda en la cookie solo si aceptó las cookies. → `src/utils/cookies.js`

## US-CRO-S1-06 — Aceptar o rechazar las cookies

**Archivos:** `src/App.jsx`, `src/components/CookieBanner.css`, `src/components/CookieBanner.jsx`, `src/utils/cookies.js`

- **C1** — aviso de cookies en la primera visita. → `src/App.jsx`

## US-CRO-S2-01 — Detalle de un cromo

**Archivos:** `src/App.jsx`, `src/components/CartaCromo.css`, `src/components/CartaCromo.jsx`, `src/components/CatalogoMundo.jsx`, `src/components/DetalleCromo.css`, `src/components/DetalleCromo.jsx`, `src/hooks/useDetalleCromo.js`, `src/hooks/useTituloDocumento.js`, `src/utils/arteCromos.js`, `src/utils/figuras.jsx`

- **C1** — atributos en barras. → `src/components/DetalleCromo.jsx`
- **C1** — poder y descripción. → `src/components/DetalleCromo.jsx`
- **C1** — rareza con icono y palabra, y tipo. → `src/components/DetalleCromo.jsx`
- **C2** — título y descripción de la pestaña con nombre y poder. → `src/components/DetalleCromo.jsx`
- **C3** — 404 no_encontrado → página de no encontrado. → `src/components/DetalleCromo.jsx`
- **C3** — distingue el 404 del resto de errores. → `src/hooks/useDetalleCromo.js`
- **C4** — carta dibujada solo en SVG con ilustracion.colorBase y figura. → `src/components/DetalleCromo.jsx`
- Rutas: /cromos/:id abre el detalle (S2-01); /ingresar abre el ingreso (S2-03). → `src/App.jsx`
- Ventana sobre el catálogo del mundo (web) / hoja inferior (móvil). → `src/components/DetalleCromo.jsx`

## US-CRO-S2-02 — Estados de carga, vacío y error

**Archivos:** `src/components/CatalogoMundo.css`, `src/components/CatalogoMundo.jsx`, `src/components/DetalleCromo.css`, `src/components/DetalleCromo.jsx`, `src/components/Estados.jsx`, `src/hooks/useCatalogoMundo.js`, `src/hooks/useDetalleCromo.js`, `src/hooks/useTextos.js`, `src/utils/api.js`

- **C1** — bloque de esqueleto de carga. → `src/components/Estados.jsx`
- **C1** — esqueleto con la forma del catálogo mientras carga. → `src/components/CatalogoMundo.jsx`
- **C1** — esqueleto con la forma del detalle mientras carga. → `src/components/DetalleCromo.jsx`
- **C2** — estado vacío (ej. /mundos/neon?rareza=legendaria&tipo=aliado). → `src/components/CatalogoMundo.jsx`
- **C3 y C4** — error con «Reintentar»; texto de textos.estados y textos.errores[codigo]. → `src/components/Estados.jsx`
- **C3** — error con botón «Reintentar» en el catálogo. → `src/components/CatalogoMundo.jsx`
- **C3** — error con botón «Reintentar» en el detalle. → `src/components/DetalleCromo.jsx`
- **C5** — ?simularLatencia y ?simularError → cabeceras X-Simular-*. → `src/utils/api.js`

## US-CRO-S2-03 — Iniciar sesión

**Archivos:** `src/App.jsx`, `src/components/CampoClave.jsx`, `src/components/Ingresar.css`, `src/components/Ingresar.jsx`, `src/components/TextField.css`, `src/components/TextField.jsx`, `src/utils/sesion.js`

- **C1 y C3** — etiqueta asociada al campo y error junto a él. → `src/components/TextField.jsx`
- **C1** — correo y contraseña con etiquetas visibles. S2-04 C3: se bloquea con 429. → `src/components/Ingresar.jsx`
- **C2** — botón del ojo con aria-pressed. → `src/components/CampoClave.jsx`
- **C2** — el ojo muestra/oculta la contraseña (aria-pressed). → `src/components/Ingresar.jsx`
- **C3** — 422 validacion → mensaje junto a cada campo. → `src/utils/erroresIngreso.js`
- **C3** — mensaje junto al campo y foco en el primer campo con error. → `src/components/Ingresar.jsx`
- **C3** — valida que no falte ningún dato. → `src/components/Ingresar.jsx`
- **C4** — POST /sesion con { correo, clave }. → `src/utils/sesion.js`
- **C4** — al ingresar vuelve al inicio con la sesión iniciada. → `src/components/Ingresar.jsx`
- **C5** — enlace «Crea una cuenta». → `src/components/Ingresar.jsx`
- Decisión: /ingresar a pantalla completa (Figma), sin barra ni pie. → `src/App.jsx`

## US-CRO-S2-04 — Ver por qué no pude ingresar

**Archivos:** `src/components/Ingresar.css`, `src/components/Ingresar.jsx`, `src/utils/api.js`, `src/utils/erroresIngreso.js`

- **C1** — no se puede enviar dos veces. → `src/components/Ingresar.jsx`
- **C1** — «Ingresando…» mientras envía; C4: «Reintentar» sin red. → `src/components/Ingresar.jsx`
- **C2** — 401 credenciales_invalidas → un solo mensaje. → `src/utils/erroresIngreso.js`
- **C2–C4** — aviso de error del ingreso. → `src/components/Ingresar.jsx`
- **C2–C4** — traduce 401, 429 y sin red al aviso del formulario. → `src/components/Ingresar.jsx`
- **C3** — 429 demasiadas_peticiones → bloqueo con Retry-After. → `src/utils/erroresIngreso.js`
- **C3** — 429 → el formulario se bloquea los segundos de Retry-After. → `src/components/Ingresar.jsx`
- **C3** — segundos de bloqueo que indica Retry-After. → `src/utils/api.js`
- **C4** — sin red → error de conexión con «Reintentar». → `src/utils/erroresIngreso.js`

## US-CRO-S2-05 — Mantener la sesión y cerrarla

**Archivos:** `src/components/Ingresar.jsx`, `src/components/InicioHero.jsx`, `src/components/MenuCuenta.css`, `src/components/MenuCuenta.jsx`, `src/components/Navbar.css`, `src/components/Navbar.jsx`, `src/components/ProveedorSesion.jsx`, `src/hooks/useSesion.js`, `src/main.jsx`, `src/utils/api.js`, `src/utils/iniciales.js`, `src/utils/sesion.js`

- **C1** — la cookie httpOnly `sesion` viaja con credentials: "include". → `src/utils/api.js`
- **C1** — marca sin token para no consultar la sesión a visitantes. → `src/utils/sesion.js`
- **C2 y C3** — menú con nombre y correo, y «Cerrar sesión». → `src/components/MenuCuenta.jsx`
- **C2 y C4** — GET /sesion; 401 no_autenticado → sin sesión. → `src/utils/sesion.js`
- **C2** — GET /sesion al cargar la página. → `src/components/ProveedorSesion.jsx`
- **C2** — con sesión la portada no invita a crear cuenta. → `src/components/InicioHero.jsx`
- **C2** — con sesión, avatar y cerrar sesión en el menú móvil; sin sesión, «Ingresar» y «Crear cuenta». → `src/components/Navbar.jsx`
- **C2** — con sesión, menú de cuenta; sin sesión, «Ingresar» y «Crear cuenta». → `src/components/Navbar.jsx`
- **C2** — la sesión se consulta al cargar la página (GET /sesion). → `src/main.jsx`
- **C3** — cerrar sesión y volver al inicio como visitante. → `src/components/ProveedorSesion.jsx`
- **C3** — «Cerrar sesión» llama a DELETE /sesion. → `src/utils/sesion.js`
- **C4** — al volver a la pestaña se revisa si la sesión venció. → `src/components/ProveedorSesion.jsx`
- **C4** — sesión vencida → se lleva a la persona a /ingresar. → `src/components/ProveedorSesion.jsx`
- **C5** — guarda solo la preferencia «Mantener la sesión iniciada». → `src/components/Ingresar.jsx`
- **C5** — sin «Mantener la sesión», se cierra al abrir el navegador. → `src/components/ProveedorSesion.jsx`
- **C5** — solo marcas de preferencia, nunca el token. → `src/utils/sesion.js`
- **C5** — «Mantener la sesión iniciada». S2-03 C5: «¿Olvidaste tu contraseña?». → `src/components/Ingresar.jsx`
