import { Link } from "react-router-dom";
import { insertarVariables } from "../utils/textos.js";
import Icono from "./Icono.jsx";
import "./CabeceraMundo.css";

const RAYOS = Array.from({ length: 28 }, (_, i) => {
  const angulo = (Math.PI * i) / 14;
  const radio = i % 2 === 0 ? 700 : 430;
  return `${700 + radio * Math.sin(angulo)},${700 - radio * Math.cos(angulo)}`;
}).join(" ");

const conCeros = (numero) => String(numero).padStart(3, "0");

/** Cabecera del mundo (Figma · «Cabecera del mundo» web y móvil). */
export default function CabeceraMundo({
  mundo,
  posicion,
  etiquetaTitulo: EtiquetaTitulo = "h1",
  pagina,
  general,
  buscadorAbierto,
  onAlternarBuscador,
}) {
  const rango =
    pagina.encabezado?.rango &&
    insertarVariables(pagina.encabezado.rango, {
      numero: posicion,
      desde: conCeros(mundo.numeros?.desde ?? ""),
      hasta: conCeros(mundo.numeros?.hasta ?? ""),
    });

  return (
    <header className="cabecera-mundo" style={{ "--color-mundo": mundo.color }}>
      <svg
        className="cabecera-mundo-rayos"
        viewBox="0 0 1400 1400"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points={RAYOS} />
      </svg>
      <div className="cabecera-mundo-interior">
        <ol className="cabecera-mundo-migas">
          <li>
            <Link to="/">{pagina.migas.inicio}</Link>
          </li>
          <li aria-hidden="true">
            <Icono nombre="chevronDer" />
          </li>
          <li aria-current="page">{mundo.nombre}</li>
        </ol>
        <div className="cabecera-mundo-fila">
          <Link
            className="cabecera-mundo-boton"
            to="/"
            aria-label={general?.acciones?.volver}
          >
            <Icono nombre="flechaIzq" />
          </Link>
          <div className="cabecera-mundo-titulos">
            <EtiquetaTitulo
              id="catalogo-titulo"
              className="cabecera-mundo-titulo"
            >
              {mundo.nombre}
            </EtiquetaTitulo>
            {rango && <p className="cabecera-mundo-rango">{rango}</p>}
            {mundo.tema && <p className="cabecera-mundo-tema">{mundo.tema}</p>}
          </div>
          <button
            type="button"
            className="cabecera-mundo-boton"
            aria-label={general?.acciones?.buscar}
            aria-expanded={buscadorAbierto}
            aria-controls="catalogo-busqueda"
            onClick={onAlternarBuscador}
          >
            <Icono nombre="buscar" />
          </button>
        </div>
      </div>
    </header>
  );
}
