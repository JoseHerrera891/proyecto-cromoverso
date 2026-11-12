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
