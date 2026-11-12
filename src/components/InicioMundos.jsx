import { Link } from "react-router-dom";
import { useInicioPublico } from "../hooks/useInicioPublico.js";
import InicioRarezas from "./InicioRarezas.jsx";
import "./InicioMundos.css";

function insertarVariables(plantilla, variables) {
  return Object.entries(variables).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    plantilla,
  );
}

export default function InicioMundos({ textos }) {
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
      className="inicio-mundos"
      id="mundos"
      aria-labelledby="inicio-mundos-titulo"
    >
      <div className="inicio-mundos-encabezado">
        <div>
          <h2 id="inicio-mundos-titulo">{pagina.mundos.titulo}</h2>
          <p>{pagina.mundos.subtitulo}</p>
        </div>
        <span className="inicio-mundos-total">{datos.totalAlbum}</span>
      </div>
      <ul className="inicio-mundos-lista">
        {datos.mundos.map((mundo, indice) => (
          <li key={mundo.id}>
            <Link
              className="inicio-mundo"
              to={`/mundos/${mundo.id}`}
              style={{ "--color-mundo": mundo.color }}
            >
              <span className="inicio-mundo-orden">
                {insertarVariables(etiquetas.mundo, { numero: indice + 1 })}
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
      <InicioRarezas rarezas={datos.rarezas} />
    </section>
  );
}
