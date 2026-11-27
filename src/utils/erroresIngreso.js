// US-CRO-S2-04 · Ver por qué no pude ingresar
import { ErrorHttp } from "./api.js";

const ESPERA_POR_DEFECTO = 30;

/**
 * Traduce un error de POST /sesion al aviso del formulario de ingreso.
 * - 401 credenciales_invalidas: un solo mensaje, sin decir qué campo falló.
 * - 422 validacion: mensajes junto a cada campo.
 * - 429 demasiadas_peticiones: bloqueo durante los segundos de Retry-After.
 * - Sin respuesta de la red: error de conexión con opción de reintentar.
 * - Otros: mensaje de textos.errores[codigo].
 */
export function avisoDeError(error, pagina, textos) {
  const errores = pagina.errores;

  if (!(error instanceof ErrorHttp)) {
    // US-CRO-S2-04 · C4: sin red → error de conexión con «Reintentar».
    return { tipo: "conexion", aviso: errores.conexion };
  }
  // US-CRO-S2-04 · C2: 401 credenciales_invalidas → un solo mensaje.
  if (error.status === 401) {
    return { tipo: "credenciales", aviso: errores.credenciales };
  }
  // US-CRO-S2-04 · C3: 429 demasiadas_peticiones → bloqueo con Retry-After.
  if (error.status === 429) {
    return {
      tipo: "bloqueo",
      aviso: errores.demasiadosIntentos,
      segundos: error.reintentarEn ?? ESPERA_POR_DEFECTO,
    };
  }
  // US-CRO-S2-03 · C3: 422 validacion → mensaje junto a cada campo.
  if (error.status === 422) {
    const campos = {};
    if (error.campos?.correo) campos.correo = error.campos.correo;
    if (error.campos?.clave) campos.clave = error.campos.clave;
    return {
      tipo: "campos",
      aviso: {
        titulo: errores.camposObligatorios.titulo,
        texto: textos?.errores?.validacion,
      },
      campos,
    };
  }
  return {
    tipo: "servidor",
    aviso: {
      titulo: textos?.estados?.error?.titulo,
      texto:
        textos?.errores?.[error.codigo] ??
        textos?.errores?.generico ??
        textos?.estados?.error?.texto,
    },
  };
}
