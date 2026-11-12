import { Link } from "react-router-dom";
import "./Footer.css";

const LOGO_FOOTER =
  "https://yanethm-cromoverso-api.fly.dev/docs/diseno/logos/logo-inverso.svg";

const DESTINOS = {
  inicio: "/",
  mundos: "/mundos",
  ingresar: "/ingresar",
  crearCuenta: "/registro",
  terminos: "/terminos",
  accesibilidad: "/accesibilidad",
};

function EnlacesColumna({ titulo, enlaces }) {
  return (
    <section className="pie-pagina-columna" aria-label={titulo}>
      <h2>{titulo}</h2>
      <ul>
        {Object.entries(enlaces)
          .filter(([clave]) => DESTINOS[clave])
          .map(([clave, etiqueta]) => (
            <li key={clave}>
              <Link to={DESTINOS[clave]}>{etiqueta}</Link>
            </li>
          ))}
      </ul>
    </section>
  );
}

export default function Footer({ textos, idioma }) {
  const pie = textos?.footer;
  const ingles = idioma === "en";
  const marca = textos?.navbar?.logo;
  const anio = new Date().getFullYear();

  return (
    <footer className="pie-pagina">
      <div className="pie-pagina-contenido">
        <div className="pie-pagina-superior">
          <div className="pie-pagina-identidad">
            <Link
              className="pie-pagina-marca"
              to="/"
              aria-label={
                marca?.aria ?? (ingles ? "Go to home" : "Ir al inicio")
              }
            >
              <img src={LOGO_FOOTER} alt="" />
            </Link>
            {pie?.lema && <p>{pie.lema}</p>}
          </div>
          {pie?.columnas && (
            <nav
              className="pie-pagina-navegacion"
              aria-label={ingles ? "Footer navigation" : "Navegación del pie"}
            >
              <EnlacesColumna
                titulo={pie.columnas.explora.titulo}
                enlaces={pie.columnas.explora.enlaces}
              />
              <EnlacesColumna
                titulo={pie.columnas.cuenta.titulo}
                enlaces={pie.columnas.cuenta.enlaces}
              />
              <EnlacesColumna
                titulo={pie.columnas.legal.titulo}
                enlaces={pie.columnas.legal.enlaces}
              />
            </nav>
          )}
        </div>
        {pie?.legal && (
          <div className="pie-pagina-legal">
            <p>{pie.legal.derechos.replaceAll("{anio}", String(anio))}</p>
            <p>{pie.legal.nota}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
