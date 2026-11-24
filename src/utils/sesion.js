import { pedirJson } from "./api.js";

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
