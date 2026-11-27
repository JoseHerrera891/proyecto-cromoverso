// US-CRO-S2-02 · Estados de carga, vacío y error
import { clasesBoton } from "../utils/clasesBoton.js";
import Icono from "./Icono.jsx";
import "./Estados.css";

/**
 * Estado de error con botón para reintentar. El título sale de
 * textos.estados.error y el mensaje de textos.errores[codigo] de la API.
 */
// US-CRO-S2-02 · C3 y C4: error con «Reintentar»; texto de textos.estados y textos.errores[codigo].
export function EstadoError({
  textos,
  error,
  onReintentar,
  etiquetaTitulo: EtiquetaTitulo = "h2",
  className = "",
}) {
  const estados = textos?.estados?.error;
  const mensaje =
    (error?.codigo && textos?.errores?.[error.codigo]) || estados?.texto;
  return (
    <div className={`estado estado--error ${className}`} role="alert">
      <span className="estado-icono" aria-hidden="true">
        <Icono nombre="alerta" />
      </span>
      <EtiquetaTitulo className="estado-titulo">
        {estados?.titulo}
      </EtiquetaTitulo>
      <p className="estado-texto">{mensaje}</p>
      {onReintentar && (
        <button
          type="button"
          className={clasesBoton("primario", "m")}
          onClick={onReintentar}
        >
          {estados?.botones?.reintentar}
        </button>
      )}
    </div>
  );
}

/** Bloque gris animado que ocupa el lugar de un contenido que aún carga. */
// US-CRO-S2-02 · C1: bloque de esqueleto de carga.
export function Esqueleto({ className = "" }) {
  return <span className={`esqueleto ${className}`} aria-hidden="true" />;
}

/** Anuncia la carga a lectores de pantalla sin mostrar texto. */
export function AvisoCarga({ textos }) {
  return (
    <p className="solo-lector" role="status">
      {textos?.estados?.cargando}
    </p>
  );
}
