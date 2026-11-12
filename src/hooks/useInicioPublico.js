import { useEffect, useState } from "react";
import { crearUrlApi } from "../utils/api.js";

export function validarDatosInicio(respuestaMundos, respuestaRarezas) {
  const mundos = respuestaMundos?.datos;
  const rarezas = respuestaRarezas?.datos;
  if (
    !Array.isArray(mundos) ||
    mundos.length !== 6 ||
    !Number.isInteger(respuestaMundos?.totalAlbum) ||
    !mundos.every(
      ({ id, nombre, color, totalCromos } = {}) =>
        [id, nombre, color].every((valor) => typeof valor === "string") &&
        Number.isFinite(totalCromos),
    )
  ) {
    throw new Error("La respuesta de mundos no tiene el formato esperado.");
  }
  if (
    !Array.isArray(rarezas) ||
    rarezas.length !== 4 ||
    !rarezas.every(({ id, nombre, icono, color } = {}) =>
      [id, nombre, icono, color].every((valor) => typeof valor === "string"),
    )
  ) {
    throw new Error("La respuesta de rarezas no tiene el formato esperado.");
  }
  return { mundos, rarezas, totalAlbum: respuestaMundos.totalAlbum };
}

export async function solicitarDatosInicio(signal, fetcher = fetch) {
  const respuestas = await Promise.all(
    ["mundos", "rarezas"].map((ruta) => fetcher(crearUrlApi(ruta), { signal })),
  );
  const fallo = respuestas.find((respuesta) => !respuesta.ok);
  if (fallo) throw new Error(`Error HTTP ${fallo.status}.`);
  const datos = await Promise.all(
    respuestas.map((respuesta) => respuesta.json()),
  );
  return validarDatosInicio(...datos);
}

export function useInicioPublico() {
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

    solicitarDatosInicio(controlador.signal)
      .then(
        (nuevosDatos) => vigente && setDatos(nuevosDatos),
        (error) => {
          if (vigente) {
            console.error("Error al cargar el inicio público:", error);
            setError(true);
          }
        },
      )
      .finally(() => {
        clearTimeout(limite);
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [intento]);

  return {
    datos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
