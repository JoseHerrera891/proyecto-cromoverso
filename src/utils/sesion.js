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
