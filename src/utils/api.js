export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(
  /\/+$/,
  "",
);

export function crearUrlApi(recurso) {
  if (!API_BASE_URL) {
    throw new Error("Falta configurar la variable VITE_API_BASE_URL.");
  }
  return `${API_BASE_URL}/${recurso.replace(/^\/+/, "")}`;
}

/** Error de la API con su código HTTP y el `codigo` de su cuerpo. */
export class ErrorHttp extends Error {
  constructor(status, codigo = null) {
    super(`Error HTTP ${status}.`);
    this.status = status;
    this.codigo = codigo;
  }
}

/**
 * Cabeceras de prueba de la API (X-Simular-Latencia, X-Simular-Error) que se
 * activan con ?simularLatencia=2000 o ?simularError=503 en la página.
 */
export function cabecerasDeSimulacion(busqueda = globalThis.location?.search) {
  const parametros = new URLSearchParams(busqueda ?? "");
  const cabeceras = {};
  const latencia = parametros.get("simularLatencia");
  const error = parametros.get("simularError");
  if (/^\d+$/.test(latencia ?? "")) cabeceras["X-Simular-Latencia"] = latencia;
  if (/^(500|503|504)$/.test(error ?? "")) cabeceras["X-Simular-Error"] = error;
  return cabeceras;
}

/** GET a la API que devuelve JSON o lanza ErrorHttp con el código de error. */
export async function pedirJson(ruta, { signal, fetcher = fetch } = {}) {
  const respuesta = await fetcher(crearUrlApi(ruta), {
    signal,
    headers: cabecerasDeSimulacion(),
  });
  if (!respuesta.ok) {
    const cuerpo = await Promise.resolve()
      .then(() => respuesta.json())
      .catch(() => null);
    throw new ErrorHttp(respuesta.status, cuerpo?.error?.codigo ?? null);
  }
  return respuesta.json();
}
