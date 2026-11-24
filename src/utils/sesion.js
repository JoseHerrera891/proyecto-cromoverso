import { ErrorHttp, pedirJson } from "./api.js";

/**
 * GET /sesion. Devuelve el usuario si la cookie `sesion` sigue vigente o null
 * si la API responde 401 no_autenticado.
 */
export async function obtenerSesion(opciones = {}) {
  try {
    const datos = await pedirJson("sesion", { ...opciones, conSesion: true });
    return datos?.usuario ?? null;
  } catch (error) {
    if (error instanceof ErrorHttp && error.status === 401) return null;
    throw error;
  }
}

// «Mantener la sesión iniciada» desmarcado: se guarda solo una marca (nunca el
// token) para cerrar la sesión la próxima vez que se abra el navegador.
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

/** DELETE /sesion (204): la API borra la cookie `sesion`. */
export async function cerrarSesion(opciones = {}) {
  await pedirJson("sesion", { ...opciones, metodo: "DELETE", conSesion: true });
}

/**
 * POST /sesion. La API responde con el usuario y deja la cookie httpOnly
 * `sesion` en el navegador; del cuerpo solo se usa el usuario.
 */
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
  return datos.usuario;
}
