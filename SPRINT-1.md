# Sprint 1 — Cromoverso

Historias y criterios transcritos del tablero del curso. Estado en el tablero: terminadas
(en revisión final antes de iniciar el Sprint 2).

## US-CRO-S1-01 — Configurar el proyecto y el sistema de diseño

Como estudiante que desarrolla el proyecto, quiero una base de proyecto lista y con los estilos del diseño para construir todas las vistas sobre la misma base.

Alcance: configuración, tokens y componentes base.

1. El proyecto usa Next.js (App Router) con TypeScript en modo estricto, ESLint y Prettier, sin errores.
2. El sitio está desplegado en Vercel desde la primera semana, y la dirección de la API va en una variable de entorno.
3. Los colores, la tipografía, los espacios y los radios de Figma están como tokens en el CSS; ningún componente usa valores escritos a mano.
4. Existen los componentes base: botón, campo, etiqueta, tarjeta, selector de idioma y aviso de cookies, con estados de foco, hover y deshabilitado.
5. El trabajo se hace con una rama y un PR por historia, con commits convencionales.

## US-CRO-S1-02 — Navegar por el sitio en web y móvil

Como visitante de Cromoverso, quiero recorrer el sitio desde el computador y desde el celular para llegar a cualquier vista sin perderme.

Alcance: encabezado, navegación, pie de página y menú móvil.

1. El encabezado con la navegación y el pie de página aparecen en todas las vistas.
2. En móvil, el menú hamburguesa se abre y se cierra, y se puede usar con teclado. No hay barra de pestañas inferior.
3. Los enlaces llevan a las vistas del curso: Inicio público, Catálogo de un mundo, Iniciar sesión y Crear cuenta.
4. El HTML es semántico: `header`, `nav`, `main` y `footer`, con los encabezados en orden.
5. Referencia de diseño: Figma, bloque «Sprint 1», vista 1 y «Menú móvil». Funciona de 390 a 1440 px sin desbordes.

## US-CRO-S1-03 — Inicio público

Como visitante de Cromoverso, quiero ver los seis mundos del álbum con sus totales y las cuatro rarezas para conocer el álbum sin tener que crear una cuenta.

Alcance: vista 1 en web y móvil, con datos de la API.

1. La vista muestra los seis mundos del álbum con sus totales y las cuatro rarezas, con datos de `GET /mundos` y `GET /rarezas`.
2. Los botones y enlaces llevan a Catálogo de un mundo, a Iniciar sesión y a Crear cuenta.
3. Ningún dato del catálogo está escrito a mano en el código.
4. La vista se ve igual que en Figma en web y en móvil: tipografía, colores y espaciado.
5. Referencia de diseño: Figma, bloque «Sprint 1», columna «1 · Inicio público» (web y móvil).

**Aclaración para esta entrega:** aunque el criterio textual menciona las cuatro rarezas,
se prioriza la captura de Figma compartida y no se muestra esa lista en Inicio. El endpoint
sigue consultándose y las rarezas aparecen en el catálogo.

## US-CRO-S1-04 — Catálogo de un mundo

Como visitante de Cromoverso, quiero ver los 20 cromos del mundo, con filtros por rareza y por tipo, para encontrar los cromos que me interesan.

Alcance: vista 2 en web y móvil, en la ruta `/mundos/[id]`.

1. La vista muestra los 20 cromos del mundo, con filtros por rareza y por tipo, con datos de `GET /mundos/:id`, `GET /cromos` y `GET /rarezas`.
2. Los filtros viven en la URL (por ejemplo `?rareza=legendaria&tipo=villano`): al recargar o compartir el enlace se conservan.
3. Cada elemento enlaza a la ruta de su detalle (vista 3, que se construye en el Sprint 2). La rareza nunca se muestra solo con color: siempre con su icono y su palabra (`GET /rarezas`).
4. La vista se ve igual que en Figma en web y en móvil.
5. Referencia de diseño: Figma, bloque «Sprint 1», columna «2 · Catálogo de un mundo» (web y móvil).

## US-CRO-S1-05 — Cambiar el idioma entre español e inglés

Como visitante de Cromoverso, quiero ver toda la interfaz en español o en inglés para usar el sitio en el idioma que prefiero.

Alcance: selector ES | EN y textos de la interfaz desde la API.

1. Todos los textos de la interfaz (navegación, botones, títulos, etiquetas, mensajes) salen de `GET /textos?idioma=es` o `?idioma=en`. Ningún texto queda escrito dentro de un componente.
2. El selector ES | EN está en la navegación y en el menú móvil, y cambia el idioma de toda la vista.
3. `<html lang>` cambia con el idioma.
4. Si la persona aceptó las cookies, el idioma elegido se guarda en la cookie `idioma` y se recuerda en la próxima visita.
5. La interfaz en inglés no se rompe aunque los textos sean más largos. Los datos del catálogo no se traducen.

## US-CRO-S1-06 — Aceptar o rechazar las cookies

Como visitante de Cromoverso, quiero decidir si acepto las cookies en mi primera visita para controlar qué se guarda en mi navegador.

Alcance: aviso de cookies con aceptar y rechazar, sin panel de preferencias.

1. El aviso aparece en la primera visita, con los textos de `cookies.banner` de `GET /textos`.
2. «Aceptar» y «Rechazar» tienen el mismo tamaño y el mismo peso visual.
3. La decisión se guarda en la cookie `consentimiento` y el aviso no vuelve a salir.
4. Si la persona rechaza, el sitio funciona igual, pero el idioma no se guarda en la cookie `idioma`.
5. Referencia de diseño: Figma, bloque «Sprint 1», «Aviso de cookies (primera visita)». El aviso se puede usar con teclado.

## Decisión sobre el stack

La profesora indicó mantener React, JavaScript y Vite por razones de tiempo. Por tanto, se conserva la base actual y no se migra a Next.js ni TypeScript, aunque el criterio original de US-CRO-S1-01 los mencione.

La parte del criterio US-CRO-S1-01 relativa al stack se considera adaptada a esa indicación de la profesora. Se mantienen los demás objetivos del sprint que sean compatibles.

## Sprint 2 (siguiente, sin iniciar)

- US-CRO-S2-01 — Detalle de un cromo
- US-CRO-S2-02 — Ver los estados de carga, vacío y error
- US-CRO-S2-03 — Iniciar sesión
- US-CRO-S2-04 — Ver por qué no pude ingresar
- US-CRO-S2-05 — Mantener la sesión y cerrarla
