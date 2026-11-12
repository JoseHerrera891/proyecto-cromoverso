import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icono from "./Icono.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import PanelAccesibilidad from "./PanelAccesibilidad.jsx";
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
  preferenciasAccesibilidad,
  onCambiarAccesibilidad,
  onRestablecerAccesibilidad,
}) {
  const [abierto, setAbierto] = useState(false);
  const [panelAccesibilidadAbierto, setPanelAccesibilidadAbierto] =
    useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const botonAccesibilidad = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const menuMovil = textos?.menuMovil;
  const estados = textos?.estados;
  const textosAccesibilidad = textos?.accesibilidad;
  const ingles = idioma === "en";
  const abrir = menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar = menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const cerrarPanelAccesibilidad = useCallback(
    () => setPanelAccesibilidadAbierto(false),
    [],
  );
  const cerrarAccesibilidad =
    textosAccesibilidad?.botones?.cerrar ??
    (ingles ? "Close accessibility options" : "Cerrar opciones de accesibilidad");
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );
  const enlacesMoviles = Object.entries(menuMovil?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && abierto && !panelAccesibilidadAbierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, panelAccesibilidadAbierto]);

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
          <Link
            className="navbar-marca"
            to={DESTINOS.inicio}
            aria-label={nav?.logo.aria ?? "Cromoverso"}
            onClick={() => setAbierto(false)}
          >
            <img src={LOGO} alt="" />
          </Link>

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
                      <Link
                        to={DESTINOS[clave]}
                        aria-current={activo === clave ? "page" : undefined}
                        onClick={() => setAbierto(false)}
                      >
                        {etiqueta}
                      </Link>
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
                  <Link className="navbar-ingresar" to="/ingresar">
                    {nav.botones.ingresar}
                  </Link>
                  <Link className="navbar-accion" to="/registro">
                    {nav.botones.crearCuenta}
                  </Link>
                </div>
              </>
            )}
            {menuMovil && (
              <>
                <ul className="navbar-enlaces navbar-enlaces-movil">
                  {enlacesMoviles.map(([clave, etiqueta]) => (
                    <li key={clave}>
                      <Link
                        to={DESTINOS[clave]}
                        aria-current={activo === clave ? "page" : undefined}
                        onClick={() => setAbierto(false)}
                      >
                        {etiqueta}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="navbar-cuenta navbar-cuenta-movil">
                  <Link className="navbar-ingresar" to="/ingresar">
                    {menuMovil.botones.ingresar}
                  </Link>
                  <Link className="navbar-accion" to="/registro">
                    {menuMovil.botones.crearCuenta}
                  </Link>
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
                ref={botonAccesibilidad}
                className="navbar-icono navbar-accesibilidad"
                type="button"
                aria-label={
                  textosAccesibilidad?.botones?.abrir ??
                  (ingles
                    ? "Open accessibility options"
                    : "Abrir opciones de accesibilidad")
                }
                aria-expanded={panelAccesibilidadAbierto}
                aria-haspopup="dialog"
                aria-controls="panel-accesibilidad"
                onClick={() => setPanelAccesibilidadAbierto(true)}
              >
                <Icono nombre="accesibilidad" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {panelAccesibilidadAbierto && textosAccesibilidad && (
        <PanelAccesibilidad
          id="panel-accesibilidad"
          textos={{
            ...textosAccesibilidad,
            botones: {
              ...textosAccesibilidad.botones,
              cerrar: cerrarAccesibilidad,
            },
          }}
          preferencias={preferenciasAccesibilidad}
          onCambiar={onCambiarAccesibilidad}
          onRestablecer={onRestablecerAccesibilidad}
          onCerrar={cerrarPanelAccesibilidad}
          botonAbrir={botonAccesibilidad}
        />
      )}
    </header>
  );
}
