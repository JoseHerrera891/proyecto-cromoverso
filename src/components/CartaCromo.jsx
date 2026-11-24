import { arteDeCromo } from "../utils/arteCromos.js";
import { FIGURAS } from "../utils/figuras.jsx";
import Icono from "./Icono.jsx";
import "./CartaCromo.css";

// Rayos del fondo del arte: estrella de 12 puntas centrada en el lienzo.
const RAYOS = Array.from({ length: 24 }, (_, i) => {
  const angulo = (Math.PI * i) / 12;
  const radio = i % 2 === 0 ? 220 : 150;
  return `${112 + radio * Math.sin(angulo)},${128 - radio * Math.cos(angulo)}`;
}).join(" ");

/** Arte dibujado con las mismas formas del cromo en Figma. */
export function ArteSvg({ ilustracion }) {
  const figura = FIGURAS[ilustracion?.figura] ?? FIGURAS.estrella;
  return (
    <svg
      className="carta-cromo-svg"
      viewBox="0 0 224 270"
      preserveAspectRatio="xMidYMid slice"
      style={{ "--color-base": ilustracion?.colorBase }}
      aria-hidden="true"
      focusable="false"
    >
      <rect className="carta-cromo-svg-fondo" width="224" height="270" />
      <polygon className="carta-cromo-svg-rayos" points={RAYOS} />
      <circle className="carta-cromo-svg-halo" cx="112" cy="121" r="78" />
      <path
        className="carta-cromo-svg-silueta"
        d="M38 241a62 62 0 0 1 62-62h24a62 62 0 0 1 62 62v31H38Z"
      />
      <circle className="carta-cromo-svg-silueta" cx="112" cy="153" r="34" />
      <rect
        className="carta-cromo-svg-antifaz"
        x="83"
        y="143"
        width="58"
        height="15"
        rx="7.4"
      />
      <g
        className="carta-cromo-svg-emblema"
        transform="translate(95 200) scale(0.34)"
      >
        {figura}
      </g>
    </svg>
  );
}

/**
 * Cromo del álbum (Figma · «Cromo»). La rareza se muestra con su icono y su
 * nombre queda disponible para lectores de pantalla.
 */
export default function CartaCromo({
  cromo,
  rareza,
  detalle,
  mostrarDetalle = true,
  etiquetaNombre: EtiquetaNombre = "h3",
  className = "",
}) {
  const arte = arteDeCromo(cromo.id);
  const clases = [
    "carta-cromo",
    cromo.holografico ? "carta-cromo--holografica" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={clases}>
      <div className="carta-cromo-marco">
        <div className="carta-cromo-arte">
          {arte ? (
            <img src={arte.src} srcSet={arte.srcSet} alt="" loading="lazy" />
          ) : (
            <ArteSvg ilustracion={cromo.ilustracion} />
          )}
          <span className="carta-cromo-numero">
            {String(cromo.numero).padStart(3, "0")}
          </span>
          {rareza && (
            <span
              className={`carta-cromo-rareza carta-cromo-rareza--${rareza.id}`}
            >
              <Icono nombre={`rareza-${rareza.icono}`} />
              <span className="solo-lector">{rareza.nombre}</span>
            </span>
          )}
        </div>
        <div className="carta-cromo-pie">
          <EtiquetaNombre className="carta-cromo-nombre">
            {cromo.nombre}
          </EtiquetaNombre>
          {mostrarDetalle && detalle && (
            <p className="carta-cromo-detalle">{detalle}</p>
          )}
        </div>
      </div>
    </article>
  );
}
