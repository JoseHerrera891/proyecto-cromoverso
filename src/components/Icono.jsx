import "./Icono.css";

/*
 * Íconos del sistema de diseño (Figma · «Iconos» e «Imágenes para exportar»).
 * Cada ícono conserva el viewBox de Figma; el grosor del trazo es 1/12 del
 * lienzo, igual que en el diseño. El color sale de `currentColor`.
 */
const ICONOS = {
  buscar: {
    lienzo: 22,
    trazos: (
      <>
        <circle cx="10.08" cy="10.08" r="6.42" />
        <path d="m15.13 15.13 4.12 4.12" />
      </>
    ),
  },
  menu: {
    lienzo: 22,
    trazos: <path d="M3.67 6.42h14.66M3.67 11h14.66M3.67 15.58h14.66" />,
  },
  cerrar: { lienzo: 22, trazos: <path d="m5.5 5.5 11 11m0-11-11 11" /> },
  flechaIzq: {
    lienzo: 22,
    trazos: <path d="M17.42 11H4.58m5.5-5.5L4.58 11l5.5 5.5" />,
  },
  flechaDer: {
    lienzo: 18,
    trazos: <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" />,
  },
  chevronAbajo: { lienzo: 16, trazos: <path d="m4 6 4 4 4-4" /> },
  chevronDer: { lienzo: 16, trazos: <path d="m6 4 4 4-4 4" /> },
  chevronIzq: { lienzo: 16, trazos: <path d="m10 4-4 4 4 4" /> },
  inicio: {
    lienzo: 24,
    trazos: (
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    ),
  },
  mundo: {
    lienzo: 24,
    trazos: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M3 15c3-5 15-11 18-8" />
      </>
    ),
  },
  regalo: {
    lienzo: 20,
    trazos: (
      <>
        <rect x="2.5" y="6.67" width="15" height="4.17" rx="0.83" />
        <path d="M4.17 10.83v6.67h11.66v-6.67M10 6.67V17.5" />
        <path d="M10 6.67C8.33 3.33 5.42 3.75 6.25 5.67 6.83 6.67 10 6.67 10 6.67Zm0 0c1.67-3.34 4.58-2.92 3.75-1 -.58 1-3.75 1-3.75 1Z" />
      </>
    ),
  },
  album: {
    lienzo: 20,
    trazos: (
      <>
        <rect x="3.33" y="2.5" width="13.34" height="15" rx="1.67" />
        <path d="M7.5 2.5v15m3.33-10.83h3.34" />
      </>
    ),
  },
  destellos: {
    lienzo: 22,
    trazos: (
      <>
        <path d="m10.08 2.75 1.65 4.77 4.77 1.65-4.77 1.65-1.65 4.76-1.65-4.76-4.76-1.65 4.76-1.65 1.65-4.77Z" />
        <path d="m17.42 12.83.73 2.02 2.02.73-2.02.74-.73 2.01-.74-2.01-2.01-.74 2.01-.73.74-2.02Z" />
      </>
    ),
  },
  estrella: {
    lienzo: 22,
    trazos: (
      <path d="m11 2.57 2.57 5.31 5.86.83-4.21 4.12 1 5.78L11 15.86l-5.22 2.75 1-5.78-4.21-4.12 5.86-.83L11 2.57Z" />
    ),
  },
  alerta: {
    lienzo: 20,
    trazos: (
      <>
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 6.25v4.58m0 2.92v.01" />
      </>
    ),
  },
  rayo: {
    lienzo: 22,
    trazos: (
      <path d="M11.92 1.83 3.67 12.83h6.41l-.91 7.34 8.25-11H11l.92-7.34Z" />
    ),
  },
  accesibilidad: {
    lienzo: 20,
    trazos: (
      <>
        <circle cx="10" cy="3.75" r="1.5" />
        <path d="M4 7.5h12M10 7.5v5m0 0-2.5 4.5m2.5-4.5 2.5 4.5" />
      </>
    ),
  },
  "rareza-circulo": {
    lienzo: 14,
    trazos: <circle cx="7" cy="7" r="4.5" />,
  },
  "rareza-rombo": {
    lienzo: 14,
    relleno: true,
    trazos: <path d="m7 1.75 4.5 5.25L7 12.25 2.5 7 7 1.75Z" />,
  },
  "rareza-estrella": {
    lienzo: 14,
    relleno: true,
    trazos: (
      <path d="m7 1.6 1.65 3.4 3.75.52-2.7 2.63.64 3.7L7 10.1l-3.34 1.75.64-3.7-2.7-2.63 3.75-.52L7 1.6Z" />
    ),
  },
  "rareza-corona": {
    lienzo: 14,
    relleno: true,
    trazos: (
      <path d="M1.75 4.67 4.08 7 7 2.92 9.92 7l2.33-2.33-1.16 5.25H2.91L1.75 4.67ZM2.92 11.67h8.16" />
    ),
  },
};

const ALIAS = { volver: "flechaIzq", destello: "destellos" };

export default function Icono({ nombre, className = "" }) {
  const icono = ICONOS[ALIAS[nombre] ?? nombre];
  if (!icono) return null;
  const { lienzo, trazos, relleno = false } = icono;

  return (
    <svg
      className={["icono", `icono--${nombre}`, className]
        .filter(Boolean)
        .join(" ")}
      viewBox={`0 0 ${lienzo} ${lienzo}`}
      fill={relleno ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={relleno ? lienzo / 16 : lienzo / 12}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {trazos}
    </svg>
  );
}
