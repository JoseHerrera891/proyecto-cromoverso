// US-CRO-S2-01 · Detalle de un cromo
import { useEffect } from "react";

/** Título de la pestaña y meta descripción desde los textos SEO de la API. */
export function useTituloDocumento(titulo, descripcion) {
  useEffect(() => {
    if (titulo) document.title = titulo;
    if (descripcion) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", descripcion);
    }
  }, [titulo, descripcion]);
}
