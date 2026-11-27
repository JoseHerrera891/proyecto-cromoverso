// US-CRO-S1-05 · Cambiar el idioma entre español e inglés
// US-CRO-S1-06 · Aceptar o rechazar las cookies
export const COOKIE_CONSENTIMIENTO = "consentimiento";
export const COOKIE_IDIOMA = "idioma";
const UN_ANIO = 60 * 60 * 24 * 365;
const IDIOMAS = ["es", "en"];

export function leerCookie(nombre, cadena = document.cookie) {
  const prefijo = `${nombre}=`;
  return cadena
    .split("; ")
    .find((valor) => valor.startsWith(prefijo))
    ?.slice(prefijo.length);
}

function escribirCookie(nombre, valor, duracion = UN_ANIO) {
  document.cookie = `${nombre}=${valor}; Max-Age=${duracion}; Path=/; SameSite=Lax`;
}

export function aceptoCookies(cadena = document.cookie) {
  return leerCookie(COOKIE_CONSENTIMIENTO, cadena) === "aceptado";
}

export function decidioCookies(cadena = document.cookie) {
  return Boolean(leerCookie(COOKIE_CONSENTIMIENTO, cadena));
}

/** El idioma guardado solo se usa si la persona aceptó las cookies. */
export function idiomaGuardado(cadena = document.cookie) {
  const idioma = leerCookie(COOKIE_IDIOMA, cadena);
  return aceptoCookies(cadena) && IDIOMAS.includes(idioma) ? idioma : "es";
}

/** Guarda la decisión; si rechaza, borra la cookie de idioma. */
export function guardarConsentimiento(valor, idioma) {
  escribirCookie(COOKIE_CONSENTIMIENTO, valor);
  if (valor === "aceptado") escribirCookie(COOKIE_IDIOMA, idioma);
  else escribirCookie(COOKIE_IDIOMA, "", 0);
}

/** Recuerda el idioma solo con consentimiento. */
// US-CRO-S1-05 · C4: el idioma se guarda en la cookie solo si aceptó las cookies.
export function recordarIdioma(idioma) {
  if (aceptoCookies()) escribirCookie(COOKIE_IDIOMA, idioma);
}
