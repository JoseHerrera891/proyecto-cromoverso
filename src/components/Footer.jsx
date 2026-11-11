import { Link } from "react-router-dom";
import "./Footer.css";

const DESTINOS = {
  inicio: "/",
  album: "/album",
  sobres: "/sobres",
  intercambios: "/intercambios",
  mundos: "/mundos",
  ranking: "/ranking",
};

export default function Footer({ textos, idioma }) {
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  return (
    <footer className="pie-pagina">
      <Link className="pie-pagina-marca" to="/">
        {nav?.logo?.texto ?? "Cromoverso"}
      </Link>
      <nav
        className="pie-pagina-navegacion"
        aria-label={ingles ? "Footer navigation" : "Navegación del pie"}
      >
        <ul>
          {enlaces.map(([clave, etiqueta]) => (
            <li key={clave}>
              <Link to={DESTINOS[clave]}>{etiqueta}</Link>
            </li>
          ))}
          {nav?.botones?.ingresar && (
            <li>
              <Link to="/ingresar">{nav.botones.ingresar}</Link>
            </li>
          )}
          {nav?.botones?.crearCuenta && (
            <li>
              <Link to="/registro">{nav.botones.crearCuenta}</Link>
            </li>
          )}
        </ul>
      </nav>
    </footer>
  );
}
