# Sprint 1 — Cromoverso

Historias y criterios transcritos de las capturas compartidas. Estado inicial: por hacer.

## US-CRO-S1-01 — Configurar el proyecto y el sistema de diseño

Como estudiante que desarrolla el proyecto, quiero una base lista y con los estilos del diseño para construir todas las vistas sobre la misma base.

1. El proyecto usa Next.js (App Router) con TypeScript en modo estricto, ESLint y Prettier, sin errores.
2. El sitio está desplegado en Vercel desde la primera semana y la dirección de la API está en una variable de entorno.
3. Los colores, tipografía, espacios y radios de Figma están como tokens CSS; ningún componente usa valores escritos a mano.
4. Existen componentes base: botón, campo, etiqueta, tarjeta, selector de idioma y aviso de cookies, con estados de foco, hover y deshabilitado.
5. El trabajo se hace con una rama y un PR por historia, con commits convencionales.

## US-CRO-S1-02 — Navegar por el sitio en web y móvil

Como visitante de Cromoverso, quiero recorrer el sitio desde el computador y desde el celular para llegar a cualquier vista sin perderme.

1. El encabezado con navegación y el pie de página aparecen en todas las vistas.
2. En móvil, el menú hamburguesa se abre, se cierra y se puede usar con teclado. No hay barra de pestañas inferior.
3. Los enlaces llevan a las vistas del curso: Inicio público, Catálogo de un mundo, Iniciar sesión y Crear cuenta.
4. El HTML es semántico: `header`, `nav`, `main` y `footer`, en ese orden.
5. Referencia: Figma, bloque «Sprint 1», vista 1 y «Menú móvil». Funciona de 390 a 1440 px sin desbordes.

## US-CRO-S1-03 — Inicio público

Como visitante de Cromoverso, quiero ver los seis mundos del álbum con sus totales y las cuatro rarezas para conocer el álbum sin tener que crear una cuenta.

1. La vista muestra los seis mundos del álbum con sus totales y las cuatro rarezas, con datos de `GET /mundos` y `GET /rarezas`.
2. Los botones y enlaces llevan a Catálogo de un mundo, Iniciar sesión y Crear cuenta.
3. Ningún dato del catálogo está escrito a mano en el código.
4. La vista se ve igual que en Figma en web y móvil: tipografía, colores y espaciado.
5. Referencia: Figma, bloque «Sprint 1», columna «1 · Inicio público» (web y móvil).

**Aclaración para esta entrega:** aunque el criterio textual menciona las cuatro rarezas,
se prioriza la captura de Figma compartida y no se muestra esa lista en Inicio. El endpoint
sigue consultándose y las rarezas aparecen en el catálogo.

## US-CRO-S1-04 — Catálogo de un mundo

Como visitante de Cromoverso, quiero ver los 20 cromos del mundo, con filtros por rareza y por tipo, para encontrar los cromos que me interesan.

1. La vista muestra el nombre y el rango del mundo, la navegación entre los seis mundos, los totales por rareza y tipo, y sus 20 cromos ordenados por número. Los datos vienen de `GET /mundos`, `GET /mundos/:id`, `GET /cromos` y `GET /rarezas`.
2. Los filtros viven en la URL (por ejemplo, `?rareza=legendaria&tipo=villano`) y se conservan al recargar o compartir el enlace.
3. Las tarjetas muestran nombre, mundo, tipo e ilustración; cada elemento enlaza a la ruta de su detalle (vista 3, planificada para Sprint 2). La rareza siempre se muestra con su icono y su palabra (`GET /rarezas`).
4. La vista se ve igual que en Figma en web y móvil.
5. Referencia: Figma, bloque «Sprint 1», columna «2 · Catálogo de un mundo» (web y móvil).

## US-CRO-S1-05 — Cambiar el idioma entre español e inglés

Como visitante de Cromoverso, quiero ver toda la interfaz en español o en inglés para usar el sitio en el idioma que prefiero.

1. Todos los textos de la interfaz salen de `GET /textos?idioma=es` o `GET /textos?idioma=en`. Ningún texto queda escrito dentro de un componente.
2. El selector ES | EN está en la navegación y en el menú móvil, y cambia el idioma de toda la vista.
3. El atributo `<html lang>` cambia con el idioma.
4. Si la persona aceptó las cookies, el idioma elegido se guarda en la cookie `idioma` y se recuerda en la próxima visita.
5. La interfaz en inglés no se rompe aunque los textos sean más largos. Los datos del catálogo no se traducen.

## US-CRO-S1-06 — Aceptar o rechazar las cookies

Como visitante de Cromoverso, quiero decidir si acepto las cookies en mi primera visita para controlar qué se guarda en mi navegador.

Alcance: aviso de cookies con aceptar y rechazar, sin panel de preferencias.

1. El aviso aparece en la primera visita, con los textos de `Cookies.banner` de `GET /textos`.
2. «Aceptar» y «Rechazar» tienen el mismo tamaño y el mismo peso visual.
3. La decisión se guarda en la cookie `consentimiento` y el aviso no vuelve a salir.
4. Si la persona rechaza, el sitio funciona igual, pero el idioma no se guarda en la cookie `idioma`.
5. Referencia: Figma, bloque «Sprint 1», «Aviso de cookies (primera visita)». En escritorio se muestra como aviso horizontal compacto; en móvil se adapta al ancho disponible. El aviso se puede usar con teclado.

## Decisión sobre el stack

La profesora indicó mantener React, JavaScript y Vite por razones de tiempo. Por tanto, se conserva la base actual y no se migra a Next.js ni TypeScript, aunque el criterio original de US-CRO-S1-01 los mencione.

La parte del criterio US-CRO-S1-01 relativa al stack se considera adaptada a esa indicación de la profesora. Se mantienen los demás objetivos del sprint que sean compatibles.
