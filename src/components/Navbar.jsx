import { useEffect, useRef, useState } from "react";
import Icono from "./Icono.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import "./Navbar.css";

const DESTINOS = {
  inicio: "/",
  album: "/album",
  sobres: "/sobres",
  intercambios: "/intercambios",
  mundos: "/mundos",
  ranking: "/ranking",
};

const LOGO =
  "https://yanethm-cromoverso-api.fly.dev/docs/diseno/logos/logo-normal.svg";

export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  activo,
  onBuscar,
  textoGrande,
  alternarTexto,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const menuMovil = textos?.menuMovil;
  const estados = textos?.estados;
  const opcionesTexto = textos?.accesibilidad?.tamanoTexto;
  const ingles = idioma === "en";
  const abrir = menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar = menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );
  const enlacesMoviles = Object.entries(menuMovil?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function abrirBusqueda() {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault();
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className="navbar">
      <nav className="navbar-interior">
        <div className="navbar-bar">
          <a
            className="navbar-marca"
            href={DESTINOS.inicio}
            aria-label={nav?.logo.aria ?? "Cromoverso"}
            onClick={() => setAbierto(false)}
          >
            <img src={LOGO} alt="" />
          </a>

          <div className="navbar-movil-acciones">
            <button
              type="button"
              className="navbar-icono"
              aria-label={nav?.buscador.aria ?? "Buscar"}
              disabled={!nav}
              onClick={abrirBusqueda}
            >
              <Icono nombre="buscar" />
            </button>
            <button
              ref={botonMenu}
              type="button"
              className="navbar-icono"
              aria-label={abierto ? cerrar : abrir}
              aria-expanded={abierto}
              aria-controls="navbar-panel"
              onClick={() => setAbierto((valor) => !valor)}
            >
              <Icono nombre={abierto ? "cerrar" : "menu"} />
            </button>
          </div>

          <div
            id="navbar-panel"
            className={`navbar-panel${abierto ? " is-abierto" : ""}`}
            aria-busy={cargando}
          >
            {cargando && (
              <p className="navbar-estado" role="status">
                {estados?.cargando ??
                  (ingles ? "Loading navigation…" : "Cargando navegación…")}
              </p>
            )}
            {error && (
              <div className="navbar-estado" role="alert">
                <p>
                  {estados?.error?.texto ??
                    (ingles
                      ? "Navigation could not be loaded."
                      : "No pudimos cargar el menú.")}
                </p>
                <button type="button" onClick={recargar}>
                  {estados?.error?.botones?.reintentar ??
                    (ingles ? "Try again" : "Reintentar")}
                </button>
              </div>
            )}
            {nav && (
              <>
                <ul className="navbar-enlaces navbar-enlaces-escritorio">
                  {enlaces.map(([clave, etiqueta]) => (
                    <li key={clave}>
                      <a
                        href={DESTINOS[clave]}
                        aria-current={activo === clave ? "page" : undefined}
                        onClick={() => setAbierto(false)}
                      >
                        {etiqueta}
                      </a>
                    </li>
                  ))}
                </ul>
                <form
                  className="navbar-buscador"
                  role="search"
                  aria-label={nav.buscador.aria}
                  onSubmit={buscar}
                >
                  <button type="submit" aria-label={nav.buscador.aria}>
                    <Icono nombre="buscar" />
                  </button>
                  <input
                    ref={campoBusqueda}
                    type="search"
                    value={busqueda}
                    onChange={(evento) => setBusqueda(evento.target.value)}
                    placeholder={nav.buscador.placeholder}
                    aria-label={nav.buscador.aria}
                    required
                  />
                </form>
                <div className="navbar-cuenta">
                  <a className="navbar-ingresar" href="/ingresar">
                    {nav.botones.ingresar}
                  </a>
                  <a className="navbar-accion" href="/registro">
                    {nav.botones.crearCuenta}
                  </a>
                </div>
              </>
            )}
            {menuMovil && (
              <>
                <ul className="navbar-enlaces navbar-enlaces-movil">
                  {enlacesMoviles.map(([clave, etiqueta]) => (
                    <li key={clave}>
                      <a
                        href={DESTINOS[clave]}
                        aria-current={activo === clave ? "page" : undefined}
                        onClick={() => setAbierto(false)}
                      >
                        {etiqueta}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="navbar-cuenta navbar-cuenta-movil">
                  <a className="navbar-ingresar" href="/ingresar">
                    {menuMovil.botones.ingresar}
                  </a>
                  <a className="navbar-accion" href="/registro">
                    {menuMovil.botones.crearCuenta}
                  </a>
                </div>
              </>
            )}
            <div className="navbar-utilidades">
              <LanguageSelector
                idioma={idioma}
                cambiarIdioma={cambiarIdioma}
                etiqueta={nav?.aria.idioma ?? "Cambiar idioma"}
              />
              <button
                className="navbar-icono navbar-accesibilidad"
                type="button"
                aria-label={`${opcionesTexto?.titulo ?? (ingles ? "Text size" : "Tamaño del texto")}: ${
                  textoGrande
                    ? (opcionesTexto?.opciones?.grande ??
                      (ingles ? "Large" : "Grande"))
                    : (opcionesTexto?.opciones?.normal ?? "Normal")
                }`}
                aria-pressed={textoGrande}
                onClick={alternarTexto}
              >
                <Icono nombre="accesibilidad" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
