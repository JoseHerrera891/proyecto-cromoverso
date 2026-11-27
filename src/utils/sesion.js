// US-CRO-S2-03 · Iniciar sesión
// US-CRO-S2-05 · Mantener la sesión y cerrarla
import { ErrorHttp, pedirJson } from "./api.js";

/**
 * GET /sesion. Devuelve el usuario si la cookie `sesion` sigue vigente o null
 * si la API responde 401 no_autenticado.
 */
// US-CRO-S2-05 · C2 y C4: GET /sesion; 401 no_autenticado → sin sesión.
export async function obtenerSesion(opciones = {}) {
  try {
    const datos = await pedirJson("sesion", { ...opciones, conSesion: true });
    marcarHuboSesion(Boolean(datos?.usuario));
    return datos?.usuario ?? null;
  } catch (error) {
    if (error instanceof ErrorHttp && error.status === 401) {
      marcarHuboSesion(false);
      return null;
    }
    throw error;
  }
}

// «Mantener la sesión iniciada» desmarcado: se guarda solo una marca (nunca el
// token) para cerrar la sesión la próxima vez que se abra el navegador.
// US-CRO-S2-05 · C5: solo marcas de preferencia, nunca el token.
const MARCA_CERRAR = "cromoverso.cerrarSesionAlSalir";
const MARCA_ABIERTA = "cromoverso.navegadorAbierto";

function guardar(almacen, clave, valor) {
  try {
    if (valor) almacen?.setItem(clave, "1");
    else almacen?.removeItem(clave);
  } catch {
    // Almacenamiento bloqueado: la sesión se mantiene como siempre.
  }
}

function leer(almacen, clave) {
  try {
    return almacen?.getItem(clave) === "1";
  } catch {
    return false;
  }
}

// Marca (no el token) de que en este navegador se inició sesión: evita
// consultar GET /sesion, y su 401, a quien nunca ingresó.
// US-CRO-S2-05 · C1: marca sin token para no consultar la sesión a visitantes.
const MARCA_HUBO_SESION = "cromoverso.huboSesion";

export function marcarHuboSesion(hubo, local = globalThis.localStorage) {
  guardar(local, MARCA_HUBO_SESION, hubo);
}

export function puedeHaberSesion(local = globalThis.localStorage) {
  return leer(local, MARCA_HUBO_SESION);
}

export function recordarPreferenciaDeSesion(
  mantener,
  local = globalThis.localStorage,
  pestana = globalThis.sessionStorage,
) {
  guardar(local, MARCA_CERRAR, !mantener);
  guardar(pestana, MARCA_ABIERTA, true);
}

/** true si la sesión era temporal y el navegador se volvió a abrir. */
export function debeCerrarSesionAlIniciar(
  local = globalThis.localStorage,
  pestana = globalThis.sessionStorage,
) {
  const cerrar = leer(local, MARCA_CERRAR) && !leer(pestana, MARCA_ABIERTA);
  guardar(pestana, MARCA_ABIERTA, true);
  if (cerrar) guardar(local, MARCA_CERRAR, false);
  return cerrar;
}

// US-CRO-S2-05 · C3: «Cerrar sesión» llama a DELETE /sesion.
/** DELETE /sesion (204): la API borra la cookie `sesion`. */
export async function cerrarSesion(opciones = {}) {
  try {
    await pedirJson("sesion", {
      ...opciones,
      metodo: "DELETE",
      conSesion: true,
    });
  } finally {
    marcarHuboSesion(false);
  }
}

/**
 * POST /sesion. La API responde con el usuario y deja la cookie httpOnly
 * `sesion` en el navegador; del cuerpo solo se usa el usuario.
 */
// US-CRO-S2-03 · C4: POST /sesion con { correo, clave }.
export async function iniciarSesion({ correo, clave }, opciones = {}) {
  const datos = await pedirJson("sesion", {
    ...opciones,
    metodo: "POST",
    cuerpo: { correo, clave },
    conSesion: true,
  });
  if (typeof datos?.usuario?.nombre !== "string") {
    throw new Error("La respuesta de la sesión no tiene el formato esperado.");
  }
  marcarHuboSesion(true);
  return datos.usuario;
}
