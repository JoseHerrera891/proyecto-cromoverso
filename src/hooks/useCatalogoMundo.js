import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { crearUrlApi } from "../utils/api.js";

export function validarDatosCatalogo(mundo, respuestaCromos, respuestaRarezas) {
  const cromos = respuestaCromos?.datos;
  const rarezas = respuestaRarezas?.datos;
  if (
    typeof mundo?.id !== "string" ||
    typeof mundo?.nombre !== "string" ||
    !Array.isArray(cromos) ||
    !Array.isArray(rarezas) ||
    !cromos.every(({ id, nombre, rareza, tipo } = {}) =>
      [id, nombre, rareza, tipo].every((valor) => typeof valor === "string"),
    ) ||
    !rarezas.every(({ id, nombre, icono, color } = {}) =>
      [id, nombre, icono, color].every((valor) => typeof valor === "string"),
    )
  ) {
    throw new Error("La respuesta del catálogo no tiene el formato esperado.");
  }
  return { mundo, cromos, rarezas, paginacion: respuestaCromos.paginacion };
}

export async function solicitarDatosCatalogo(
  id,
  filtros,
  signal,
  fetcher = fetch,
) {
  const parametros = new URLSearchParams({ mundo: id });
  if (filtros.rareza) parametros.set("rareza", filtros.rareza);
  if (filtros.tipo) parametros.set("tipo", filtros.tipo);
  const rutas = [
    `mundos/${encodeURIComponent(id)}`,
    `cromos?${parametros}`,
    "rarezas",
  ];
  const respuestas = await Promise.all(
    rutas.map((ruta) => fetcher(crearUrlApi(ruta), { signal })),
  );
  const fallo = respuestas.find((respuesta) => !respuesta.ok);
  if (fallo) throw new Error(`Error HTTP ${fallo.status}.`);
  const [mundo, cromos, rarezas] = await Promise.all(
    respuestas.map((respuesta) => respuesta.json()),
  );
  return validarDatosCatalogo(mundo, cromos, rarezas);
}

export function useCatalogoMundo(id) {
  const [searchParams] = useSearchParams();
  const rareza = searchParams.get("rareza") ?? "";
  const tipo = searchParams.get("tipo") ?? "";
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setDatos(null);
    solicitarDatosCatalogo(id, { rareza, tipo }, controlador.signal)
      .then((nuevosDatos) => vigente && setDatos(nuevosDatos))
      .catch((error) => {
        if (vigente) {
          console.error("Error al cargar el catálogo del mundo:", error);
          setError(true);
        }
      })
      .finally(() => {
        clearTimeout(limite);
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [id, rareza, tipo, intento]);

  return {
    datos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
