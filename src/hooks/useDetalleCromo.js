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

export function useDetalleCromo(id) {
  const [cromo, setCromo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setCromo(null);

    solicitarDetalleCromo(id, controlador.signal)
      .then((dato) => vigente && setCromo(dato))
      .catch((error) => {
        if (vigente) {
          console.error("Error al cargar el detalle del cromo:", error);
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
  }, [id, intento]);

  return {
    cromo,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
