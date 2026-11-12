import { useEffect, useState } from "react";
import { crearUrlApi } from "../utils/api.js";

export function validarDetalleCromo(cromo) {
  const camposTexto = [
    "id",
    "nombre",
    "mundo",
    "mundoNombre",
    "rareza",
    "tipo",
    "poder",
    "descripcion",
  ];
  if (
    !camposTexto.every(
      (campo) => typeof cromo?.[campo] === "string" && cromo[campo].trim(),
    ) ||
    !Number.isInteger(cromo.numero) ||
    !Number.isInteger(cromo.posicion) ||
    !cromo.atributos ||
    !Object.values(cromo.atributos).every(Number.isFinite)
  ) {
    throw new Error("La respuesta del cromo no tiene el formato esperado.");
  }
  return cromo;
}

export async function solicitarDetalleCromo(id, signal, fetcher = fetch) {
  const respuesta = await fetcher(
    crearUrlApi(`cromos/${encodeURIComponent(id)}`),
    { signal },
  );
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}.`);
  return validarDetalleCromo(await respuesta.json());
}

export function obtenerCromosAdyacentes(cromo, cromosMundo) {
  if (
    !Array.isArray(cromosMundo) ||
    !cromosMundo.every(
      ({ id, posicion } = {}) =>
        typeof id === "string" && Number.isInteger(posicion),
    )
  ) {
    throw new Error("La lista del mundo no tiene el formato esperado.");
  }
  const indice = cromosMundo.findIndex(({ id }) => id === cromo.id);
  if (indice < 0) {
    throw new Error("El cromo no aparece en la lista de su mundo.");
  }
  return {
    anterior: cromosMundo[indice - 1] ?? null,
    siguiente: cromosMundo[indice + 1] ?? null,
  };
}

export function validarRarezaCromo(rareza, rarezas) {
  if (
    !Array.isArray(rarezas) ||
    !rarezas.every(({ id, nombre, icono, color } = {}) =>
      [id, nombre, icono, color].every((valor) => typeof valor === "string"),
    )
  ) {
    throw new Error("La lista de rarezas no tiene el formato esperado.");
  }
  const resultado = rarezas.find(({ id }) => id === rareza);
  if (!resultado) throw new Error(`No se encontró la rareza ${rareza}.`);
  return resultado;
}

export function useDetalleCromo(id) {
  const [cromo, setCromo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setNoEncontrado(false);
    setCromo(null);

    solicitarDetalleCromo(id, controlador.signal)
      .then(async (dato) => {
        const [respuestaMundo, respuestaRarezas] = await Promise.all([
          fetch(crearUrlApi(`mundos/${encodeURIComponent(dato.mundo)}`), {
            signal: controlador.signal,
          }),
          fetch(crearUrlApi("rarezas"), { signal: controlador.signal }),
        ]);
        const fallo = [respuestaMundo, respuestaRarezas].find(
          (respuesta) => !respuesta.ok,
        );
        if (fallo) throw new Error(`Error HTTP ${fallo.status}.`);
        const [mundo, listaRarezas] = await Promise.all([
          respuestaMundo.json(),
          respuestaRarezas.json(),
        ]);
        return {
          ...dato,
          ...obtenerCromosAdyacentes(dato, mundo.cromos),
          datosRareza: validarRarezaCromo(dato.rareza, listaRarezas.datos),
        };
      })
      .then((dato) => vigente && setCromo(dato))
      .catch((error) => {
        if (vigente) {
          setError(true);
          if (error.message === "Error HTTP 404.") {
            setNoEncontrado(true);
          } else {
            console.error("Error al cargar el detalle del cromo:", error);
          }
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
  }, [id, intento]);

  return {
    cromo,
    cargando,
    error,
    noEncontrado,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
