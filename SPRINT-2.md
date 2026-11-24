# Sprint 2 — Cromoverso

Detalle, ingreso y sesión. Criterios transcritos del tablero del curso.

## US-CRO-S2-01 — Detalle de un cromo

Ruta `/cromos/:id`. Se abre como ventana sobre el catálogo del mundo (web) y como hoja inferior (móvil).

1. Rareza con icono y palabra, tipo, atributos en barras, poder y descripción (`GET /cromos/:id`).
2. Título y descripción de la pestaña a partir de `nombre` y `poder`.
3. Si el cromo no existe (404 `no_encontrado`) se muestra la página de no encontrado.
4. La carta se dibuja con SVG a partir de `ilustracion.colorBase` e `ilustracion.figura`.
5. Figma: bloque «Sprint 2», columna «3 · Detalle de un cromo».

## US-CRO-S2-02 — Estados de carga, vacío y error

Vistas 2 (catálogo) y 3 (detalle).

1. Mientras cargan: esqueletos con la forma de la vista.
2. Sin resultados: estado vacío. Ejemplo: `/mundos/neon?rareza=legendaria&tipo=aliado`.
3. Si la API falla: estado de error con botón «Reintentar».
4. Los mensajes salen de `textos.estados` y `textos.errores` (según el `codigo` de la API).
5. Para probarlos se agregan a la URL de la página los parámetros que envían las cabeceras de prueba de la API:
   - `?simularLatencia=2000` → `X-Simular-Latencia: 2000`
   - `?simularError=503` → `X-Simular-Error: 503`

## US-CRO-S2-03 — Iniciar sesión

Ruta `/ingresar` (`POST /sesion`).

1. Correo y contraseña con etiquetas visibles asociadas a cada campo.
2. El botón del ojo muestra y oculta la contraseña y anuncia su estado (`aria-pressed`).
3. Si falta un dato, el mensaje aparece junto al campo y el foco va al primer campo con error.
4. Cuenta de prueba: `laura@cromoverso.test` / `cromos2026`. Al ingresar vuelve al inicio con la sesión iniciada.
5. Enlaces a «Crea una cuenta» y «¿Olvidaste tu contraseña?».

## US-CRO-S2-04 — Ver por qué no pude ingresar

1. Mientras se envía, el botón muestra «Ingresando…» y no se puede enviar dos veces.
2. 401 `credenciales_invalidas`: un solo mensaje, sin decir qué campo falló.
3. 429 `demasiadas_peticiones`: el formulario se bloquea durante los segundos de `Retry-After` (se prueba con un correo inventado y varios intentos).
4. Sin red: error de conexión con botón «Reintentar»; lo escrito se conserva.

## US-CRO-S2-05 — Mantener la sesión y cerrarla

1. La sesión vive en la cookie httpOnly `sesion` que crea la API; el frontend la envía con `credentials: "include"`. El token nunca se guarda en JavaScript ni en `localStorage`.
2. Con sesión, la navegación muestra el avatar y el menú de cuenta (nombre y correo); sin sesión, «Ingresar» y «Crear cuenta». Se consulta con `GET /sesion` al cargar la página.
3. «Cerrar sesión» llama a `DELETE /sesion` y vuelve al inicio como visitante.
4. Si la sesión vence (401 `no_autenticado`), al volver a la pestaña se lleva a la persona a ingresar.
5. «Mantener la sesión iniciada» desmarcado: la sesión se cierra la próxima vez que se abre el navegador (solo se guarda una marca de preferencia, no el token).

## Decisiones

- La vista de ingreso usa su propio diseño a pantalla completa (Figma), sin la barra ni el pie del sitio; el logo enlaza al inicio.
- Se mantiene React + Vite (indicación de la profesora): `loading.tsx`, `error.tsx`, `generateMetadata` y `notFound()` se implementan con componentes de estado, `useTituloDocumento` y la página de no encontrado.
