import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { clasesBoton } from "../utils/clasesBoton.js";
import Icono from "./Icono.jsx";
import LanguageSelector from "./LanguageSelector.jsx";
import PanelAccesibilidad from "./PanelAccesibilidad.jsx";
import "./Navbar.css";

// Rutas de las vistas del curso. Los textos de cada enlace vienen de la API.
const DESTINOS = {
  inicio: "/",
  mundos: "/mundos",
};
const ICONOS_ENLACE = { inicio: "inicio", mundos: "mundo" };
const LOGO_NORMAL = "/marca/logo-normal.svg";
const LOGO_INVERSO = "/marca/logo-inverso.svg";

function MenuMovil({
  textos,
  idioma,
  cambiarIdioma,
  activo,
  onCerrar,
  onAbrirAccesibilidad,
}) {
  const menu = useRef(null);
  const nav = textos?.navbar;
  const menuMovil = textos?.menuMovil;
  const enlaces = Object.entries(menuMovil?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  useEffect(() => {
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector("button")?.focus();

    function gestionarTeclado(evento) {
      if (evento.key === "Escape") {
        onCerrar();
        return;
      }
      if (evento.key !== "Tab") return;
      const enfocables = [...menu.current.querySelectorAll("a, button")];
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", gestionarTeclado);
    return () => {
      document.removeEventListener("keydown", gestionarTeclado);
      document.body.style.overflow = overflowAnterior;
    };
  }, [onCerrar]);

  return (
    <div
      ref={menu}
      id="menu-movil"
      className="menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label={menuMovil?.abrir}
    >
      <div className="menu-movil-encabezado">
        <Link
          className="navbar-marca"
          to={DESTINOS.inicio}
          aria-label={nav?.logo?.aria}
          onClick={onCerrar}
        >
          <img src={LOGO_NORMAL} alt="" />
        </Link>
        <button
          type="button"
          className="navbar-icono"
          aria-label={menuMovil?.cerrar}
          onClick={onCerrar}
        >
          <Icono nombre="cerrar" />
        </button>
      </div>

      <nav aria-label={menuMovil?.abrir}>
        <ul className="menu-movil-enlaces">
          {enlaces.map(([clave, etiqueta]) => {
            const actual = activo === clave;
            return (
              <li key={clave}>
                <Link
                  to={DESTINOS[clave]}
                  aria-current={actual ? "page" : undefined}
                  onClick={onCerrar}
                >
                  <Icono nombre={ICONOS_ENLACE[clave]} />
                  <span className="menu-movil-enlace-texto">{etiqueta}</span>
                  {actual ? (
                    <span className="menu-movil-aqui">
                      {menuMovil?.aria?.estasAqui}
                    </span>
                  ) : (
                    <Icono nombre="chevronDer" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="menu-movil-ajustes">
        <div className="menu-movil-fila">
          <span>{menuMovil?.secciones?.idioma}</span>
          <LanguageSelector
            idioma={idioma}
            cambiarIdioma={cambiarIdioma}
            etiqueta={nav?.aria?.idioma}
            codigos={textos?.idioma?.codigos}
            nombres={textos?.idioma?.opciones}
          />
        </div>
        <div className="menu-movil-fila">
          <span>{menuMovil?.secciones?.accesibilidad}</span>
          <button
            type="button"
            className="navbar-icono navbar-icono--borde"
            aria-label={nav?.aria?.accesibilidad}
            aria-haspopup="dialog"
            onClick={onAbrirAccesibilidad}
          >
            <Icono nombre="accesibilidad" />
          </button>
        </div>
      </div>

      <div className="menu-movil-sesion">
        <Link
          className={clasesBoton("secundario", "m")}
          to="/ingresar"
          onClick={onCerrar}
        >
          {menuMovil?.botones?.ingresar}
        </Link>
        <Link
          className={clasesBoton("primario", "m")}
          to="/registro"
          onClick={onCerrar}
        >
          {menuMovil?.botones?.crearCuenta}
        </Link>
      </div>
    </div>
  );
}

export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  activo,
  tono = "claro",
  ocultarEnMovil = false,
  preferenciasAccesibilidad,
  onCambiarAccesibilidad,
  onRestablecerAccesibilidad,
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const botonMenu = useRef(null);
  const botonAccesibilidad = useRef(null);
  const nav = textos?.navbar;
  const menuMovil = textos?.menuMovil;
  const estados = textos?.estados;
  const textosAccesibilidad = textos?.accesibilidad;
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false);
    botonMenu.current?.focus();
  }, []);
  const cerrarPanel = useCallback(() => setPanelAbierto(false), []);
  const abrirAccesibilidadDesdeMenu = useCallback(() => {
    setMenuAbierto(false);
    setPanelAbierto(true);
  }, []);

  const clases = [
    "navbar",
    `navbar--${tono}`,
    ocultarEnMovil ? "navbar--oculta-movil" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={clases}>
      <nav className="navbar-barra" aria-label={nav?.logo?.texto}>
        <div className="navbar-izquierda">
          <Link
            className="navbar-marca"
            to={DESTINOS.inicio}
            aria-label={nav?.logo?.aria}
          >
            <img
              className="navbar-logo navbar-logo--normal"
              src={LOGO_NORMAL}
              alt=""
            />
            <img
              className="navbar-logo navbar-logo--inverso"
              src={LOGO_INVERSO}
              alt=""
            />
          </Link>
          <ul className="navbar-enlaces">
            {enlaces.map(([clave, etiqueta]) => (
              <li key={clave}>
                <Link
                  to={DESTINOS[clave]}
                  aria-current={activo === clave ? "page" : undefined}
                >
                  {etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-derecha">
          <button
            ref={botonAccesibilidad}
            className="navbar-icono navbar-icono--borde navbar-solo-escritorio"
            type="button"
            aria-label={nav?.aria?.accesibilidad}
            aria-expanded={panelAbierto}
            aria-haspopup="dialog"
            onClick={() => setPanelAbierto(true)}
          >
            <Icono nombre="accesibilidad" />
          </button>
          <div className="navbar-solo-escritorio">
            <LanguageSelector
              idioma={idioma}
              cambiarIdioma={cambiarIdioma}
              etiqueta={nav?.aria?.idioma}
              codigos={textos?.idioma?.codigos}
              nombres={textos?.idioma?.opciones}
            />
          </div>
          {/* Se pintan desde el inicio con su ancho de Figma: no saltan al
              llegar los textos. */}
          <Link
            className={clasesBoton("secundario", "p", "navbar-ingresar")}
            to="/ingresar"
          >
            {nav?.botones?.ingresar}
          </Link>
          <Link
            className={clasesBoton(
              "primario",
              "p",
              "navbar-crear-cuenta navbar-solo-escritorio",
            )}
            to="/registro"
          >
            {nav?.botones?.crearCuenta}
          </Link>
          <button
            ref={botonMenu}
            type="button"
            className="navbar-icono navbar-menu"
            aria-label={menuMovil?.abrir}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            onClick={() => setMenuAbierto(true)}
          >
            <Icono nombre="menu" />
          </button>
        </div>
      </nav>

      {cargando && (
        <p className="navbar-estado" role="status">
          {estados?.cargando}
        </p>
      )}
      {error && (
        <div className="navbar-estado" role="alert">
          <p>{estados?.error?.texto}</p>
          {recargar && (
            <button type="button" onClick={recargar}>
              {estados?.error?.botones?.reintentar}
            </button>
          )}
        </div>
      )}

      {menuAbierto && (
        <MenuMovil
          textos={textos}
          idioma={idioma}
          cambiarIdioma={cambiarIdioma}
          activo={activo}
          onCerrar={cerrarMenu}
          onAbrirAccesibilidad={abrirAccesibilidadDesdeMenu}
        />
      )}

      {panelAbierto && textosAccesibilidad && (
        <PanelAccesibilidad
          id="panel-accesibilidad"
          textos={{
            ...textosAccesibilidad,
            botones: {
              ...textosAccesibilidad.botones,
              cerrar: textos?.general?.aria?.cerrarDialogo,
            },
          }}
          preferencias={preferenciasAccesibilidad}
          onCambiar={onCambiarAccesibilidad}
          onRestablecer={onRestablecerAccesibilidad}
          onCerrar={cerrarPanel}
          botonAbrir={botonAccesibilidad}
        />
      )}
    </header>
  );
}
