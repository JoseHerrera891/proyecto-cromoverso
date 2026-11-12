import "./Icono.css";

const TRAZOS = {
  buscar: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </>
  ),
  cerrar: <path d="m6 6 12 12M6 18 18 6" />,
  volver: <path d="m15 18-6-6 6-6M9 12h12" />,
  regalo: (
    <>
      <path d="M20 8H4c-.6 0-1 .4-1 1v3h18V9c0-.6-.4-1-1-1Z" />
      <path d="M5 12v9h14v-9M12 8v13M12 8c-2-4-5.5-3.5-4.5-1.2C8.2 8 12 8 12 8Zm0 0c2-4 5.5-3.5 4.5-1.2C15.8 8 12 8 12 8Z" />
    </>
  ),
  album: (
    <>
      <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M9 3v18m4-13h4" />
    </>
  ),
  destello: (
    <>
      <path d="m11 3 1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8L11 3Z" />
      <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" />
    </>
  ),
  estrella: (
    <path
      d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1 2.9-6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  "rareza-circulo": (
    <circle cx="12" cy="12" r="8" fill="currentColor" stroke="none" />
  ),
  "rareza-rombo": (
    <path d="m12 3 9 9-9 9-9-9 9-9Z" fill="currentColor" stroke="none" />
  ),
  "rareza-estrella": (
    <path
      d="m12 2.5 2.9 6 6.6 1-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-1 2.9-6Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  "rareza-corona": (
    <path
      d="M3 19h18M4.5 16 3 7l5 4 4-7 4 7 5-4-1.5 9h-15Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  favoritos: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  idioma: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z" />
    </>
  ),
  accesibilidad: (
    <>
      <circle cx="12" cy="4" r="2" />
      <path d="M4 8h16M12 6v8m0 0-4 7m4-7 4 7" />
    </>
  ),
};

export default function Icono({ nombre }) {
  return (
    <svg
      className={`icono icono--${nombre}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
