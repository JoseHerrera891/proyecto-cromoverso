import { useEffect, useRef, useState } from "react";
import { useSesion } from "../hooks/useSesion.js";
import { iniciales } from "../utils/iniciales.js";
import Icono from "./Icono.jsx";
import "./MenuCuenta.css";

export function Avatar({ usuario, variante = "acento" }) {
  return (
    <span
      className={`avatar avatar--${variante}`}
      style={{ "--color-avatar": usuario.colorAvatar }}
      aria-hidden="true"
    >
      {iniciales(usuario.nombre)}
    </span>
  );
}

/** Menú de cuenta de la barra (Figma · «Menú de cuenta»). */
export default function MenuCuenta({ textos }) {
  const { usuario, salir } = useSesion();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);
  const boton = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    function alTeclado(evento) {
      if (evento.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    }
    function alPulsarFuera(evento) {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false);
    }
    document.addEventListener("keydown", alTeclado);
    document.addEventListener("mousedown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alTeclado);
      document.removeEventListener("mousedown", alPulsarFuera);
    };
  }, [abierto]);

  if (!usuario) return null;

  return (
    <div className="menu-cuenta" ref={contenedor}>
      <button
        ref={boton}
        type="button"
        className="menu-cuenta-boton"
        aria-expanded={abierto}
        aria-controls="menu-cuenta-panel"
        onClick={() => setAbierto((actual) => !actual)}
      >
        <Avatar usuario={usuario} />
        <span className="solo-lector">
          {`${textos?.menu}: ${usuario.nombre}`}
        </span>
      </button>
      {abierto && (
        <div id="menu-cuenta-panel" className="menu-cuenta-panel">
          <div className="menu-cuenta-persona">
            <Avatar usuario={usuario} variante="propio" />
            <div>
              <p className="menu-cuenta-nombre">{usuario.nombre}</p>
              <p className="menu-cuenta-correo">{usuario.correo}</p>
            </div>
          </div>
          <button type="button" className="menu-cuenta-opcion" onClick={salir}>
            <Icono nombre="salir" />
            {textos?.cerrarSesion}
          </button>
        </div>
      )}
    </div>
  );
}
