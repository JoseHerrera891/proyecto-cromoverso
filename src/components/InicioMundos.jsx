// US-CRO-S1-03 · Inicio público
import { Link } from "react-router-dom";
import { emblemaDeMundo } from "../utils/emblemasMundos.js";
import { FIGURAS } from "../utils/figuras.jsx";
import { insertarVariables } from "../utils/textos.js";
import Icono from "./Icono.jsx";
import "./InicioMundos.css";

function Emblema({ mundo }) {
  const emblema = emblemaDeMundo(mundo.id);
  if (emblema) {
    return <img className="inicio-mundo-emblema" src={emblema} alt="" />;
  }
  return (
    <span className="inicio-mundo-emblema" aria-hidden="true">
      <svg viewBox="0 0 100 100" focusable="false">
        {FIGURAS[mundo.figura]}
      </svg>
    </span>
  );
}

/** Sección «Los seis mundos» del inicio (Figma · «Tus mundos»). */
export default function InicioMundos({
  textos,
  datos,
  cargando,
  error,
  recargar,
}) {
  const pagina = textos?.paginas?.inicio;
  const etiquetas = pagina?.mundos?.etiquetas;
  const estados = textos?.estados;
  const primero = datos?.mundos?.[0];

  return (
    <section
      className="inicio-mundos"
      id="mundos"
      aria-labelledby="inicio-mundos-titulo"
      aria-busy={cargando}
    >
      <div className="inicio-mundos-interior">
        {pagina && (
          <div className="inicio-mundos-cabecera">
            <div>
              <h2 id="inicio-mundos-titulo">{pagina.mundos.titulo}</h2>
              <p>{pagina.mundos.subtitulo}</p>
            </div>
            {primero && (
              <Link
                className="inicio-mundos-enlace"
                to={`/mundos/${encodeURIComponent(primero.id)}`}
              >
                <Icono nombre="flechaDer" />
                {insertarVariables(pagina.mundos.enlaces.ver, {
                  mundo: primero.nombre,
                })}
              </Link>
            )}
          </div>
        )}

        {datos ? (
          <ul className="inicio-mundos-lista" data-desplazable>
            {datos.mundos.map((mundo, indice) => (
              <li key={mundo.id}>
                <Link
                  className="inicio-mundo"
                  to={`/mundos/${encodeURIComponent(mundo.id)}`}
                  style={{ "--color-mundo": mundo.color }}
                >
                  <span className="inicio-mundo-arriba">
                    <Emblema mundo={mundo} />
                    {indice === 0 && etiquetas && (
                      <span className="inicio-mundo-orden">
                        {insertarVariables(etiquetas.mundo, {
                          numero: indice + 1,
                        })}
                      </span>
                    )}
                  </span>
                  <span className="inicio-mundo-nombre">{mundo.nombre}</span>
                  {etiquetas && (
                    <span className="inicio-mundo-total">
                      {insertarVariables(etiquetas.cromos, {
                        cantidad: mundo.totalCromos,
                      })}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="inicio-mundos-estado" role="alert">
            <p>{estados?.error?.texto}</p>
            <button type="button" onClick={recargar}>
              {estados?.error?.botones?.reintentar}
            </button>
          </div>
        ) : (
          <p className="inicio-mundos-estado" role="status">
            {estados?.cargando}
          </p>
        )}
      </div>
    </section>
  );
}
