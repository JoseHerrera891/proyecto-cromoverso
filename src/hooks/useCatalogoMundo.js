import { useEffect, useState } from "react";
import { crearUrlApi } from "../utils/api.js";

const TIEMPO_LIMITE = 12000;

export class ErrorHttp extends Error {
  constructor(status) {
    super(`Error HTTP ${status}.`);
    this.status = status;
  }
}

async function pedirJson(ruta, signal, fetcher) {
  const respuesta = await fetcher(crearUrlApi(ruta), { signal });
  if (!respuesta.ok) throw new ErrorHttp(respuesta.status);
  return respuesta.json();
}

const esTexto = (valor) => typeof valor === "string";

export function validarMundo(mundo, respuestaRarezas, respuestaMundos) {
  const rarezas = respuestaRarezas?.datos;
  const mundos = respuestaMundos?.datos;
  if (
    !esTexto(mundo?.id) ||
    !esTexto(mundo?.nombre) ||
    !Array.isArray(mundo.cromos) ||
    !Array.isArray(rarezas) ||
    !rarezas.every(({ id, nombre, icono } = {}) =>
      [id, nombre, icono].every(esTexto),
    ) ||
    !Array.isArray(mundos) ||
    !mundos.every(
      ({ id, nombre, totalCromos } = {}) =>
        [id, nombre].every(esTexto) && Number.isFinite(totalCromos),
    )
  ) {
    throw new Error("La respuesta del mundo no tiene el formato esperado.");
  }
  return { mundo, rarezas, mundos };
}

export function validarCromos(respuesta) {
  const cromos = respuesta?.datos;
  if (
    !Array.isArray(cromos) ||
    !cromos.every(({ id, nombre, rareza, tipo } = {}) =>
      [id, nombre, rareza, tipo].every(esTexto),
    )
  ) {
    throw new Error("La respuesta de cromos no tiene el formato esperado.");
  }
  return [...cromos].sort((a, b) => a.numero - b.numero);
}

/** GET /mundos/:id, GET /rarezas y GET /mundos (navegación entre mundos). */
export async function solicitarMundo(id, signal, fetcher = fetch) {
  const datos = await Promise.all(
    [`mundos/${encodeURIComponent(id)}`, "rarezas", "mundos"].map((ruta) =>
      pedirJson(ruta, signal, fetcher),
    ),
  );
  return validarMundo(...datos);
}

/** GET /cromos con los filtros de la URL. */
export async function solicitarCromos(id, filtros, signal, fetcher = fetch) {
  const parametros = new URLSearchParams({ mundo: id, porPagina: "100" });
  if (filtros.rareza) parametros.set("rareza", filtros.rareza);
  if (filtros.tipo) parametros.set("tipo", filtros.tipo);
  return validarCromos(
    await pedirJson(`cromos?${parametros}`, signal, fetcher),
  );
}

function usePeticion(solicitar, dependencias) {
  const [estado, setEstado] = useState({
    datos: null,
    cargando: true,
    error: null,
  });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!solicitar) return undefined;
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), TIEMPO_LIMITE);
    let vigente = true;
    // Conserva los datos anteriores mientras llegan los nuevos.
    setEstado((anterior) => ({ ...anterior, cargando: true, error: null }));
    solicitar(controlador.signal)
      .then((datos) => {
        if (vigente) setEstado({ datos, cargando: false, error: null });
      })
      .catch((error) => {
        if (!vigente) return;
        console.error("Error al cargar el catálogo:", error);
        setEstado((anterior) => ({ ...anterior, cargando: false, error }));
      })
      .finally(() => clearTimeout(limite));
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, intento, Boolean(solicitar)]);

  return { ...estado, recargar: () => setIntento((valor) => valor + 1) };
}

/**
 * Datos del catálogo de un mundo. El mundo se carga una vez por id y los
 * cromos se vuelven a pedir al cambiar los filtros, sin vaciar la vista.
 * Los filtros que no existen en la API se ignoran.
 */
export function useCatalogoMundo(id, filtros, tiposValidos = []) {
  const base = usePeticion((signal) => solicitarMundo(id, signal), [id]);
  const rareza = base.datos?.rarezas.some(({ id: r }) => r === filtros.rareza)
    ? filtros.rareza
    : "";
  const tipo = tiposValidos.includes(filtros.tipo) ? filtros.tipo : "";
  const listo = base.datos?.mundo.id === id;
  const cromos = usePeticion(
    listo ? (signal) => solicitarCromos(id, { rareza, tipo }, signal) : null,
    [id, rareza, tipo],
  );

  return {
    datos: listo ? base.datos : null,
    cromos: cromos.datos,
    filtros: { rareza, tipo },
    cargando: base.cargando,
    cargandoCromos: cromos.cargando,
    error: base.error ?? cromos.error,
    noEncontrado: base.error?.status === 404,
    recargar: () => {
      base.recargar();
      cromos.recargar();
    },
  };
}
