import { Link } from "react-router-dom";
import { useInicioPublico } from "../hooks/useInicioPublico.js";
import { FIGURAS } from "../utils/figuras.jsx";
import "./InicioMundos.css";

function insertarVariables(plantilla, variables) {
  return Object.entries(variables).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    plantilla,
  );
}

export default function InicioMundos({ textos, comoPagina = false }) {
  const { datos, cargando, error, recargar } = useInicioPublico();
  const pagina = textos?.paginas?.inicio;
  const etiquetas = pagina?.mundos?.etiquetas;
  const estados = textos?.estados;

  if (cargando || !pagina) {
    return (
      <p className="inicio-mundos-estado" role="status">
        {estados?.cargando}
      </p>
    );
  }

  if (error || !datos) {
    return (
      <div className="inicio-mundos-estado" role="alert">
        <p>{estados?.error?.texto}</p>
        <button type="button" onClick={recargar}>
          {estados?.error?.botones?.reintentar}
        </button>
      </div>
    );
  }

  return (
    <section
      className={`inicio-mundos${comoPagina ? " inicio-mundos--pagina" : ""}`}
      id="mundos"
      aria-labelledby="inicio-mundos-titulo"
    >
      <div className="inicio-mundos-encabezado">
        <div>
          {comoPagina ? (
            <h1 id="inicio-mundos-titulo">{pagina.mundos.titulo}</h1>
          ) : (
            <h2 id="inicio-mundos-titulo">{pagina.mundos.titulo}</h2>
          )}
          <p>{pagina.mundos.subtitulo}</p>
        </div>
        {!comoPagina && datos.mundos[0] && (
          <Link
            className="inicio-mundos-enlace"
            to={`/mundos/${datos.mundos[0].id}`}
          >
            {insertarVariables(pagina.mundos.enlaces.ver, {
              mundo: datos.mundos[0].nombre,
            })}
            <span aria-hidden="true">→</span>
          </Link>
        )}
        {comoPagina && (
          <span className="inicio-mundos-total">{datos.totalAlbum}</span>
        )}
      </div>
      <ul className="inicio-mundos-lista">
        {datos.mundos.map((mundo, indice) => (
          <li key={mundo.id}>
            <Link
              className="inicio-mundo"
              to={`/mundos/${mundo.id}`}
              style={{ "--color-mundo": mundo.color }}
            >
              <span className="inicio-mundo-identificador">
                <span className="inicio-mundo-icono" aria-hidden="true">
                  <svg viewBox="0 0 100 100" focusable="false">
                    {FIGURAS[mundo.figura]}
                  </svg>
                </span>
                <span className="inicio-mundo-orden">
                  {insertarVariables(etiquetas.mundo, { numero: indice + 1 })}
                </span>
              </span>
              <span className="inicio-mundo-nombre">{mundo.nombre}</span>
              <span className="inicio-mundo-total">
                {insertarVariables(etiquetas.cromos, {
                  cantidad: mundo.totalCromos,
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
