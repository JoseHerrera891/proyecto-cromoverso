import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { crearUrlApi } from "../utils/api.js";

/** /mundos lleva al catálogo del primer mundo que entrega GET /mundos. */
export default function PrimerMundo({ textos }) {
  const [destino, setDestino] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controlador = new AbortController();
    fetch(crearUrlApi("mundos"), { signal: controlador.signal })
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}.`);
        return respuesta.json();
      })
      .then(({ datos }) => {
        if (!datos?.[0]?.id) throw new Error("Sin mundos.");
        setDestino(`/mundos/${encodeURIComponent(datos[0].id)}`);
      })
      .catch((causa) => {
        if (causa.name !== "AbortError") setError(true);
      });
    return () => controlador.abort();
  }, []);

  if (destino) return <Navigate to={destino} replace />;
  return (
    <p className="catalogo-estado" role={error ? "alert" : "status"}>
      {error ? textos?.estados?.error?.texto : textos?.estados?.cargando}
    </p>
  );
}
