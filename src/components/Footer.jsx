import { Link } from "react-router-dom";
import "./Footer.css";

const LOGO_INVERSO = "/marca/logo-inverso.svg";

const DESTINOS = {
  inicio: "/",
  mundos: "/mundos",
  ingresar: "/ingresar",
  crearCuenta: "/registro",
  terminos: "/terminos",
  accesibilidad: "/accesibilidad",
};

const COLUMNAS = ["explora", "cuenta", "legal"];

export default function Footer({ textos }) {
  const pie = textos?.footer;
  const marca = textos?.navbar?.logo;
  const anio = new Date().getFullYear();

  return (
    <footer className="pie-pagina">
      <div className="pie-pagina-contenido">
        <div className="pie-pagina-columnas">
          <div className="pie-pagina-marca">
            <Link to="/" aria-label={marca?.aria}>
              <img src={LOGO_INVERSO} alt="" />
            </Link>
            {pie?.lema && <p>{pie.lema}</p>}
          </div>
          {pie?.columnas && (
            <div className="pie-pagina-enlaces">
              {COLUMNAS.map((clave) => {
                const columna = pie.columnas[clave];
                if (!columna) return null;
                return (
                  <section className="pie-pagina-columna" key={clave}>
                    <h2>{columna.titulo}</h2>
                    <ul>
                      {Object.entries(columna.enlaces)
                        .filter(([destino]) => DESTINOS[destino])
                        .map(([destino, etiqueta]) => (
                          <li key={destino}>
                            <Link to={DESTINOS[destino]}>{etiqueta}</Link>
                          </li>
                        ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
        {pie?.legal?.derechos && (
          <p className="pie-pagina-legal">
            {pie.legal.derechos.replaceAll("{anio}", String(anio))}
          </p>
        )}
      </div>
    </footer>
  );
}
