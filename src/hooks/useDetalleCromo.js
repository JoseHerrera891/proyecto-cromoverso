import { useEffect, useState } from "react";
import { pedirJson as pedirApi } from "../utils/api.js";

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
    typeof cromo.holografico !== "boolean" ||
    typeof cromo.ilustracion?.colorBase !== "string" ||
    typeof cromo.ilustracion?.figura !== "string" ||
    !cromo.atributos ||
    !Object.values(cromo.atributos).every(Number.isFinite)
  ) {
    throw new Error("La respuesta del cromo no tiene el formato esperado.");
  }
  return cromo;
}

const pedirJson = (ruta, signal, fetcher) =>
  pedirApi(ruta, { signal, fetcher });

export async function solicitarDetalleCromo(id, signal, fetcher = fetch) {
  return validarDetalleCromo(
    await pedirJson(`cromos/${encodeURIComponent(id)}`, signal, fetcher),
  );
}

/** GET /cromos/:id y, con su mundo, GET /mundos/:id (vecinos) y GET /rarezas. */
export async function solicitarDetalleCompleto(id, signal, fetcher = fetch) {
  const cromo = await solicitarDetalleCromo(id, signal, fetcher);
  const [mundo, rarezas] = await Promise.all([
    pedirJson(`mundos/${encodeURIComponent(cromo.mundo)}`, signal, fetcher),
    pedirJson("rarezas", signal, fetcher),
  ]);
  return {
    ...cromo,
    ...obtenerCromosAdyacentes(cromo, mundo.cromos),
    datosRareza: validarRarezaCromo(cromo.rareza, rarezas.datos),
  };
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

/**
 * Detalle de un cromo. Al pasar al cromo anterior o siguiente se conserva el
 * actual en pantalla hasta que llega el nuevo.
 */
export function useDetalleCromo(id) {
  const [estado, setEstado] = useState({ cromo: null, error: null });
  const [intento, setIntento] = useState(0);
  const cargando =
    !estado.error && estado.cromo?.id?.toUpperCase() !== id.toUpperCase();

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setEstado((anterior) => ({ ...anterior, error: null }));

    solicitarDetalleCompleto(id, controlador.signal)
      .then((cromo) => vigente && setEstado({ cromo, error: null }))
      .catch((error) => {
        if (!vigente) return;
        if (error.status !== 404) {
          console.error("Error al cargar el detalle del cromo:", error);
        }
        setEstado((anterior) => ({ ...anterior, error }));
      })
      .finally(() => clearTimeout(limite));

    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [id, intento]);

  return {
    cromo: estado.cromo,
    cargando,
    error: Boolean(estado.error),
    noEncontrado: estado.error?.status === 404,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
