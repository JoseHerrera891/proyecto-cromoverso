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
  constructor(
    status,
    codigo = null,
    { campos = null, reintentarEn = null } = {},
  ) {
    super(`Error HTTP ${status}.`);
    this.status = status;
    this.codigo = codigo;
    this.campos = campos;
    this.reintentarEn = reintentarEn;
  }
}

/** Segundos de la cabecera Retry-After (número o fecha HTTP). */
export function segundosDeEspera(valor, ahora = Date.now()) {
  if (!valor) return null;
  if (/^\d+$/.test(valor.trim())) return Number(valor);
  const fecha = Date.parse(valor);
  return Number.isNaN(fecha)
    ? null
    : Math.max(0, Math.ceil((fecha - ahora) / 1000));
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

/**
 * Petición a la API que devuelve JSON (o null en 204) o lanza ErrorHttp con
 * el código, los campos y la espera que indique la API. Con `conSesion` el
 * navegador envía la cookie httpOnly `sesion`; el token nunca pasa por aquí.
 */
export async function pedirJson(
  ruta,
  { signal, fetcher = fetch, metodo = "GET", cuerpo, conSesion = false } = {},
) {
  const respuesta = await fetcher(crearUrlApi(ruta), {
    method: metodo,
    signal,
    credentials: conSesion ? "include" : "same-origin",
    headers: {
      ...cabecerasDeSimulacion(),
      ...(cuerpo ? { "Content-Type": "application/json" } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!respuesta.ok) {
    const datos = await Promise.resolve()
      .then(() => respuesta.json())
      .catch(() => null);
    throw new ErrorHttp(respuesta.status, datos?.error?.codigo ?? null, {
      campos: datos?.error?.campos ?? null,
      reintentarEn: segundosDeEspera(respuesta.headers?.get?.("Retry-After")),
    });
  }
  return respuesta.status === 204 ? null : respuesta.json();
}
